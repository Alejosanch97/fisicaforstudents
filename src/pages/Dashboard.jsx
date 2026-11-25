import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FlaskConical, Trophy, ClipboardList, Sigma, CircleCheck } from "lucide-react";
import { useAuth } from "../auth";
import { apiGet } from "../api";
import { GRADES } from "../data/grades";
import { unitsOf, getUnit } from "../data/curriculum";
import { SIMS, FAMILIES } from "../sims";

export function Dashboard() {
  const { user, token, myQuestions } = useAuth();
  const [log, setLog] = useState([]);
  useEffect(() => { apiGet({ action: "log", token }).then((r) => r.status === "success" && setLog((r.log || []).slice(-6).reverse())).catch(() => {}); }, [token]);
  const h = new Date().getHours();
  const hello = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  const first = (user?.Nombre || "Teacher").split(" ")[0];
  const featured = ["projectile", "energy", "circuit", "sound", "gas", "lens"].map((id) => SIMS.find((s) => s.id === id));

  return (
    <div className="page dash">
      <section className="dash-hero">
        <div>
          <span className="kicker">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
          <h1>{hello}, {first}! <span className="wave">👋</span></h1>
          <p>Which grade are we making move today?</p>
        </div>
        <div className="dash-stats">
          <Link to="/app/sims"><FlaskConical /><b>{SIMS.length}</b><span>sims</span></Link>
          <Link to="/app/bank"><ClipboardList /><b>{600 + myQuestions.length}</b><span>questions</span></Link>
          <Link to="/app/games"><Trophy /><b>3</b><span>games</span></Link>
          <Link to="/app/formulas"><Sigma /><b>{GRADES.reduce((a, g) => a + unitsOf(g.g).reduce((b, u) => b + u.formulas.length, 0), 0)}</b><span>formulas</span></Link>
        </div>
      </section>

      <h2 className="block-title">Choose a grade world</h2>
      <div className="dash-grades">
        {GRADES.map((g) => (
          <Link key={g.g} to={`/app/grade/${g.g}`} className="dg" style={{ "--gc": g.color, "--gi": g.ink }}>
            <span className="dg-num">{g.g}°</span>
            <span className="dg-emoji">{g.emoji}</span>
            <h3>{g.name}</h3>
            <small>English {g.cefr}</small>
            <p>{g.tag}</p>
            <ul>{unitsOf(g.g).map((u) => <li key={u.p} title={u.title}>{u.emoji}</li>)}</ul>
            <span className="dg-go">Open <ArrowRight size={15} /></span>
          </Link>
        ))}
      </div>

      <div className="dash-cols">
        <section>
          <h2 className="block-title">Quick-launch simulations</h2>
          <div className="quick-sims">
            {featured.map((s) => (
              <Link key={s.id} to={`/app/sims/${s.id}`} className="qs" style={{ "--fc": FAMILIES[s.fam].color }}>
                <span>{s.emoji}</span><b>{s.name}</b><small>{s.grades.map((g) => g + "°").join(" · ")}</small>
              </Link>
            ))}
          </div>
          <Link to="/app/games/millionaire" className="dash-game">
            <span className="dash-game-ic">💰</span>
            <div><b>Who Wants to Be a Physicist?</b><small>15 questions · 3 lifelines · instant class energy</small></div>
            <ArrowRight />
          </Link>
        </section>
        <section>
          <h2 className="block-title">Recently taught</h2>
          <div className="log-list">
            {log.length === 0 && <p className="muted">When you mark a term as "taught" from a unit page, it appears here — your own teaching diary.</p>}
            {log.map((l) => {
              const u = getUnit(l.Grado, l.Periodo);
              return (
                <Link key={l.Id} to={`/app/grade/${l.Grado}/p/${l.Periodo}`} className="log-item">
                  <CircleCheck size={18} />
                  <div><b>{l.Grado}° · {u?.title || l.Tema}</b><small>{new Date(l.Fecha).toLocaleDateString()} {l.Recurso ? "· " + l.Recurso : ""}</small>{l.Notas && <p>{l.Notas}</p>}</div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
