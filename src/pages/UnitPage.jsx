import { T } from "../i18n";
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
const ICONS = {
  Sparkles,
  Presentation,
  FlaskConical,
  PenLine,
  Trophy
};
const TABS = [["overview", T("Overview"), Target], ["formulas", T("Formulas"), Sigma], ["labs", T("Virtual labs"), FlaskConical], ["examples", T("Worked examples"), PenLine], ["reading", T("Reading"), BookOpen], ["questions", T("Questions"), ClipboardList], ["tips", T("Teacher tips"), Lightbulb]];
export function Example({
  ex,
  n
}) {
  const [k, setK] = useState(0);
  const done = k > ex.steps.length;
  return <article className="example">
      <span className="ex-n">#{n}</span>
      <h4>{ex.q}</h4>
      <ol>{ex.steps.slice(0, k).map((s, i) => <li key={i}>{s}</li>)}</ol>
      {done && <div className="ex-ans">✅ {ex.a}</div>}
      <div className="ex-btns">
        {!done && <button className="btn btn-gc btn-sm" onClick={() => setK(k + 1)}>{k < ex.steps.length ? T("Show step {0}", k + 1) : T("Show answer")} <ChevronRight size={14} /></button>}
        {k > 0 && <button className="btn btn-ghost btn-sm" onClick={() => setK(0)}>{T("Hide")}</button>}
      </div>
    </article>;
}
export function FormulaCard({
  f
}) {
  return <article className="formula-card">
      <h4>{f.n}</h4>
      <div className="formula-big"><Tex tex={f.tex} block /></div>
      <table><tbody>{f.vars.map(([s, m, u]) => <tr key={s + m}><td><Tex tex={s} /></td><td>{m}</td><td className="unit">{u}</td></tr>)}</tbody></table>
      <p className="trick"><Lightbulb size={15} /> {f.tip}</p>
    </article>;
}
export function QuestionItem({
  q,
  i
}) {
  const [show, setShow] = useState(false);
  return <article className={T("q-item {0}", show ? "shown" : "")}>
      <div className="q-head"><span className="q-num">{i}</span><span className={T("q-lv lv{0}", q.level)}>{["", T("Easy"), T("Medium"), T("Hard")][q.level]}</span>{q.mine && <span className="q-mine">{T("Mine")}</span>}<span className="q-kind">{q.kind === "calc" ? "🧮" : q.kind === "mine" ? "✍️" : "💡"}</span></div>
      <p>{q.q}</p>
      <ol type="A">{q.opts.map((o, k) => <li key={k} className={show && k === q.ans ? "ok" : ""}>{o}</li>)}</ol>
      {show && q.ex && <p className="q-ex">💬 {q.ex}</p>}
      <button className="btn btn-ghost btn-sm" onClick={() => setShow(!show)}>{show ? <><EyeOff size={14} /> {T("Hide")}</> : <><Eye size={14} /> {T("Answer")}</>}</button>
    </article>;
}
function Reading({
  r,
  cefr
}) {
  const [ans, setAns] = useState(false);
  const words = r.gloss.map(g => g[0]);
  const mark = p => {
    const re = new RegExp(`\\b((?:${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?:s|es|ed|ing)?)\\b`, "gi");
    return p.split(re).map((part, i) => {
      const g = i % 2 ? r.gloss.find(x => part.toLowerCase().startsWith(x[0].toLowerCase())) : null;
      return g ? <mark key={i} title={g[1]}>{part}</mark> : part;
    });
  };
  return <div className="reading">
      <article className="reading-paper">
        <span className="kicker">{T("Reading ·")} {cefr}</span>
        <h2>{r.t}</h2>
        {r.text.map((p, i) => <p key={i}>{mark(p)}</p>)}
      </article>
      <aside>
        <div className="gloss"><h4>{T("📖 Glossary")}</h4>{r.gloss.map(([w, d]) => <p key={w}><b>{w}</b> — {d}</p>)}</div>
        <div className="gloss"><h4>{T("❓ Comprehension")}</h4>{r.qs.map(([q, a], i) => <div key={i} className="rq"><p>{i + 1}. {q}</p>{ans && <p className="rq-a">→ {a}</p>}</div>)}
          <button className="btn btn-ghost btn-sm" onClick={() => setAns(!ans)}>{ans ? T("Hide answers") : T("Show answers")}</button>
        </div>
      </aside>
    </div>;
}
export function LabCard({
  lab,
  compact
}) {
  const s = getSim(lab.sim);
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState(0);
  if (!s) return null;
  const S = s.C;
  return <article className="lab">
      <header>
        <span className="lab-emoji">{s.emoji}</span>
        <div><h3>{lab.t}</h3><small>{T("uses")} {s.name}</small></div>
        <button className="btn btn-gc btn-sm" onClick={() => setOpen(!open)}>{open ? T("Close lab") : T("Open lab")}</button>
      </header>
      <div className="poe">
        <div className={T("poe-step {0}", stage >= 0 ? "on" : "")}><b>{T("1 · Predict")}</b><p>{lab.predict}</p></div>
        <div className={T("poe-step {0}", stage >= 1 ? "on" : "")}><b>{T("2 · Observe")}</b>{stage >= 1 ? <><ul>{lab.steps.map(x => <li key={x}>{x}</li>)}</ul><p className="obs">👀 {lab.observe}</p></> : <p className="muted">{T("Run the simulation…")}</p>}</div>
        <div className={T("poe-step {0}", stage >= 2 ? "on" : "")}><b>{T("3 · Explain")}</b>{stage >= 2 ? <p>💡 {lab.explain}</p> : <p className="muted">{T("Discuss first, then reveal.")}</p>}</div>
      </div>
      <div className="poe-btns">
        {stage < 2 && <button className="btn btn-ghost btn-sm" onClick={() => {
        setStage(stage + 1);
        setOpen(true);
      }}>{T("Next:")} {stage === 0 ? T("Observe") : T("Explain")} <ChevronRight size={14} /></button>}
        {stage > 0 && <button className="btn btn-ghost btn-sm" onClick={() => setStage(0)}>{T("Restart")}</button>}
        <Link className="btn btn-ghost btn-sm" to={T("/app/sims/{0}", s.id)}>{T("Full screen")}</Link>
      </div>
      {open && <div className="lab-sim"><S compact={compact} /></div>}
    </article>;
}
export function UnitPage() {
  const {
    grade,
    period
  } = useParams();
  const u = getUnit(grade, period);
  const g = gradeMeta(grade);
  const {
    myQuestions,
    token
  } = useAuth();
  const [tab, setTab] = useState("overview");
  const [taught, setTaught] = useState(false);
  const [notes, setNotes] = useState(""),
    [res, setRes] = useState("Deck"),
    [saved, setSaved] = useState("");
  const questions = useMemo(() => {
    const mine = myQuestions.map(fromSheet).filter(q => q.grade === Number(grade) && q.period === Number(period));
    return [...buildBank().filter(q => q.grade === Number(grade) && q.period === Number(period)), ...mine];
  }, [grade, period, myQuestions]);
  if (!u) return <div className="page"><p>{T("Unit not found.")}</p></div>;
  const save = async () => {
    setSaved("saving");
    const r = await apiPost({
      action: "log_save",
      token,
      entry: {
        Grado: u.g,
        Periodo: u.p,
        Tema: u.title,
        Recurso: res,
        Notas: notes
      }
    }).catch(() => ({
      status: "error"
    }));
    setSaved(r.status === "success" ? "ok" : "err");
    if (r.status === "success") setTimeout(() => {
      setTaught(false);
      setSaved("");
      setNotes("");
    }, 900);
  };
  return <div className="page unit" style={{
    "--gc": g.color,
    "--gi": g.ink
  }}>
      <Link to={T("/app/grade/{0}", g.g)} className="crumb"><ArrowLeft size={15} /> {g.g}° {g.name}</Link>
      <section className="unit-hero">
        <div className="unit-hero-l">
          <span className="kicker">{T("Grade")} {g.g} {T("· Term")} {u.p} · {g.cefr}</span>
          <h1><span>{u.emoji}</span> {u.title}</h1>
          <p className="unit-sdg"><Globe size={15} /> {u.sdg}</p>
          <blockquote>“{u.challenge}”</blockquote>
        </div>
        <div className="unit-hero-r">
          <Link className="btn btn-ink btn-lg" to={T("/present/{0}/{1}", g.g, u.p)}><Presentation size={18} /> {T("Present the deck")}</Link>
          <Link className="btn btn-ghost" to={T("/app/games/millionaire?grade={0}&term={1}", g.g, u.p)}><Trophy size={16} /> {T("Millionaire for this term")}</Link>
          <button className="btn btn-ghost" onClick={() => setTaught(true)}><CircleCheck size={16} /> {T("Mark as taught")}</button>
        </div>
      </section>

      <nav className="tabs">
        {TABS.map(([k, l, I]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}><I size={16} /> {l}{k === "questions" && <em>{questions.length}</em>}</button>)}
      </nav>

      {tab === "overview" && <div className="ov">
          <article className="ov-big"><h3>{T("💡 Big idea")}</h3><p>{u.bigIdea}</p></article>
          <article className="ov-flow">
            <h3>{T("⏱️ Suggested 45-minute class")}</h3>
            <ol>{classFlow(u).map(s => {
            const I = ICONS[s.icon];
            return <li key={s.t}><span className="fl-min">{s.min}'</span><I size={18} /><div><b>{s.t}</b><p>{s.d}</p></div></li>;
          })}</ol>
          </article>
          <article className="ov-topics"><h3>{T("📚 Topics of the term")}</h3><div className="term-topics">{u.topics.map(t => <span key={t}>{t}</span>)}</div></article>
          <article className="ov-ideas"><h3>{T("🧠 Key ideas")}</h3>
            <div className="idea-grid">{u.ideas.map(i => <div key={i.t} className="idea"><h4>{i.t}</h4><p>{i.b}</p><ul>{i.pts.map(p => <li key={p}>{p}</li>)}</ul></div>)}</div>
          </article>
        </div>}
      {tab === "formulas" && <div className="formula-grid">{u.formulas.map(f => <FormulaCard key={f.n} f={f} />)}</div>}
      {tab === "labs" && <div className="labs">{u.labs.map(l => <LabCard key={l.t} lab={l} />)}</div>}
      {tab === "examples" && <div className="examples">{u.examples.map((e, i) => <Example key={i} ex={e} n={i + 1} />)}</div>}
      {tab === "reading" && <Reading r={u.reading} cefr={g.cefr} />}
      {tab === "questions" && <>
          <div className="q-toolbar"><span>{questions.length} {T("questions for this term · ICFES style")}</span><Link className="btn btn-ghost btn-sm" to={T("/app/bank?grade={0}&term={1}&projector=1", g.g, u.p)}>{T("Projector mode")}</Link></div>
          <div className="q-list">{questions.map((q, i) => <QuestionItem key={q.id} q={q} i={i + 1} />)}</div>
        </>}
      {tab === "tips" && <div className="tips">{u.tips.map((t, i) => <article key={i} className="tip"><span>{["🎯", "🧪", "🗣️", "⚡"][i % 4]}</span><p>{t}</p></article>)}</div>}

      <Modal open={taught} onClose={() => setTaught(false)} title={T("Mark “{0}” as taught", u.title)}>
        <div className="form">
          <label><span>{T("What did you use?")}</span>
            <select value={res} onChange={e => setRes(e.target.value)}>{[T("Deck"), T("Simulation"), T("Millionaire"), T("Board Battle"), T("Reading"), T("Worked examples"), T("Mixed")].map(x => <option key={x}>{x}</option>)}</select>
          </label>
          <label><span>{T("Notes for next time (optional)")}</span><textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder={T("e.g. 8B loved the cannon. Next class: start with vectors.")} /></label>
          <button className="btn btn-tang" onClick={save} disabled={saved === "saving"}>{saved === "saving" ? T("Saving…") : saved === "ok" ? T("Saved ✅") : T("Save to my diary")}</button>
          {saved === "err" && <div className="alert">{T("Could not save. Check the Apps Script URL.")}</div>}
        </div>
      </Modal>
    </div>;
}