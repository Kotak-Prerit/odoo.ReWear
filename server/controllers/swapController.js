const SwapRequest = require("../models/SwapRequest");
const Item = require("../models/Item");

exports.createSwapRequest = async (req, res) => {
  const { requestedItem, offeredItem } = req.body;
  try {
    const swap = await SwapRequest.create({
      requester: req.user._id,
      requestedItem,
      offeredItem,
    });
    res.status(201).json(swap);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserSwapRequests = async (req, res) => {
  try {
    const swaps = await SwapRequest.find({ requester: req.user._id })
      .populate("requestedItem")
      .populate("offeredItem");
    res.json(swaps);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSwapStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap)
      return res.status(404).json({ message: "Swap request not found" });
    swap.status = status;
    await swap.save();
    res.json(swap);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
