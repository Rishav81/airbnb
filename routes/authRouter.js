const express = require("express");
const authRouter = express.Router();

const homeController = require("../controller/authController");
const { isLoggedIn } = require("../middleware/authmiddleware");

authRouter.get("/login", homeController.getLogin);
authRouter.post("/login", homeController.postLogin);
authRouter.get("/signup", homeController.getSignup);
authRouter.post("/signup", homeController.postSignup);
authRouter.post("/logout", homeController.postLogout);

// Profile routes protected
authRouter.get("/profile-detail", isLoggedIn, homeController.getProfile);
authRouter.post("/profile-detail", isLoggedIn, homeController.postProfile);

exports.authRouter = authRouter;
