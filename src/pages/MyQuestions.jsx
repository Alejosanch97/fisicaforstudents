import { T } from "../i18n";
import { useState } from "react";
import { Plus, Upload, Trash2, Pencil } from "lucide-react";
import { useAuth } from "../auth";
import { apiPost, isDemo } from "../api";
import { GRADES } from "../data/grades";
import { unitsOf } from "../data/curriculum";
import { PageHead } from "../components/ui";
const EMPTY = {
  Grado: 8,
  Periodo: 1,
  Tema: "",
  Nivel: 2,
  Pregunta: "",
  Opcion_A: "",
  Opcion_B: "",
  Opcion_C: "",
  Opcion_D: "",
  Correcta: "A",
  Explicacion: ""
};
export function MyQuestions() {
  const {
    myQuestions,
    token,
    refreshQuestions
  } = useAuth();
  const [f, setF] = useState(EMPTY);
  const [bulk, setBulk] = useState(""),
    [msg, setMsg] = useState(""),
    [busy, setBusy] = useState(false),
    [filter, setFilter] = useState(0);
  const set = (k, v) => setF(x => ({
    ...x,
    [k]: v
  }));
  const unitTitle = (g, p) => unitsOf(g).find(u => u.p === Number(p))?.title || "";
  const save = async e => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const r = await apiPost({
      action: "question_save",
      token,
      question: {
        ...f,
        Tema: f.Tema || unitTitle(f.Grado, f.Periodo)
      }
    }).catch(x => ({
      status: "error",
      message: x.message
    }));
    setBusy(false);
    if (r.status === "success") {
      setMsg("✅ Saved to your Google Sheet");
      setF({
        ...EMPTY,
        Grado: f.Grado,
        Periodo: f.Periodo,
        Tema: f.Tema,
        Nivel: f.Nivel
      });
      refreshQuestions();
    } else setMsg("❌ " + (r.message || "Error"));
  };
  const parseBulk = () => bulk.split("\n").map(l => l.trim()).filter(Boolean).map(l => l.split(l.includes("\t") ? "\t" : "|").map(s => s.trim())).filter(c => c.length >= 6).map(c => ({
    Grado: f.Grado,
    Periodo: f.Periodo,
    Tema: f.Tema || unitTitle(f.Grado, f.Periodo),
    Nivel: f.Nivel,
    Pregunta: c[0],
    Opcion_A: c[1],
    Opcion_B: c[2],
    Opcion_C: c[3],
    Opcion_D: c[4],
    Correcta: (c[5] || "A").toUpperCase().slice(0, 1),
    Explicacion: c[6] || ""
  }));
  const sendBulk = async () => {
    const list = parseBulk();
    if (!list.length) {
      setMsg("❌ No valid lines. Use: Question | A | B | C | D | Correct letter | Explanation");
      return;
    }
    setBusy(true);
    const r = await apiPost({
      action: "question_bulk",
      token,
      questions: list
    }).catch(x => ({
      status: "error",
      message: x.message
    }));
    setBusy(false);
    if (r.status === "success") {
      setMsg(`✅ ${r.saved} questions uploaded`);
      setBulk("");
      refreshQuestions();
    } else setMsg("❌ " + (r.message || "Error"));
  };
  const del = async id => {
    if (!confirm(T("Delete this question?"))) return;
    await apiPost({
      action: "question_delete",
      token,
      id
    });
    refreshQuestions();
  };
  const shown = myQuestions.filter(q => !filter || Number(q.Grado) === filter);
  return <div className="page myq">
      <PageHead kicker={T("Your Google Sheet")} title={T("My questions")} sub={T("Questions you write here are saved in the “Questions” sheet and appear automatically in the bank and in every game.")} />
      {isDemo && <div className="demo-note">{T("🧪 Demo mode: questions are saved only in this browser. Paste your Apps Script URL in")} <code>{T("src/api.js")}</code> {T("to save them in Google Sheets.")}</div>}
      <div className="myq-grid">
        <form className="card form" onSubmit={save}>
          <h3><Plus size={18} /> {T("New question")}</h3>
          <div className="form-row">
            <label><span>{T("Grade")}</span><select value={f.Grado} onChange={e => set("Grado", Number(e.target.value))}>{GRADES.map(g => <option key={g.g} value={g.g}>{g.g}°</option>)}</select></label>
            <label><span>{T("Term")}</span><select value={f.Periodo} onChange={e => set("Periodo", Number(e.target.value))}>{unitsOf(f.Grado).map(u => <option key={u.p} value={u.p}>T{u.p} · {u.title}</option>)}</select></label>
            <label><span>{T("Level")}</span><select value={f.Nivel} onChange={e => set("Nivel", Number(e.target.value))}><option value={1}>{T("Easy")}</option><option value={2}>{T("Medium")}</option><option value={3}>{T("Hard")}</option></select></label>
          </div>
          <label><span>{T("Topic (optional)")}</span><input value={f.Tema} onChange={e => set("Tema", e.target.value)} placeholder={unitTitle(f.Grado, f.Periodo)} /></label>
          <label><span>{T("Question")}</span><textarea required rows={3} value={f.Pregunta} onChange={e => set("Pregunta", e.target.value)} placeholder={T("A cyclist travels 120 m in 20 s. What is her speed?")} /></label>
          <div className="opt-grid">
            {["A", "B", "C", "D"].map(L => <label key={L} className={T("opt-in {0}", f.Correcta === L ? "ok" : "")}>
                <button type="button" onClick={() => set("Correcta", L)} title={T("Mark as correct")}>{L}</button>
                <input required value={f["Opcion_" + L]} onChange={e => set("Opcion_" + L, e.target.value)} placeholder={T("Option {0}", L)} />
              </label>)}
          </div>
          <p className="muted small">{T("Click a letter to mark the correct answer (now:")} <b>{f.Correcta}</b>).</p>
          <label><span>{T("Explanation (shown after the answer)")}</span><input value={f.Explicacion} onChange={e => set("Explicacion", e.target.value)} placeholder="v = d / t = 120 / 20 = 6 m/s" /></label>
          <button className="btn btn-tang" disabled={busy}>{busy ? T("Saving…") : T("Save question")}</button>
        </form>

        <div className="card form">
          <h3><Upload size={18} /> {T("Paste many at once")}</h3>
          <p className="muted small">{T("One question per line, columns separated by")} <code>|</code> {T("or copied straight from Excel/Sheets (tabs). Uses the grade, term and level selected on the left.")}</p>
          <code className="fmt">{T("Question | A | B | C | D | Correct | Explanation")}</code>
          <textarea rows={9} value={bulk} onChange={e => setBulk(e.target.value)} placeholder={T("What is the SI unit of force? | joule | newton | watt | pascal | B | 1 N = 1 kg·m/s²\nWater boils at… K | 100 | 273 | 373 | 212 | C | K = °C + 273")} />
          <button type="button" className="btn btn-ink" onClick={sendBulk} disabled={busy}>{T("Upload")} {parseBulk().length || ""} {T("questions")}</button>
        </div>
      </div>
      {msg && <div className="toast-inline">{msg}</div>}

      <div className="myq-list-head"><h2 className="block-title">{T("Saved questions (")}{myQuestions.length})</h2>
        <div className="chips"><button className={!filter ? "on" : ""} onClick={() => setFilter(0)}>{T("All")}</button>{GRADES.map(g => <button key={g.g} className={filter === g.g ? "on" : ""} style={{
          "--fc": g.color
        }} onClick={() => setFilter(g.g)}>{g.g}°</button>)}</div>
      </div>
      <div className="myq-list">
        {shown.length === 0 && <p className="muted">{T("No questions yet.")}</p>}
        {shown.map(q => <article key={q.Id} className="myq-item">
            <span className="grade-dot" style={{
          "--gc": GRADES.find(g => g.g === Number(q.Grado))?.color
        }}>{q.Grado}°</span>
            <div><b>{q.Pregunta}</b><small>T{q.Periodo} · {q.Tema} · ✅ {q.Correcta}) {q["Opcion_" + q.Correcta]}</small></div>
            <button className="icon-btn" title={T("Edit")} onClick={() => {
          setF({
            ...EMPTY,
            ...q,
            Grado: Number(q.Grado),
            Periodo: Number(q.Periodo),
            Nivel: Number(q.Nivel) || 2
          });
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        }}><Pencil size={16} /></button>
            <button className="icon-btn danger" title={T("Delete")} onClick={() => del(q.Id)}><Trash2 size={16} /></button>
          </article>)}
      </div>
    </div>;
}