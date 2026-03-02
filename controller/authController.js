const { check, validationResult } = require("express-validator");
const User = require("../model/user");
const bcrypt = require("bcryptjs");

/* ==============================
   Helper Function
============================== */

const renderAuthView = (
  req,
  res,
  view,
  pageTitle,
  currentPage,
  options = {},
) => {
  return res.status(options.status || 200).render(view, {
    pageTitle,
    currentPage,
    isLoggedIn: req.session.isLoggedIn || false,
    errors: options.errors || {},
    oldInput: options.oldInput || {},
    user: req.session.user || null,
  });
};

/* ==============================
   LOGIN
============================== */

exports.getLogin = (req, res) => {
  renderAuthView(req, res, "auth/login", "Login", "Login");
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return renderAuthView(req, res, "auth/login", "Login", "Login", {
        status: 422,
        errors: { email: { msg: "Invalid email address" } },
        oldInput: { email },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return renderAuthView(req, res, "auth/login", "Login", "Login", {
        status: 422,
        errors: { password: { msg: "Invalid password" } },
        oldInput: { email },
      });
    }

    // Store only safe fields in session //regenerating session
    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.isLoggedIn = true;
      req.session.user = {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      };

      req.session.save((err) => {
        if (err) return next(err);
        res.redirect("/"); // redirect based on role if needed
      });
    });
  } catch (err) {
    next(err);
  }
};

/* ==============================
   SIGNUP
============================== */

exports.getSignup = (req, res) => {
  renderAuthView(req, res, "auth/signup", "Signup", "Signup");
};

exports.postSignup = [
  // Username validation
  check("userName")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 4, max: 16 })
    .withMessage("Username must be 4–16 characters")
    .matches(/^[a-zA-Z0-9 _-]+$/)
    .withMessage("Username contains invalid characters"),

  // Email validation
  check("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Enter a valid email address")
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error("Email already exists");
      }
      return true;
    }),

  // Password validation
  check("password")
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be 8+ characters with uppercase, lowercase, number and symbol",
    ),

  // Confirm password
  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  // Role validation
  check("role")
    .notEmpty()
    .withMessage("Please select a role")
    .isIn(["user", "host"])
    .withMessage("Role must be either User or Host"),

  // Terms validation
  check("terms")
    .equals("on")
    .withMessage("Please accept the terms and conditions"),

  // Final handler
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return renderAuthView(req, res, "auth/signup", "Signup", "Signup", {
          status: 422,
          errors: errors.mapped(),
          oldInput: {
            userName: req.body.userName,
            email: req.body.email,
            role: req.body.role,
          },
        });
      }

      const { userName, email, password, role } = req.body;

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        userName,
        email,
        password: hashedPassword,
        role,
      });

      await user.save();

      // ✅ Auto-login after signup (optional)
      req.session.regenerate((err) => {
        if (err) return next(err);

        req.session.isLoggedIn = true;
        req.session.user = {
          _id: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
        };

        req.session.save((err) => {
          if (err) return next(err);

          res.redirect("/"); // redirect based on role if needed
        });
      });
    } catch (err) {
      next(err);
    }
  },
];

/* ==============================
   LOGOUT
============================== */

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

/* ==============================
   PROFILE
============================== */

exports.getProfile = async (req, res, next) => {
  try {
    if (!req.session.isLoggedIn) {
      return res.redirect("/login");
    }

    const userId = req.session.user._id;
    const currentUser = await User.findById(userId);

    res.render("auth/profile-detail", {
      pageTitle: "My Profile",
      currentPage: "Profile",
      LoggedIn: req.session.isLoggedIn,
      user: currentUser,
    });
  } catch (err) {
    console.error("Profile error:", err);
    next(err);
  }
};

exports.postProfile = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.session.user._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { userName: name, email, phone },
      { new: true },
    );

    //Update session with fresh data

    req.session.user.userName = updatedUser.userName;
    req.session.user.email = updatedUser.email;
    req.session.user.phone = updatedUser.phone;

    res.redirect("/profile-detail");
  } catch (err) {
    console.error("Profile update error:", err);
    next(err);
  }
};
