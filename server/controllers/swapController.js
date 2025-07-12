const SwapRequest = require("../models/SwapRequest");
const Item = require("../models/Item");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.createSwapRequest = async (req, res) => {
  const { targetItem, requesterItem } = req.body;

  try {
    const [targetItemDoc, requesterItemDoc] = await Promise.all([
      Item.findById(targetItem).populate("owner", "username email"),
      Item.findById(requesterItem),
    ]);

    if (!targetItemDoc) {
      return res.status(404).json({ message: "Target item not found" });
    }

    if (!requesterItemDoc) {
      return res.status(404).json({ message: "Your item not found" });
    }

    if (requesterItemDoc.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You don't own the offered item" });
    }

    if (targetItemDoc.owner._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot swap with your own item" });
    }

    if (
      targetItemDoc.status !== "available" ||
      requesterItemDoc.status !== "available"
    ) {
      return res
        .status(400)
        .json({ message: "One or both items are no longer available" });
    }

    const existingSwap = await SwapRequest.findOne({
      requester: req.user._id,
      requestedItem: targetItem,
      offeredItem: requesterItem,
      status: "pending",
    });

    if (existingSwap) {
      return res
        .status(400)
        .json({ message: "Swap request already exists for these items" });
    }

    const swap = await SwapRequest.create({
      requester: req.user._id,
      requestedItem: targetItem,
      offeredItem: requesterItem,
    });

    const populatedSwap = await SwapRequest.findById(swap._id)
      .populate("requester", "username email")
      .populate({
        path: "requestedItem",
        populate: { path: "owner", select: "username email" },
      })
      .populate("offeredItem");

    try {
      const targetOwner = targetItemDoc.owner;
      const requesterName = req.user.username || req.user.email;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: targetOwner.email,
        subject: "New Swap Request - ReWear",
        html: `
          <h2>You have a new swap request!</h2>
          <p><strong>${requesterName}</strong> wants to swap their item with yours.</p>
          <h3>Your Item:</h3>
          <p><strong>${targetItemDoc.title}</strong> - ₹${targetItemDoc.price}</p>
          <h3>Their Item:</h3>
          <p><strong>${requesterItemDoc.title}</strong> - ₹${requesterItemDoc.price}</p>
          <p>Log in to your ReWear dashboard to review and respond to this request.</p>
          <p><a href="${process.env.CLIENT_URL}/dashboard">View Dashboard</a></p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
    }

    res.status(201).json({
      message: "Swap request created successfully",
      swap: populatedSwap,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while creating swap request" });
  }
};

exports.getUserSwapRequests = async (req, res) => {
  try {
    const swaps = await SwapRequest.find({ requester: req.user._id })
      .populate({
        path: "requestedItem",
        populate: { path: "owner", select: "username email" },
      })
      .populate("offeredItem")
      .sort({ createdAt: -1 });
    res.json(swaps);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while fetching swap requests" });
  }
};

exports.getReceivedSwapRequests = async (req, res) => {
  try {
    const userItems = await Item.find({ owner: req.user._id }).select("_id");
    const userItemIds = userItems.map((item) => item._id);

    const swaps = await SwapRequest.find({
      requestedItem: { $in: userItemIds },
    })
      .populate("requester", "username email")
      .populate("requestedItem")
      .populate("offeredItem")
      .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while fetching received requests" });
  }
};

exports.updateSwapStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const swap = await SwapRequest.findById(req.params.id)
      .populate("requester", "username email")
      .populate({
        path: "requestedItem",
        populate: { path: "owner", select: "username email" },
      })
      .populate("offeredItem");

    if (!swap) {
      return res.status(404).json({ message: "Swap request not found" });
    }

    if (swap.requestedItem.owner._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this swap request" });
    }

    if (swap.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Swap request has already been processed" });
    }

    swap.status = status;
    await swap.save();

    let emailSubject, emailContent;
    const requesterName = swap.requester.username || swap.requester.email;
    const ownerName = req.user.username || req.user.email;

    if (status === "accepted") {
      const requestedItem = await Item.findById(swap.requestedItem._id);
      const offeredItem = await Item.findById(swap.offeredItem._id);

      if (!requestedItem || !offeredItem) {
        return res.status(404).json({ message: "One or both items not found" });
      }

      if (
        requestedItem.status !== "available" ||
        offeredItem.status !== "available"
      ) {
        swap.status = "rejected";
        await swap.save();
        return res
          .status(400)
          .json({ message: "One or both items are no longer available" });
      }

      const originalRequestedOwner = requestedItem.owner;
      const originalOfferedOwner = offeredItem.owner;

      requestedItem.owner = originalOfferedOwner;
      requestedItem.status = "swapped";

      offeredItem.owner = originalRequestedOwner;
      offeredItem.status = "swapped";

      await Promise.all([requestedItem.save(), offeredItem.save()]);

      swap.status = "completed";
      await swap.save();

      emailSubject = "Swap Request Accepted - ReWear";
      emailContent = `
        <h2>Great news! Your swap request has been accepted!</h2>
        <p><strong>${ownerName}</strong> has accepted your swap request.</p>
        <h3>Swap Details:</h3>
        <p>You gave: <strong>${offeredItem.title}</strong></p>
        <p>You received: <strong>${requestedItem.title}</strong></p>
        <p>The items have been automatically transferred to your respective accounts.</p>
        <p><a href="${process.env.CLIENT_URL}/dashboard">View Your Dashboard</a></p>
      `;
    } else if (status === "rejected") {
      emailSubject = "Swap Request Declined - ReWear";
      emailContent = `
        <h2>Swap request declined</h2>
        <p><strong>${ownerName}</strong> has declined your swap request.</p>
        <h3>Request Details:</h3>
        <p>Your item: <strong>${swap.offeredItem.title}</strong></p>
        <p>Requested item: <strong>${swap.requestedItem.title}</strong></p>
        <p>Don't worry! There are many other items available for swapping.</p>
        <p><a href="${process.env.CLIENT_URL}/swap">Browse More Items</a></p>
      `;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: swap.requester.email,
        subject: emailSubject,
        html: emailContent,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
    }

    const updatedSwap = await SwapRequest.findById(swap._id)
      .populate("requester", "username email")
      .populate({
        path: "requestedItem",
        populate: { path: "owner", select: "username email" },
      })
      .populate("offeredItem");

    res.json({
      message: `Swap request ${status} successfully`,
      swap: updatedSwap,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while updating swap request" });
  }
};
