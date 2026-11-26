import { T } from "../i18n";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, RotateCcw, Trophy } from "lucide-react";
import { useAuth } from "../auth";
import { apiPost } from "../api";
import { GameSetup } from "./Setup";
import { getPool, confetti } from "./pool";
import { shuffle } from "../data/bank";
import { unitsOf } from "../data/curriculum";
import { beep, Modal } from "../components/ui";
const VALUES = [100, 200, 300, 400, 500];
const TEAM_COLORS = [T("#ff5a36"), T("#3557ff"), "#10a58c", T("#9b7bff")];
export function Jeopardy() {
  const [sp] = useSearchParams();
  const {
    myQuestions,
    token
  } = useAuth();
  const [grade, setGrade] = useState(Number(sp.get("grade")) || 9);
  const [terms, setTerms] = useState([1, 2, 3, 4]);
  const [includeMine, setIncludeMine] = useState(true);
  const [teams, setTeams] = useState([T("Team Newton"), T("Team Curie")]);
  const [board, setBoard] = useState(null);
  const [open, setOpen] = useState(null);
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(30);
  const pool = useMemo(() => getPool({
    grade,
    terms,
    mine: myQuestions,
    includeMine
  }), [grade, terms, myQuestions, includeMine]);
  useEffect(() => {
    if (!open || show) return;
    if (time <= 0) {
      beep("bad");
      setShow(true);
      return;
    }
    const t = setTimeout(() => {
      setTime(x => x - 1);
      if (time <= 6) beep("tick");
    }, 1000);
    return () => clearTimeout(t);
  }, [open, time, show]);
  const start = () => {
    const units = unitsOf(grade).filter(u => terms.includes(u.p));
    const cols = units.map(u => {
      const qs = shuffle(pool.filter(q => q.period === u.p), Date.now() + u.p);
      const lv = l => qs.filter(q => q.level === l);
      const pickFrom = (arr, used) => arr.find(q => !used.has(q.id)) || qs.find(q => !used.has(q.id));
      const used = new Set();
      const tiles = VALUES.map((v, i) => {
        const q = pickFrom(i < 2 ? lv(1) : i < 4 ? lv(2) : lv(3), used);
        if (q) used.add(q.id);
        return {
          v,
          q,
          done: false
        };
      });
      return {
        u,
        tiles
      };
    });
    const dd = [Math.floor(Math.random() * cols.length), 2 + Math.floor(Math.random() * 3)];
    cols[dd[0]].tiles[dd[1]].double = true;
    setBoard({
      cols,
      scores: teams.map(() => 0)
    });
    beep("ok");
  };
  const openTile = (c, t) => {
    const tile = board.cols[c].tiles[t];
    if (tile.done || !tile.q) return;
    setOpen({
      c,
      t
    });
    setShow(false);
    setTime(30);
    beep(tile.double ? "win" : "tick");
  };
  const award = team => {
    const tile = board.cols[open.c].tiles[open.t];
    const pts = tile.v * (tile.double ? 2 : 1);
    const cols = board.cols.map((col, i) => i !== open.c ? col : {
      ...col,
      tiles: col.tiles.map((x, j) => j === open.t ? {
        ...x,
        done: team ?? -1
      } : x)
    });
    const scores = board.scores.map((s, i) => i === team ? s + pts : s);
    setBoard({
      cols,
      scores
    });
    setOpen(null);
    if (team != null) beep("ok");
    if (cols.every(col => col.tiles.every(x => x.done !== false || !x.q))) {
      confetti();
      beep("win");
      scores.forEach((s, i) => apiPost({
        action: "score_save",
        token,
        score: {
          Juego: "Board Battle",
          Grado: grade,
          Equipo: teams[i],
          Puntos: s,
          Detalle_JSON: JSON.stringify({
            terms
          })
        }
      }).catch(() => {}));
    }
  };
  if (!board) return <div className="page">
      <Link to="/app/games" className="crumb"><ArrowLeft size={15} /> {T("Games")}</Link>
      <h1 className="game-title">{T("🧩 Board Battle")}</h1>
      <GameSetup grade={grade} setGrade={setGrade} terms={terms} setTerms={setTerms} includeMine={includeMine} setIncludeMine={setIncludeMine} count={pool.length}>
        <div className="setup-row"><b>{T("Teams")}</b>
          <div className="teams-edit">
            {teams.map((t, i) => <input key={i} className="inp" style={{
            borderColor: TEAM_COLORS[i]
          }} value={t} onChange={e => setTeams(teams.map((x, j) => j === i ? e.target.value : x))} />)}
            {teams.length < 4 && <button className="btn btn-ghost btn-sm" onClick={() => setTeams([...teams, [T("Team Tesla"), T("Team Galileo")][teams.length - 2]])}>{T("+ team")}</button>}
            {teams.length > 2 && <button className="btn btn-ghost btn-sm" onClick={() => setTeams(teams.slice(0, -1))}>{T("− team")}</button>}
          </div>
        </div>
        <button className="btn btn-tang btn-lg" onClick={start}>{T("Build the board 🧩")}</button>
      </GameSetup>
    </div>;
  const tile = open && board.cols[open.c].tiles[open.t];
  const lead = Math.max(...board.scores);
  return <div className="page jeo">
      <div className="jeo-top"><Link to="/app/games" className="crumb"><ArrowLeft size={15} /> {T("Games")}</Link><button className="btn btn-ghost btn-sm" onClick={() => setBoard(null)}><RotateCcw size={14} /> {T("New board")}</button></div>
      <div className="jeo-board" style={{
      gridTemplateColumns: `repeat(${board.cols.length}, 1fr)`
    }}>
        {board.cols.map(col => <div key={col.u.p} className="jeo-head">{col.u.emoji}<b>{col.u.title}</b></div>)}
        {VALUES.map((_, r) => board.cols.map((col, c) => {
        const t = col.tiles[r];
        return <button key={c + "-" + r} className={T("jeo-tile {0}", t.done !== false ? "done" : "")} style={typeof t.done === "number" && t.done >= 0 ? {
          "--tc": TEAM_COLORS[t.done]
        } : undefined} onClick={() => openTile(c, r)} disabled={t.done !== false || !t.q}>{t.done !== false ? t.done >= 0 ? "✓" : "·" : t.v}</button>;
      }))}
      </div>
      <div className="jeo-scores">
        {teams.map((t, i) => <div key={i} className={T("jeo-team {0}", board.scores[i] === lead && lead > 0 ? "lead" : "")} style={{
        "--tc": TEAM_COLORS[i]
      }}>{board.scores[i] === lead && lead > 0 && <Trophy size={16} />}<span>{t}</span><b>{board.scores[i]}</b></div>)}
      </div>
      <Modal open={!!open} onClose={() => setOpen(null)} wide>
        {tile && <div className="jeo-q">
            <div className="jeo-q-top">
              <span className="pill">{board.cols[open.c].u.title} · {tile.v}{tile.double ? T(" × 2 🌟 DOUBLE PHYSICS!") : ""}</span>
              <span className={T("jeo-timer {0}", time <= 5 ? "hot" : "")} style={{
            "--p": time / 30 * 100 + "%"
          }}>{time}</span>
            </div>
            <h2>{tile.q.q}</h2>
            <ol type="A" className="jeo-opts">{tile.q.opts.map((o, i) => <li key={i} className={show && i === tile.q.ans ? "ok" : ""}><span>{"ABCD"[i]}</span>{o}</li>)}</ol>
            {show && tile.q.ex && <p className="q-ex">💬 {tile.q.ex}</p>}
            {!show ? <button className="btn btn-ink" onClick={() => setShow(true)}><Eye size={16} /> {T("Reveal answer")}</button> : <div className="jeo-award"><span>{T("Who got it?")}</span>{teams.map((t, i) => <button key={i} className="btn" style={{
            background: TEAM_COLORS[i],
            color: "#fff"
          }} onClick={() => award(i)}>{t}</button>)}<button className="btn btn-ghost" onClick={() => award(null)}>{T("Nobody")}</button></div>}
          </div>}
      </Modal>
    </div>;
}