const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const verifyRoutes = require("./routes/verify");

// Routes
app.use("/api", verifyRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Document Verification Backend is running"
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});