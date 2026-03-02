const fs = require("fs");
const Home = require("../model/home");
const User = require("../model/user");
const Booking = require("../model/booking");

exports.getBooking = async (req, res, next) => {
  try {
    if (!req.session.isLoggedIn) {
      return res.redirect("/login");
    }

    const bookings = await Booking.find({
      user: req.session.user._id,
    }).populate("home");

    res.render("store/booking", {
      pageTitle: "My Booking",
      currentPage: "Booking",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
      bookings,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    if (!req.session.isLoggedIn) {
      return res.redirect("/login");
    }

    const { homeId, checkIn, checkOut, guest } = req.body;

    if (!homeId || !checkIn || !checkOut || !guest) {
      return res.redirect("/booking");
    }

    const home = await Home.findById(homeId);
    if (!home) return res.redirect("/");

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      return res.redirect("/booking");
    }

    if (checkOutDate <= checkInDate) {
      return res.redirect("/booking");
    }

    const diffTime = checkOutDate - checkInDate;
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const totalPrice = nights * home.houseRent;

    await Booking.create({
      home: homeId,
      user: req.session.user._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: Number(guest),
      totalPrice,
    });

    res.redirect("/booking");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    if (!req.session.isLoggedIn) {
      return res.redirect("/login");
    }

    const bookingId = req.params.bookingId;

    await Booking.findOneAndDelete({
      _id: bookingId,
      user: req.session.user._id,
    });

    res.redirect("/booking");
  } catch (err) {
    console.log(err);
    res.redirect("/booking");
  }
};

exports.getUpcomingBooking = async (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookings = await Booking.find({
    user: req.session.user._id,
    checkIn: { $gte: today },
  }).populate("home");

  res.render("store/upcoming-booking", {
    pageTitle: "Upcoming Booking",
    currentPage: "Booking",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
    bookings,
  });
};

exports.getPreviousBooking = async (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookings = await Booking.find({
    user: req.session.user._id,
    checkIn: { $lt: today },
  }).populate("home");

  res.render("store/previous-booking", {
    pageTitle: "Stayed Booking",
    currentPage: "Booking",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
    bookings,
  });
};
