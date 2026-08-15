import { useState, useEffect } from "react";
import jsPDF from "jspdf";

const SUBJECTS = ["Mathematics", "Science", "English", "Social Studies", "Computer Science"];
const GRADES = ["Grade 3", "Grade 5", "Grade 7", "Grade 9", "Grade 11"];
const API_URL = "http://localhost:5000";

function exportLessonPDF(lesson) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y;

  doc.setFillColor(31, 59, 49);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(217, 164, 65);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("OMNIKON 2026 · LESSONFORGE", margin, 12);
  doc.setTextColor(245, 241, 230);
  doc.setFontSize(20);
  doc.text(lesson.topic || "Lesson Plan", margin, 25);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(201, 214, 205);
  doc.text(`${lesson.subject} · ${lesson.grade} · ${lesson.duration} min`, margin, 33);

  y = 52;

  const checkPageBreak = (needed) => {
    if (y + needed > 280) {
      doc.addPage();
      y = 20;
    }
  };

  const sectionHeader = (title) => {
    checkPageBreak(12);
    doc.setTextColor(217, 164, 65);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(title.toUpperCase(), margin, y);
    y += 8;
  };

  if (lesson.objectives?.length) {
    sectionHeader("Objectives");
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(28, 43, 36);
    lesson.objectives.forEach((obj) => {
      const lines = doc.splitTextToSize(`\u2713  ${obj}`, contentWidth);
      checkPageBreak(lines.length * 6 + 2);
      doc.text(lines, margin, y);
      y += lines.length * 6 + 2;
    });
    y += 4;
  }

  if (lesson.materials?.length) {
    sectionHeader("Materials");
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(28, 43, 36);
    const lines = doc.splitTextToSize(lesson.materials.join("   •   "), contentWidth);
    checkPageBreak(lines.length * 6 + 2);
    doc.text(lines, margin, y);
    y += lines.length * 6 + 8;
  }

  if (lesson.activities?.length) {
    sectionHeader("Activities");
    doc.setFontSize(11);
    lesson.activities.forEach((act) => {
      checkPageBreak(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 59, 49);
      doc.text(act.time || "", margin, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(28, 43, 36);
      const lines = doc.splitTextToSize(act.activity || "", contentWidth - 35);
      doc.text(lines, margin + 35, y);
      y += Math.max(lines.length * 6, 6) + 4;
    });
    y += 4;
  }

  if (lesson.assessment) {
    sectionHeader("Assessment");
    const lines = doc.splitTextToSize(lesson.assessment, contentWidth - 6);
    const boxHeight = lines.length * 6 + 10;
    checkPageBreak(boxHeight);
    doc.setFillColor(245, 241, 230);
    doc.rect(margin, y - 5, contentWidth, boxHeight, "F");
    doc.setFontSize(11);
    doc.setTextColor(28, 43, 36);
    doc.text(lines, margin + 6, y + 2);
    y += boxHeight + 4;
  }

  doc.save(`${(lesson.topic || "lesson-plan").replace(/\s+/g, "-").toLowerCase()}.pdf`);
}

function LessonPlanDetails({ plan }) {
  return (
    <>
      {plan.objectives?.length > 0 && (
        <section className="mb-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[#D9A441] mb-2 flex items-center gap-2">
            <span className="w-4 h-px bg-[#D9A441]" /> Objectives
          </h3>
          <ul className="space-y-1.5">
            {plan.objectives.map((obj, i) => (
              <li key={i} className="flex gap-2 text-[#1C2B24]">
                <span className="text-[#1F3B31] mt-1">✓</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {plan.materials?.length > 0 && (
        <section className="mb-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[#D9A441] mb-2 flex items-center gap-2">
            <span className="w-4 h-px bg-[#D9A441]" /> Materials
          </h3>
          <div className="flex flex-wrap gap-2">
            {plan.materials.map((mat, i) => (
              <span
                key={i}
                className="text-sm bg-[#F5F1E6] border border-[#E2DBC8] rounded-full px-3 py-1 text-[#1C2B24]"
              >
                {mat}
              </span>
            ))}
          </div>
        </section>
      )}

      {plan.activities?.length > 0 && (
        <section className="mb-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[#D9A441] mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-[#D9A441]" /> Activities
          </h3>
          <div className="space-y-0">
            {plan.activities.map((act, i) => (
              <div key={i} className="flex gap-4 relative pb-5 last:pb-0">
                {i !== plan.activities.length - 1 && (
                  <span className="absolute left-[27px] top-6 bottom-0 w-px bg-[#E2DBC8]" />
                )}
                <span className="shrink-0 w-[56px] h-[56px] rounded-full bg-[#1F3B31] text-[#F5F1E6] font-mono text-[10px] flex items-center justify-center text-center leading-tight px-1">
                  {act.time}
                </span>
                <p className="pt-3.5 text-[#1C2B24]">{act.activity}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {plan.assessment && (
        <section className="bg-[#F5F1E6] border-l-4 border-[#D9A441] rounded-r-md p-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[#8A7B4E] mb-1.5">
            Assessment
          </h3>
          <p className="text-[#1C2B24]">{plan.assessment}</p>
        </section>
      )}
    </>
  );
}

export default function App() {
  const [form, setForm] = useState({ subject: "", grade: "", topic: "", duration: "40" });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [view, setView] = useState("create");
  const [library, setLibrary] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.grade || !form.topic) {
      setError("Fill in subject, grade, and topic to generate a plan.");
      return;
    }
    setError("");
    setLoading(true);
    setPlan(null);
    setSaved(false);
    try {
      const res = await fetch(`${API_URL}/api/generate-lesson`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPlan(data);
      }
    } catch (err) {
      setError("Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!plan) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...plan }),
      });
      if (res.ok) setSaved(true);
    } catch (err) {
      setError("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    if (!plan) return;
    exportLessonPDF({ ...form, ...plan });
  };

  const fetchLibrary = async () => {
    setLibraryLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/lessons`);
      const data = await res.json();
      setLibrary(data);
    } catch (err) {
      console.error("Failed to load library");
    } finally {
      setLibraryLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/api/lessons/${id}`, { method: "DELETE" });
    setLibrary(library.filter((l) => l._id !== id));
  };

  useEffect(() => {
    if (view === "library") fetchLibrary();
  }, [view]);

  return (
    <div className="min-h-screen bg-[#F5F1E6] text-[#1C2B24]">
      <header className="bg-[#1F3B31] text-[#F5F1E6] px-6 py-8 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-[#D9A441] tracking-[0.2em] text-xs font-mono uppercase mb-2">
              Omnikon 2026 · Omni_EdTech_7
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight">
              LessonForge
            </h1>
            <p className="mt-2 text-[#C9D6CD] max-w-md">
              Turn a subject, grade, and topic into a full lesson plan — in under a minute.
            </p>
          </div>

          <div className="flex gap-2 bg-[#16291F] rounded-md p-1">
            <button
              onClick={() => setView("create")}
              className={`px-3 py-1.5 rounded text-sm font-mono transition ${
                view === "create" ? "bg-[#D9A441] text-[#1C2B24]" : "text-[#C9D6CD] hover:text-white"
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setView("library")}
              className={`px-3 py-1.5 rounded text-sm font-mono transition ${
                view === "library" ? "bg-[#D9A441] text-[#1C2B24]" : "text-[#C9D6CD] hover:text-white"
              }`}
            >
              Library
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-[repeating-linear-gradient(90deg,#D9A441_0px,#D9A441_10px,transparent_10px,transparent_20px)] opacity-60" />
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {view === "create" ? (
          <>
            <form
              onSubmit={handleGenerate}
              className="bg-white border border-[#E2DBC8] rounded-lg p-6 shadow-sm space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono uppercase tracking-wide text-[#5C6B62] mb-1">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full border border-[#D8D2BF] rounded-md px-3 py-2 bg-[#FBF9F2] focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
                  >
                    <option value="">Select subject</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-mono uppercase tracking-wide text-[#5C6B62] mb-1">
                    Grade
                  </label>
                  <select
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                    className="w-full border border-[#D8D2BF] rounded-md px-3 py-2 bg-[#FBF9F2] focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
                  >
                    <option value="">Select grade</option>
                    {GRADES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-mono uppercase tracking-wide text-[#5C6B62] mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  placeholder="e.g. Photosynthesis, Fractions, The French Revolution"
                  className="w-full border border-[#D8D2BF] rounded-md px-3 py-2 bg-[#FBF9F2] focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
                />
              </div>

              <div>
                <label className="block text-sm font-mono uppercase tracking-wide text-[#5C6B62] mb-1">
                  Class duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  min="15"
                  max="120"
                  className="w-32 border border-[#D8D2BF] rounded-md px-3 py-2 bg-[#FBF9F2] focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
                />
              </div>

              {error && <p className="text-sm text-[#B3452C] font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="bg-[#1F3B31] text-[#F5F1E6] px-5 py-2.5 rounded-md font-medium hover:bg-[#16291F] transition disabled:opacity-60"
              >
                {loading ? "Generating…" : "Generate lesson plan"}
              </button>
            </form>

            {plan && (
              <div className="mt-8 bg-white border border-[#E2DBC8] rounded-lg p-6 md:p-8 shadow-sm">
                <div className="mb-6 pb-4 border-b-2 border-dashed border-[#D8D2BF] flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="font-serif text-3xl mb-1 capitalize">{form.topic}</h2>
                    <p className="text-sm text-[#8A7B4E] font-mono uppercase tracking-wide">
                      {form.subject} · {form.grade} · {form.duration} min
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={handleExportPDF}
                      className="bg-white border border-[#1F3B31] text-[#1F3B31] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#F5F1E6] transition"
                    >
                      Export PDF
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving || saved}
                      className="bg-[#D9A441] text-[#1C2B24] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#C7943A] transition disabled:opacity-60"
                    >
                      {saved ? "✓ Saved to library" : saving ? "Saving…" : "Save to library"}
                    </button>
                  </div>
                </div>
                <LessonPlanDetails plan={plan} />
              </div>
            )}
          </>
        ) : (
          <LibraryView library={library} loading={libraryLoading} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}

function LibraryView({ library, loading, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);

  if (loading) {
    return <p className="text-center text-[#5C6B62] font-mono py-12">Loading saved plans…</p>;
  }

  if (library.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-[#E2DBC8] rounded-lg">
        <p className="text-[#5C6B62]">No saved lesson plans yet.</p>
        <p className="text-sm text-[#8A7B4E] mt-1">Generate a plan and click "Save to library".</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {library.map((lesson) => {
        const isOpen = expandedId === lesson._id;
        return (
          <div key={lesson._id} className="bg-white border border-[#E2DBC8] rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedId(isOpen ? null : lesson._id)}
              className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-[#FBF9F2] transition"
            >
              <div>
                <h3 className="font-serif text-xl capitalize">{lesson.topic}</h3>
                <p className="text-sm text-[#8A7B4E] font-mono uppercase tracking-wide">
                  {lesson.subject} · {lesson.grade} · {lesson.duration} min
                </p>
                <p className="text-xs text-[#5C6B62] mt-1">
                  Saved {new Date(lesson.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-[#8A7B4E] shrink-0 mt-1">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-2 border-t border-[#E2DBC8]">
                <div className="flex gap-2 mb-5 justify-end">
                  <button
                    onClick={() => exportLessonPDF(lesson)}
                    className="bg-white border border-[#1F3B31] text-[#1F3B31] px-3 py-1.5 rounded-md text-sm font-medium hover:bg-[#F5F1E6] transition"
                  >
                    Export PDF
                  </button>
                  <button
                    onClick={() => onDelete(lesson._id)}
                    className="text-sm text-[#B3452C] hover:underline px-3 py-1.5"
                  >
                    Delete
                  </button>
                </div>
                <LessonPlanDetails plan={lesson} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}