import { Link } from "react-router-dom";
import { ArrowRight, FlaskConical, Presentation, Trophy, ClipboardList, BookOpen, Sigma, Sparkles, Target, PenLine, Play } from "lucide-react";
import { Brand } from "../components/ui";
import { GRADES } from "../data/grades";
import { unitsOf } from "../data/curriculum";
import { SIMS } from "../sims";
import { Projectile } from "../sims/motion";
import { Tex, useCanvas, C } from "../sims/kit";

function HeroBoard() {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = C.board; ctx.beginPath(); ctx.roundRect(0, 0, w, h, 28); ctx.fill();
    ctx.strokeStyle = "rgba(244,239,228,.06)"; ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    const arcs = [[0.45, C.tang, 0], [0.75, C.sun, 1.3], [0.62, C.teal, 2.6], [0.9, C.lilac, 3.9]];
    const g0 = h - 40;
    ctx.strokeStyle = "rgba(244,239,228,.35)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, g0); ctx.lineTo(w - 20, g0); ctx.stroke();
    arcs.forEach(([k, col, off]) => {
      const p = ((t * 0.32 + off / 5.2) % 1);
      const R = (w - 80) * k, H = (h - 120) * k;
      ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.setLineDash([2, 9]); ctx.lineCap = "round"; ctx.beginPath();
      for (let i = 0; i <= 60 * p; i++) { const s = i / 60, x = 40 + R * s, y = g0 - 4 * H * s * (1 - s); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke(); ctx.setLineDash([]);
      const x = 40 + R * p, y = g0 - 4 * H * p * (1 - p);
      ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      const vx = R, vy = -4 * H * (1 - 2 * p);
      const m = Math.hypot(vx, vy); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (vx / m) * 34, y + (vy / m) * 34); ctx.stroke();
    });
    ctx.save(); ctx.translate(40, g0); ctx.rotate(-0.8); ctx.fillStyle = C.tang; ctx.beginPath(); ctx.roundRect(-6, -10, 52, 20, 8); ctx.fill(); ctx.restore();
    ctx.fillStyle = "#2a2e6e"; ctx.beginPath(); ctx.arc(40, g0, 15, 0, Math.PI * 2); ctx.fill();
  }, []);
  return (
    <div className="hero-board">
      <canvas ref={ref} />
      <div className="hero-chip c1"><Tex tex={"R = \\frac{v_0^2 \\sin 2\\theta}{g}"} /></div>
      <div className="hero-chip c2"><Tex tex={"F = m\\,a"} /></div>
      <div className="hero-chip c3"><Tex tex={"v = \\lambda f"} /></div>
      <div className="hero-chip c4"><Tex tex={"E = mc^2"} /></div>
    </div>
  );
}

const FEATURES = [
  { i: FlaskConical, t: "24 live simulations", d: "Cannons, circuits, lenses, gas pistons, real sound… every slider changes the physics in front of the class.", c: "var(--tang)" },
  { i: Presentation, t: "Ready-to-project decks", d: "One deck per term, with live simulations INSIDE the slides and examples that reveal step by step.", c: "var(--cobalt)" },
  { i: Trophy, t: "Who Wants to Be a Physicist?", d: "Ladder, lifelines and drama. Plus Board Battle for teams and a Spin Wheel.", c: "var(--sun)" },
  { i: ClipboardList, t: "600 ICFES-style questions", d: "100 per grade, seeded and stable, plus every question you upload from your Google Sheet.", c: "var(--teal)" },
  { i: BookOpen, t: "Readings A2 → B2", d: "Short CLIL texts linked to each SDG challenge with glossary and comprehension questions.", c: "var(--lilac)" },
  { i: Sigma, t: "Formula wall + memory tricks", d: "Every formula with variables, units and a trick that students actually remember.", c: "var(--pink)" },
];
const FLOW = [["Hook", Sparkles, "A prediction question that creates curiosity."], ["Explain", Presentation, "Project the deck. Ideas, formulas, live sims."], ["Simulate", FlaskConical, "Predict → Observe → Explain with a virtual lab."], ["Practise", PenLine, "Worked examples that reveal one step at a time."], ["Play", Trophy, "Millionaire or Board Battle to close the class."]];

export function Landing() {
  return (
    <div className="landing">
      <nav className="land-nav">
        <Brand />
        <div className="land-links"><a href="#inside">What's inside</a><a href="#grades">Grades</a><a href="#try">Try a sim</a></div>
        <Link to="/login" className="btn btn-ink">Teacher login <ArrowRight size={16} /></Link>
      </nav>

      <section className="hero">
        <div className="hero-txt">
          <span className="kicker">For physics teachers · grades 6 – 11 · 100% English</span>
          <h1>Make physics <em>move.</em></h1>
          <p>Momentum is your physics studio: simulations you control with sliders, slides that come alive, games your students beg for, and a question bank that prepares them for the ICFES — ordered by grade and term.</p>
          <div className="hero-cta">
            <Link to="/login" className="btn btn-tang btn-lg">Enter the studio <ArrowRight size={18} /></Link>
            <a href="#try" className="btn btn-ghost btn-lg"><Play size={16} /> Try a simulation</a>
          </div>
          <div className="hero-stats">
            <div><b>{SIMS.length}</b><span>simulations</span></div>
            <div><b>600</b><span>ICFES questions</span></div>
            <div><b>24</b><span>term decks</span></div>
            <div><b>6</b><span>grade worlds</span></div>
          </div>
        </div>
        <HeroBoard />
      </section>

      <section id="inside" className="land-sec">
        <h2 className="sec-title">Everything a great physics class needs, <span>in one place.</span></h2>
        <div className="feat-grid">
          {FEATURES.map(({ i: I, t, d, c }) => (
            <article key={t} className="feat" style={{ "--fc": c }}>
              <span className="feat-ic"><I size={22} /></span>
              <h3>{t}</h3><p>{d}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="grades" className="land-sec">
        <h2 className="sec-title">Six grade worlds. <span>One clear learning line.</span></h2>
        <div className="world-grid">
          {GRADES.map((g) => (
            <article key={g.g} className="world" style={{ "--gc": g.color, "--gi": g.ink }}>
              <header><span className="world-num">{g.g}°</span><div><h3>{g.emoji} {g.name}</h3><small>English {g.cefr}</small></div></header>
              <ol>{unitsOf(g.g).map((u) => <li key={u.p}><span>T{u.p}</span>{u.emoji} {u.title}</li>)}</ol>
            </article>
          ))}
        </div>
      </section>

      <section className="land-sec">
        <h2 className="sec-title">A 45-minute class <span>in five moves.</span></h2>
        <div className="flow">
          {FLOW.map(([t, I, d], i) => (
            <div key={t} className="flow-step"><span className="flow-n">{i + 1}</span><I size={22} /><h4>{t}</h4><p>{d}</p></div>
          ))}
        </div>
      </section>

      <section id="try" className="land-sec">
        <h2 className="sec-title"><Target size={30} /> Go on, <span>fire the cannon.</span></h2>
        <div className="try-box"><Projectile /></div>
      </section>

      <footer className="land-foot">
        <Brand light />
        <p>Built for teachers at Instituto Pedagógico CREAR · Physics in English, from A2 to B2.</p>
        <Link to="/login" className="btn btn-sun">Start teaching <ArrowRight size={16} /></Link>
      </footer>
    </div>
  );
}
