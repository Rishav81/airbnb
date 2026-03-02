//Core Modules

//External Modules
const express = require("express");
const hostRouter = express.Router();

//Local Modules

const homeController = require("../controller/hostController");
const { isLoggedIn, isHost } = require("../middleware/authmiddleware");
hostRouter.use(isLoggedIn, isHost);

hostRouter.get("/add-home", homeController.getAddHome);
hostRouter.post("/add-home", homeController.postAddHome);

hostRouter.get("/host-home-list", homeController.getHostHomeList);
hostRouter.get("/edit-home/:homeId", homeController.getEditHome);
hostRouter.post("/edit-home", homeController.postEditHome);
hostRouter.post("/delete-home/:homeId", homeController.postDeleteHome);

exports.hostRouter = hostRouter;
