const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../middleware/auth");

const dataPath = path.join(__dirname, "../data/tasks.json");

const readTasks = () => {
  try {
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeTasks = (tasks) => {
  fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get all tasks
router.get("/", authMiddleware, (req, res) => {
  try {
    const tasks = readTasks();
    const userTasks = tasks.filter(t => t.userId === req.userId);
    res.json(userTasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Add task
router.post("/", authMiddleware, (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    const tasks = readTasks();
    const newTask = {
      id: generateId(),
      userId: req.userId,
      title,
      description,
      dueDate,
      priority: priority || "medium",
      completed: false,
      createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to add task" });
  }
});

// Update task
router.patch("/:id", authMiddleware, (req, res) => {
  try {
    const tasks = readTasks();
    const index = tasks.findIndex(t => 
      t.id === req.params.id && t.userId === req.userId
    );

    if (index === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    tasks[index] = { ...tasks[index], ...req.body };
    writeTasks(tasks);

    res.json(tasks[index]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task
router.delete("/:id", authMiddleware, (req, res) => {
  try {
    const tasks = readTasks();
    const filtered = tasks.filter(t => 
      !(t.id === req.params.id && t.userId === req.userId)
    );

    writeTasks(filtered);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
