// routes/transactionRoutes.js
// Defines all /api/transactions/* endpoints
// Every route here is protected — user must be logged in

const express = require("express");
const router = express.Router();

const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getMonthlyAnalytics,
  getCategoryBreakdown,
} = require("../controllers/transactionController");

const authMiddleware = require("../middlewares/authMiddleware");

// Apply authMiddleware to every route in this file
router.use(authMiddleware);

router.get("/", getTransactions);
router.get("/summary", getTransactionSummary);
router.get("/analytics/monthly", getMonthlyAnalytics);
router.get("/analytics/category-breakdown", getCategoryBreakdown);
router.get("/:id", getTransactionById);
router.post("/", createTransaction);
router.patch("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
