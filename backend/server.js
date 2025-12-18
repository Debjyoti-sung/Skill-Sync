const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ==================
// MongoDB Connection
// ==================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillsync', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('📦 MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ==================
// Middleware
// ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================
// CORS Configuration
// ==================
const corsOptions = {
  origin: [
    "https://skill-sync-1.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

// ==================
// Routes
// ==================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/skills", require("./routes/skills"));
app.use("/api/retention", require("./routes/retention"));
app.use("/api/career", require("./routes/career"));
app.use("/api/tasks", require("./routes/tasks"));

// ==================
// Health Check
// ==================
app.get("/", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "SkillSync API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      skills: "/api/skills",
      retention: "/api/retention",
      career: "/api/career",
      tasks: "/api/tasks"
    }
  });
});

app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    status: "OK", 
    message: "SkillSync API is running",
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// ==================
// Error Handling
// ==================
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.path 
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ 
    error: err.message || "Internal server error"
  });
});

// ==================
// Start Server
// ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SkillSync server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for: https://skill-sync-1.vercel.app`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
