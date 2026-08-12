// controllers/transactionController.js
// Handles all CRUD operations for transactions
// Every transaction is scoped to req.userId (set by authMiddleware)
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

// @route   GET /api/transactions
// Supports: search, filter (category, type), sort, pagination
const getTransactions = async (req, res) => {
  try {
    const { search, category, type, sort, page = 1, limit = 10 } = req.query;

    // Base filter: only this user's transactions
    const query = { userId: req.userId };

    // Search by title (case-insensitive)
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default: latest first
    if (sort === "latest") sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "high") sortOption = { amount: -1 };
    if (sort === "low") sortOption = { amount: 1 };

    // Pagination math
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const totalTransactions = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    return res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: {
        transactions,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalTransactions / limitNumber),
        totalTransactions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/transactions/:id
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId, // ensures user can only access their own transaction
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction fetched successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   POST /api/transactions
const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, description } = req.body;

    // Basic validation
    if (!title || amount === undefined || !type || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, amount, type and category are required",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero",
      });
    }

    const transaction = await Transaction.create({
      userId: req.userId,
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      // Agar frontend date bheje to woh use hogi,
      // warna current date automatically save hogi.
      date: date || Date.now(),
      description: description?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PATCH /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, description } = req.body;

    // If amount is being updated, validate it
    if (amount !== undefined && Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero",
      });
    }

    // Whitelist only the fields we allow to change.
    // Never spread req.body directly — that lets userId/_id get overwritten
    // and, since it has no $ operator, Mongoose/Mongo would REPLACE the whole
    // document instead of merging, wiping out any field not sent (this is
    // exactly why "date" was turning null).
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (amount !== undefined) updates.amount = Number(amount);
    if (type !== undefined) updates.type = type;
    if (category !== undefined) updates.category = category;
    if (date !== undefined) updates.date = date;
    if (description !== undefined) updates.description = description.trim();

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // only update own transaction
      { $set: updates }, // $set = partial update, won't touch other fields
      { new: true, runValidators: true },
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId, // only delete own transaction
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/transactions/summary
// Returns totalIncome, totalExpense, and balance for the logged-in user
// Calculated using MongoDB aggregation (not fetched into JS and summed manually)
const getTransactionSummary = async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      // Only this user's transactions
      // Note: aggregate() does NOT auto-cast strings to ObjectId like
      // find()/findOne() do, so we cast req.userId manually here —
      // otherwise this $match would silently return zero results.
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      // Group by type (Income / Expense) and sum amounts for each
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    // summary looks like: [{ _id: "Income", total: 5000 }, { _id: "Expense", total: 2000 }]
    // Convert that into a simple object, defaulting to 0 if a type has no transactions yet
    let totalIncome = 0;
    let totalExpense = 0;

    summary.forEach((item) => {
      if (item._id === "Income") totalIncome = item.total;
      if (item._id === "Expense") totalExpense = item.total;
    });

    const balance = totalIncome - totalExpense;

    return res.status(200).json({
      success: true,
      message: "Transaction summary fetched successfully",
      data: {
        totalIncome,
        totalExpense,
        balance,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
};
