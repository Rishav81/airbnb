exports.errorPage = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "404! page not found",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};
