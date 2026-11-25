/* DYNAMICS & ENERGY SIMS: force lab · energy skate park · collisions · pendulum/spring */
import { useRef, useState } from "react";
import { C, useCanvas, useLive, clear, grid, arrow, text, mono, circle, rrect, plot, glow, noGlow, Slider, Seg, Check, SimFrame, f1 } from "./kit";

/* =====================================================================
   FORCE LAB — Newton's 2nd law with friction and free-body diagram
   ===================================================================== */
export function ForceLab({ compact }) {
  const [F, setF] = useState(50), [m, setM] = useState(10), [mu, setMu] = useState(0.2), [fbd, setFbd] = useState(true);
  const S = useRef({ x: 0, v: 0, W: 0, hist: [], t: 0 });
  const [live, push] = useLive({ x: 0, v: 0, W: 0 });
  const g = 9.8, N = m * g, fMax = mu * N;
  const reset = () => { S.current = { x: 0, v: 0, W: 0, hist: [], t: 0 }; push({ x: 0, v: 0, W: 0 }, true); };

  const ref = useCanvas((ctx, w, h, _t, dt) => {
    const s = S.current;
    // physics
    let fr = 0;
    if (Math.abs(s.v) < 1e-3 && Math.abs(F) <= fMax) { fr = -F; s.v = 0; }
    else fr = -Math.sign(s.v || F) * fMax;
    const net = F + fr, a = net / m;
    const vNew = s.v + a * dt;
    s.v = s.v !== 0 && Math.sign(vNew) !== Math.sign(s.v) && Math.abs(F) <= fMax ? 0 : vNew;
    const dx = s.v * dt; s.x += dx; s.W += F * dx; s.t += dt;
    if (s.hist.length === 0 || s.t - s.hist[s.hist.length - 1][0] > 0.1) { s.hist.push([s.t, s.v]); if (s.hist.length > 200) s.hist.shift(); }
    push({ x: s.x, v: s.v, W: s.W, a, fr, net });
    // draw
    clear(ctx, w, h);
    const floor = h * 0.58, px = 18;
    const off = (s.x * px) % 60;
    ctx.fillStyle = "#0d0f2b"; ctx.fillRect(0, floor, w, h - floor);
    for (let x = -off; x < w + 60; x += 60) { ctx.fillStyle = C.faint; ctx.fillRect(x, floor, 2, 12); mono(ctx, Math.round((x + s.x * px - w / 2 + 60) / px) + "", x, floor + 22, C.dim, 9, "center"); }
    ctx.fillStyle = mu > 0 ? `rgba(255,110,170,${0.08 + mu * 0.4})` : "transparent"; ctx.fillRect(0, floor, w, 6);
    const bw = 60 + m * 2.2, bh = 44 + m * 1.2, bx = w / 2 - bw / 2, by = floor - bh;
    rrect(ctx, bx, by, bw, bh, 10, C.sun); text(ctx, `${m} kg`, w / 2, by + bh / 2, C.board, 15, "center", 800, "Bricolage Grotesque");
    const k = 1.1;
    if (fbd) {
      arrow(ctx, w / 2, by + bh / 2, w / 2 + F * k, by + bh / 2, C.tang, 4, `F = ${f1(F, 0)} N`);
      arrow(ctx, w / 2, floor - 4, w / 2 + fr * k, floor - 4, C.pink, 4, fr ? `f = ${f1(Math.abs(fr), 0)} N` : "");
      arrow(ctx, w / 2, by + bh / 2, w / 2, by + bh / 2 + Math.min(130, N * 0.5), C.lilac, 3, "W = mg");
      arrow(ctx, w / 2, by, w / 2, by - Math.min(130, N * 0.5), C.teal, 3, "N");
    }
    if (Math.abs(s.v) < 1e-3 && F !== 0 && Math.abs(F) <= fMax) text(ctx, "Static friction wins — the box doesn't move!", w / 2, 26, C.pink, 15, "center", 700);
    plot(ctx, { x: 12, y: floor + 36, w: w - 24, h: h - floor - 44 }, [{ pts: s.hist.map(([t, v]) => [t - (s.hist[0]?.[0] || 0), v]), color: C.teal, label: "velocity" }], { title: "v – t (m/s)", auto: true, xl: "t (s)" });
  }, []);

  const net = live.net ?? 0;
  return (
    <SimFrame compact={compact} canvasRef={ref} onReset={reset}
      readouts={[
        { l: "Net force ΣF", v: f1(net, 1), u: "N", c: C.tang }, { l: "acceleration", v: f1(live.a ?? 0, 2), u: "m/s²" },
        { l: "velocity", v: f1(live.v, 2), u: "m/s", c: C.teal }, { l: "max friction μN", v: f1(fMax, 1), u: "N", c: C.pink },
        { l: "Work by F", v: f1(live.W, 0), u: "J", c: C.sun },
      ]}
      controls={<>
        <Slider label="Applied force F" value={F} min={-150} max={150} step={5} unit="N" onChange={setF} color={C.tang} />
        <Slider label="Mass m" value={m} min={1} max={40} unit="kg" onChange={setM} color={C.sun} />
        <Slider label="Friction coefficient μ" value={mu} min={0} max={1} step={0.05} onChange={setMu} color={C.pink} fmt={(v) => v.toFixed(2)} />
        <div className="sim-row"><Seg value={mu} options={[[0, "🧊 Ice"], [0.3, "🪵 Wood"], [0.7, "🧱 Rubber"]]} onChange={setMu} /></div>
        <Check label="Free-body diagram" value={fbd} onChange={setFbd} />
      </>}
      formula={"\\sum F = F - \\mu m g = m\\,a"}
    />
  );
}

/* =====================================================================
   ENERGY SKATE PARK — half-pipe, Ek / Ep / thermal bars
   ===================================================================== */
export function Skate({ compact }) {
  const [h0, setH0] = useState(6), [m, setM] = useState(50), [mu, setMu] = useState(0), [g, setG] = useState(9.8);
  const S = useRef({ x: -1, v: 0, E0: null, th: 0, hist: [], t: 0 });
  const [live, push] = useLive({ v: 0, y: h0 });
  const L = 8; // half width in m; track y = H (x/L)^2 with H = 8
  const Htr = 8, yOf = (x) => Htr * (x / L) ** 2, slope = (x) => (2 * Htr * x) / (L * L);
  const start = () => { const x0 = -L * Math.sqrt(h0 / Htr); S.current = { x: x0, v: 0, E0: m * g * h0, th: 0, hist: [], t: 0 }; };
  if (S.current.x === -1 && S.current.E0 === null) start();

  const ref = useCanvas((ctx, w, h, _t, dt) => {
    const s = S.current;
    const n = 8, d = dt / n;
    for (let i = 0; i < n; i++) {
      const sl = slope(s.x), c = 1 / Math.sqrt(1 + sl * sl);
      let acc = -g * sl * c; // tangential
      if (mu > 0 && Math.abs(s.v) > 0.01) acc -= Math.sign(s.v) * mu * g * c;
      s.v += acc * d;
      const ds = s.v * d; s.x += ds * c;
      if (mu > 0) s.th += Math.abs(mu * m * g * c * ds);
    }
    if (mu > 0 && Math.abs(s.v) < 0.03 && Math.abs(s.x) < 0.15) { s.v = 0; }
    const y = yOf(s.x), Ek = 0.5 * m * s.v * s.v, Ep = m * g * y;
    s.t += dt;
    if (!s.hist.length || s.t - s.hist[s.hist.length - 1][0] > 0.08) { s.hist.push([s.t, Ek, Ep]); if (s.hist.length > 160) s.hist.shift(); }
    push({ v: Math.abs(s.v), y, Ek, Ep, th: s.th });
    clear(ctx, w, h);
    const area = { w: w * 0.68, h: h - 30 };
    const sc = Math.min((area.w - 40) / (2 * L), (area.h - 40) / Htr);
    const cx = 20 + area.w / 2, base = h - 24;
    const X = (x) => cx + x * sc, Y = (yy) => base - yy * sc;
    grid(ctx, area.w + 20, h, sc, cx, base);
    for (let k = 0; k <= Htr; k += 2) mono(ctx, k + " m", 14, Y(k), C.dim, 10);
    ctx.beginPath(); for (let x = -L; x <= L; x += 0.1) { x === -L ? ctx.moveTo(X(x), Y(yOf(x))) : ctx.lineTo(X(x), Y(yOf(x))); }
    ctx.lineTo(X(L), base + 10); ctx.lineTo(X(-L), base + 10); ctx.closePath();
    ctx.fillStyle = "#23276a"; ctx.fill(); ctx.strokeStyle = mu > 0 ? C.pink : C.cobalt; ctx.lineWidth = 4; ctx.stroke();
    ctx.setLineDash([4, 6]); ctx.strokeStyle = C.dim; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(-L), Y(h0)); ctx.lineTo(X(L), Y(h0)); ctx.stroke(); ctx.setLineDash([]);
    const sl = slope(s.x), ang = Math.atan(sl);
    ctx.save(); ctx.translate(X(s.x), Y(y)); ctx.rotate(-ang);
    rrect(ctx, -20, -8, 40, 6, 3, C.tang); circle(ctx, -13, -1, 4, C.chalk); circle(ctx, 13, -1, 4, C.chalk);
    glow(ctx, C.sun); circle(ctx, 0, -26, 14, C.sun); noGlow(ctx); text(ctx, "🛹", 0, -26, C.board, 14, "center");
    ctx.restore();
    // bars
    const E0 = s.E0 || 1, bx = area.w + 40, bw = (w - bx - 20) / 4, bh = h * 0.62, by = 20;
    [["Ek", Ek, C.teal], ["Ep", Ep, C.sun], ["Heat", s.th, C.pink], ["Total", Ek + Ep + s.th, C.chalk]].forEach(([l, val, col], i) => {
      const hh = (val / E0) * bh;
      rrect(ctx, bx + i * bw + 4, by, bw - 8, bh, 8, "rgba(255,255,255,.04)");
      rrect(ctx, bx + i * bw + 4, by + bh - hh, bw - 8, Math.max(2, hh), 8, col);
      text(ctx, l, bx + i * bw + bw / 2, by + bh + 14, col, 12, "center", 800);
      mono(ctx, Math.round(val) + " J", bx + i * bw + bw / 2, by + bh + 30, C.dim, 10, "center");
    });
    if (h > 360) plot(ctx, { x: bx, y: by + bh + 44, w: w - bx - 16, h: h - (by + bh + 54) }, [{ pts: s.hist.map((p) => [p[0] - s.hist[0][0], p[1]]), color: C.teal }, { pts: s.hist.map((p) => [p[0] - s.hist[0][0], p[2]]), color: C.sun }], { title: "Ek & Ep vs t", xmax: Math.max(4, s.hist.length ? s.hist[s.hist.length - 1][0] - s.hist[0][0] : 4), ymax: E0 });
  }, []);

  return (
    <SimFrame compact={compact} canvasRef={ref} onReset={start}
      readouts={[
        { l: "speed", v: f1(live.v, 2), u: "m/s", c: C.teal }, { l: "height", v: f1(live.y, 2), u: "m", c: C.sun },
        { l: "v at bottom √(2gh)", v: f1(Math.sqrt(2 * g * h0), 2), u: "m/s" }, { l: "thermal", v: f1(live.th ?? 0, 0), u: "J", c: C.pink },
      ]}
      controls={<>
        <Slider label="Start height h" value={h0} min={1} max={8} step={0.5} unit="m" onChange={(v) => { setH0(v); setTimeout(start, 0); }} color={C.sun} />
        <Slider label="Mass m" value={m} min={20} max={100} step={5} unit="kg" onChange={(v) => { setM(v); setTimeout(start, 0); }} color={C.lilac} />
        <Slider label="Friction μ" value={mu} min={0} max={0.3} step={0.01} onChange={setMu} color={C.pink} fmt={(v) => v.toFixed(2)} />
        <Seg value={g} options={[[9.8, "🌍 Earth"], [1.6, "🌙 Moon"], [24.8, "🪐 Jupiter"]]} onChange={(v) => { setG(v); setTimeout(start, 0); }} />
      </>}
      formula={"\\tfrac{1}{2}mv^2 + mgh = E_{total}"}
    />
  );
}

/* =====================================================================
   COLLISIONS 1D — elastic ↔ perfectly inelastic with e
   ===================================================================== */
export function Collisions({ compact }) {
  const [m1, setM1] = useState(2), [v1, setV1] = useState(4), [m2, setM2] = useState(2), [v2, setV2] = useState(0), [e, setE] = useState(1);
  const [playing, setPlaying] = useState(false);
  const init = () => ({ x1: -6, x2: 2, u1: v1, u2: v2, hit: false, after: null });
  const S = useRef(init());
  const [live, push] = useLive({ hit: false });
  const reset = () => { S.current = init(); setPlaying(false); push({ hit: false }, true); };
  const p0 = m1 * v1 + m2 * v2, K0 = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
  const v1f = (m1 * v1 + m2 * v2 + m2 * e * (v2 - v1)) / (m1 + m2), v2f = (m1 * v1 + m2 * v2 + m1 * e * (v1 - v2)) / (m1 + m2);
  const K1 = 0.5 * m1 * v1f * v1f + 0.5 * m2 * v2f * v2f;

  const ref = useCanvas((ctx, w, h, _t, dt) => {
    const s = S.current;
    const w1 = 0.6 + m1 * 0.12, w2 = 0.6 + m2 * 0.12;
    if (playing) {
      s.x1 += s.u1 * dt; s.x2 += s.u2 * dt;
      if (!s.hit && s.x1 + w1 / 2 >= s.x2 - w2 / 2) { s.hit = true; s.u1 = v1f; s.u2 = v2f; push({ hit: true }, true); }
      if (Math.abs(s.x1) > 14 || Math.abs(s.x2) > 14) setPlaying(false);
    }
    clear(ctx, w, h);
    const sc = (w - 40) / 26, X = (x) => w / 2 + x * sc, track = h * 0.42;
    ctx.fillStyle = "#0d0f2b"; ctx.fillRect(0, track, w, 10);
    for (let m = -12; m <= 12; m += 2) mono(ctx, m + "", X(m), track + 22, C.dim, 9, "center");
    const cart = (x, ww, mm, col, u, lab) => {
      const W = ww * sc, H = 30 + mm * 3;
      rrect(ctx, X(x) - W / 2, track - H, W, H, 8, col);
      text(ctx, `${lab} · ${mm} kg`, X(x), track - H / 2, C.board, 12, "center", 800);
      circle(ctx, X(x) - W / 3, track + 2, 5, "#0d0f2b", C.chalk); circle(ctx, X(x) + W / 3, track + 2, 5, "#0d0f2b", C.chalk);
      if (Math.abs(u) > 0.01) arrow(ctx, X(x), track - H - 14, X(x) + u * 14, track - H - 14, C.chalk, 3, f1(u, 1) + " m/s");
    };
    cart(s.x1, w1, m1, C.sun, s.u1, "1"); cart(s.x2, w2, m2, C.teal, s.u2, "2");
    if (s.hit) { glow(ctx, C.tang); text(ctx, e === 1 ? "💥 ELASTIC!" : e === 0 ? "🤝 STUCK TOGETHER" : "💥 BANG!", w / 2, 26, C.tang, 18, "center", 800, "Bricolage Grotesque"); noGlow(ctx); }
    // momentum bars before/after
    const by = h * 0.62, bh = h - by - 16, mid = w / 2;
    const pm = Math.max(1, Math.abs(m1 * v1), Math.abs(m2 * v2), Math.abs(p0), Math.abs(m1 * v1f), Math.abs(m2 * v2f));
    const bar = (x0, label, vals) => {
      text(ctx, label, x0 + (mid - 30) / 2, by, C.chalk, 13, "center", 800);
      vals.forEach(([l, val, col], i) => {
        const y = by + 18 + i * ((bh - 18) / 3), len = (val / pm) * ((mid - 60) / 2.2), cxx = x0 + (mid - 30) / 2;
        ctx.fillStyle = col; ctx.fillRect(Math.min(cxx, cxx + len), y, Math.abs(len), (bh - 18) / 3 - 8);
        mono(ctx, `${l} ${f1(val, 1)}`, x0 + 4, y + 9, C.chalk, 11);
      });
      ctx.fillStyle = C.dim; ctx.fillRect(x0 + (mid - 30) / 2, by + 14, 1.5, bh - 14);
    };
    bar(10, "Momentum BEFORE", [["p₁", m1 * v1, C.sun], ["p₂", m2 * v2, C.teal], ["Σp", p0, C.tang]]);
    bar(mid + 10, "Momentum AFTER", [["p₁'", m1 * v1f, C.sun], ["p₂'", m2 * v2f, C.teal], ["Σp'", m1 * v1f + m2 * v2f, C.tang]]);
  }, [playing, m1, m2, v1, v2, e]);

  return (
    <SimFrame compact={compact} canvasRef={ref} playing={playing} onPlay={() => { if (S.current.hit || Math.abs(S.current.x1) > 13) reset(); setPlaying((p) => !p); }} onReset={reset}
      readouts={[
        { l: "Σp before", v: f1(p0, 1), u: "kg·m/s", c: C.tang }, { l: "Σp after", v: f1(m1 * v1f + m2 * v2f, 1), u: "kg·m/s", c: C.tang },
        { l: "Ek before", v: f1(K0, 1), u: "J", c: C.sun }, { l: "Ek after", v: f1(K1, 1), u: "J", c: C.teal },
        { l: "Ek lost", v: f1(K0 - K1, 1), u: `J (${f1(K0 ? ((K0 - K1) / K0) * 100 : 0, 0)}%)`, c: C.pink },
      ]}
      controls={<>
        <div className="sim-group" style={{ "--c": C.sun }}><b>Cart 1</b>
          <Slider label="mass" value={m1} min={1} max={10} unit="kg" onChange={(v) => { setM1(v); reset(); }} color={C.sun} />
          <Slider label="velocity" value={v1} min={0} max={8} step={0.5} unit="m/s" onChange={(v) => { setV1(v); reset(); }} color={C.sun} />
        </div>
        <div className="sim-group" style={{ "--c": C.teal }}><b>Cart 2</b>
          <Slider label="mass" value={m2} min={1} max={10} unit="kg" onChange={(v) => { setM2(v); reset(); }} color={C.teal} />
          <Slider label="velocity" value={v2} min={-6} max={2} step={0.5} unit="m/s" onChange={(v) => { setV2(v); reset(); }} color={C.teal} />
        </div>
        <Slider label="Elasticity e (0 = stick · 1 = elastic)" value={e} min={0} max={1} step={0.05} onChange={(v) => { setE(v); reset(); }} color={C.tang} fmt={(v) => v.toFixed(2)} />
      </>}
      formula={"m_1v_1 + m_2v_2 = m_1v_1' + m_2v_2'"}
    />
  );
}

/* =====================================================================
   PENDULUM + SPRING (SHM) with damping and live graphs
   ===================================================================== */
export function Pendulum({ compact }) {
  const [mode, setMode] = useState("pend");
  const [L, setL] = useState(2), [m, setM] = useState(1), [g, setG] = useState(9.8), [amp, setAmp] = useState(20), [b, setB] = useState(0), [k, setK] = useState(20);
  const S = useRef({ q: (20 * Math.PI) / 180, w: 0, t: 0, hist: [] });
  const [live, push] = useLive({ q: 0 });
  const reset = (md = mode, a = amp) => { S.current = { q: md === "pend" ? (a * Math.PI) / 180 : a / 100, w: 0, t: 0, hist: [] }; };
  const Tth = mode === "pend" ? 2 * Math.PI * Math.sqrt(L / g) : 2 * Math.PI * Math.sqrt(m / k);

  const ref = useCanvas((ctx, w, h, _t, dt) => {
    const s = S.current, n = 10, d = dt / n;
    for (let i = 0; i < n; i++) {
      const acc = mode === "pend" ? -(g / L) * Math.sin(s.q) - b * s.w : -(k / m) * s.q - b * s.w;
      s.w += acc * d; s.q += s.w * d;
    }
    s.t += dt;
    const Ek = mode === "pend" ? 0.5 * m * (L * s.w) ** 2 : 0.5 * m * s.w * s.w;
    const Ep = mode === "pend" ? m * g * L * (1 - Math.cos(s.q)) : 0.5 * k * s.q * s.q;
    if (!s.hist.length || s.t - s.hist[s.hist.length - 1][0] > 0.04) { s.hist.push([s.t, s.q, Ek, Ep]); if (s.hist.length > 260) s.hist.shift(); }
    push({ q: s.q, Ek, Ep });
    clear(ctx, w, h);
    const left = w * 0.42;
    grid(ctx, left, h, 32);
    if (mode === "pend") {
      const px = left / 2, py = 30, sc = (h - 90) / 5;
      ctx.fillStyle = C.dim; ctx.fillRect(px - 50, py - 6, 100, 6);
      const bx = px + Math.sin(s.q) * L * sc, by = py + Math.cos(s.q) * L * sc;
      ctx.setLineDash([3, 5]); ctx.strokeStyle = C.faint; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + L * sc + 20); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = C.chalk; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.stroke();
      glow(ctx, C.sun); circle(ctx, bx, by, 10 + m * 3, C.sun); noGlow(ctx);
      mono(ctx, `θ = ${f1((s.q * 180) / Math.PI, 0)}°`, px, h - 16, C.dim, 12, "center");
    } else {
      const px = left / 2, top = 20, sc = 260, eq = h * 0.5, y = eq + s.q * sc;
      ctx.fillStyle = C.dim; ctx.fillRect(px - 50, top, 100, 6);
      ctx.strokeStyle = C.chalk; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, top + 6);
      const coils = 14; for (let i = 1; i <= coils; i++) ctx.lineTo(px + (i % 2 ? 16 : -16), top + 6 + ((y - top - 26) * i) / coils);
      ctx.lineTo(px, y - 20); ctx.stroke();
      rrect(ctx, px - 26, y - 20, 52, 40, 8, C.sun); text(ctx, `${m} kg`, px, y, C.board, 12, "center", 800);
      ctx.setLineDash([4, 5]); ctx.strokeStyle = C.teal; ctx.beginPath(); ctx.moveTo(px - 70, eq); ctx.lineTo(px + 70, eq); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "equilibrium", px + 74, eq, C.teal, 10);
    }
    const gx = left + 10, gw = w - gx - 10, gh = (h - 30) / 2;
    const t0 = s.hist.length ? s.hist[0][0] : 0, tN = Math.max(6, (s.hist.at(-1)?.[0] || 0) - t0);
    const qmax = mode === "pend" ? Math.max(0.2, (amp * Math.PI) / 180) : Math.max(0.02, amp / 100);
    plot(ctx, { x: gx, y: 10, w: gw, h: gh }, [{ pts: s.hist.map((p) => [p[0] - t0, p[1]]), color: C.sun, label: mode === "pend" ? "θ (rad)" : "x (m)" }], { title: "position vs time", xmax: tN, ymin: -qmax * 1.1, ymax: qmax * 1.1, xl: "t (s)" });
    const E = Math.max(1e-6, ...s.hist.map((p) => p[2] + p[3]));
    plot(ctx, { x: gx, y: 20 + gh, w: gw, h: gh }, [{ pts: s.hist.map((p) => [p[0] - t0, p[2]]), color: C.teal, label: "Ek" }, { pts: s.hist.map((p) => [p[0] - t0, p[3]]), color: C.pink, label: "Ep" }, { pts: s.hist.map((p) => [p[0] - t0, p[2] + p[3]]), color: C.chalk, label: "E" }], { title: "energy (J)", xmax: tN, ymax: E * 1.1, xl: "t (s)" });
  }, []);

  return (
    <SimFrame compact={compact} canvasRef={ref} onReset={() => reset()}
      readouts={[
        { l: "Period T (theory)", v: f1(Tth, 2), u: "s", c: C.sun }, { l: "frequency", v: f1(1 / Tth, 2), u: "Hz" },
        { l: "Ek", v: f1(live.Ek ?? 0, 2), u: "J", c: C.teal }, { l: "Ep", v: f1(live.Ep ?? 0, 2), u: "J", c: C.pink },
      ]}
      controls={<>
        <Seg value={mode} options={[["pend", "🕰️ Pendulum"], ["spring", "🌀 Spring"]]} onChange={(v) => { setMode(v); const a = v === "pend" ? 20 : 15; setAmp(a); reset(v, a); }} />
        {mode === "pend"
          ? <Slider label="Length L" value={L} min={0.25} max={5} step={0.25} unit="m" onChange={setL} color={C.sun} />
          : <Slider label="Spring constant k" value={k} min={5} max={100} step={5} unit="N/m" onChange={setK} color={C.sun} />}
        <Slider label="Mass m" value={m} min={0.5} max={5} step={0.5} unit="kg" onChange={setM} color={C.lilac} />
        <Slider label={mode === "pend" ? "Release angle" : "Amplitude"} value={amp} min={5} max={mode === "pend" ? 80 : 30} unit={mode === "pend" ? "°" : "cm"} onChange={(v) => { setAmp(v); reset(mode, v); }} color={C.tang} />
        {mode === "pend" && <Seg value={g} options={[[9.8, "🌍"], [1.6, "🌙"], [3.7, "🔴"], [24.8, "🪐"]]} onChange={setG} />}
        <Slider label="Damping" value={b} min={0} max={1} step={0.05} onChange={setB} color={C.pink} fmt={(v) => v.toFixed(2)} />
      </>}
      formula={mode === "pend" ? "T = 2\\pi\\sqrt{L/g}" : "T = 2\\pi\\sqrt{m/k}"}
    />
  );
}
