const express = require('express');
const router = express.Router();
const RetentionItem = require('../models/RetentionItem');

// SM-2 Algorithm Implementation
function calculateSM2(quality, easeFactor, interval, repetitions) {
  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  let newInterval;
  let newRepetitions = repetitions;

  if (quality < 3) {
    newInterval = 1;
    newRepetitions = 0;
  } else {
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEaseFactor);
    }
    newRepetitions += 1;
  }

  return { easeFactor: newEaseFactor, interval: newInterval, repetitions: newRepetitions };
}

// Add retention item
router.post('/add', async (req, res) => {
  try {
    const { userId, content, skill } = req.body;

    const item = new RetentionItem({
      userId,
      content,
      skill,
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Review item
router.post('/review/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quality } = req.body; // Quality rating 0-5

    const item = await RetentionItem.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const sm2Result = calculateSM2(quality, item.easeFactor, item.interval, item.repetitions);

    item.easeFactor = sm2Result.easeFactor;
    item.interval = sm2Result.interval;
    item.repetitions = sm2Result.repetitions;
    item.lastReviewed = new Date();
    item.nextReview = new Date(Date.now() + sm2Result.interval * 24 * 60 * 60 * 1000);

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get due items
router.get('/due/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const items = await RetentionItem.find({
      userId,
      nextReview: { $lte: new Date() }
    }).sort({ nextReview: 1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;