import { T } from "../i18n";
import { GRADES } from "../data/grades";
import { unitsOf } from "../data/curriculum";
export function GameSetup({
  grade,
  setGrade,
  terms,
  setTerms,
  includeMine,
  setIncludeMine,
  count,
  children
}) {
  const toggle = p => setTerms(terms.includes(p) ? terms.length > 1 ? terms.filter(x => x !== p) : terms : [...terms, p].sort());
  return <div className="setup">
      <div className="setup-row"><b>{T("Grade")}</b>
        <div className="chips">{GRADES.map(g => <button key={g.g} className={grade === g.g ? "on" : ""} style={{
          "--fc": g.color
        }} onClick={() => setGrade(g.g)}>{g.emoji} {g.g}°</button>)}</div>
      </div>
      <div className="setup-row"><b>{T("Terms")}</b>
        <div className="chips">{unitsOf(grade).map(u => <button key={u.p} className={terms.includes(u.p) ? "on" : ""} onClick={() => toggle(u.p)}>T{u.p} · {u.title}</button>)}</div>
      </div>
      {setIncludeMine && <label className="sim-check"><input type="checkbox" checked={includeMine} onChange={e => setIncludeMine(e.target.checked)} /><span className="box" />{T("Include my own questions")}</label>}
      {count != null && <p className="muted">{count} {T("questions available")}</p>}
      {children}
    </div>;
}