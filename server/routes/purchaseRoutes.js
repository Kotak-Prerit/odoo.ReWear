const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");
const { protect } = require("../middlewares/authMiddleware");

// Get user's purchases (as buyer)
router.get("/my-purchases", protect, purchaseController.getUserPurchases);

// Get user's sales (as seller)
router.get("/my-sales", protect, purchaseController.getUserSales);

// Get specific purchase details
router.get("/:id", protect, purchaseController.getPurchaseById);

module.exports = router;
