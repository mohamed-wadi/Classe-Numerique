const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  subcategory: { type: String },
  level: { type: String, required: true, enum: ['CM2', 'CE6'] },
  type: { type: String, required: true, enum: ['cours', 'exercice'] },
  content: { type: String },
  fileUrl: { type: String },
  thumbnailUrl: { type: String },
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', contentSchema);
