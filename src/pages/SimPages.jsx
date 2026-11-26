import { T } from "../i18n";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Maximize } from "lucide-react";
import { SIMS, FAMILIES, getSim } from "../sims";
import { UNITS } from "../data/curriculum";
import { GRADES, gradeMeta } from "../data/grades";
import { PageHead } from "../components/ui";
export function SimLibrary() {
  const [fam, setFam] = useState("all"),
    [g, setG] = useState(0);
  const list = SIMS.filter(s => (fam === "all" || s.fam === fam) && (!g || s.grades.includes(g)));
  return <div className="page">
      <PageHead kicker={T("Virtual laboratory")} title={T("Simulations")} sub={T("Every slider is a question: “what happens if…?”. Project them, let students predict, then press play.")} />
      <div className="filters">
        <div className="chips">
          <button className={fam === "all" ? "on" : ""} onClick={() => setFam("all")}>{T("All")}</button>
          {Object.entries(FAMILIES).map(([k, f]) => <button key={k} className={fam === k ? "on" : ""} style={{
          "--fc": f.color
        }} onClick={() => setFam(k)}>{f.name}</button>)}
        </div>
        <div className="chips">
          <button className={!g ? "on" : ""} onClick={() => setG(0)}>{T("All grades")}</button>
          {GRADES.map(x => <button key={x.g} className={g === x.g ? "on" : ""} style={{
          "--fc": x.color
        }} onClick={() => setG(x.g)}>{x.g}°</button>)}
        </div>
      </div>
      <div className="sim-grid">
        {list.map(s => <Link key={s.id} to={T("/app/sims/{0}", s.id)} className="sim-card" style={{
        "--fc": FAMILIES[s.fam].color
      }}>
            <span className="sim-card-emoji">{s.emoji}</span>
            <small>{FAMILIES[s.fam].name}</small>
            <h3>{s.name}</h3>
            <p>{s.blurb}</p>
            <div className="sim-card-g">{s.grades.sort((a, b) => a - b).map(x => <span key={x} style={{
            "--gc": gradeMeta(x).color
          }}>{x}°</span>)}</div>
          </Link>)}
      </div>
    </div>;
}
export function SimPage() {
  const {
    simId
  } = useParams();
  const s = getSim(simId);
  const labs = useMemo(() => UNITS.flatMap(u => u.labs.filter(l => l.sim === simId).map(l => ({
    ...l,
    u
  }))), [simId]);
  if (!s) return <div className="page"><p>{T("Simulation not found.")}</p></div>;
  const C = s.C;
  const full = () => document.querySelector(".sim-page-stage")?.requestFullscreen?.();
  return <div className="page sim-page" style={{
    "--fc": FAMILIES[s.fam].color
  }}>
      <Link to="/app/sims" className="crumb"><ArrowLeft size={15} /> {T("All simulations")}</Link>
      <div className="sim-page-head">
        <h1><span>{s.emoji}</span> {s.name}</h1>
        <button className="btn btn-ghost" onClick={full}><Maximize size={16} /> {T("Fullscreen")}</button>
      </div>
      <p className="muted">{s.blurb}</p>
      <div className="sim-page-stage"><C /></div>
      {labs.length > 0 && <>
          <h2 className="block-title">{T("Ready-made activities with this simulation")}</h2>
          <div className="sim-acts">
            {labs.map(l => <article key={l.u.g + l.t} className="sim-act" style={{
          "--gc": gradeMeta(l.u.g).color
        }}>
                <Link to={T("/app/grade/{0}/p/{1}", l.u.g, l.u.p)} className="sim-act-g">{l.u.g}° · T{l.u.p} · {l.u.title}</Link>
                <h3>{l.t}</h3>
                <p><b>{T("🤔 Predict:")}</b> {l.predict}</p>
                <ol>{l.steps.map(x => <li key={x}>{x}</li>)}</ol>
                <p><b>{T("👀 Observe:")}</b> {l.observe}</p>
                <p><b>{T("💡 Explain:")}</b> {l.explain}</p>
              </article>)}
          </div>
        </>}
    </div>;
}