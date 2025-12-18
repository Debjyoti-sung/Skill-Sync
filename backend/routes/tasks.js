const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Create task
router.post('/create', async (req, res) => {
  try {
    const { userId, title, description, dueDate, priority, skills } = req.body;

    const task = new Task({
      userId,
      title,
      description,
      dueDate: new Date(dueDate),
      priority,
      skills
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tasks including tomorrow's tasks
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 2); // Include tomorrow

    const tasks = await Task.find({
      userId,
      dueDate: { $lt: tomorrow },
      status: 'pending'
    }).sort({ dueDate: 1, priority: -1 });

    // Separate today and tomorrow tasks
    const todayEnd = new Date(today);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const todayTasks = tasks.filter(t => t.dueDate < todayEnd);
    const tomorrowTasks = tasks.filter(t => t.dueDate >= todayEnd);

    res.json({ 
      todayTasks, 
      tomorrowTasks,
      allTasks: tasks 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task status
router.patch('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/delete/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;