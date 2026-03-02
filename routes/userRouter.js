//External Modules
const express = require("express");
const userRouter = express.Router();

//Local Modules
const homeController = require("../controller/storeController");
const { isLoggedIn, isUser } = require("../middleware/authmiddleware");

userRouter.get("/", homeController.getIndex);
userRouter.get("/home-list", isLoggedIn, isUser, homeController.getHomesList);

userRouter.get(
  "/favourite-list",
  isLoggedIn,
  isUser,
  homeController.getFavouriteList,
);
userRouter.post(
  "/toggle-favourite/:homeId",
  isLoggedIn,
  isUser,
  homeController.postToggleFavourite,
);
userRouter.post(
  "/remove-favourite/:homeId",
  isLoggedIn,
  isUser,
  homeController.postRemoveFavourite,
);

userRouter.get("/home-list/:homeId", homeController.getHomeDetails);

exports.userRouter = userRouter;
