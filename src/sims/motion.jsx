/* MOTION SIMS: projectile · race (MRU/MRUV) · free fall · circular · vectors */
import { useRef, useState } from "react";
import { C, useCanvas, useLive, clear, grid, arrow, text, mono, circle, rrect, plot, glow, noGlow, Slider, Seg, Check, SimFrame, f1 } from "./kit";

const PLANETS = { Earth: 9.8, Moon: 1.6, Mars: 3.7, Jupiter: 24.8 };
const planetSeg = Object.keys(PLANETS).map((k) => [k, { Earth: "🌍 Earth", Moon: "🌙 Moon", Mars: "🔴 Mars", Jupiter: "🪐 Jupiter" }[k]]);

/* =====================================================================
   PROJECTILE CANNON
   ===================================================================== */
export function Projectile({ compact }) {
  const [v0, setV0] = useState(20), [ang, setAng] = useState(45), [h0, setH0] = useState(0), [pl, setPl] = useState("Earth");
  const [vectors, setVectors] = useState(true), [keep, setKeep] = useState(true), [predict, setPredict] = useState(false);
  const S = useRef({ t: 0, flying: false, trails: [], cur: [], target: 28, hit: null });
  const [live, push] = useLive({ t: 0, x: 0, y: h0 });
  const g = PLANETS[pl], th = (ang * Math.PI) / 180;
  const vx = v0 * Math.cos(th), vy0 = v0 * Math.sin(th);
  const tf = (vy0 + Math.sqrt(vy0 * vy0 + 2 * g * h0)) / g;
  const R = vx * tf, H = h0 + (vy0 * vy0) / (2 * g);

  const fire = () => {
    const s = S.current;
    if (s.cur.length && keep) s.trails.push({ pts: s.cur, color: s.trails.length % 2 ? C.lilac : C.teal });
    if (s.trails.length > 5) s.trails.shift();
    s.cur = []; s.t = 0; s.flying = true; s.hit = null;
  };
  const reset = () => { S.current = { ...S.current, t: 0, flying: false, trails: [], cur: [], hit: null }; push({ t: 0, x: 0, y: h0 }, true); };
  const newTarget = () => { S.current.target = 10 + Math.round(Math.random() * 45); S.current.hit = null; };

  const ref = useCanvas((ctx, w, h, _t, dt) => {
    const s = S.current;
    clear(ctx, w, h);
    const ground = h - 46, left = 70;
    const maxX = Math.max(30, R * 1.08, s.target + 6, ...s.trails.flatMap((tr) => tr.pts.map((p) => p[0] + 3)));
    const maxY = Math.max(12, H * 1.15, ...s.trails.flatMap((tr) => tr.pts.map((p) => p[1] + 2)));
    const sc = Math.min((w - left - 30) / maxX, (ground - 30) / maxY);
    const X = (x) => left + x * sc, Y = (y) => ground - y * sc;
    grid(ctx, w, h, Math.max(16, sc * 5), left, ground);
    // ground & ruler
    ctx.fillStyle = "#0d0f2b"; ctx.fillRect(0, ground, w, h - ground);
    ctx.strokeStyle = C.dim; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, ground); ctx.lineTo(w, ground); ctx.stroke();
    const stepM = maxX > 120 ? 20 : maxX > 50 ? 10 : 5;
    for (let m = 0; m <= maxX; m += stepM) { ctx.fillStyle = C.dim; ctx.fillRect(X(m), ground, 1.5, 7); mono(ctx, m + " m", X(m), ground + 18, C.dim, 10, "center"); }
    // platform
    if (h0 > 0) { rrect(ctx, left - 26, Y(h0), 30, h0 * sc, 4, "#2a2e6e"); }
    // target
    const tx = X(s.target);
    ctx.fillStyle = C.red; ctx.fillRect(tx - 1, ground - 34, 2, 34);
    ctx.beginPath(); ctx.moveTo(tx + 1, ground - 34); ctx.lineTo(tx + 20, ground - 28); ctx.lineTo(tx + 1, ground - 22); ctx.fill();
    circle(ctx, tx, ground, 10, null, C.red, 2); circle(ctx, tx, ground, 4, C.red);
    // old trails
    s.trails.forEach((tr) => { ctx.strokeStyle = tr.color; ctx.globalAlpha = 0.5; ctx.lineWidth = 2; ctx.setLineDash([2, 6]); ctx.beginPath(); tr.pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; });
    // prediction
    if (predict) {
      ctx.strokeStyle = C.dim; ctx.setLineDash([6, 6]); ctx.lineWidth = 1.5; ctx.beginPath();
      for (let i = 0; i <= 60; i++) { const tt = (tf * i) / 60; const x = vx * tt, y = h0 + vy0 * tt - 0.5 * g * tt * tt; i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); }
      ctx.stroke(); ctx.setLineDash([]);
      text(ctx, `H = ${f1(H)} m`, X(vx * (vy0 / g)), Y(H) - 14, C.dim, 11, "center");
    }
    // cannon
    ctx.save(); ctx.translate(X(0), Y(h0)); ctx.rotate(-th);
    rrect(ctx, -8, -9, 46, 18, 8, C.tang); rrect(ctx, 30, -11, 12, 22, 4, "#ff8b6e"); ctx.restore();
    circle(ctx, X(0), Y(h0), 13, "#2a2e6e", C.chalk, 2);
    // flight
    if (s.flying) {
      s.t += dt;
      const t = Math.min(s.t, tf);
      const x = vx * t, y = Math.max(0, h0 + vy0 * t - 0.5 * g * t * t);
      s.cur.push([x, y]);
      if (s.t >= tf) {
        s.flying = false;
        const d = Math.abs(R - s.target);
        s.hit = d < 1.5 ? "hit" : R < s.target ? "short" : "long";
      }
      push({ t, x, y }, !s.flying);
    }
    // current trail
    if (s.cur.length) {
      ctx.strokeStyle = C.sun; ctx.lineWidth = 3; ctx.beginPath(); s.cur.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.stroke();
      s.cur.forEach(([x, y], i) => { if (i % 6 === 0) circle(ctx, X(x), Y(y), 2.5, C.chalk); });
      const [x, y] = s.cur[s.cur.length - 1];
      const t = Math.min(s.t, tf), vy = vy0 - g * t;
      glow(ctx, C.sun); circle(ctx, X(x), Y(y), 9, C.sun); noGlow(ctx);
      if (vectors) {
        const k = 2.2;
        arrow(ctx, X(x), Y(y), X(x) + vx * k, Y(y), C.teal, 3, "vx");
        arrow(ctx, X(x), Y(y), X(x), Y(y) - vy * k, C.pink, 3, "vy");
        arrow(ctx, X(x), Y(y), X(x) + vx * k, Y(y) - vy * k, C.sun, 2, "v");
      }
    }
    if (s.hit) {
      const msg = s.hit === "hit" ? "🎯 BULLSEYE!" : s.hit === "short" ? `Too short by ${f1(s.target - R)} m` : `Too long by ${f1(R - s.target)} m`;
      rrect(ctx, w / 2 - 130, 18, 260, 44, 22, s.hit === "hit" ? C.teal : "rgba(255,90,54,.9)");
      text(ctx, msg, w / 2, 40, s.hit === "hit" ? C.board : C.chalk, 18, "center", 800, "Bricolage Grotesque");
    }
    mono(ctx, `g = ${g} m/s²`, w - 14, 18, C.dim, 11, "right");
  }, []);

  return (
    <SimFrame compact={compact} canvasRef={ref} onPlay={fire} playing={false} onReset={reset} hint="Press ▶ to fire · try to hit the red flag"
      readouts={[
        { l: "Range R", v: f1(R), u: "m", c: C.sun }, { l: "Max height H", v: f1(H), u: "m", c: C.teal },
        { l: "Flight time", v: f1(tf, 2), u: "s", c: C.lilac }, { l: "t now", v: f1(live.t, 2), u: "s" },
        { l: "vx (constant)", v: f1(vx), u: "m/s", c: C.teal }, { l: "vy₀", v: f1(vy0), u: "m/s", c: C.pink },
      ]}
      controls={<>
        <Slider label="Launch speed v₀" value={v0} min={5} max={40} unit="m/s" onChange={setV0} color={C.sun} />
        <Slider label="Angle θ" value={ang} min={0} max={90} unit="°" onChange={setAng} color={C.tang} />
        <Slider label="Launch height" value={h0} min={0} max={30} unit="m" onChange={setH0} color={C.lilac} />
        <Seg value={pl} options={planetSeg} onChange={setPl} />
        <div className="sim-row">
          <Check label="Vectors" value={vectors} onChange={setVectors} />
          <Check label="Keep trails" value={keep} onChange={setKeep} />
          <Check label="Prediction" value={predict} onChange={setPredict} />
        </div>
        <div className="sim-row"><button className="sim-btn" onClick={fire}>🔥 Fire!</button><button className="sim-btn ghost" onClick={newTarget}>🎯 New target</button></div>
      </>}
      formula={"R = \\dfrac{v_0^2\\sin 2\\theta}{g}\\quad H = \\dfrac{v_0^2\\sin^2\\theta}{2g}"}
    />
  );
}

/* =====================================================================
   RACE: two cars, MRU or MRUV, with live x–t and v–t graphs
   ===================================================================== */
export function Race({ compact }) {
  const [vA, setVA] = useState(5), [aA, setAA] = useState(0), [vB, setVB] = useState(0), [aB, setAB] = useState(2), [x0B, setX0B] = useState(0);
  const [playing, setPlaying] = useState(false);
  const S = useRef({ t: 0, hA: [], hB: [] });
  const [live, push] = useLive({ t: 0 });
  const L = 100, TMAX = 20;
  const pos = (x0, v, a, t) => x0 + v * t + 0.5 * a * t * t;
  const reset = () => { S.current = { t: 0, hA: [], hB: [] }; setPlaying(false); push({ t: 0 }, true); };

  const ref = useCanvas((ctx, w, h, _t, dt) => {
    const s = S.current;
    clear(ctx, w, h);
    if (playing && s.t < TMAX) {
      s.t = Math.min(TMAX, s.t + dt);
      s.hA.push([s.t, pos(0, vA, aA, s.t), vA + aA * s.t]); s.hB.push([s.t, pos(x0B, vB, aB, s.t), vB + aB * s.t]);
      push({ t: s.t });
      if (s.t >= TMAX) setPlaying(false);
    }
    const t = s.t;
    const xa = pos(0, vA, aA, t), xb = pos(x0B, vB, aB, t);
    // track
    const top = 18, laneH = 46, X0 = 40, W = w - 80, sx = (x) => X0 + (Math.max(-10, Math.min(L, x)) / L) * W;
    rrect(ctx, 10, top - 6, w - 20, laneH * 2 + 26, 14, "#0d0f2b");
    for (let m = 0; m <= L; m += 10) { ctx.fillStyle = C.faint; ctx.fillRect(sx(m), top, 1, laneH * 2 + 6); mono(ctx, m + "", sx(m), top + laneH * 2 + 14, C.dim, 10, "center"); }
    ctx.fillStyle = "repeating-linear-gradient"; // no-op
    ctx.fillStyle = C.chalk; for (let i = 0; i < 8; i++) { ctx.fillStyle = i % 2 ? C.chalk : C.board; ctx.fillRect(sx(L) - 3, top + i * 12, 6, 12); }
    const car = (x, y, col, label) => {
      const X = sx(x);
      rrect(ctx, X - 30, y + 8, 34, 22, 7, col); rrect(ctx, X - 22, y + 2, 18, 12, 5, col);
      circle(ctx, X - 22, y + 30, 5, "#0d0f2b", C.chalk, 1.5); circle(ctx, X - 4, y + 30, 5, "#0d0f2b", C.chalk, 1.5);
      text(ctx, label, X - 13, y + 19, C.board, 12, "center", 800);
    };
    car(xa, top + 2, C.sun, "A"); car(xb, top + laneH + 4, C.teal, "B");
    // graphs
    const gy = top + laneH * 2 + 34, gh = h - gy - 10, gw = (w - 30) / 2;
    const xmax = Math.max(5, t);
    plot(ctx, { x: 10, y: gy, w: gw, h: gh }, [{ pts: s.hA.map((p) => [p[0], p[1]]), color: C.sun, label: "A" }, { pts: s.hB.map((p) => [p[0], p[1]]), color: C.teal, label: "B" }], { title: "x – t  (m)", xmax, ymin: Math.min(0, x0B), ymax: Math.max(L, ...s.hA.map((p) => p[1]), ...s.hB.map((p) => p[1])), xl: "t (s)" });
    const vmax = Math.max(10, vA + aA * TMAX * 0.5, vB + aB * TMAX * 0.5);
    plot(ctx, { x: 20 + gw, y: gy, w: gw, h: gh }, [{ pts: s.hA.map((p) => [p[0], p[2]]), color: C.sun, label: "A" }, { pts: s.hB.map((p) => [p[0], p[2]]), color: C.teal, label: "B" }], { title: "v – t  (m/s)", xmax, ymin: Math.min(0, vA, vB, ...s.hA.map((p) => p[2]), ...s.hB.map((p) => p[2])), ymax: Math.max(vmax, ...s.hA.map((p) => p[2]), ...s.hB.map((p) => p[2])), xl: "t (s)" });
  }, [playing, vA, aA, vB, aB, x0B]);

  const t = live.t;
  return (
    <SimFrame compact={compact} canvasRef={ref} playing={playing} onPlay={() => setPlaying((p) => !p)} onReset={reset}
      readouts={[
        { l: "time t", v: f1(t, 1), u: "s" },
        { l: "x A", v: f1(pos(0, vA, aA, t)), u: "m", c: C.sun }, { l: "x B", v: f1(pos(x0B, vB, aB, t)), u: "m", c: C.teal },
        { l: "v A", v: f1(vA + aA * t), u: "m/s", c: C.sun }, { l: "v B", v: f1(vB + aB * t), u: "m/s", c: C.teal },
      ]}
      controls={<>
        <div className="sim-group" style={{ "--c": C.sun }}><b>Car A</b>
          <Slider label="initial velocity" value={vA} min={-10} max={20} step={0.5} unit="m/s" onChange={setVA} color={C.sun} />
          <Slider label="acceleration" value={aA} min={-3} max={5} step={0.5} unit="m/s²" onChange={setAA} color={C.sun} />
        </div>
        <div className="sim-group" style={{ "--c": C.teal }}><b>Car B</b>
          <Slider label="start position" value={x0B} min={-10} max={50} unit="m" onChange={setX0B} color={C.teal} />
          <Slider label="initial velocity" value={vB} min={-10} max={20} step={0.5} unit="m/s" onChange={setVB} color={C.teal} />
          <Slider label="acceleration" value={aB} min={-3} max={5} step={0.5} unit="m/s²" onChange={setAB} color={C.teal} />
        </div>
        <p className="sim-note">a = 0 → MRU (straight x–t line) · a ≠ 0 → MRUV (parabola)</p>
      </>}
      formula={"x = x_0 + v_0 t + \\tfrac{1}{2}at^2"}
    />
  );
}

/* =====================================================================
   FREE FALL: Earth vs another planet, side by side
   ===================================================================== */
export function FreeFall({ compact }) {
  const [hgt, setH] = useState(45), [vUp, setVUp] = useState(0), [pl, setPl] = useState("Moon"), [m, setM] = useState(1);
  const [playing, setPlaying] = useState(false);
  const S = useRef({ t: 0, hist: [] });
  const [live, push] = useLive({ t: 0 });
  const gE = 9.8, gP = PLANETS[pl];
  const tGround = (g) => (vUp + Math.sqrt(vUp * vUp + 2 * g * hgt)) / g;
  const tE = tGround(gE), tP = tGround(gP);
  const yAt = (g, t) => Math.max(0, hgt + vUp * t - 0.5 * g * t * t);
  const reset = () => { S.current = { t: 0, hist: [] }; setPlaying(false); push({ t: 0 }, true); };

  const ref = useCanvas((ctx, w, h, _t, dt) => {
    const s = S.current;
    clear(ctx, w, h);
    const tEnd = Math.max(tE, tP);
    if (playing) {
      s.t = Math.min(tEnd, s.t + dt);
      s.hist.push([s.t, yAt(gE, s.t), yAt(gP, s.t)]);
      push({ t: s.t });
      if (s.t >= tEnd) setPlaying(false);
    }
    const t = s.t;
    const colW = Math.min(150, w * 0.18), top = 40, bot = h - 40;
    const maxY = hgt + (vUp * vUp) / (2 * gP) + 2;
    const Y = (y) => bot - (y / maxY) * (bot - top);
    // ruler
    for (let y = 0; y <= maxY; y += maxY > 60 ? 10 : 5) { ctx.fillStyle = C.faint; ctx.fillRect(20, Y(y), colW * 2 + 40, 1); mono(ctx, y + " m", 16, Y(y), C.dim, 10, "right"); }
    [[gE, "🌍 Earth", C.sun, 40], [gP, planetSeg.find((p) => p[0] === pl)[1], C.teal, 70 + colW]].forEach(([g, name, col, x0]) => {
      rrect(ctx, x0, top - 10, colW, bot - top + 20, 14, "rgba(255,255,255,.03)", C.faint, 1);
      text(ctx, name, x0 + colW / 2, top - 22, col, 13, "center", 800);
      const y = yAt(g, t);
      glow(ctx, col); circle(ctx, x0 + colW / 2, Y(y) - 10, 8 + m * 1.5, col); noGlow(ctx);
      const v = vUp - g * Math.min(t, tGround(g));
      if (t > 0 && y > 0) arrow(ctx, x0 + colW / 2 + 18, Y(y) - 10, x0 + colW / 2 + 18, Y(y) - 10 - v * 2.2, C.pink, 2.5, "v");
      mono(ctx, `g = ${g}`, x0 + colW / 2, bot + 16, C.dim, 11, "center");
    });
    ctx.fillStyle = "#0d0f2b"; ctx.fillRect(30, bot, colW * 2 + 50, 4);
    const gx = 100 + colW * 2, gw = w - gx - 10;
    if (gw > 140) {
      const half = (h - 30) / 2;
      plot(ctx, { x: gx, y: 10, w: gw, h: half }, [{ pts: s.hist.map((p) => [p[0], p[1]]), color: C.sun, label: "Earth" }, { pts: s.hist.map((p) => [p[0], p[2]]), color: C.teal, label: pl }], { title: "height y (m)", xmax: Math.max(2, tEnd), ymax: maxY, xl: "t (s)" });
      plot(ctx, { x: gx, y: 20 + half, w: gw, h: half }, [{ pts: s.hist.map((p) => [p[0], vUp - gE * Math.min(p[0], tE)]), color: C.sun }, { pts: s.hist.map((p) => [p[0], vUp - gP * Math.min(p[0], tP)]), color: C.teal }], { title: "velocity v (m/s)", xmax: Math.max(2, tEnd), ymin: Math.min(-5, vUp - gE * tE), ymax: Math.max(5, vUp), xl: "t (s)" });
    }
  }, [playing, hgt, vUp, pl, m]);

  return (
    <SimFrame compact={compact} canvasRef={ref} playing={playing} onPlay={() => setPlaying((p) => !p)} onReset={reset}
      readouts={[
        { l: "t now", v: f1(live.t, 2), u: "s" },
        { l: "Earth lands at", v: f1(tE, 2), u: "s", c: C.sun }, { l: `${pl} lands at`, v: f1(tP, 2), u: "s", c: C.teal },
        { l: "Earth impact v", v: f1(Math.sqrt(vUp * vUp + 2 * gE * hgt)), u: "m/s", c: C.sun },
      ]}
      controls={<>
        <Slider label="Height" value={hgt} min={5} max={100} unit="m" onChange={(v) => { setH(v); reset(); }} color={C.sun} />
        <Slider label="Initial speed UP (vertical throw)" value={vUp} min={0} max={25} unit="m/s" onChange={(v) => { setVUp(v); reset(); }} color={C.pink} />
        <Slider label="Mass (does it matter?)" value={m} min={1} max={10} unit="kg" onChange={setM} color={C.lilac} />
        <Seg value={pl} options={planetSeg.filter((p) => p[0] !== "Earth")} onChange={(v) => { setPl(v); reset(); }} />
      </>}
      formula={"y = y_0 + v_0t - \\tfrac{1}{2}gt^2 \\qquad v = v_0 - gt"}
    />
  );
}

/* =====================================================================
   CIRCULAR MOTION (MCU) with "release" button → inertia
   ===================================================================== */
export function Circular({ compact }) {
  const [r, setR] = useState(2), [T, setT] = useState(2), [showV, setShowV] = useState(true), [showA, setShowA] = useState(true);
  const S = useRef({ phi: 0, free: null, trail: [] });
  const v = (2 * Math.PI * r) / T, w0 = (2 * Math.PI) / T, ac = (v * v) / r;
  const release = () => { const s = S.current; s.free = { x: r * Math.cos(s.phi), y: r * Math.sin(s.phi), vx: -v * Math.sin(s.phi), vy: v * Math.cos(s.phi) }; };
  const reset = () => { S.current = { phi: 0, free: null, trail: [] }; };

  const ref = useCanvas((ctx, w, h, _t, dt) => {
    const s = S.current;
    clear(ctx, w, h); grid(ctx, w, h, 40);
    const cx = w / 2, cy = h / 2, sc = (Math.min(w, h) * 0.32) / 5;
    circle(ctx, cx, cy, r * sc, null, C.faint, 2);
    circle(ctx, cx, cy, 5, C.chalk);
    if (!s.free) {
      s.phi += w0 * dt;
      const x = cx + r * sc * Math.cos(s.phi), y = cy - r * sc * Math.sin(s.phi);
      ctx.strokeStyle = C.dim; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]);
      s.trail.push([x, y]); if (s.trail.length > 40) s.trail.shift();
      s.trail.forEach(([a, b], i) => circle(ctx, a, b, 2 + i / 14, `rgba(255,193,46,${i / 60})`));
      if (showV) arrow(ctx, x, y, x - Math.sin(s.phi) * v * 6, y - Math.cos(s.phi) * v * 6, C.teal, 3, "v");
      if (showA) arrow(ctx, x, y, x + (cx - x) * Math.min(0.9, ac / 30 + 0.25), y + (cy - y) * Math.min(0.9, ac / 30 + 0.25), C.pink, 3, "a꜀");
      glow(ctx, C.sun); circle(ctx, x, y, 12, C.sun); noGlow(ctx);
    } else {
      const f = s.free; f.x += f.vx * dt; f.y += f.vy * dt;
      const x = cx + f.x * sc, y = cy - f.y * sc;
      arrow(ctx, x, y, x + f.vx * 6, y - f.vy * 6, C.teal, 3, "v");
      glow(ctx, C.sun); circle(ctx, x, y, 12, C.sun); noGlow(ctx);
      text(ctx, "No centripetal force → straight line (inertia!)", w / 2, 26, C.sun, 15, "center", 700);
      if (Math.abs(f.x) > 12 || Math.abs(f.y) > 12) reset();
    }
    mono(ctx, `r = ${r} m`, cx + 8, cy + 16, C.dim, 11);
  }, [r, T, showV, showA]);

  return (
    <SimFrame compact={compact} canvasRef={ref} onReset={reset}
      readouts={[
        { l: "speed v", v: f1(v, 2), u: "m/s", c: C.teal }, { l: "ω", v: f1(w0, 2), u: "rad/s" },
        { l: "frequency f", v: f1(1 / T, 2), u: "Hz" }, { l: "a꜀ = v²/r", v: f1(ac, 2), u: "m/s²", c: C.pink },
      ]}
      controls={<>
        <Slider label="Radius r" value={r} min={0.5} max={5} step={0.5} unit="m" onChange={setR} color={C.sun} />
        <Slider label="Period T" value={T} min={0.5} max={6} step={0.5} unit="s" onChange={setT} color={C.lilac} />
        <div className="sim-row"><Check label="v vector" value={showV} onChange={setShowV} /><Check label="a꜀ vector" value={showA} onChange={setShowA} /></div>
        <button className="sim-btn" onClick={release}>✂️ Cut the string!</button>
      </>}
      formula={"v = \\dfrac{2\\pi r}{T} \\qquad a_c = \\dfrac{v^2}{r}"}
    />
  );
}

/* =====================================================================
   VECTORS: drag the heads, see head-to-tail, parallelogram, components
   ===================================================================== */
export function Vectors({ compact }) {
  const [A, setA] = useState({ x: 4, y: 2 }), [B, setB] = useState({ x: 1, y: 3 });
  const [mode, setMode] = useState("tail");
  const [comp, setComp] = useState(true);
  const drag = useRef(null), geo = useRef({ cx: 0, cy: 0, u: 40 });
  const Rv = { x: A.x + B.x, y: A.y + B.y };
  const mag = (v) => Math.hypot(v.x, v.y), angD = (v) => ((Math.atan2(v.y, v.x) * 180) / Math.PI);

  const ref = useCanvas((ctx, w, h) => {
    clear(ctx, w, h);
    const u = Math.max(26, Math.min(w, h) / 16); const cx = w * 0.32, cy = h * 0.68;
    geo.current = { cx, cy, u };
    grid(ctx, w, h, u, cx, cy);
    ctx.strokeStyle = C.dim; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
    const P = (v) => [cx + v.x * u, cy - v.y * u];
    const [ax, ay] = P(A), [bx, by] = P(B), [rx, ry] = P(Rv);
    if (mode === "tail") {
      arrow(ctx, cx, cy, ax, ay, C.sun, 4, "A");
      arrow(ctx, ax, ay, ax + B.x * u, ay - B.y * u, C.teal, 4, "B");
      ctx.globalAlpha = 0.3; arrow(ctx, cx, cy, bx, by, C.teal, 2); ctx.globalAlpha = 1;
    } else {
      arrow(ctx, cx, cy, ax, ay, C.sun, 4, "A"); arrow(ctx, cx, cy, bx, by, C.teal, 4, "B");
      ctx.strokeStyle = C.dim; ctx.setLineDash([6, 6]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(rx, ry); ctx.lineTo(bx, by); ctx.stroke(); ctx.setLineDash([]);
    }
    glow(ctx, C.tang); arrow(ctx, cx, cy, rx, ry, C.tang, 5, "R"); noGlow(ctx);
    if (comp) {
      ctx.setLineDash([3, 5]); ctx.strokeStyle = C.tang; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx, cy); ctx.moveTo(rx, ry); ctx.lineTo(cx, ry); ctx.stroke(); ctx.setLineDash([]);
      mono(ctx, `Rx = ${f1(Rv.x)}`, (cx + rx) / 2, cy + 14, C.tang, 11, "center"); mono(ctx, `Ry = ${f1(Rv.y)}`, cx - 8, (cy + ry) / 2, C.tang, 11, "right");
    }
    // handles
    circle(ctx, ax, ay, 10, null, C.sun, 2);
    circle(ctx, mode === "tail" ? ax + B.x * u : bx, mode === "tail" ? ay - B.y * u : by, 10, null, C.teal, 2);
    text(ctx, "Drag the circles ✋", 14, 18, C.dim, 12);
  }, [A, B, mode, comp], { animate: false });

  const toUnits = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const { cx, cy, u } = geo.current;
    return { x: Math.round(((e.clientX - r.left - cx) / u) * 2) / 2, y: Math.round(((cy - (e.clientY - r.top)) / u) * 2) / 2 };
  };
  const onPointer = {
    onPointerDown: (e) => {
      const p = toUnits(e);
      const bHead = mode === "tail" ? { x: A.x + B.x, y: A.y + B.y } : B;
      const dA = Math.hypot(p.x - A.x, p.y - A.y), dB = Math.hypot(p.x - bHead.x, p.y - bHead.y);
      drag.current = dA < dB ? "A" : "B";
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerMove: (e) => {
      if (!drag.current) return;
      const p = toUnits(e);
      if (drag.current === "A") setA(p); else setB(mode === "tail" ? { x: p.x - A.x, y: p.y - A.y } : p);
    },
    onPointerUp: () => { drag.current = null; },
  };

  return (
    <SimFrame compact={compact} canvasRef={ref} onPointer={onPointer}
      readouts={[
        { l: "|A|", v: f1(mag(A), 2), u: `∠ ${f1(angD(A), 0)}°`, c: C.sun }, { l: "|B|", v: f1(mag(B), 2), u: `∠ ${f1(angD(B), 0)}°`, c: C.teal },
        { l: "|R| = |A + B|", v: f1(mag(Rv), 2), u: `∠ ${f1(angD(Rv), 0)}°`, c: C.tang }, { l: "A · B", v: f1(A.x * B.x + A.y * B.y, 2), u: "" },
      ]}
      controls={<>
        <Seg value={mode} options={[["tail", "Head-to-tail"], ["para", "Parallelogram"]]} onChange={setMode} />
        <Check label="Show components of R" value={comp} onChange={setComp} />
        <div className="sim-row">
          <button className="sim-btn ghost" onClick={() => { setA({ x: 3, y: 0 }); setB({ x: 0, y: 4 }); }}>3-4-5 ✨</button>
          <button className="sim-btn ghost" onClick={() => { setA({ x: 4, y: 1 }); setB({ x: -4, y: -1 }); }}>Cancel out</button>
        </div>
        <p className="sim-note">A = ({A.x}, {A.y}) · B = ({B.x}, {B.y}) · R = ({Rv.x}, {Rv.y})</p>
      </>}
      formula={"|\\vec R| = \\sqrt{R_x^2 + R_y^2} \\qquad \\vec A\\cdot\\vec B = A_xB_x + A_yB_y"}
    />
  );
}
