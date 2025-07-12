const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }], // Array of Cloudinary URLs
    category: { type: String, required: true },
    condition: {
      type: String,
      enum: ["new", "like-new", "good", "fair", "poor"],
      required: true,
    },
    tags: [{ type: String }], // Array of tags for better searchability
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size", "Custom"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    }, // Price in INR
    currency: {
      type: String,
      default: "INR",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "swapped", "redeemed", "sold"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
