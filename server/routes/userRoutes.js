const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/google-login", userController.googleAuth);
router.get("/profile", protect, userController.getProfile);

module.exports = router;
