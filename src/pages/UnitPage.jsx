import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Presentation, Sparkles, FlaskConical, PenLine, Trophy, BookOpen, Sigma, Lightbulb, ClipboardList, CircleCheck, Eye, EyeOff, ChevronRight, Globe, Target } from "lucide-react";
import { gradeMeta } from "../data/grades";
import { getUnit, classFlow } from "../data/curriculum";
import { buildBank, fromSheet } from "../data/bank";
import { getSim } from "../sims";
import { Tex } from "../sims/kit";
import { useAuth } from "../auth";
import { apiPost } from "../api";
import { Modal } from "../components/ui";

const ICONS = { Sparkles, Presentation, FlaskConical, PenLine, Trophy };
const TABS = [["overview", "Overview", Target], ["formulas", "Formulas", Sigma], ["labs", "Virtual labs", FlaskConical], ["examples", "Worked examples", PenLine], ["reading", "Reading", BookOpen], ["questions", "Questions", ClipboardList], ["tips", "Teacher tips", Lightbulb]];

export function Example({ ex, n }) {
  const [k, setK] = useState(0);
  const done = k > ex.steps.length;
  return (
    <article className="example">
      <span className="ex-n">#{n}</span>
      <h4>{ex.q}</h4>
      <ol>{ex.steps.slice(0, k).map((s, i) => <li key={i}>{s}</li>)}</ol>
      {done && <div className="ex-ans">✅ {ex.a}</div>}
      <div className="ex-btns">
        {!done && <button className="btn btn-gc btn-sm" onClick={() => setK(k + 1)}>{k < ex.steps.length ? `Show step ${k + 1}` : "Show answer"} <ChevronRight size={14} /></button>}
        {k > 0 && <button className="btn btn-ghost btn-sm" onClick={() => setK(0)}>Hide</button>}
      </div>
    </article>
  );
}

export function FormulaCard({ f }) {
  return (
    <article className="formula-card">
      <h4>{f.n}</h4>
      <div className="formula-big"><Tex tex={f.tex} block /></div>
      <table><tbody>{f.vars.map(([s, m, u]) => <tr key={s + m}><td><Tex tex={s} /></td><td>{m}</td><td className="unit">{u}</td></tr>)}</tbody></table>
      <p className="trick"><Lightbulb size={15} /> {f.tip}</p>
    </article>
  );
}

export function QuestionItem({ q, i }) {
  const [show, setShow] = useState(false);
  return (
    <article className={`q-item ${show ? "shown" : ""}`}>
      <div className="q-head"><span className="q-num">{i}</span><span className={`q-lv lv${q.level}`}>{["", "Easy", "Medium", "Hard"][q.level]}</span>{q.mine && <span className="q-mine">Mine</span>}<span className="q-kind">{q.kind === "calc" ? "🧮" : q.kind === "mine" ? "✍️" : "💡"}</span></div>
      <p>{q.q}</p>
      <ol type="A">{q.opts.map((o, k) => <li key={k} className={show && k === q.ans ? "ok" : ""}>{o}</li>)}</ol>
      {show && q.ex && <p className="q-ex">💬 {q.ex}</p>}
      <button className="btn btn-ghost btn-sm" onClick={() => setShow(!show)}>{show ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> Answer</>}</button>
    </article>
  );
}

function Reading({ r, cefr }) {
  const [ans, setAns] = useState(false);
  const words = r.gloss.map((g) => g[0]);
  const mark = (p) => {
    const re = new RegExp(`\\b((?:${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?:s|es|ed|ing)?)\\b`, "gi");
    return p.split(re).map((part, i) => {
      const g = i % 2 ? r.gloss.find((x) => part.toLowerCase().startsWith(x[0].toLowerCase())) : null;
      return g ? <mark key={i} title={g[1]}>{part}</mark> : part;
    });
  };
  return (
    <div className="reading">
      <article className="reading-paper">
        <span className="kicker">Reading · {cefr}</span>
        <h2>{r.t}</h2>
        {r.text.map((p, i) => <p key={i}>{mark(p)}</p>)}
      </article>
      <aside>
        <div className="gloss"><h4>📖 Glossary</h4>{r.gloss.map(([w, d]) => <p key={w}><b>{w}</b> — {d}</p>)}</div>
        <div className="gloss"><h4>❓ Comprehension</h4>{r.qs.map(([q, a], i) => <div key={i} className="rq"><p>{i + 1}. {q}</p>{ans && <p className="rq-a">→ {a}</p>}</div>)}
          <button className="btn btn-ghost btn-sm" onClick={() => setAns(!ans)}>{ans ? "Hide answers" : "Show answers"}</button>
        </div>
      </aside>
    </div>
  );
}

export function LabCard({ lab, compact }) {
  const s = getSim(lab.sim);
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState(0);
  if (!s) return null;
  const S = s.C;
  return (
    <article className="lab">
      <header>
        <span className="lab-emoji">{s.emoji}</span>
        <div><h3>{lab.t}</h3><small>uses {s.name}</small></div>
        <button className="btn btn-gc btn-sm" onClick={() => setOpen(!open)}>{open ? "Close lab" : "Open lab"}</button>
      </header>
      <div className="poe">
        <div className={`poe-step ${stage >= 0 ? "on" : ""}`}><b>1 · Predict</b><p>{lab.predict}</p></div>
        <div className={`poe-step ${stage >= 1 ? "on" : ""}`}><b>2 · Observe</b>{stage >= 1 ? <><ul>{lab.steps.map((x) => <li key={x}>{x}</li>)}</ul><p className="obs">👀 {lab.observe}</p></> : <p className="muted">Run the simulation…</p>}</div>
        <div className={`poe-step ${stage >= 2 ? "on" : ""}`}><b>3 · Explain</b>{stage >= 2 ? <p>💡 {lab.explain}</p> : <p className="muted">Discuss first, then reveal.</p>}</div>
      </div>
      <div className="poe-btns">
        {stage < 2 && <button className="btn btn-ghost btn-sm" onClick={() => { setStage(stage + 1); setOpen(true); }}>Next: {stage === 0 ? "Observe" : "Explain"} <ChevronRight size={14} /></button>}
        {stage > 0 && <button className="btn btn-ghost btn-sm" onClick={() => setStage(0)}>Restart</button>}
        <Link className="btn btn-ghost btn-sm" to={`/app/sims/${s.id}`}>Full screen</Link>
      </div>
      {open && <div className="lab-sim"><S compact={compact} /></div>}
    </article>
  );
}

export function UnitPage() {
  const { grade, period } = useParams();
  const u = getUnit(grade, period);
  const g = gradeMeta(grade);
  const { myQuestions, token } = useAuth();
  const [tab, setTab] = useState("overview");
  const [taught, setTaught] = useState(false);
  const [notes, setNotes] = useState(""), [res, setRes] = useState("Deck"), [saved, setSaved] = useState("");
  const questions = useMemo(() => {
    const mine = myQuestions.map(fromSheet).filter((q) => q.grade === Number(grade) && q.period === Number(period));
    return [...buildBank().filter((q) => q.grade === Number(grade) && q.period === Number(period)), ...mine];
  }, [grade, period, myQuestions]);
  if (!u) return <div className="page"><p>Unit not found.</p></div>;

  const save = async () => {
    setSaved("saving");
    const r = await apiPost({ action: "log_save", token, entry: { Grado: u.g, Periodo: u.p, Tema: u.title, Recurso: res, Notas: notes } }).catch(() => ({ status: "error" }));
    setSaved(r.status === "success" ? "ok" : "err");
    if (r.status === "success") setTimeout(() => { setTaught(false); setSaved(""); setNotes(""); }, 900);
  };

  return (
    <div className="page unit" style={{ "--gc": g.color, "--gi": g.ink }}>
      <Link to={`/app/grade/${g.g}`} className="crumb"><ArrowLeft size={15} /> {g.g}° {g.name}</Link>
      <section className="unit-hero">
        <div className="unit-hero-l">
          <span className="kicker">Grade {g.g} · Term {u.p} · {g.cefr}</span>
          <h1><span>{u.emoji}</span> {u.title}</h1>
          <p className="unit-sdg"><Globe size={15} /> {u.sdg}</p>
          <blockquote>“{u.challenge}”</blockquote>
        </div>
        <div className="unit-hero-r">
          <Link className="btn btn-ink btn-lg" to={`/present/${g.g}/${u.p}`}><Presentation size={18} /> Present the deck</Link>
          <Link className="btn btn-ghost" to={`/app/games/millionaire?grade=${g.g}&term=${u.p}`}><Trophy size={16} /> Millionaire for this term</Link>
          <button className="btn btn-ghost" onClick={() => setTaught(true)}><CircleCheck size={16} /> Mark as taught</button>
        </div>
      </section>

      <nav className="tabs">
        {TABS.map(([k, l, I]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}><I size={16} /> {l}{k === "questions" && <em>{questions.length}</em>}</button>)}
      </nav>

      {tab === "overview" && (
        <div className="ov">
          <article className="ov-big"><h3>💡 Big idea</h3><p>{u.bigIdea}</p></article>
          <article className="ov-flow">
            <h3>⏱️ Suggested 45-minute class</h3>
            <ol>{classFlow(u).map((s) => { const I = ICONS[s.icon]; return <li key={s.t}><span className="fl-min">{s.min}'</span><I size={18} /><div><b>{s.t}</b><p>{s.d}</p></div></li>; })}</ol>
          </article>
          <article className="ov-topics"><h3>📚 Topics of the term</h3><div className="term-topics">{u.topics.map((t) => <span key={t}>{t}</span>)}</div></article>
          <article className="ov-ideas"><h3>🧠 Key ideas</h3>
            <div className="idea-grid">{u.ideas.map((i) => <div key={i.t} className="idea"><h4>{i.t}</h4><p>{i.b}</p><ul>{i.pts.map((p) => <li key={p}>{p}</li>)}</ul></div>)}</div>
          </article>
        </div>
      )}
      {tab === "formulas" && <div className="formula-grid">{u.formulas.map((f) => <FormulaCard key={f.n} f={f} />)}</div>}
      {tab === "labs" && <div className="labs">{u.labs.map((l) => <LabCard key={l.t} lab={l} />)}</div>}
      {tab === "examples" && <div className="examples">{u.examples.map((e, i) => <Example key={i} ex={e} n={i + 1} />)}</div>}
      {tab === "reading" && <Reading r={u.reading} cefr={g.cefr} />}
      {tab === "questions" && (
        <>
          <div className="q-toolbar"><span>{questions.length} questions for this term · ICFES style</span><Link className="btn btn-ghost btn-sm" to={`/app/bank?grade=${g.g}&term=${u.p}&projector=1`}>Projector mode</Link></div>
          <div className="q-list">{questions.map((q, i) => <QuestionItem key={q.id} q={q} i={i + 1} />)}</div>
        </>
      )}
      {tab === "tips" && <div className="tips">{u.tips.map((t, i) => <article key={i} className="tip"><span>{["🎯", "🧪", "🗣️", "⚡"][i % 4]}</span><p>{t}</p></article>)}</div>}

      <Modal open={taught} onClose={() => setTaught(false)} title={`Mark “${u.title}” as taught`}>
        <div className="form">
          <label><span>What did you use?</span>
            <select value={res} onChange={(e) => setRes(e.target.value)}>{["Deck", "Simulation", "Millionaire", "Board Battle", "Reading", "Worked examples", "Mixed"].map((x) => <option key={x}>{x}</option>)}</select>
          </label>
          <label><span>Notes for next time (optional)</span><textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. 8B loved the cannon. Next class: start with vectors." /></label>
          <button className="btn btn-tang" onClick={save} disabled={saved === "saving"}>{saved === "saving" ? "Saving…" : saved === "ok" ? "Saved ✅" : "Save to my diary"}</button>
          {saved === "err" && <div className="alert">Could not save. Check the Apps Script URL.</div>}
        </div>
      </Modal>
    </div>
  );
}
