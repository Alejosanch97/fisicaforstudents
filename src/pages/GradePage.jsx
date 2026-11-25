import { Link, useParams } from "react-router-dom";
import { ArrowRight, Presentation, FlaskConical, Trophy, ClipboardList, Globe } from "lucide-react";
import { gradeMeta } from "../data/grades";
import { unitsOf } from "../data/curriculum";
import { SIMS, getSim } from "../sims";

export function GradePage() {
  const { grade } = useParams();
  const g = gradeMeta(grade);
  const units = unitsOf(grade);
  const sims = SIMS.filter((s) => s.grades.includes(g.g));
  return (
    <div className="page" style={{ "--gc": g.color, "--gi": g.ink }}>
      <section className="grade-hero">
        <span className="grade-hero-num">{g.g}°</span>
        <div>
          <span className="kicker">Grade {g.g} · English {g.cefr}</span>
          <h1>{g.emoji} The {g.name}</h1>
          <p>{g.desc}</p>
          <div className="grade-hero-btns">
            <Link className="btn btn-ink" to={`/app/games/millionaire?grade=${g.g}`}><Trophy size={16} /> Millionaire {g.g}°</Link>
            <Link className="btn btn-ghost" to={`/app/games/board?grade=${g.g}`}>Board Battle</Link>
            <Link className="btn btn-ghost" to={`/app/bank?grade=${g.g}`}><ClipboardList size={16} /> 100 questions</Link>
          </div>
        </div>
      </section>

      <div className="term-grid">
        {units.map((u) => (
          <article key={u.p} className="term-card">
            <header>
              <span className="term-tag">Term {u.p}</span>
              <span className="term-emoji">{u.emoji}</span>
            </header>
            <h2>{u.title}</h2>
            <p className="term-sdg"><Globe size={14} /> {u.sdg}</p>
            <p className="term-big">{u.bigIdea}</p>
            <div className="term-topics">{u.topics.slice(0, 7).map((t) => <span key={t}>{t}</span>)}{u.topics.length > 7 && <span>+{u.topics.length - 7}</span>}</div>
            <div className="term-sims">{u.sims.map((id) => { const s = getSim(id); return s && <Link key={id} to={`/app/sims/${id}`} title={s.name}>{s.emoji}</Link>; })}</div>
            <footer>
              <Link className="btn btn-gc" to={`/app/grade/${g.g}/p/${u.p}`}>Open unit <ArrowRight size={16} /></Link>
              <Link className="btn btn-ghost" to={`/present/${g.g}/${u.p}`}><Presentation size={16} /> Present</Link>
            </footer>
          </article>
        ))}
      </div>

      <h2 className="block-title"><FlaskConical size={20} /> Simulations for {g.g}°</h2>
      <div className="quick-sims wide">
        {sims.map((s) => <Link key={s.id} to={`/app/sims/${s.id}`} className="qs"><span>{s.emoji}</span><b>{s.name}</b><small>{s.blurb}</small></Link>)}
      </div>
    </div>
  );
}
