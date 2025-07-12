const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Not required for Google users
    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String },
    points: { type: Number, default: 1200 },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
