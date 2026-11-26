import { T } from "../i18n";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MonitorPlay, Printer, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";
import { useAuth } from "../auth";
import { buildBank, fromSheet } from "../data/bank";
import { GRADES, gradeMeta } from "../data/grades";
import { unitsOf } from "../data/curriculum";
import { PageHead } from "../components/ui";
import { QuestionItem } from "./UnitPage";
function Projector({
  list,
  onClose
}) {
  const [i, setI] = useState(0),
    [show, setShow] = useState(false);
  const q = list[i];
  useEffect(() => {
    const k = e => {
      if (e.key === "ArrowRight") {
        setI(x => Math.min(list.length - 1, x + 1));
        setShow(false);
      }
      if (e.key === "ArrowLeft") {
        setI(x => Math.max(0, x - 1));
        setShow(false);
      }
      if (e.key === " ") {
        e.preventDefault();
        setShow(s => !s);
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [list.length, onClose]);
  if (!q) return null;
  return <div className="projector" style={{
    "--gc": gradeMeta(q.grade).color
  }}>
      <button className="proj-x" onClick={onClose}><X /></button>
      <span className="proj-meta">{q.grade}{T("° · Term")} {q.period} · {q.topic} · {i + 1}/{list.length}</span>
      <h2>{q.q}</h2>
      <div className="proj-opts">{q.opts.map((o, k) => <div key={k} className={show ? k === q.ans ? "ok" : "no" : ""}><span>{"ABCD"[k]}</span>{o}</div>)}</div>
      {show && q.ex && <p className="proj-ex">💬 {q.ex}</p>}
      <div className="proj-nav">
        <button onClick={() => {
        setI(Math.max(0, i - 1));
        setShow(false);
      }}><ChevronLeft /></button>
        <button className="proj-reveal" onClick={() => setShow(!show)}><Eye size={18} /> {show ? T("Hide") : T("Reveal")} {T("(space)")}</button>
        <button onClick={() => {
        setI(Math.min(list.length - 1, i + 1));
        setShow(false);
      }}><ChevronRight /></button>
      </div>
    </div>;
}
export function BankPage() {
  const [sp] = useSearchParams();
  const {
    myQuestions
  } = useAuth();
  const [grade, setGrade] = useState(Number(sp.get("grade")) || 6);
  const [term, setTerm] = useState(Number(sp.get("term")) || 0);
  const [lv, setLv] = useState(0),
    [kind, setKind] = useState("all"),
    [qq, setQq] = useState("");
  const [proj, setProj] = useState(sp.get("projector") === "1");
  const all = useMemo(() => [...buildBank(), ...myQuestions.map(fromSheet)], [myQuestions]);
  const list = all.filter(q => q.grade === grade && (!term || q.period === term) && (!lv || q.level === lv) && (kind === "all" || q.kind === kind) && (!qq || q.q.toLowerCase().includes(qq.toLowerCase())));
  const g = gradeMeta(grade);
  return <div className="page bank" style={{
    "--gc": g.color
  }}>
      <PageHead kicker={T("ICFES-style bank")} title={T("Question bank")} sub={T("100 questions per grade (5 concept + 20 calculation per term) plus everything you upload in “My questions”.")}>
        <button className="btn btn-ink" onClick={() => setProj(true)} disabled={!list.length}><MonitorPlay size={16} /> {T("Projector")}</button>
        <button className="btn btn-ghost" onClick={() => window.print()}><Printer size={16} /> {T("Print")}</button>
      </PageHead>
      <div className="filters">
        <div className="chips">{GRADES.map(x => <button key={x.g} className={grade === x.g ? "on" : ""} style={{
          "--fc": x.color
        }} onClick={() => {
          setGrade(x.g);
          setTerm(0);
        }}>{x.g}°</button>)}</div>
        <div className="chips"><button className={!term ? "on" : ""} onClick={() => setTerm(0)}>{T("All terms")}</button>{unitsOf(grade).map(u => <button key={u.p} className={term === u.p ? "on" : ""} onClick={() => setTerm(u.p)}>T{u.p} {u.emoji}</button>)}</div>
        <div className="chips">
          {[[0, T("Any level")], [1, T("Easy")], [2, T("Medium")], [3, T("Hard")]].map(([v, l]) => <button key={v} className={lv === v ? "on" : ""} onClick={() => setLv(v)}>{l}</button>)}
          {[["all", T("All types")], ["concept", T("💡 Concept")], ["calc", T("🧮 Calculation")], ["mine", T("✍️ Mine")]].map(([v, l]) => <button key={v} className={kind === v ? "on" : ""} onClick={() => setKind(v)}>{l}</button>)}
        </div>
        <label className="search"><Search size={16} /><input value={qq} onChange={e => setQq(e.target.value)} placeholder={T("Search a word…")} /></label>
      </div>
      <p className="muted">{list.length} {T("questions")}</p>
      <div className="q-list print-list">{list.map((q, i) => <QuestionItem key={q.id} q={q} i={i + 1} />)}</div>
      {proj && <Projector list={list} onClose={() => setProj(false)} />}
    </div>;
}