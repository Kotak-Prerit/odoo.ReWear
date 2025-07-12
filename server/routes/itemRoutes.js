const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, itemController.addItem);
router.get("/", itemController.getAllItems);
router.get("/user", protect, itemController.getUserItems); // Fixed route path
router.get("/:id", itemController.getItem);
router.post("/:id/purchase", protect, itemController.purchaseItem); // Added purchase route
router.delete("/:id", protect, itemController.deleteItem); // Added delete route

module.exports = router;
