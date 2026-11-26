import { T, getLang } from "../i18n";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FlaskConical, Trophy, ClipboardList, Sigma, CircleCheck } from "lucide-react";
import { useAuth } from "../auth";
import { apiGet } from "../api";
import { GRADES } from "../data/grades";
import { unitsOf, getUnit } from "../data/curriculum";
import { SIMS, FAMILIES } from "../sims";
export function Dashboard() {
  const {
    user,
    token,
    myQuestions
  } = useAuth();
  const [log, setLog] = useState([]);
  useEffect(() => {
    apiGet({
      action: "log",
      token
    }).then(r => r.status === "success" && setLog((r.log || []).slice(-6).reverse())).catch(() => {});
  }, [token]);
  const h = new Date().getHours();
  const hello = h < 12 ? T("Good morning") : h < 18 ? T("Good afternoon") : T("Good evening");
  const first = (user?.Nombre || T("Teacher")).split(" ")[0];
  const featured = ["projectile", "energy", "circuit", "sound", "gas", "lens"].map(id => SIMS.find(s => s.id === id));
  return <div className="page dash">
      <section className="dash-hero">
        <div>
          <span className="kicker">{new Date().toLocaleDateString(getLang() === "es" ? "es-CO" : "en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
          })}</span>
          <h1>{hello}, {first}! <span className="wave">👋</span></h1>
          <p>{T("Which grade are we making move today?")}</p>
        </div>
        <div className="dash-stats">
          <Link to="/app/sims"><FlaskConical /><b>{SIMS.length}</b><span>{T("sims")}</span></Link>
          <Link to="/app/bank"><ClipboardList /><b>{600 + myQuestions.length}</b><span>{T("questions")}</span></Link>
          <Link to="/app/games"><Trophy /><b>3</b><span>{T("games")}</span></Link>
          <Link to="/app/formulas"><Sigma /><b>{GRADES.reduce((a, g) => a + unitsOf(g.g).reduce((b, u) => b + u.formulas.length, 0), 0)}</b><span>{T("formulas")}</span></Link>
        </div>
      </section>

      <h2 className="block-title">{T("Choose a grade world")}</h2>
      <div className="dash-grades">
        {GRADES.map(g => <Link key={g.g} to={T("/app/grade/{0}", g.g)} className="dg" style={{
        "--gc": g.color,
        "--gi": g.ink
      }}>
            <span className="dg-num">{g.g}°</span>
            <span className="dg-emoji">{g.emoji}</span>
            <h3>{g.name}</h3>
            <small>{T("English")} {g.cefr}</small>
            <p>{g.tag}</p>
            <ul>{unitsOf(g.g).map(u => <li key={u.p} title={u.title}>{u.emoji}</li>)}</ul>
            <span className="dg-go">{T("Open")} <ArrowRight size={15} /></span>
          </Link>)}
      </div>

      <div className="dash-cols">
        <section>
          <h2 className="block-title">{T("Quick-launch simulations")}</h2>
          <div className="quick-sims">
            {featured.map(s => <Link key={s.id} to={T("/app/sims/{0}", s.id)} className="qs" style={{
            "--fc": FAMILIES[s.fam].color
          }}>
                <span>{s.emoji}</span><b>{s.name}</b><small>{s.grades.map(g => g + "°").join(" · ")}</small>
              </Link>)}
          </div>
          <Link to="/app/games/millionaire" className="dash-game">
            <span className="dash-game-ic">💰</span>
            <div><b>{T("Who Wants to Be a Physicist?")}</b><small>{T("15 questions · 3 lifelines · instant class energy")}</small></div>
            <ArrowRight />
          </Link>
        </section>
        <section>
          <h2 className="block-title">{T("Recently taught")}</h2>
          <div className="log-list">
            {log.length === 0 && <p className="muted">{T("When you mark a term as \"taught\" from a unit page, it appears here — your own teaching diary.")}</p>}
            {log.map(l => {
            const u = getUnit(l.Grado, l.Periodo);
            return <Link key={l.Id} to={T("/app/grade/{0}/p/{1}", l.Grado, l.Periodo)} className="log-item">
                  <CircleCheck size={18} />
                  <div><b>{l.Grado}° · {u?.title || l.Tema}</b><small>{new Date(l.Fecha).toLocaleDateString()} {l.Recurso ? "· " + l.Recurso : ""}</small>{l.Notas && <p>{l.Notas}</p>}</div>
                </Link>;
          })}
          </div>
        </section>
      </div>
    </div>;
}