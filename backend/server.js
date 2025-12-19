const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

// ==================
// Data Directory Setup
// ==================
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log("📁 Data directory created");
}

// Initialize JSON files if they don't exist
const initFile = (filename) => {
  const filepath = path.join(dataDir, filename);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify([], null, 2));
    console.log(`📄 Created ${filename}`);
  }
};

initFile("users.json");
initFile("skills.json");
initFile("retention.json");
initFile("career.json");
initFile("tasks.json");

console.log("✅ JSON storage initialized");

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
    storage: "JSON Files",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  const dataFiles = ["users.json", "skills.json", "retention.json", "career.json", "tasks.json"];
  const filesExist = dataFiles.every(file => 
    fs.existsSync(path.join(dataDir, file))
  );

  res.json({ 
    status: "OK", 
    message: "SkillSync API is running",
    storage: "JSON Files",
    storageHealth: filesExist ? "Connected" : "Error",
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
  console.log(`💾 Using JSON file storage`);
  console.log(`🌐 CORS enabled for: https://skill-sync-1.vercel.app`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
