const Purchase = require("../models/Purchase");

exports.getUserPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ buyer: req.user._id })
      .populate({
        path: "item",
        select: "title description images category condition size price",
      })
      .populate("seller", "username email")
      .sort({ createdAt: -1 });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching purchases" });
  }
};

exports.getUserSales = async (req, res) => {
  try {
    const sales = await Purchase.find({ seller: req.user._id })
      .populate({
        path: "item",
        select: "title description images category condition size price",
      })
      .populate("buyer", "username email")
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching sales" });
  }
};

exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate({
        path: "item",
        select: "title description images category condition size price",
      })
      .populate("buyer", "username email")
      .populate("seller", "username email");

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    if (
      purchase.buyer._id.toString() !== req.user._id.toString() &&
      purchase.seller._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this purchase" });
    }

    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching purchase" });
  }
};
