const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, itemController.addItem);
router.get("/", itemController.getAllItems);
router.get("/:id", itemController.getItem);
router.get("/user/items", protect, itemController.getUserItems);

module.exports = router;
