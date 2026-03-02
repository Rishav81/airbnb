//External Modules
const express = require("express");
const bookingRouter = express.Router();

//Local Modules
const bookingController = require("../controller/bookingController");
const { isLoggedIn, isUser } = require("../middleware/authmiddleware");

bookingRouter.use(isLoggedIn);

bookingRouter.get("/", isUser, bookingController.getBooking);
bookingRouter.post("/", isUser, bookingController.createBooking);
bookingRouter.post(
  "/delete/:bookingId",
  isUser,
  bookingController.deleteBooking,
);
bookingRouter.get(
  "/upcoming-Booking",
  isUser,
  bookingController.getUpcomingBooking,
);
bookingRouter.get(
  "/previous-Booking",
  isUser,
  bookingController.getPreviousBooking,
);

exports.bookingRouter = bookingRouter;
