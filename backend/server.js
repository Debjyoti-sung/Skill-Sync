const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ==================
// Middleware
// ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Correct CORS configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

// ==================
// Routes
// ==================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/skills", require("./routes/skills"));
app.use("/api/retention", require("./routes/retention"));
app.use("/api/career", require("./routes/career"));
app.use("/api/tasks", require("./routes/tasks"));

// ==================
// Health check
// ==================
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "SkillSync API is running" });
});

// ==================
// Server
// ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SkillSync server running on port ${PORT}`);
});
