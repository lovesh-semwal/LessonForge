import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const SUBJECTS = [
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "Social Studies",
  "History",
  "Geography",
  "Civics",
  "Economics",
  "Computer Science",
  "Environmental Science",
  "Sanskrit",
  "Art & Craft",
  "Physical Education",
];
const GRADES = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const LANGUAGES = ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali"];
const API_URL = "http://localhost:5000";

async function exportLessonPDF(lesson) {
  const esc = (s) => (s || "").toString();

  const objectivesHTML = (lesson.objectives || [])
    .map((o) => `<li style="display:flex;gap:8px;margin-bottom:6px;"><span style="color:#1F3B31;">✓</span><span>${esc(o)}</span></li>`)
    .join("");

  const materialsHTML = (lesson.materials || [])
    .map((m) => `<span style="display:inline-block;background:#F5F1E6;border:1px solid #E2DBC8;border-radius:9999px;padding:4px 12px;margin:0 6px 6px 0;font-size:13px;">${esc(m)}</span>`)
    .join("");

  const activitiesHTML = (lesson.activities || [])
    .map(
      (a) => `
      <div style="display:flex;gap:16px;margin-bottom:18px;">
        <div style="flex-shrink:0;width:64px;height:64px;border-radius:9999px;background:#1F3B31;color:#F5F1E6;font-size:10px;display:flex;align-items:center;justify-content:center;text-align:center;line-height:1.2;padding:4px;">${esc(a.time)}</div>
        <div style="padding-top:14px;">${esc(a.activity)}</div>
      </div>`
    )
    .join("");

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-10000px";
  container.style.left = "0";
  container.style.width = "800px";
  container.style.background = "#FFFFFF";
  container.style.fontFamily = "'Inter', 'Noto Sans', sans-serif";
  container.style.color = "#1C2B24";

  container.innerHTML = `
    <div style="background:#1F3B31;color:#F5F1E6;padding:28px 36px;">
      <div style="color:#D9A441;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">OMNIKON 2026 · LESSONFORGE</div>
      <div style="font-size:32px;font-weight:600;text-transform:capitalize;">${esc(lesson.topic)}</div>
      <div style="color:#C9D6CD;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-top:6px;">${esc(lesson.subject)} · ${esc(lesson.grade)} · ${esc(lesson.duration)} min</div>
    </div>
    <div style="padding:32px 36px;">
      ${lesson.objectives?.length ? `
        <div style="margin-bottom:24px;">
          <div style="color:#D9A441;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;margin-bottom:10px;">Objectives</div>
          <ul style="list-style:none;padding:0;margin:0;">${objectivesHTML}</ul>
        </div>` : ""}
      ${lesson.materials?.length ? `
        <div style="margin-bottom:24px;">
          <div style="color:#D9A441;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;margin-bottom:10px;">Materials</div>
          <div>${materialsHTML}</div>
        </div>` : ""}
      ${lesson.activities?.length ? `
        <div style="margin-bottom:24px;">
          <div style="color:#D9A441;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;margin-bottom:14px;">Activities</div>
          <div>${activitiesHTML}</div>
        </div>` : ""}
      ${lesson.assessment ? `
        <div style="background:#F5F1E6;border-left:4px solid #D9A441;border-radius:0 6px 6px 0;padding:16px;">
          <div style="color:#8A7B4E;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;margin-bottom:6px;">Assessment</div>
          <div>${esc(lesson.assessment)}</div>
        </div>` : ""}
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: "#FFFFFF" });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${(lesson.topic || "lesson-plan").replace(/\s+/g, "-").toLowerCase()}.pdf`);
  } catch (err) {
    console.error("PDF export failed:", err);
    alert("Could not export PDF. Try again.");
  } finally {
    document.body.removeChild(container);
  }
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
              <li key={i} className="flex gap-2 text-(--text)">
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
                className="text-sm bg-(--surface-alt) border border-(--border) rounded-full px-3 py-1 text-(--text)"
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
                  <span className="absolute left-6.75 top-6 bottom-0 w-px bg-(--border)" />
                )}
                <span className="shrink-0 w-14 h-14 rounded-full bg-[#1F3B31] text-[#F5F1E6] font-mono text-[10px] flex items-center justify-center text-center leading-tight px-1">
                  {act.time}
                </span>
                <p className="pt-3.5 text-(--text)">{act.activity}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {plan.assessment && (
        <section className="bg-(--surface-alt) border-l-4 border-[#D9A441] rounded-r-md p-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-(--label-muted) mb-1.5">
            Assessment
          </h3>
          <p className="text-(--text)">{plan.assessment}</p>
        </section>
      )}
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("lessonforge-theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("lessonforge-theme", theme);
  }, [theme]);

  const [form, setForm] = useState({ subject: "", grade: "", topic: "", duration: "40", language: "English" });
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
    <div className="min-h-screen bg-(--bg) text-(--text) transition-colors duration-300">
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-md bg-[#16291F] text-[#F5F1E6] flex items-center justify-center hover:opacity-80 transition text-base"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
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
        </div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-[repeating-linear-gradient(90deg,#D9A441_0px,#D9A441_10px,transparent_10px,transparent_20px)] opacity-60" />
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {view === "create" ? (
          <>
            <form
              onSubmit={handleGenerate}
              className="bg-(--surface) border border-(--border) rounded-lg p-6 shadow-sm space-y-5 transition-colors duration-300"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono uppercase tracking-wide text-(--text-muted) mb-1">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full border border-(--input-border) rounded-md px-3 py-2 bg-(--input-bg) text-(--text) focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
                  >
                    <option value="">Select subject</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-mono uppercase tracking-wide text-(--text-muted) mb-1">
                    Grade
                  </label>
                  <select
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                    className="w-full border border-(--input-border) rounded-md px-3 py-2 bg-(--input-bg) text-(--text) focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
                  >
                    <option value="">Select grade</option>
                    {GRADES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-mono uppercase tracking-wide text-(--text-muted) mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  placeholder="e.g. Photosynthesis, Fractions, The French Revolution"
                  className="w-full border border-(--input-border) rounded-md px-3 py-2 bg-(--input-bg) text-(--text) focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono uppercase tracking-wide text-(--text-muted) mb-1">
                    Class duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    min="15"
                    max="120"
                    className="w-full border border-(--input-border) rounded-md px-3 py-2 bg-(--input-bg) text-(--text) focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono uppercase tracking-wide text-(--text-muted) mb-1">
                    Output language
                  </label>
                  <select
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    className="w-full border border-(--input-border) rounded-md px-3 py-2 bg-(--input-bg) text-(--text) focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && <p className="text-sm text-(--danger) font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="bg-[#1F3B31] text-[#F5F1E6] px-5 py-2.5 rounded-md font-medium hover:bg-[#16291F] transition disabled:opacity-60"
              >
                {loading ? "Generating…" : "Generate lesson plan"}
              </button>
            </form>

            {plan && (
              <div className="mt-8 bg-(--surface) border border-(--border) rounded-lg p-6 md:p-8 shadow-sm transition-colors duration-300">
                <div className="mb-6 pb-4 border-b-2 border-dashed border-(--input-border) flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="font-serif text-3xl mb-1 capitalize">{form.topic}</h2>
                    <p className="text-sm text-(--label-muted) font-mono uppercase tracking-wide">
                      {form.subject} · {form.grade} · {form.duration} min
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                                        <button
                      onClick={handleExportPDF}
                      className="bg-(--surface) border border-(--input-border) text-(--text) px-4 py-2 rounded-md text-sm font-medium hover:bg-(--surface-alt) transition"
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
    return <p className="text-center text-(--text-muted) font-mono py-12">Loading saved plans…</p>;
  }

  if (library.length === 0) {
    return (
      <div className="text-center py-16 bg-(--surface) border border-(--border) rounded-lg transition-colors duration-300">
        <p className="text-(--text-muted)">No saved lesson plans yet.</p>
        <p className="text-sm text-(--label-muted) mt-1">Generate a plan and click "Save to library".</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {library.map((lesson) => {
        const isOpen = expandedId === lesson._id;
        return (
          <div key={lesson._id} className="bg-(--surface) border border-(--border) rounded-lg overflow-hidden transition-colors duration-300">
            <button
              onClick={() => setExpandedId(isOpen ? null : lesson._id)}
              className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-(--surface-alt) transition"
            >
              <div>
                <h3 className="font-serif text-xl capitalize">{lesson.topic}</h3>
                <p className="text-sm text-(--label-muted) font-mono uppercase tracking-wide">
                  {lesson.subject} · {lesson.grade} · {lesson.duration} min
                </p>
                <p className="text-xs text-(--text-muted) mt-1">
                  Saved {new Date(lesson.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-(--label-muted) shrink-0 mt-1">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-2 border-t border-(--border)">
                <div className="flex gap-2 mb-5 justify-end">
                  <button
                    onClick={() => exportLessonPDF(lesson)}
                    className="bg-(--surface) border border-[#1F3B31] text-[#1F3B31] px-3 py-1.5 rounded-md text-sm font-medium hover:bg-[(--surface-alt) transition"
                  >
                    Export PDF
                  </button>
                  <button
                    onClick={() => onDelete(lesson._id)}
                    className="text-sm text-(--danger) hover:underline px-3 py-1.5"
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