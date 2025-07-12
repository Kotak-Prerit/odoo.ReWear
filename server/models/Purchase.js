const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "refunded"],
      default: "completed",
    },
  },
  { timestamps: true }
);

purchaseSchema.index({ buyer: 1, createdAt: -1 });
purchaseSchema.index({ seller: 1, createdAt: -1 });

module.exports = mongoose.model("Purchase", purchaseSchema);
