const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  time: String,
  activity: String,
}, { _id: false });

const lessonSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  topic: { type: String, required: true },
  duration: { type: String, required: true },
  objectives: [String],
  materials: [String],
  activities: [activitySchema],
  assessment: String,
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);