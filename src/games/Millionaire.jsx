import { LangToggle } from "../i18n";
import { T } from "../i18n";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Users, Phone, Percent, Flag, RotateCcw } from "lucide-react";
import { useAuth } from "../auth";
import { apiPost } from "../api";
import { GameSetup } from "./Setup";
import { getPool, ladder, confetti } from "./pool";
import { beep } from "../components/ui";
import { gradeMeta } from "../data/grades";
const PRIZES = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
const SAFE = [4, 9]; // indexes 5 and 10
const SCIENTISTS = [T("Marie Curie"), T("Isaac Newton"), T("Albert Einstein"), T("Katherine Johnson"), T("Nikola Tesla"), T("Galileo Galilei"), T("Lise Meitner"), T("Richard Feynman")];
const money = n => n.toLocaleString("en-US") + " " + T("pts");
export function Millionaire() {
  const [sp] = useSearchParams();
  const {
    myQuestions,
    token
  } = useAuth();
  const [grade, setGrade] = useState(Number(sp.get("grade")) || 8);
  const [terms, setTerms] = useState(sp.get("term") ? [Number(sp.get("term"))] : [1, 2, 3, 4]);
  const [includeMine, setIncludeMine] = useState(true);
  const [player, setPlayer] = useState("");
  const pool = useMemo(() => getPool({
    grade,
    terms,
    mine: myQuestions,
    includeMine
  }), [grade, terms, myQuestions, includeMine]);
  const [game, setGame] = useState(null);
  const start = () => {
    setGame({
      qs: ladder(pool),
      lvl: 0,
      pick: null,
      lock: false,
      reveal: false,
      over: null,
      hidden: [],
      poll: null,
      phone: null,
      used: {}
    });
    beep("ok");
  };
  const g = gradeMeta(grade);
  if (!game) return <div className="page">
      <Link to="/app/games" className="crumb"><ArrowLeft size={15} /> {T("Games")}</Link>
      <section className="mil-intro">
        <div className="mil-logo"><span>💰</span><h1>{T("Who Wants to Be a")} <em>{T("Physicist?")}</em></h1></div>
        <GameSetup grade={grade} setGrade={setGrade} terms={terms} setTerms={setTerms} includeMine={includeMine} setIncludeMine={setIncludeMine} count={pool.length}>
          <div className="setup-row"><b>{T("Player / team name")}</b><input className="inp" value={player} onChange={e => setPlayer(e.target.value)} placeholder={T("e.g. Valentina or Team Newton")} /></div>
          <button className="btn btn-sun btn-lg" disabled={pool.length < 15} onClick={start}>{T("Let's play! 🎬")}</button>
          {pool.length < 15 && <p className="alert">{T("Select more terms: at least 15 questions are needed.")}</p>}
        </GameSetup>
      </section>
    </div>;
  const q = game.qs[game.lvl];
  const set = p => setGame(x => ({
    ...x,
    ...p
  }));
  const lockIn = () => {
    if (game.pick == null || game.lock) return;
    set({
      lock: true
    });
    beep("tick");
    setTimeout(() => {
      const ok = game.pick === q.ans;
      beep(ok ? "ok" : "bad");
      setGame(x => ({
        ...x,
        reveal: true
      }));
      setTimeout(() => {
        if (ok && game.lvl === 14) {
          confetti();
          beep("win");
          setGame(x => ({
            ...x,
            over: {
              won: PRIZES[14],
              msg: T("MILLIONAIRE OF PHYSICS! 🏆")
            }
          }));
          save(PRIZES[14]);
        } else if (ok) setGame(x => ({
          ...x,
          lvl: x.lvl + 1,
          pick: null,
          lock: false,
          reveal: false,
          hidden: [],
          poll: null,
          phone: null
        }));else {
          const safe = [...SAFE].reverse().find(s => s < game.lvl);
          const won = safe != null ? PRIZES[safe] : 0;
          setGame(x => ({
            ...x,
            over: {
              won,
              msg: T("Oh no! Wrong answer.")
            }
          }));
          save(won);
        }
      }, ok ? 1500 : 2600);
    }, 1600);
  };
  const save = pts => apiPost({
    action: "score_save",
    token,
    score: {
      Juego: "Millionaire",
      Grado: grade,
      Equipo: player || "Player",
      Puntos: pts,
      Detalle_JSON: JSON.stringify({
        terms,
        reached: game.lvl + 1
      })
    }
  }).catch(() => {});
  const fifty = () => {
    const wrong = [0, 1, 2, 3].filter(i => i !== q.ans).sort(() => Math.random() - 0.5).slice(0, 2);
    set({
      hidden: wrong,
      used: {
        ...game.used,
        fifty: true
      }
    });
    beep("tick");
  };
  const ask = () => {
    const acc = [0.75, 0.6, 0.45][Math.min(2, Math.floor(game.lvl / 5))];
    let rest = 100 - Math.round(acc * 100 * (0.8 + Math.random() * 0.4));
    const poll = [0, 0, 0, 0];
    poll[q.ans] = 100 - rest;
    [0, 1, 2, 3].filter(i => i !== q.ans && !game.hidden.includes(i)).forEach((i, k, arr) => {
      const v = k === arr.length - 1 ? rest : Math.round(Math.random() * rest);
      poll[i] = v;
      rest -= v;
    });
    set({
      poll,
      used: {
        ...game.used,
        ask: true
      }
    });
    beep("tick");
  };
  const phone = () => {
    const who = SCIENTISTS[Math.floor(Math.random() * SCIENTISTS.length)];
    const sure = Math.random() < [0.9, 0.75, 0.6][Math.min(2, Math.floor(game.lvl / 5))];
    const opts = [0, 1, 2, 3].filter(i => !game.hidden.includes(i));
    const guess = sure ? q.ans : opts[Math.floor(Math.random() * opts.length)];
    set({
      phone: {
        who,
        letter: "ABCD"[guess],
        conf: sure ? "I'm quite sure" : "I'm not 100% sure, but I think"
      },
      used: {
        ...game.used,
        phone: true
      }
    });
    beep("tick");
  };
  const walk = () => {
    const won = game.lvl > 0 ? PRIZES[game.lvl - 1] : 0;
    set({
      over: {
        won,
        msg: T("You walked away with your points!")
      }
    });
    save(won);
  };
  return <div className="mil" style={{
    "--gc": g.color
  }}>
      <div className="mil-main">
        <div className="mil-top">
          <Link to="/app/games" className="mil-exit"><ArrowLeft size={16} /> {T("Exit")}</Link>
          <div className="mil-life">
            <button disabled={game.used.fifty || game.lock} onClick={fifty} title="50:50"><Percent size={18} /> 50:50</button>
            <button disabled={game.used.ask || game.lock} onClick={ask} title={T("Ask the class")}><Users size={18} /></button>
            <button disabled={game.used.phone || game.lock} onClick={phone} title={T("Phone a scientist")}><Phone size={18} /></button>
          </div>
          <LangToggle dark compact />
          <button className="mil-walk" disabled={game.lock} onClick={walk}><Flag size={15} /> {T("Walk away")}</button>
        </div>

        {game.over ? <div className="mil-over">
            <h2>{game.over.msg}</h2>
            <p>{player || "Player"} {T("wins")}</p>
            <strong>{money(game.over.won)}</strong>
            {!game.reveal || game.over.won === PRIZES[14] ? null : <p className="mil-correct">{T("Correct answer:")} <b>{"ABCD"[q.ans]}. {q.opts[q.ans]}</b><br /><small>{q.ex}</small></p>}
            <div className="row"><button className="btn btn-sun btn-lg" onClick={start}><RotateCcw size={18} /> {T("Play again")}</button><button className="btn btn-ghost-light" onClick={() => setGame(null)}>{T("Change settings")}</button></div>
          </div> : <>
            <div className="mil-stage">
              <span className="mil-for">{T("Question")} {game.lvl + 1} {T("for")} <b>{money(PRIZES[game.lvl])}</b> · {q.topic}</span>
              {game.poll && <div className="mil-poll">{game.poll.map((v, i) => <div key={i}><span style={{
                height: v + "%"
              }} /><b>{"ABCD"[i]}</b><small>{v}%</small></div>)}</div>}
              {game.phone && <div className="mil-phone">📞 <b>{game.phone.who}:</b> “{game.phone.conf} {T("it's")} <b>{game.phone.letter}</b>.”</div>}
              <div className="mil-q">{q.q}</div>
            </div>
            <div className="mil-opts">
              {q.opts.map((o, i) => {
            const hid = game.hidden.includes(i);
            const cls = game.reveal ? i === q.ans ? "right" : i === game.pick ? "wrong" : "" : game.pick === i ? game.lock ? "locked" : "picked" : "";
            return <button key={i} className={T("mil-opt {0}", cls)} disabled={hid || game.lock} onClick={() => set({
              pick: i
            })}><span>{"ABCD"[i]}:</span>{hid ? "" : o}</button>;
          })}
            </div>
            <div className="mil-final">{game.pick != null && !game.lock && <button className="btn btn-sun btn-lg" onClick={lockIn}>{T("Final answer? 🔒")}</button>}{game.lock && !game.reveal && <span className="suspense">…</span>}</div>
          </>}
      </div>
      <ol className="mil-ladder" reversed>
        {[...PRIZES].map((p, i) => ({
        p,
        i
      })).reverse().map(({
        p,
        i
      }) => <li key={i} className={`${i === game.lvl && !game.over ? "now" : ""} ${i < game.lvl ? "done" : ""} ${SAFE.includes(i) ? "safe" : ""}`}><span>{i + 1}</span>{money(p)}</li>)}
      </ol>
    </div>;
}