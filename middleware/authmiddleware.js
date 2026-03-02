// middleware/auth.js
exports.isLoggedIn = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};

exports.isUser = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

exports.isHost = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "host") {
    return res.redirect("/login");
  }
  next();
};
