const Item = require("../models/Item");

exports.addItem = async (req, res) => {
  const { title, description, images, category } = req.body;
  try {
    const item = await Item.create({
      title,
      description,
      images,
      category,
      owner: req.user._id,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate("owner", "username email");
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
    const items = await Item.find({ owner: req.user._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
