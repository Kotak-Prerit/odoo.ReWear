const express = require("express");
const router = express.Router();
const swapController = require("../controllers/swapController");
const { protect } = require("../middlewares/authMiddleware");

// Create swap request
router.post("/", protect, swapController.createSwapRequest);

// Get user's outgoing swap requests
router.get("/my-requests", protect, swapController.getUserSwapRequests);

// Get user's incoming swap requests
router.get("/received", protect, swapController.getReceivedSwapRequests);

// Update swap request status (accept/reject)
router.patch("/:id/status", protect, swapController.updateSwapStatus);

module.exports = router;
