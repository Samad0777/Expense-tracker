// server.js
// Entry point of the backend — sets up Express, middlewares, routes, and starts the server

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const dns = require("dns");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL, // allow requests from our React frontend
    credentials: true, // allow cookies to be sent
  }),
);
app.use(express.json()); // parse JSON request bodies
app.use(cookieParser()); // parse cookies (needed to read JWT cookie)

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

// Simple health check route
app.get("/", (req, res) => {
  res.send("Expense Tracker API is running");
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
