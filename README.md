# LessonForge 📚

**AI-powered lesson planning assistant for teachers** 

---

## 👥 Team

- **Team Leader:** Lovesh Semwal

---

## 📌 Problem Statement

**Omni_EdTech_7 — Fast Lesson Planning Support for Teachers**

Teachers in under-resourced schools often lack time and materials to prepare quality lessons. Build a tool that helps them create effective lesson plans quickly.

---

## 🧩 Problem Understanding

Teachers in under-resourced and rural government schools are often overwhelmed, managing large class sizes and multiple subjects with minimal institutional support. A significant portion of their limited preparation time goes into manually creating lesson plans from scratch — searching for relevant content, structuring activities, and aligning material to curriculum standards. This leaves less time for actual teaching, student engagement, and individual attention.

The problem is compounded in low-resource settings, where teachers frequently lack access to structured pedagogical material, updated curriculum guides, or peer mentorship to draw from. As a result, lesson quality becomes inconsistent, teaching content is often rushed or repetitive, and student learning outcomes suffer.

**Key pain points:**
- Lesson preparation consumes disproportionate time relative to actual teaching hours.
- Limited access to curriculum-aligned content in under-resourced schools.
- No easy way to adapt lesson plans across grade levels, subjects, or learning paces.
- Lack of reusable, shareable teaching resources across teachers and schools.

---

## 💡 Proposed Solution

**LessonForge** is a web-based lesson planning assistant that lets teachers generate a complete, structured lesson plan in under a minute by entering subject, grade level, topic, and available class duration. The system uses an AI-powered generation engine combined with a curriculum-alignment layer to produce ready-to-use lesson plans covering objectives, activities, materials, and assessment methods.

Generated plans are fully editable, allowing teachers to fine-tune content before saving. A personal lesson library lets teachers store, tag, and revisit past plans, enabling reuse and adaptation instead of starting from scratch each time. Finished plans can be exported as print-ready PDFs for offline classroom use — critical for schools with unreliable internet access.

The platform is built lightweight and low-bandwidth friendly, ensuring usability even in resource-constrained schools.

## 🏗️ System Architecture

─────────────┐ ┌──────────────┐ ┌───────────────────┐
│ Client │ ───▶ │ API Layer │ ───▶ │ AI Generation │
│ (React) │ ◀─── │ (Node/Express│ ◀─── │ Service (LLM API) │
└─────────────┘ └──────┬───────┘ └───────────────────┘
│
▼
┌─────────────┐
│ Database │
│ (MongoDB) │
└─────────────┘

| Layer | Responsibility |
|---|---|
| **Client (Frontend)** | Lesson request form, plan editor/viewer, personal lesson library, PDF export trigger |
| **API Layer (Backend)** | Auth, request validation, prompt construction, curriculum-alignment checks, plan CRUD |
| **AI Generation Service** | Structured lesson plan generation via LLM API, using curriculum-aware prompt templates |
| **Database** | Stores users, saved lesson plans, subjects/grades metadata, curriculum reference tags |
| **Export Service** | Converts a finalized lesson plan into a downloadable, print-ready PDF |

**Data flow:** Teacher submits lesson parameters → Backend constructs a structured prompt with curriculum context → AI Generation Service returns a structured lesson plan → Teacher reviews/edits in UI → Plan is saved to database and optionally exported as PDF.

---

## ✨ Key Features

- **Instant Lesson Generation** — Input subject, grade, topic, and duration to receive a full lesson plan in seconds.
- **Editable Structured Output** — Every generated section is editable inline.
- **Personal Lesson Library** — Save, tag, and revisit past lesson plans.
- **Curriculum Alignment Tags** — Plans tagged against standard curriculum topics.
- **Low-Bandwidth Friendly UI** — Optimized for slow or intermittent school internet.
- **One-Click PDF Export** — Print-ready lesson plan output for offline use.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| AI / Generation | LLM API (structured prompt templates) |
| Authentication | JWT-based auth |
| PDF Export | Puppeteer / PDFKit |
| Hosting | Vercel (frontend), Render/Railway (backend), MongoDB Atlas (DB) |

---

## 📅 Implementation Plan

| Phase | Tasks | Time |
|---|---|---|
| 1. Setup | Repo setup, tech stack scaffolding, DB schema, basic auth | 1–2 hrs |
| 2. Core Generation Flow | Lesson input form, backend prompt construction, LLM integration | 3–4 hrs |
| 3. Editing & Persistence | Inline editing, save-to-library, fetch/list saved plans | 2–3 hrs |
| 4. Export & Polish | PDF export, UI/UX polish, low-bandwidth optimization | 2–3 hrs |
| 5. Testing & Demo Prep | Bug fixes, sample data, rehearse demo, prepare pitch | 1–2 hrs |

### Stretch Goals
- Multi-language lesson plan output for regional accessibility.
- Teacher-to-teacher plan sharing within the library.
- Basic analytics on most-used topics/subjects.

---

## 📂 Project Structure

LessonForge/
├── frontend/ # React app (UI, lesson form, editor, library)
├── backend/ # Node/Express API (auth, generation, CRUD, export)
└── README.md

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/lovesh-semwal/LessonForge.git
cd LessonForge

# Frontend setup
cd frontend
npm install
npm start

# Backend setup (in a new terminal)
cd backend
npm install
npm run dev
```

---

## 🏆 Hackathon Info

Built for **Omnikon National Hackathon 2026**  
Track: EdTech & Skill Development  
Problem Statement: `Omni_EdTech_7`
