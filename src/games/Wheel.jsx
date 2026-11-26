import { T } from "../i18n";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import { useAuth } from "../auth";
import { getPool } from "./pool";
import { GRADES } from "../data/grades";
import { unitsOf } from "../data/curriculum";
import { beep } from "../components/ui";
import { QuestionItem } from "../pages/UnitPage";
const COLS = [T("#ff5a36"), T("#ffc12e"), "#10a58c", T("#3557ff"), T("#9b7bff"), T("#ff6fae"), "#17183b", "#f08a24"];
function WheelSVG({
  labels,
  rot,
  spinning
}) {
  const n = labels.length,
    seg = 360 / n,
    R = 200;
  const pt = a => [R + R * Math.sin(a * Math.PI / 180), R - R * Math.cos(a * Math.PI / 180)];
  return <div className="wheel-wrap">
      <div className="wheel-pointer" />
      <svg viewBox="0 0 400 400" className="wheel" style={{
      transform: `rotate(${rot}deg)`,
      transition: spinning ? "transform 4.6s cubic-bezier(.12,.72,.08,1)" : "none"
    }}>
        {labels.map((l, i) => {
        const [x1, y1] = pt(i * seg),
          [x2, y2] = pt((i + 1) * seg),
          mid = (i + 0.5) * seg;
        const [tx, ty] = [R + R * 0.62 * Math.sin(mid * Math.PI / 180), R - R * 0.62 * Math.cos(mid * Math.PI / 180)];
        return <g key={i}>
              <path d={`M${R},${R} L${x1},${y1} A${R},${R} 0 ${seg > 180 ? 1 : 0} 1 ${x2},${y2} Z`} fill={COLS[i % COLS.length]} stroke="#f4efe4" strokeWidth="3" />
              <text x={tx} y={ty} transform={T("rotate({0} {1} {2})", mid, tx, ty)} textAnchor="middle" dominantBaseline="middle" fill={i % COLS.length === 1 ? "#17183b" : "#fff"} fontSize={n > 16 ? 13 : 17} fontWeight="800" fontFamily="Bricolage Grotesque">{l}</text>
            </g>;
      })}
        <circle cx={R} cy={R} r="30" fill="#17183b" stroke="#f4efe4" strokeWidth="4" />
      </svg>
    </div>;
}
export function Wheel() {
  const [sp] = useSearchParams();
  const {
    myQuestions
  } = useAuth();
  const [mode, setMode] = useState("q");
  const [grade, setGrade] = useState(Number(sp.get("grade")) || 7);
  const [n, setN] = useState(25),
    [removed, setRemoved] = useState([]),
    [removeMode, setRemoveMode] = useState(true);
  const [rot, setRot] = useState(0),
    [spinning, setSpinning] = useState(false),
    [result, setResult] = useState(null),
    [q, setQ] = useState(null);
  const units = unitsOf(grade);
  const qLabels = [...units.map(u => `T${u.p} ${u.emoji}`), T("Bonus ×2"), T("Concept 💡"), T("Calc 🧮"), T("Mystery ❓")];
  const students = Array.from({
    length: n
  }, (_, i) => i + 1).filter(x => !removed.includes(x));
  const labels = mode === "q" ? qLabels : students.map(String);
  const pool = useMemo(() => getPool({
    grade,
    mine: myQuestions
  }), [grade, myQuestions]);
  const spin = () => {
    if (spinning || labels.length < 2) return;
    const i = Math.floor(Math.random() * labels.length),
      seg = 360 / labels.length;
    const base = rot - rot % 360 + 360 * 6;
    const target = base + (360 - (i + 0.5) * seg) + (Math.random() - 0.5) * seg * 0.6;
    setResult(null);
    setQ(null);
    setSpinning(true);
    setRot(target);
    let k = 0;
    const tick = setInterval(() => {
      beep("tick");
      if (++k > 14) clearInterval(tick);
    }, 260);
    setTimeout(() => {
      setSpinning(false);
      beep("ok");
      const lab = labels[i];
      setResult(lab);
      if (mode === "q") {
        let list = pool;
        const extra = i - units.length; // 0 bonus · 1 concept · 2 calc · 3 mystery
        if (extra < 0) list = pool.filter(x => x.period === units[i].p);
        if (extra === 1) list = pool.filter(x => x.kind !== "calc");
        if (extra === 2) list = pool.filter(x => x.kind === "calc");
        if (extra === 0) list = pool.filter(x => x.level >= 2);
        setQ(list[Math.floor(Math.random() * list.length)]);
      } else if (removeMode) setTimeout(() => setRemoved(r => [...r, Number(lab)]), 2500);
    }, 4700);
  };
  return <div className="page wheel-page">
      <Link to="/app/games" className="crumb"><ArrowLeft size={15} /> {T("Games")}</Link>
      <h1 className="game-title">{T("🎡 Spin the Wheel")}</h1>
      <div className="wheel-layout">
        <div className="wheel-col">
          <WheelSVG labels={labels} rot={rot} spinning={spinning} />
          <button className="btn btn-tang btn-lg spin-btn" onClick={spin} disabled={spinning}>{spinning ? T("Spinning…") : T("SPIN! 🎡")}</button>
        </div>
        <div className="wheel-side">
          <div className="chips"><button className={mode === "q" ? "on" : ""} onClick={() => {
            setMode("q");
            setResult(null);
          }}>{T("❓ Question wheel")}</button><button className={mode === "s" ? "on" : ""} onClick={() => {
            setMode("s");
            setResult(null);
            setQ(null);
          }}>{T("🙋 Student picker")}</button></div>
          {mode === "q" ? <div className="chips">{GRADES.map(g => <button key={g.g} className={grade === g.g ? "on" : ""} style={{
            "--fc": g.color
          }} onClick={() => setGrade(g.g)}>{g.g}°</button>)}</div> : <div className="setup">
              <label className="sim-slider"><span className="sim-slider-top"><span>{T("Students in class")}</span><b>{n}</b></span><input type="range" min={4} max={40} value={n} onChange={e => {
              setN(Number(e.target.value));
              setRemoved([]);
            }} style={{
              "--pct": (n - 4) / 36 * 100 + "%",
              "--c": "var(--tang)"
            }} /></label>
              <label className="sim-check"><input type="checkbox" checked={removeMode} onChange={e => setRemoveMode(e.target.checked)} /><span className="box" />{T("Remove students after they're picked")}</label>
              {removed.length > 0 && <button className="btn btn-ghost btn-sm" onClick={() => setRemoved([])}>{T("Reset (")}{removed.length} {T("picked)")}</button>}
            </div>}
          {result && <div className="wheel-result"><small>{T("The wheel says…")}</small><b>{mode === "s" ? T("Student #{0}", result) : result}</b></div>}
          {q && <QuestionItem key={q.id} q={q} i={<Eye size={14} />} />}
        </div>
      </div>
    </div>;
}