/* MATTER & HEAT SIMS: thermometer scales · heat transfer · particle box · buoyancy · gas piston · unit staircase */
import { useMemo, useRef, useState } from "react";
import { C, useCanvas, clear, grid, arrow, text, mono, circle, rrect, plot, glow, noGlow, Slider, Seg, Check, SimFrame, f1 } from "./kit";

const lerpColor = (t) => { // 0 cold blue → 1 hot red
  const a = [123, 147, 255], b = [255, 90, 54], c = a.map((v, i) => Math.round(v + (b[i] - v) * Math.max(0, Math.min(1, t))));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

/* =====================================================================
   THERMOMETER — °C, °F and K side by side
   ===================================================================== */
export function Thermo({ compact }) {
  const [c, setC] = useState(25);
  const F = c * 1.8 + 32, K = c + 273.15;
  const ref = useCanvas((ctx, w, h, t) => {
    clear(ctx, w, h); grid(ctx, w, h, 32);
    const top = 40, bot = h - 70, Y = (cc) => bot - ((cc + 60) / 220) * (bot - top);
    const cols = [["°C", (v) => v, C.sun], ["°F", (v) => v * 1.8 + 32, C.pink], ["K", (v) => v + 273, C.teal]];
    const tw = Math.min(140, w / 5);
    [[100, "water boils"], [37, "human body"], [0, "water freezes"], [-40, "°C = °F !"]].forEach(([v, l]) => {
      ctx.setLineDash([4, 5]); ctx.strokeStyle = C.faint; ctx.beginPath(); ctx.moveTo(30, Y(v)); ctx.lineTo(30 + tw * 3 + 40, Y(v)); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, l, 36 + tw * 3 + 40, Y(v), C.dim, 11);
    });
    cols.forEach(([u, fn, col], i) => {
      const x = 40 + i * (tw + 20) + tw / 2;
      rrect(ctx, x - 14, top - 10, 28, bot - top + 20, 14, "rgba(255,255,255,.06)", C.faint, 1.5);
      glow(ctx, col); rrect(ctx, x - 7, Y(c), 14, bot - Y(c) + 10, 7, col); circle(ctx, x, bot + 22, 20, col); noGlow(ctx);
      for (let v = -60; v <= 160; v += 20) { ctx.fillStyle = C.dim; ctx.fillRect(x + 16, Y(v), 8, 1.5); mono(ctx, Math.round(fn(v)) + "", x + 28, Y(v), C.dim, 9); }
      text(ctx, u, x, top - 24, col, 16, "center", 800, "Bricolage Grotesque");
      mono(ctx, f1(fn(c), 1), x, bot + 22, C.board, 12, "center");
    });
    // water state icon
    const sx = w - Math.min(200, w * 0.28) / 2 - 20, sy = h / 2;
    const state = c < 0 ? "ice" : c < 100 ? "water" : "steam";
    const R = Math.min(80, w * 0.1);
    rrect(ctx, sx - R, sy - R, R * 2, R * 2, 24, "rgba(255,255,255,.04)", C.faint, 1);
    for (let i = 0; i < 25; i++) {
      const gx = (i % 5) - 2, gy = Math.floor(i / 5) - 2, sp = R * 0.34;
      let x = sx + gx * sp, y = sy + gy * sp;
      if (state === "ice") { x += Math.sin(t * 9 + i) * 1.5; y += Math.cos(t * 8 + i) * 1.5; }
      else if (state === "water") { x = sx + Math.sin(t * 0.9 + i * 1.7) * R * 0.8; y = sy + R * 0.25 + Math.cos(t * 1.1 + i * 2.3) * R * 0.5; }
      else { x = sx + Math.sin(t * 2.4 + i * 3.1) * R * 0.85; y = sy + Math.cos(t * 2.1 + i * 1.3) * R * 0.85; }
      circle(ctx, x, y, 5, state === "ice" ? C.cobalt : state === "water" ? "#4fb2ff" : C.chalk);
    }
    text(ctx, state === "ice" ? "🧊 Solid" : state === "water" ? "💧 Liquid" : "♨️ Gas", sx, sy + R + 18, C.chalk, 14, "center", 800);
  }, []);
  return (
    <SimFrame compact={compact} canvasRef={ref}
      readouts={[{ l: "Celsius", v: f1(c, 1), u: "°C", c: C.sun }, { l: "Fahrenheit", v: f1(F, 1), u: "°F", c: C.pink }, { l: "Kelvin", v: f1(K, 1), u: "K", c: C.teal }]}
      controls={<>
        <Slider label="Temperature" value={c} min={-60} max={160} unit="°C" onChange={setC} color={C.tang} />
        <div className="sim-row">
          {[["🥶 −40", -40], ["🧊 0", 0], ["🙂 37", 37], ["♨️ 100", 100]].map(([l, v]) => <button key={l} className="sim-btn ghost" onClick={() => setC(v)}>{l}</button>)}
        </div>
      </>}
      formula={"{}^{\\circ}F = 1.8\\,{}^{\\circ}C + 32 \\qquad K = {}^{\\circ}C + 273"}
    />
  );
}

/* =====================================================================
   HEAT TRANSFER — conduction · convection · radiation
   ===================================================================== */
export function Heat({ compact }) {
  const [mode, setMode] = useState("cond"), [power, setPower] = useState(60), [mat, setMat] = useState(0.9);
  const S = useRef({ T: new Array(40).fill(0), obj: 0 });
  const reset = () => { S.current = { T: new Array(40).fill(0), obj: 0 }; };
  const ref = useCanvas((ctx, w, h, t, dt) => {
    const s = S.current;
    clear(ctx, w, h); grid(ctx, w, h, 36);
    const flame = (x, y, k = 1) => { for (let i = 0; i < 5; i++) { const fx = x + (i - 2) * 9 * k, fy = y - Math.abs(Math.sin(t * 7 + i)) * 10 * k; glow(ctx, C.tang); ctx.fillStyle = i % 2 ? C.sun : C.tang; ctx.beginPath(); ctx.moveTo(fx - 6 * k, y); ctx.quadraticCurveTo(fx, fy - 26 * k * (power / 80), fx + 6 * k, y); ctx.fill(); noGlow(ctx); } };
    if (mode === "cond") {
      const T = s.T, n = T.length, alpha = mat * 120;
      for (let st = 0; st < 6; st++) { const nt = T.slice(); nt[0] = power; for (let i = 1; i < n - 1; i++) nt[i] = T[i] + alpha * (dt / 6) * (T[i - 1] - 2 * T[i] + T[i + 1]) * 0.5; nt[n - 1] = nt[n - 2] * 0.995; for (let i = 0; i < n; i++) T[i] = nt[i]; }
      const x0 = 70, y0 = h / 2 - 26, W = w - 120, cw = W / n;
      T.forEach((v, i) => {
        ctx.fillStyle = lerpColor(v / 100); ctx.fillRect(x0 + i * cw, y0, cw + 1, 52);
        const amp = 1 + (v / 100) * 5; circle(ctx, x0 + i * cw + cw / 2 + Math.sin(t * 20 + i) * amp, y0 + 26 + Math.cos(t * 17 + i * 2) * amp, 3, "rgba(255,255,255,.7)");
      });
      rrect(ctx, x0, y0, W, 52, 6, null, C.chalk, 2);
      flame(x0 + 18, y0 + 92, 1.6);
      text(ctx, "✋", x0 + W + 22, y0 + 26, C.chalk, 26, "center");
      mono(ctx, `hand side: ${f1(T[n - 1], 0)} °C`, x0 + W, y0 + 76, C.pink, 12, "right");
      text(ctx, "Particles bump into their neighbours and pass the energy along", w / 2, 26, C.chalk, 14, "center", 700);
    } else if (mode === "conv") {
      const cx = w / 2, cy = h / 2 + 10, pw = Math.min(380, w * 0.6), ph = Math.min(220, h * 0.55);
      rrect(ctx, cx - pw / 2, cy - ph / 2, pw, ph, 18, "rgba(79,178,255,.12)", C.chalk, 3);
      for (let i = 0; i < 60; i++) {
        const side = i % 2 ? 1 : -1, ph0 = (i / 60) * Math.PI * 2 + t * (0.4 + power / 120);
        const x = cx + side * (pw * 0.24) + Math.cos(ph0) * pw * 0.2 * side, y = cy + Math.sin(ph0) * ph * 0.36;
        const hot = (y - (cy - ph * 0.36)) / (ph * 0.72);
        circle(ctx, x, y, 5, lerpColor(hot));
      }
      arrow(ctx, cx, cy + ph * 0.3, cx, cy - ph * 0.3, C.tang, 3, "hot rises"); arrow(ctx, cx - pw * 0.44, cy - ph * 0.3, cx - pw * 0.44, cy + ph * 0.3, C.cobalt, 3); arrow(ctx, cx + pw * 0.44, cy - ph * 0.3, cx + pw * 0.44, cy + ph * 0.3, C.cobalt, 3, "cold sinks");
      flame(cx, cy + ph / 2 + 40, 1.3);
      text(ctx, "Hot fluid is less dense → rises. Cold fluid sinks → a current forms", w / 2, 24, C.chalk, 14, "center", 700);
    } else {
      const sx = 90, sy = h / 2;
      glow(ctx, C.sun, 40); circle(ctx, sx, sy, 46, C.sun); noGlow(ctx);
      for (let i = 0; i < 7; i++) {
        const yy = sy - 90 + i * 30; ctx.strokeStyle = `rgba(255,193,46,${0.3 + power / 200})`; ctx.lineWidth = 2; ctx.beginPath();
        for (let x = sx + 56; x < w - 140; x += 4) { const y = yy + Math.sin(x * 0.08 - t * 9) * 6; x === sx + 56 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke();
      }
      s.obj += (power * 0.6 * mat - s.obj) * dt * 0.25;
      rrect(ctx, w - 130, sy - 50, 100, 100, 18, lerpColor(s.obj / 60), C.chalk, 2);
      text(ctx, `${f1(20 + s.obj, 0)} °C`, w - 80, sy, C.board, 16, "center", 800);
      text(ctx, "Waves travel even through EMPTY space (vacuum) ☀️ → 🌍", w / 2, 24, C.chalk, 14, "center", 700);
      text(ctx, mat > 0.5 ? "dark surface: absorbs more" : "light surface: reflects more", w - 80, sy + 70, C.dim, 11, "center");
    }
  }, []);
  return (
    <SimFrame compact={compact} canvasRef={ref} onReset={reset}
      readouts={[{ l: "mode", v: { cond: "Conduction", conv: "Convection", rad: "Radiation" }[mode], u: "", c: C.tang }, { l: "needs matter?", v: mode === "rad" ? "No" : "Yes", u: "", c: C.teal }, { l: "example", v: { cond: "🍳 pan handle", conv: "🫕 boiling pot", rad: "☀️ sunlight" }[mode], u: "" }]}
      controls={<>
        <Seg value={mode} options={[["cond", "🔥 Conduction"], ["conv", "🌀 Convection"], ["rad", "☀️ Radiation"]]} onChange={(v) => { setMode(v); reset(); }} />
        <Slider label="Heat source power" value={power} min={10} max={100} unit="%" onChange={setPower} color={C.tang} />
        {mode === "cond" && <Seg value={mat} options={[[0.9, "🥉 Copper"], [0.45, "⚙️ Iron"], [0.08, "🪵 Wood"]]} onChange={(v) => { setMat(v); reset(); }} />}
        {mode === "rad" && <Seg value={mat} options={[[0.9, "⬛ Dark roof"], [0.3, "⬜ White roof"]]} onChange={(v) => { setMat(v); reset(); }} />}
      </>}
      formula={"Q = m\\,c\\,\\Delta T"}
    />
  );
}

/* =====================================================================
   PARTICLE BOX — states of matter & kinetic theory
   ===================================================================== */
export function Particles({ compact }) {
  const [T, setT] = useState(-20);
  const N = 64;
  const S = useRef(null);
  if (!S.current) S.current = Array.from({ length: N }, (_, i) => ({ x: Math.random(), y: Math.random(), vx: Math.random() - 0.5, vy: Math.random() - 0.5, i }));
  const state = T < 0 ? "Solid" : T < 100 ? "Liquid" : "Gas";
  const ref = useCanvas((ctx, w, h, t, dt) => {
    clear(ctx, w, h);
    const bw = Math.min(w * 0.55, h - 40), bx = 20, by = (h - bw) / 2;
    rrect(ctx, bx, by, bw, bw, 16, "rgba(255,255,255,.03)", C.chalk, 2);
    const speed = Math.sqrt(Math.max(5, T + 273)) / 16;
    const cols = 8, cell = bw / (cols + 1);
    S.current.forEach((p) => {
      let X, Y;
      if (T < 0) {
        const lx = (p.i % cols) + 1, ly = Math.floor(p.i / cols) + 1, amp = 1 + (T + 60) / 14;
        X = bx + lx * cell + Math.sin(t * 14 + p.i * 1.3) * amp; Y = by + ly * cell * 0.62 + bw * 0.38 + Math.cos(t * 13 + p.i) * amp - cell * 0.3;
        p.x = (X - bx) / bw; p.y = (Y - by) / bw;
      } else {
        const floor = T < 100 ? 0.45 : 0;
        p.x += p.vx * speed * dt; p.y += p.vy * speed * dt;
        if (p.x < 0.03 || p.x > 0.97) { p.vx *= -1; p.x = Math.max(0.03, Math.min(0.97, p.x)); }
        if (p.y < 0.03 + floor) { p.vy = Math.abs(p.vy); p.y = Math.max(p.y, 0.03 + floor * 0.98); }
        if (p.y > 0.97) { p.vy = -Math.abs(p.vy); p.y = 0.97; }
        if (T < 100) { p.vx += (Math.random() - 0.5) * 0.4 * dt * 10; p.vy += (Math.random() - 0.5) * 0.4 * dt * 10; const m = Math.hypot(p.vx, p.vy) || 1; p.vx /= m * 1.4; p.vy /= m * 1.4; }
        X = bx + p.x * bw; Y = by + p.y * bw;
      }
      circle(ctx, X, Y, bw / 34, lerpColor((T + 60) / 220));
    });
    if (T >= 0 && T < 100) { ctx.fillStyle = "rgba(79,178,255,.08)"; ctx.fillRect(bx + 2, by + bw * 0.45, bw - 4, bw * 0.55 - 2); }
    text(ctx, state === "Solid" ? "🧊 SOLID — particles vibrate in place" : state === "Liquid" ? "💧 LIQUID — particles slide past each other" : "♨️ GAS — particles fly freely", bx + bw / 2, by - 12 < 12 ? 14 : by - 12, C.chalk, 13, "center", 700);
    // heating curve
    const gx = bx + bw + 20, gw = w - gx - 10;
    if (gw > 140) {
      const pts = [[0, -60], [12, 0], [30, 0], [45, 100], [85, 100], [100, 160]];
      const Q = T < 0 ? ((T + 60) / 60) * 12 : T < 100 ? 30 + (T / 100) * 15 : 85 + ((T - 100) / 60) * 15;
      plot(ctx, { x: gx, y: by, w: gw, h: bw }, [{ pts: pts.map(([q, tt]) => [q, tt]), color: C.dim, width: 2 }, { pts: [[Q, T]], color: C.tang }], { title: "heating curve of water", xmax: 100, ymin: -60, ymax: 160, xl: "energy added →" });
      mono(ctx, "melting plateau", gx + 50 + gw * 0.15, by + bw - (60 / 220) * (bw - 44) - 30, C.dim, 10);
    }
  }, []);
  return (
    <SimFrame compact={compact} canvasRef={ref}
      readouts={[{ l: "temperature", v: T, u: "°C", c: C.tang }, { l: "in kelvin", v: T + 273, u: "K" }, { l: "state", v: state, u: "", c: C.teal }, { l: "relative particle speed", v: f1(Math.sqrt((T + 273) / 273), 2), u: "×" }]}
      controls={<>
        <Slider label="Temperature" value={T} min={-60} max={160} unit="°C" onChange={setT} color={C.tang} />
        <div className="sim-row">{[["🧊", -30], ["💧", 40], ["♨️", 140]].map(([l, v]) => <button key={l} className="sim-btn ghost" onClick={() => setT(v)}>{l} {v} °C</button>)}</div>
        <p className="sim-note">Temperature = average kinetic energy of the particles.</p>
      </>}
      formula={"\\bar{E}_k \\propto T\\,(K)"}
    />
  );
}

/* =====================================================================
   DENSITY & BUOYANCY — float or sink
   ===================================================================== */
const LIQ = [["Oil", 0.92, "#f2c14e"], ["Water", 1.0, "#4fb2ff"], ["Sea water", 1.03, "#2fd4b5"], ["Honey", 1.42, "#e8913a"], ["Mercury", 13.6, "#c7c9d6"]];
const SOL = [["Cork", 0.24], ["Ice", 0.92], ["Wood", 0.6], ["Plastic", 1.2], ["Aluminium", 2.7], ["Iron", 7.9], ["Gold", 19.3]];
export function Density({ compact }) {
  const [rho, setRho] = useState(0.6), [liq, setLiq] = useState(1), [V, setV] = useState(1000);
  const S = useRef({ y: 0 });
  const L = LIQ[liq], ro = rho, rl = L[1];
  const frac = ro < rl ? ro / rl : 1;
  const m = (ro * V) / 1000, W = m * 9.8, E = (rl * V * frac) / 1000 * 9.8;
  const ref = useCanvas((ctx, w, h, t, dt) => {
    clear(ctx, w, h);
    const tw = Math.min(w * 0.6, 420), tx = (w - tw) / 2 - 40, ty = 60, th = h - 100, surf = ty + th * 0.3;
    const bs = Math.min(150, 44 + Math.cbrt(V) * 4);
    const target = ro < rl ? surf - bs + bs * frac : ty + th - bs - 4;
    S.current.y += (target - S.current.y) * Math.min(1, dt * 2.5);
    if (S.current.y === 0) S.current.y = ty;
    ctx.fillStyle = L[2]; ctx.globalAlpha = 0.35; ctx.fillRect(tx, surf + Math.sin(t * 2) * 2, tw, ty + th - surf); ctx.globalAlpha = 1;
    rrect(ctx, tx, ty, tw, th, 10, null, C.chalk, 3);
    const bx = tx + tw / 2 - bs / 2, by = S.current.y + Math.sin(t * 2) * (ro < rl ? 2 : 0);
    rrect(ctx, bx, by, bs, bs, 10, lerpColor(ro / 8), C.chalk, 2);
    text(ctx, `${ro} g/cm³`, bx + bs / 2, by + bs / 2, C.board, 12, "center", 800);
    arrow(ctx, bx + bs / 2 - 14, by + bs / 2, bx + bs / 2 - 14, by + bs / 2 + Math.min(150, 20 + W * 4), C.pink, 4, "W");
    arrow(ctx, bx + bs / 2 + 14, by + bs / 2, bx + bs / 2 + 14, by + bs / 2 - Math.min(150, 20 + E * 4), C.teal, 4, "E");
    text(ctx, `${L[0]} · ${rl} g/cm³`, tx + 12, surf + 20, C.chalk, 13, "left", 700);
    const verdict = ro < rl ? `FLOATS — ${f1(frac * 100, 0)}% under the surface` : ro === rl ? "Neutral — it hovers" : "SINKS";
    glow(ctx, ro < rl ? C.teal : C.pink); text(ctx, verdict, w / 2 - 40, 30, ro < rl ? C.teal : C.pink, 18, "center", 800, "Bricolage Grotesque"); noGlow(ctx);
  }, []);
  return (
    <SimFrame compact={compact} canvasRef={ref}
      readouts={[
        { l: "mass m = ρV", v: f1(m, 2), u: "kg" }, { l: "weight W", v: f1(W, 1), u: "N", c: C.pink },
        { l: "buoyant force E", v: f1(E, 1), u: "N", c: C.teal }, { l: "submerged", v: f1(frac * 100, 0), u: "%", c: C.sun },
      ]}
      controls={<>
        <Slider label="Object density ρ" value={rho} min={0.1} max={20} step={0.01} unit="g/cm³" onChange={setRho} color={C.tang} />
        <div className="sim-keys">{SOL.map(([n, d]) => <button key={n} onClick={() => setRho(d)}>{n}</button>)}</div>
        <Slider label="Volume V" value={V} min={125} max={8000} step={125} unit="cm³" onChange={setV} color={C.lilac} />
        <b className="sim-label">Liquid</b>
        <Seg value={liq} options={LIQ.map((l, i) => [i, l[0]])} onChange={setLiq} />
      </>}
      formula={"\\rho = \\dfrac{m}{V} \\qquad E = \\rho_{liquid}\\,g\\,V_{sub}"}
    />
  );
}

/* =====================================================================
   GAS PISTON — Boyle, Charles, Gay-Lussac, ideal gas
   ===================================================================== */
export function Gas({ compact }) {
  const [law, setLaw] = useState("boyle");
  const [T, setT] = useState(300), [V, setV] = useState(20), [n, setN] = useState(1), [Pfix] = useState(1.23);
  const Rg = 0.082;
  // depending on the law, one variable is computed
  const Vv = law === "charles" ? (n * Rg * T) / Pfix : V;
  const P = (n * Rg * T) / Vv;
  const N = Math.round(20 + n * 30);
  const S = useRef([]);
  if (S.current.length !== N) S.current = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), a: Math.random() * Math.PI * 2 }));
  const hits = useRef(0);
  const ref = useCanvas((ctx, w, h, t, dt) => {
    clear(ctx, w, h);
    const cw = Math.min(w * 0.5, 320), cx = 30, cyB = h - 30, maxH = h - 90;
    const ch = Math.max(40, (Math.min(50, Vv) / 50) * maxH);
    const top = cyB - ch;
    rrect(ctx, cx - 6, 30, cw + 12, cyB - 24, 10, null, C.faint, 2);
    ctx.fillStyle = lerpColor((T - 100) / 600); ctx.globalAlpha = 0.12; ctx.fillRect(cx, top, cw, ch); ctx.globalAlpha = 1;
    rrect(ctx, cx - 4, top - 16, cw + 8, 16, 4, C.cobalt); ctx.fillStyle = C.cobalt; ctx.fillRect(cx + cw / 2 - 6, 20, 12, top - 36);
    const sp = Math.sqrt(T / 300) * 0.9;
    S.current.forEach((p) => {
      p.x += Math.cos(p.a) * sp * dt; p.y += Math.sin(p.a) * sp * dt * (maxH / ch);
      if (p.x < 0 || p.x > 1) { p.a = Math.PI - p.a; p.x = Math.max(0, Math.min(1, p.x)); hits.current++; }
      if (p.y < 0 || p.y > 1) { p.a = -p.a; p.y = Math.max(0, Math.min(1, p.y)); hits.current++; }
      circle(ctx, cx + 6 + p.x * (cw - 12), top + 6 + p.y * (ch - 12), 4, lerpColor((T - 100) / 600));
    });
    // gauge
    const gx = cx + cw + 70, gy = 80, gr = 46;
    circle(ctx, gx, gy, gr, "#0d0f2b", C.chalk, 3);
    const ang = Math.PI * 0.75 + Math.min(1, P / 6) * Math.PI * 1.5;
    arrow(ctx, gx, gy, gx + Math.cos(ang) * gr * 0.8, gy + Math.sin(ang) * gr * 0.8, C.tang, 3);
    mono(ctx, `${f1(P, 2)} atm`, gx, gy + gr + 14, C.tang, 13, "center");
    if (law === "boyle" || law === "free") text(ctx, "🔥 " + T + " K", cx + cw / 2, cyB + 14, C.tang, 12, "center", 700);
    // P–V or V–T plot
    const px = cx + cw + 20, pw = w - px - 10, py = gy + gr + 34, phh = h - py - 10;
    if (pw > 140 && phh > 100) {
      if (law === "boyle") plot(ctx, { x: px, y: py, w: pw, h: phh }, [{ pts: Array.from({ length: 46 }, (_, i) => [5 + i, (n * Rg * T) / (5 + i)]), color: C.dim, width: 1.5 }, { pts: [[V, P]], color: C.tang }], { title: "P – V (T constant)", xmax: 50, ymax: 10, xl: "V (L)" });
      else if (law === "charles") plot(ctx, { x: px, y: py, w: pw, h: phh }, [{ pts: [[0, 0], [700, (n * Rg * 700) / Pfix]], color: C.dim, width: 1.5 }, { pts: [[T, Vv]], color: C.tang }], { title: "V – T (P constant)", xmax: 700, ymax: 60, xl: "T (K)" });
      else plot(ctx, { x: px, y: py, w: pw, h: phh }, [{ pts: [[0, 0], [700, (n * Rg * 700) / V]], color: C.dim, width: 1.5 }, { pts: [[T, P]], color: C.tang }], { title: "P – T (V constant)", xmax: 700, ymax: Math.max(3, (n * Rg * 700) / V), xl: "T (K)" });
    }
  }, []);
  return (
    <SimFrame compact={compact} canvasRef={ref}
      readouts={[{ l: "Pressure P", v: f1(P, 2), u: "atm", c: C.tang }, { l: "Volume V", v: f1(Vv, 1), u: "L", c: C.cobalt }, { l: "Temperature T", v: T, u: "K", c: C.sun }, { l: "moles n", v: n, u: "mol", c: C.teal }]}
      controls={<>
        <Seg value={law} options={[["boyle", "Boyle (T const)"], ["charles", "Charles (P const)"], ["gay", "Gay-Lussac (V const)"]]} onChange={setLaw} />
        <Slider label="Temperature T" value={T} min={100} max={700} step={10} unit="K" onChange={setT} color={C.sun} />
        {law !== "charles" && <Slider label="Volume V (move the piston)" value={V} min={5} max={50} unit="L" onChange={setV} color={C.cobalt} />}
        <Slider label="Amount of gas n" value={n} min={0.5} max={3} step={0.5} unit="mol" onChange={setN} color={C.teal} />
        <p className="sim-note">{law === "boyle" ? "Squeeze the gas: P × V stays constant." : law === "charles" ? "Heat the gas: the piston rises, V/T stays constant." : "Heat a closed can: P/T stays constant."}</p>
      </>}
      formula={"PV = nRT \\qquad \\dfrac{P_1V_1}{T_1} = \\dfrac{P_2V_2}{T_2}"}
    />
  );
}

/* =====================================================================
   UNIT STAIRCASE — metric prefixes + imperial bridges (DOM, no canvas)
   ===================================================================== */
const STAIRS = { length: ["km", "hm", "dam", "m", "dm", "cm", "mm"], mass: ["kg", "hg", "dag", "g", "dg", "cg", "mg"], volume: ["kL", "hL", "daL", "L", "dL", "cL", "mL"] };
const IMP = [["in", "cm", 2.54], ["ft", "m", 0.3048], ["mi", "km", 1.609], ["lb", "kg", 0.4536], ["gal", "L", 3.785], ["mph", "km/h", 1.609]];
export function Units({ compact }) {
  const [q, setQ] = useState("length"), [val, setVal] = useState(1200), [from, setFrom] = useState(5), [to, setTo] = useState(3), [imp, setImp] = useState(0), [iv, setIv] = useState(36);
  const steps = to - from, res = val * Math.pow(10, steps);
  const list = STAIRS[q];
  const pretty = (n) => (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-6 && n) ? n.toExponential(3) : Number(n.toPrecision(10)).toLocaleString("en-US", { maximumFractionDigits: 8 }));
  const stairs = useMemo(() => list.map((u, i) => ({ u, i })), [list]);
  const I = IMP[imp];
  return (
    <div className={`units-sim ${compact ? "compact" : ""}`}>
      <div className="units-stage">
        <div className="units-tabs">{Object.keys(STAIRS).map((k) => <button key={k} className={q === k ? "on" : ""} onClick={() => setQ(k)}>{k}</button>)}</div>
        <div className="units-stairs">
          {stairs.map(({ u, i }) => {
            const inRange = (i > Math.min(from, to) && i <= Math.max(from, to));
            return (
              <button key={u} className={`stair ${i === from ? "from" : ""} ${i === to ? "to" : ""} ${inRange ? "path" : ""}`} style={{ "--i": i }} onClick={(e) => (e.shiftKey ? setFrom(i) : setTo(i))}>
                <b>{u}</b>
                {inRange && <span className="hop">{to > from ? "×10" : "÷10"}</span>}
              </button>
            );
          })}
        </div>
        <div className="units-result">
          <span>{pretty(val)} {list[from]}</span>
          <i>{steps === 0 ? "=" : steps > 0 ? `× 10${steps > 1 ? "^" + steps : ""} →` : `÷ 10${-steps > 1 ? "^" + -steps : ""} →`}</i>
          <strong>{pretty(res)} {list[to]}</strong>
        </div>
        <p className="units-mn">👑 <b>K</b>ing <b>H</b>enry <b>D</b>ied <b>B</b>y <b>D</b>rinking <b>C</b>hocolate <b>M</b>ilk — going down the stairs? multiply!</p>
      </div>
      <aside className="sim-panel">
        <label className="units-input"><span>Value</span><input type="number" value={val} onChange={(e) => setVal(Number(e.target.value))} /></label>
        <b className="sim-label">From</b><Seg value={from} options={list.map((u, i) => [i, u])} onChange={setFrom} />
        <b className="sim-label">To</b><Seg value={to} options={list.map((u, i) => [i, u])} onChange={setTo} />
        <div className="units-imp">
          <b className="sim-label">🇺🇸 Imperial bridge</b>
          <Seg value={imp} options={IMP.map((x, i) => [i, x[0]])} onChange={setImp} />
          <label className="units-input"><span>{I[0]}</span><input type="number" value={iv} onChange={(e) => setIv(Number(e.target.value))} /></label>
          <div className="units-big">{pretty(iv)} {I[0]} = <b>{pretty(iv * I[2])} {I[1]}</b></div>
          <small>1 {I[0]} = {I[2]} {I[1]}</small>
        </div>
      </aside>
    </div>
  );
}
