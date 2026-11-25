import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Maximize, Minimize, X, Timer, Lightbulb } from "lucide-react";
import { getUnit, unitsOf } from "../data/curriculum";
import { gradeMeta } from "../data/grades";
import { getSim } from "../sims";
import { Tex } from "../sims/kit";
import { Logo } from "../components/ui";

/* Build the deck from the unit data. Each slide can have "builds" (click to reveal). */
function buildDeck(u) {
  const S = [];
  S.push({ k: "cover" });
  S.push({ k: "challenge" });
  S.push({ k: "agenda", builds: Math.min(6, u.topics.length) });
  u.ideas.forEach((i) => S.push({ k: "idea", i, builds: i.pts.length }));
  u.formulas.forEach((f) => S.push({ k: "formula", f, builds: 1 }));
  u.labs.forEach((l) => S.push({ k: "lab", l, builds: 2 }));
  u.examples.forEach((e, n) => S.push({ k: "example", e, n, builds: e.steps.length + 1 }));
  S.push({ k: "reading" });
  u.quiz.slice(0, 3).forEach((q, n) => S.push({ k: "check", q, n, builds: 1 }));
  S.push({ k: "exit" });
  return S;
}

function Slide({ s, u, g, b }) {
  switch (s.k) {
    case "cover": return (
      <div className="sl sl-cover">
        <span className="sl-emoji">{u.emoji}</span>
        <span className="sl-kicker">Grade {g.g} · Term {u.p} · {g.name}</span>
        <h1>{u.title}</h1>
        <p className="sl-sdg">{u.sdg}</p>
      </div>);
    case "challenge": return (
      <div className="sl sl-challenge">
        <span className="sl-kicker">🌍 Our challenge</span>
        <h2>“{u.challenge}”</h2>
        <div className="sl-bigidea"><b>💡 Big idea</b><p>{u.bigIdea}</p></div>
      </div>);
    case "agenda": return (
      <div className="sl sl-agenda">
        <span className="sl-kicker">Today we will explore…</span>
        <div className="sl-agenda-grid">{u.topics.slice(0, 6).map((t, i) => <div key={t} className={`sl-ag ${i < b ? "in" : ""}`}><span>{i + 1}</span>{t}</div>)}</div>
      </div>);
    case "idea": return (
      <div className="sl sl-idea">
        <span className="sl-kicker">Key idea</span>
        <h2>{s.i.t}</h2>
        <p className="sl-lead">{s.i.b}</p>
        <ul>{s.i.pts.map((p, i) => <li key={p} className={i < b ? "in" : ""}>{p}</li>)}</ul>
      </div>);
    case "formula": return (
      <div className="sl sl-formula">
        <span className="sl-kicker">Formula · {s.f.n}</span>
        <div className="sl-tex" style={{ fontSize: s.f.tex.length > 110 ? "1.25em" : s.f.tex.length > 70 ? "1.55em" : s.f.tex.length > 45 ? "1.95em" : "2.4em" }}><Tex tex={s.f.tex} block /></div>
        <div className="sl-vars">{s.f.vars.map(([sym, m, un]) => <div key={sym + m}><Tex tex={sym} /><span>{m}</span><em>{un}</em></div>)}</div>
        <div className={`sl-trick ${b >= 1 ? "in" : ""}`}><Lightbulb /> {s.f.tip}</div>
      </div>);
    case "lab": {
      const sim = getSim(s.l.sim); const C = sim?.C;
      return (
        <div className="sl sl-lab">
          <div className="sl-lab-l">
            <span className="sl-kicker">{sim?.emoji} Virtual lab</span>
            <h2>{s.l.t}</h2>
            <div className="poe-sl"><b>🤔 Predict</b><p>{s.l.predict}</p></div>
            {b >= 1 && <div className="poe-sl in"><b>👀 Observe</b><p>{s.l.observe}</p></div>}
            {b >= 2 && <div className="poe-sl in"><b>💡 Explain</b><p>{s.l.explain}</p></div>}
          </div>
          <div className="sl-lab-r">{C && <C compact />}</div>
        </div>);
    }
    case "example": return (
      <div className="sl sl-example">
        <span className="sl-kicker">Worked example {s.n + 1}</span>
        <h2>{s.e.q}</h2>
        <ol>{s.e.steps.map((st, i) => <li key={i} className={i < b ? "in" : ""}>{st}</li>)}</ol>
        <div className={`sl-answer ${b > s.e.steps.length ? "in" : ""}`}>✅ {s.e.a}</div>
      </div>);
    case "reading": return (
      <div className="sl sl-reading">
        <span className="sl-kicker">📖 Let's read · {g.cefr}</span>
        <h2>{u.reading.t}</h2>
        <div className="sl-read-cols"><div>{u.reading.text.slice(0, 2).map((p, i) => <p key={i}>{p}</p>)}</div><aside>{u.reading.gloss.map(([w, d]) => <p key={w}><b>{w}</b> {d}</p>)}</aside></div>
      </div>);
    case "check": return (
      <div className="sl sl-check">
        <span className="sl-kicker">Quick check {s.n + 1}/3 · show me with your fingers ✋</span>
        <h2>{s.q[0]}</h2>
        <div className="sl-opts">{s.q[1].map((o, i) => <div key={i} className={b >= 1 ? (i === s.q[2] ? "ok" : "no") : ""}><span>{"ABCD"[i]}</span>{o}</div>)}</div>
        {b >= 1 && <p className="sl-why">💬 {s.q[3]}</p>}
      </div>);
    case "exit": return (
      <div className="sl sl-exit">
        <span className="sl-kicker">🎟️ Exit ticket</span>
        <h2>Before you leave…</h2>
        <div className="sl-321"><div><b>3</b>things I learned today</div><div><b>2</b>formulas I can use</div><div><b>1</b>question I still have</div></div>
      </div>);
    default: return null;
  }
}

export function Presentation() {
  const { grade, period } = useParams();
  const nav = useNavigate();
  const u = getUnit(grade, period);
  const g = gradeMeta(grade);
  const deck = useMemo(() => (u ? buildDeck(u) : []), [u]);
  const [i, setI] = useState(0), [b, setB] = useState(0), [fs, setFs] = useState(false), [sec, setSec] = useState(0);
  const box = useRef(null), [scale, setScale] = useState(16);

  useEffect(() => { const t = setInterval(() => setSec((s) => s + 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => {
    const fit = () => { const w = Math.min(window.innerWidth, (window.innerHeight - 64) * 16 / 9); setScale(w / 50); };
    fit(); window.addEventListener("resize", fit); return () => window.removeEventListener("resize", fit);
  }, []);
  const next = useCallback(() => {
    const s = deck[i];
    if (s?.builds && b < s.builds) setB(b + 1);
    else if (i < deck.length - 1) { setI(i + 1); setB(0); }
  }, [deck, i, b]);
  const prev = useCallback(() => { if (b > 0) setB(b - 1); else if (i > 0) { setI(i - 1); setB(0); } }, [i, b]);
  const toggleFs = () => { if (!document.fullscreenElement) box.current?.requestFullscreen?.(); else document.exitFullscreen?.(); };
  useEffect(() => { const f = () => setFs(!!document.fullscreenElement); document.addEventListener("fullscreenchange", f); return () => document.removeEventListener("fullscreenchange", f); }, []);
  useEffect(() => {
    const k = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName) || e.target.type === "range") return;
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); next(); }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); prev(); }
      if (e.key === "f" || e.key === "F") toggleFs();
      if (e.key === "Escape" && !document.fullscreenElement) nav(`/app/grade/${grade}/p/${period}`);
    };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [next, prev, nav, grade, period]);

  if (!u) return null;
  const s = deck[i];
  const others = unitsOf(grade).filter((x) => x.p !== u.p);
  return (
    <div className="present" ref={box} style={{ "--gc": g.color, "--gi": g.ink }}>
      <div className="present-bar">
        <button onClick={() => nav(`/app/grade/${grade}/p/${period}`)} title="Exit (Esc)"><X size={18} /></button>
        <Logo size={26} />
        <b>{u.title}</b>
        <div className="present-dots">{deck.map((_, k) => <button key={k} className={k === i ? "on" : k < i ? "done" : ""} onClick={() => { setI(k); setB(0); }} />)}</div>
        <span className="present-timer"><Timer size={15} /> {String(Math.floor(sec / 60)).padStart(2, "0")}:{String(sec % 60).padStart(2, "0")}</span>
        <select value={u.p} onChange={(e) => { nav(`/present/${grade}/${e.target.value}`); setI(0); setB(0); }}>
          <option value={u.p}>Term {u.p}</option>{others.map((x) => <option key={x.p} value={x.p}>Term {x.p} · {x.title}</option>)}
        </select>
        <button onClick={toggleFs} title="Fullscreen (F)">{fs ? <Minimize size={18} /> : <Maximize size={18} />}</button>
      </div>
      <div className="present-stage" onClick={(e) => { if (e.target.closest(".sim-frame, .units-sim, button, input, select")) return; next(); }}>
        <div className="slide" key={i} style={{ fontSize: scale + "px" }}>
          {s.k !== "lab" && <span className="slide-wm">{u.emoji}</span>}
          <Slide s={s} u={u} g={g} b={b} />
          <span className="slide-num">{i + 1} / {deck.length}</span>
          {s.builds > 0 && b < s.builds && <span className="slide-more">click / → to reveal</span>}
        </div>
      </div>
      <button className="present-nav l" onClick={prev}><ChevronLeft /></button>
      <button className="present-nav r" onClick={next}><ChevronRight /></button>
    </div>
  );
}
