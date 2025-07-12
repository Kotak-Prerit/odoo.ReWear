const Item = require("../models/Item");

exports.addItem = async (req, res) => {
  const { title, description, images, category, condition, tags, size, price } =
    req.body;

  try {
    // Validate required fields
    if (!title || !description || !category || !condition || !size || !price) {
      return res.status(400).json({
        message:
          "Missing required fields: title, description, category, condition, size, and price are required",
      });
    }

    // Validate images array
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        message: "At least one image is required",
      });
    }

    // Validate price
    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        message: "Price must be a valid positive number",
      });
    }

    const item = await Item.create({
      title,
      description,
      images,
      category,
      condition,
      tags: tags || [],
      size,
      price: parseFloat(price),
      owner: req.user._id,
    });

    // Populate owner details for response
    await item.populate("owner", "username email");

    res.status(201).json({
      message: "Item listed successfully",
      item,
    });
  } catch (error) {
    console.error("Error adding item:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({ message: "Server error while adding item" });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const excludeOwn = req.query.excludeOwn === "true";

    // Only show available items
    const filterQuery = { status: "available" };

    // If excludeOwn is true and user is authenticated, exclude their items
    if (excludeOwn && req.user) {
      filterQuery.owner = { $ne: req.user._id };
    }

    // Get total count for pagination info (only available items)
    const totalItems = await Item.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalItems / limit);

    // Fetch items with pagination, sorted by newest first
    const items = await Item.find(filterQuery)
      .populate("owner", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching all items:", error);
    res.status(500).json({ message: "Server error while fetching items" });
  }
};

exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "owner",
      "username email"
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserItems = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(items);
  } catch (error) {
    console.error("Error fetching user items:", error);
    res.status(500).json({ message: "Server error while fetching items" });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the user owns the item
    if (item.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this item" });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({
      message: "Item deleted successfully",
      deletedItemId: req.params.id,
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Server error while deleting item" });
  }
};

exports.purchaseItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "owner",
      "username email"
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if item is still available
    if (item.status !== "available") {
      return res
        .status(400)
        .json({ message: "Item is no longer available for purchase" });
    }

    // Check if the user is trying to buy their own item
    if (item.owner._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot purchase your own item" });
    }

    const User = require("../models/User");
    const Purchase = require("../models/Purchase");

    const buyer = await User.findById(req.user._id);

    if (!buyer) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if buyer has enough points
    if (buyer.points < item.price) {
      return res.status(400).json({
        message: `Insufficient points. You need ₹${item.price} but have only ₹${buyer.points}`,
      });
    }

    // Create purchase record
    const purchase = await Purchase.create({
      buyer: req.user._id,
      seller: item.owner._id,
      item: item._id,
      purchasePrice: item.price,
    });

    // Deduct points from buyer
    buyer.points -= item.price;
    await buyer.save();

    // Add points to seller
    const seller = await User.findById(item.owner._id);
    if (seller) {
      seller.points += item.price;
      await seller.save();
    }

    // Mark item as sold instead of deleting
    item.status = "sold";
    await item.save();

    // Populate purchase for response
    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate("item")
      .populate("buyer", "username email")
      .populate("seller", "username email");

    res.json({
      message: "Purchase successful",
      newBalance: buyer.points,
      purchase: populatedPurchase,
    });
  } catch (error) {
    console.error("Error purchasing item:", error);
    res.status(500).json({ message: "Server error while processing purchase" });
  }
};
