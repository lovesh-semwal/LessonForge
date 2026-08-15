const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Groq = require('groq-sdk');
const Lesson = require('./models/Lesson');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

app.get('/', (req, res) => {
  res.send('LessonForge API is running ✅');
});

// Generate a lesson plan (does NOT save automatically)
app.post('/api/generate-lesson', async (req, res) => {
  const { subject, grade, topic, duration } = req.body;

  if (!subject || !grade || !topic) {
    return res.status(400).json({ error: 'Subject, grade, and topic are required.' });
  }

  const prompt = `You are an expert curriculum designer helping a teacher prepare a lesson.

Create a structured lesson plan for:
- Subject: ${subject}
- Grade level: ${grade}
- Topic: ${topic}
- Class duration: ${duration} minutes

Respond ONLY with valid JSON (no markdown, no code fences, no extra text) in exactly this shape:
{
  "objectives": ["...", "..."],
  "materials": ["...", "..."],
  "activities": [
    { "time": "0-10 min", "activity": "..." },
    { "time": "10-25 min", "activity": "..." }
  ],
  "assessment": "..."
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content;
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const lessonPlan = JSON.parse(cleaned);

    res.json(lessonPlan);
  } catch (err) {
    console.error('Generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate lesson plan. Try again.' });
  }
});

// Save a lesson plan to the library
app.post('/api/lessons', async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(201).json(lesson);
  } catch (err) {
    console.error('Save error:', err.message);
    res.status(500).json({ error: 'Failed to save lesson plan.' });
  }
});

// Get all saved lessons (library)
app.get('/api/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: -1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lessons.' });
  }
});

// Get one lesson by ID
app.get('/api/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found.' });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lesson.' });
  }
});

// Delete a saved lesson
app.delete('/api/lessons/:id', async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lesson deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete lesson.' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});