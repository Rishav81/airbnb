const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
  houseName: { type: String, required: true },
  houseRent: { type: Number, required: true },
  houseLocation: { type: String, required: true },
  houseRating: { type: Number, default: 0 }, // default 0 for new homes
  houseImg: String,
  houseDescription: String,
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to host
    required: true, // ensures every home has a host
  },
  destinationType: {
    type: String,
    enum: ["Beach", "Mountain", "Farmhouse", "Villa", "City", "Luxury"],
    required: true,
  },
  features: [String],
});

module.exports = mongoose.model("Home", homeSchema);
