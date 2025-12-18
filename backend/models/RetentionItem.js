const mongoose = require('mongoose');

const RetentionItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  skill: { type: String, required: true },
  easeFactor: { type: Number, default: 2.5 },
  interval: { type: Number, default: 1 },
  repetitions: { type: Number, default: 0 },
  nextReview: { type: Date, required: true },
  lastReviewed: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RetentionItem', RetentionItemSchema);