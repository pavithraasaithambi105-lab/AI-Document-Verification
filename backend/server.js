const express = require("express");
const cors = require("cors");
require("dotenv").config();

const documentRoutes = require("./routes/documentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/documents", documentRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Document Verification API is running"
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});