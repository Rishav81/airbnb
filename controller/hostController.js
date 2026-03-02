const Home = require("../model/home");
const fs = require("fs");

/* ==============================
   ADD HOME
============================== */
exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    currentPage: "AddHome",
    editing: false,
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddHome = async (req, res, next) => {
  try {
    if (!req.file) return res.status(404).send("No image provided");

    const home = new Home({
      houseName: req.body.houseName,
      houseLocation: req.body.houseLocation,
      houseRent: req.body.houseRent,
      houseImg: req.file.path,
      houseRating: req.body.houseRating,
      houseDescription: req.body.houseDescription,
      destinationType: req.body.destinationType,
      features: req.body.features || [],
      host: req.session.user._id, // Associate home with logged-in host
    });

    await home.save();
    res.redirect("/host/host-home-list");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong while adding home");
  }
};

/* ==============================
   LIST HOST'S HOMES
============================== */
exports.getHostHomeList = async (req, res, next) => {
  try {
    const registeredHomes = await Home.find({ host: req.session.user._id });

    res.render("host/host-home-list", {
      pageTitle: "Host Home",
      currentPage: "Host-Home-List",
      registeredHomes,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong while fetching homes");
  }
};

/* ==============================
   EDIT HOME
============================== */
exports.getEditHome = async (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
  if (!editing) return res.redirect("/host/host-home-list");

  try {
    const home = await Home.findOne({
      _id: homeId,
      host: req.session.user._id,
    });
    if (!home) return res.redirect("/host/host-home-list");

    res.render("host/edit-home", {
      pageTitle: "Edit Home",
      currentPage: "Host-Home-List",
      editing,
      home,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong while fetching home");
  }
};

exports.postEditHome = async (req, res, next) => {
  try {
    const {
      id,
      houseName,
      houseLocation,
      houseRent,
      houseRating,
      houseDescription,
      destinationType,
      features,
    } = req.body;

    const home = await Home.findOne({ _id: id, host: req.session.user._id });
    if (!home) return res.redirect("/host/host-home-list");

    const updateData = {
      houseName,
      houseLocation,
      houseRent,
      houseRating,
      destinationType,
      houseDescription,
      features: features || [],
    };

    if (req.file) {
      if (home.houseImg) await fs.promises.unlink(home.houseImg);
      updateData.houseImg = req.file.path;
    }

    await Home.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    res.redirect("/host/host-home-list");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong while updating home");
  }
};

/* ==============================
   DELETE HOME
============================== */
exports.postDeleteHome = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const home = await Home.findOne({
      _id: homeId,
      host: req.session.user._id,
    });

    if (!home) return res.redirect("/host/host-home-list");

    if (home.houseImg) {
      await fs.promises
        .unlink(home.houseImg)
        .catch((err) => console.log(err.message));
    }

    await Home.findByIdAndDelete(homeId);
    res.redirect("/host/host-home-list");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong while deleting home");
  }
};
