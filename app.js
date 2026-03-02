// Core Modules
const path = require("path");

// External Modules
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const multer = require("multer");

// Local Modules
const { hostRouter } = require("./routes/hostRouter");
const { userRouter } = require("./routes/userRouter");
const { authRouter } = require("./routes/authRouter");

const errorController = require("./controller/error");
const { bookingRouter } = require("./routes/bookingRouter");

const DB_PATH =
  "mongodb+srv://RishavKumar_DB810:Rishavkumar%40121%40DB@airbnbcluster.5fk1pa8.mongodb.net/airbnb";

const app = express();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const randomString = (length) => {
  const char = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += char.charAt(Math.floor(Math.random() * char.length));
  }
  return result;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, randomString(8) + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const multerOptions = {
  storage,
  fileFilter,
};
// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer(multerOptions).single("houseImg"));
// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/uploads",

  express.static(path.join(__dirname, "uploads")),
);

// Session setup using connect-mongo (MongoDB-backed, JSON-safe)
app.use(
  session({
    secret: "yoursecret", // change to strong secret
    resave: false,
    saveUninitialized: false, // only store sessions for logged-in users
    store: MongoStore.create({
      mongoUrl: DB_PATH,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
  }),
);

// Middleware to set login status globally
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.user = req.session.user;
  next();
});

// Routes
app.use(authRouter);
app.use(userRouter);

// Protect /host routes
app.use("/host", (req, res, next) => {
  if (req.session.isLoggedIn && req.session.user.role === "host") return next();
  res.redirect("/login");
});
app.use("/host", hostRouter);
app.use("/booking", bookingRouter);

// Error handling
app.use(errorController.errorPage);

// Connect to MongoDB and start server
const PORT = 3000;
mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`),
    );
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
