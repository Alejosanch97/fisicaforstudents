import { T } from "../i18n";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHead } from "../components/ui";
const GAMES = [{
  to: "millionaire",
  e: "💰",
  t: T("Who Wants to Be a Physicist?"),
  d: T("15 questions of growing difficulty, a money ladder, safe havens and three lifelines: 50:50, Ask the Class and Phone a Scientist."),
  tags: [T("Whole class"), T("Hot seat"), T("15 min")],
  c: "var(--sun)"
}, {
  to: "board",
  e: "🧩",
  t: T("Board Battle"),
  d: T("A Jeopardy-style board: one column per term, 100 to 500 points, a secret Double Physics tile and up to 4 teams."),
  tags: [T("2–4 teams"), T("Review"), T("20 min")],
  c: "var(--cobalt)"
}, {
  to: "wheel",
  e: "🎡",
  t: T("Spin the Wheel"),
  d: T("Spin for a random question by term — or switch to Student Picker to choose who answers next. Fair and fun."),
  tags: [T("Warm-up"), T("Cold call"), T("5 min")],
  c: "var(--tang)"
}];
export function GamesHub() {
  return <div className="page">
      <PageHead kicker={T("Game room")} title={T("Games")} sub={T("All games use the 600-question bank + the questions you upload to your Google Sheet.")} />
      <div className="games-grid">
        {GAMES.map(g => <Link key={g.to} to={g.to} className="game-card" style={{
        "--fc": g.c
      }}>
            <span className="game-emoji">{g.e}</span>
            <h2>{g.t}</h2>
            <p>{g.d}</p>
            <div className="game-tags">{g.tags.map(t => <span key={t}>{t}</span>)}</div>
            <span className="game-go">{T("Play")} <ArrowRight size={16} /></span>
          </Link>)}
      </div>
    </div>;
}