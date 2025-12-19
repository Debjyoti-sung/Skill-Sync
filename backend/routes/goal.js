const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../middleware/auth");

const dataPath = path.join(__dirname, "../data/goals.json");

const readGoals = () => {
  try {
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeGoals = (goals) => {
  fs.writeFileSync(dataPath, JSON.stringify(goals, null, 2));
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get user's goal
router.get("/", authMiddleware, (req, res) => {
  try {
    const goals = readGoals();
    const userGoal = goals.find(g => g.userId === req.userId);
    res.json(userGoal || {});
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch goal" });
  }
});

// Create/Update goal
router.post("/", authMiddleware, (req, res) => {
  try {
    const { goalType, sourceUrl, hoursPerDay, startDate, deadline } = req.body;

    const goals = readGoals();

    // Remove existing goal for this user
    const filtered = goals.filter(g => g.userId !== req.userId);

    // Create new goal
    const newGoal = {
      id: generateId(),
      userId: req.userId,
      goalType,
      sourceUrl,
      hoursPerDay: parseInt(hoursPerDay),
      startDate,
      deadline,
      createdAt: new Date().toISOString(),
      progress: 0
    };

    filtered.push(newGoal);
    writeGoals(filtered);

    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ error: "Failed to create goal" });
  }
});

// Update goal progress
router.patch("/:id", authMiddleware, (req, res) => {
  try {
    const goals = readGoals();
    const index = goals.findIndex(g => 
      g.id === req.params.id && g.userId === req.userId
    );

    if (index === -1) {
      return res.status(404).json({ error: "Goal not found" });
    }

    goals[index] = { ...goals[index], ...req.body };
    writeGoals(goals);

    res.json(goals[index]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update goal" });
  }
});

module.exports = router;
