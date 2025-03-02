const express = require("express");
const { employeePayroll } = require("./employeePayroll.services.js");
const app = express();
const PORT = 3000;
const connectDB = require("../HRMS/db.js")

// Middleware to parse JSON requests
app.use(express.json());

connectDB() // Call DB connection function

// Simple GET API Endpoint
app.get("/", (req, res) => {
  res.send("API is working!");
});

// Sample GET API
app.get("/api/products", (req, res) => {
  res.json({ message: "Product list fetched successfully", products: [] });
});
app.get("/api/employeepayroll", employeePayroll)


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
