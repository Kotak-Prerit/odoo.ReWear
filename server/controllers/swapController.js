const SwapRequest = require("../models/SwapRequest");
const Item = require("../models/Item");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Configure nodemailer transporter
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
    // Validate that both items exist
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

    // Check if requester owns the offered item
    if (requesterItemDoc.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You don't own the offered item" });
    }

    // Check if target item belongs to a different user
    if (targetItemDoc.owner._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot swap with your own item" });
    }

    // Check if both items are available
    if (
      targetItemDoc.status !== "available" ||
      requesterItemDoc.status !== "available"
    ) {
      return res
        .status(400)
        .json({ message: "One or both items are no longer available" });
    }

    // Check if swap request already exists
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

    // Populate the swap request with item and user details
    const populatedSwap = await SwapRequest.findById(swap._id)
      .populate("requester", "username email")
      .populate({
        path: "requestedItem",
        populate: { path: "owner", select: "username email" },
      })
      .populate("offeredItem");

    // Send email notification to the target item owner
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
      console.error("Error sending email notification:", emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: "Swap request created successfully",
      swap: populatedSwap,
    });
  } catch (error) {
    console.error("Error creating swap request:", error);
    res
      .status(500)
      .json({ message: "Server error while creating swap request" });
  }
};

// Get swap requests sent by user (outgoing)
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
    console.error("Error fetching user swap requests:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching swap requests" });
  }
};

// Get swap requests received by user (incoming)
exports.getReceivedSwapRequests = async (req, res) => {
  try {
    // Find all swap requests where the user owns the requested item
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
    console.error("Error fetching received swap requests:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching received requests" });
  }
};

// Update swap request status (accept/reject)
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

    // Check if user owns the requested item (can accept/reject)
    if (swap.requestedItem.owner._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this swap request" });
    }

    // Check if request is still pending
    if (swap.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Swap request has already been processed" });
    }

    // Update swap status
    swap.status = status;
    await swap.save();

    let emailSubject, emailContent;
    const requesterName = swap.requester.username || swap.requester.email;
    const ownerName = req.user.username || req.user.email;

    if (status === "accepted") {
      // If accepted, perform the swap
      const requestedItem = await Item.findById(swap.requestedItem._id);
      const offeredItem = await Item.findById(swap.offeredItem._id);

      if (!requestedItem || !offeredItem) {
        return res.status(404).json({ message: "One or both items not found" });
      }

      // Check if both items are still available
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

      // Swap ownership
      const originalRequestedOwner = requestedItem.owner;
      const originalOfferedOwner = offeredItem.owner;

      requestedItem.owner = originalOfferedOwner;
      requestedItem.status = "swapped";

      offeredItem.owner = originalRequestedOwner;
      offeredItem.status = "swapped";

      await Promise.all([requestedItem.save(), offeredItem.save()]);

      // Update swap status to completed
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

    // Send email notification to requester
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: swap.requester.email,
        subject: emailSubject,
        html: emailContent,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      // Don't fail the request if email fails
    }

    // Populate the updated swap for response
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
    console.error("Error updating swap status:", error);
    res
      .status(500)
      .json({ message: "Server error while updating swap request" });
  }
};
