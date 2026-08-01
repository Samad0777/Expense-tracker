// routes/authRoutes.js
// Defines all /api/auth/* endpoints

const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authMiddleware, getMe); // protected, needs valid cookie

module.exports = router;
