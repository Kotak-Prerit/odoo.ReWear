const express = require("express");
const router = express.Router();
const swapController = require("../controllers/swapController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, swapController.createSwapRequest);

router.get("/my-requests", protect, swapController.getUserSwapRequests);

router.get("/received", protect, swapController.getReceivedSwapRequests);

router.patch("/:id/status", protect, swapController.updateSwapStatus);

module.exports = router;
