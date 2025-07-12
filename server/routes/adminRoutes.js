const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, admin } = require("../middlewares/authMiddleware");

router.get("/users", protect, admin, adminController.getAllUsers);
router.delete("/users/:id", protect, admin, adminController.deleteUser);
router.get("/listings", protect, admin, adminController.getAllListings);
router.delete("/listings/:id", protect, admin, adminController.deleteListing);

module.exports = router;
