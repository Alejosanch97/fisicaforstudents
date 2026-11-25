import { useState } from "react";
import { Search, Lightbulb, X } from "lucide-react";
import { GRADES } from "../data/grades";
import { unitsOf } from "../data/curriculum";
import { Tex } from "../sims/kit";
import { PageHead } from "../components/ui";
import { FormulaCard } from "./UnitPage";

export function FormulaWall() {
  const [g, setG] = useState(0), [q, setQ] = useState(""), [big, setBig] = useState(null);
  const groups = GRADES.filter((x) => !g || x.g === g).map((x) => ({ x, units: unitsOf(x.g).map((u) => ({ u, fs: u.formulas.filter((f) => !q || (f.n + f.tip).toLowerCase().includes(q.toLowerCase())) })).filter((k) => k.fs.length) })).filter((k) => k.units.length);
  return (
    <div className="page">
      <PageHead kicker="Cheat sheet for the board" title="Formula wall" sub="Every formula of the programme with its variables, units and a memory trick. Click one to project it big." />
      <div className="filters">
        <div className="chips"><button className={!g ? "on" : ""} onClick={() => setG(0)}>All grades</button>{GRADES.map((x) => <button key={x.g} className={g === x.g ? "on" : ""} style={{ "--fc": x.color }} onClick={() => setG(x.g)}>{x.g}°</button>)}</div>
        <label className="search"><Search size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: density, Newton, lens…" /></label>
      </div>
      {groups.map(({ x, units }) => (
        <section key={x.g} className="fw-grade" style={{ "--gc": x.color, "--gi": x.ink }}>
          <h2><span>{x.g}°</span> {x.emoji} {x.name}</h2>
          {units.map(({ u, fs }) => (
            <div key={u.p} className="fw-unit">
              <h4>T{u.p} · {u.title}</h4>
              <div className="fw-row">{fs.map((f) => <button key={f.n} className="fw-chip" onClick={() => setBig(f)}><small>{f.n}</small><Tex tex={f.tex} /></button>)}</div>
            </div>
          ))}
        </section>
      ))}
      {big && (
        <div className="projector light" onClick={() => setBig(null)}>
          <button className="proj-x"><X /></button>
          <div className="fw-big" onClick={(e) => e.stopPropagation()}><FormulaCard f={big} /></div>
          <p className="muted"><Lightbulb size={14} /> click outside to close</p>
        </div>
      )}
    </div>
  );
}
