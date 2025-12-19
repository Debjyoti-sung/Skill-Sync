const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../middleware/auth");

const dataPath = path.join(__dirname, "../data/skills.json");

const readSkills = () => {
  try {
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeSkills = (skills) => {
  fs.writeFileSync(dataPath, JSON.stringify(skills, null, 2));
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get all skills for user
router.get("/", authMiddleware, (req, res) => {
  try {
    const skills = readSkills();
    const userSkills = skills.filter(s => s.userId === req.userId);
    res.json(userSkills);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

// Add skill
router.post("/", authMiddleware, (req, res) => {
  try {
    const { name, category, proficiency } = req.body;

    const skills = readSkills();
    const newSkill = {
      id: generateId(),
      userId: req.userId,
      name,
      category,
      proficiency: proficiency || "beginner",
      createdAt: new Date().toISOString()
    };

    skills.push(newSkill);
    writeSkills(skills);

    res.status(201).json(newSkill);
  } catch (error) {
    res.status(500).json({ error: "Failed to add skill" });
  }
});

// Delete skill
router.delete("/:id", authMiddleware, (req, res) => {
  try {
    const skills = readSkills();
    const filtered = skills.filter(s => 
      !(s.id === req.params.id && s.userId === req.userId)
    );

    writeSkills(filtered);
    res.json({ message: "Skill deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete skill" });
  }
});

module.exports = router;
