// config/db.js
// Handles connecting our backend to MongoDB Atlas using Mongoose

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Stop the server if DB connection fails, no point running without a DB
    process.exit(1);
  }
};

module.exports = connectDB;
