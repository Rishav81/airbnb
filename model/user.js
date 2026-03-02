const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: { type: String, required: [true, "Username is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: { type: String, required: [true, "Password is required"] },
  role: { type: String, enum: ["user", "host"], default: "user" },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Home" }],
});

// Pre-save hook to handle favourites correctly
userSchema.pre("save", function () {
  if (this.role === "host") {
    this.favourites = []; // always empty for host
  } else if (!this.favourites) {
    this.favourites = [];
  }
});

module.exports = mongoose.model("User", userSchema);
