const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/my-purchases", protect, purchaseController.getUserPurchases);

router.get("/my-sales", protect, purchaseController.getUserSales);

router.get("/:id", protect, purchaseController.getPurchaseById);

module.exports = router;
