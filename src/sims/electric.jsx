import { T } from "../i18n";
/* ELECTRICITY & MODERN SIMS: charges & fields · circuit builder · Faraday induction · photoelectric effect */
import { useRef, useState } from "react";
import { C, useCanvas, useLive, clear, grid, arrow, text, mono, circle, rrect, plot, glow, noGlow, Slider, Seg, Check, SimFrame, f1 } from "./kit";

/* =====================================================================
   CHARGES — Coulomb's law, draggable charges, field lines
   ===================================================================== */
export function Charges({
  compact
}) {
  const [qs, setQs] = useState([{
    x: -1,
    y: 0,
    q: 3
  }, {
    x: 1,
    y: 0,
    q: -3
  }]);
  const [lines, setLines] = useState(true),
    [vecs, setVecs] = useState(false);
  const drag = useRef(null),
    geo = useRef({
      cx: 0,
      cy: 0,
      u: 100
    });
  const k = 9e9;
  const r12 = Math.hypot(qs[1].x - qs[0].x, qs[1].y - qs[0].y);
  const F12 = k * Math.abs(qs[0].q * qs[1].q) * 1e-12 / (r12 * r12);
  const field = (x, y) => {
    let ex = 0,
      ey = 0;
    qs.forEach(c => {
      const dx = x - c.x,
        dy = y - c.y,
        r2 = dx * dx + dy * dy + 1e-4,
        r = Math.sqrt(r2);
      ex += c.q * dx / (r2 * r);
      ey += c.q * dy / (r2 * r);
    });
    return [ex, ey];
  };
  const ref = useCanvas((ctx, w, h) => {
    clear(ctx, w, h);
    const u = Math.min(w, h) / 5,
      cx = w / 2,
      cy = h / 2;
    geo.current = {
      cx,
      cy,
      u
    };
    grid(ctx, w, h, u / 2, cx, cy);
    const P = (x, y) => [cx + x * u, cy - y * u];
    if (vecs) for (let gx = -6; gx <= 6; gx += 0.5) for (let gy = -3; gy <= 3; gy += 0.5) {
      const [ex, ey] = field(gx, gy),
        m = Math.hypot(ex, ey);
      if (m < 1e-3) continue;
      const L = Math.min(0.2, 0.05 + Math.log10(1 + m) * 0.08);
      const [px, py] = P(gx, gy);
      ctx.globalAlpha = Math.min(1, 0.25 + m / 6);
      arrow(ctx, px, py, px + ex / m * L * u, py - ey / m * L * u, C.lilac, 1.5);
      ctx.globalAlpha = 1;
    }
    if (lines) {
      const anyPos = qs.some(c => c.q > 0);
      qs.filter(c => anyPos ? c.q > 0 : c.q < 0).forEach(c => {
        const nL = Math.abs(c.q) * 4;
        for (let i = 0; i < nL; i++) {
          let x = c.x + 0.08 * Math.cos(2 * Math.PI * i / nL),
            y = c.y + 0.08 * Math.sin(2 * Math.PI * i / nL);
          ctx.strokeStyle = "rgba(255,193,46,.55)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(...P(x, y));
          for (let s = 0; s < 500; s++) {
            const [ex, ey] = field(x, y),
              m = Math.hypot(ex, ey) || 1,
              dir = anyPos ? 1 : -1;
            x += dir * ex / m * 0.03;
            y += dir * ey / m * 0.03;
            ctx.lineTo(...P(x, y));
            if (Math.abs(x) > 7 || Math.abs(y) > 4 || qs.some(o => o !== c && Math.hypot(x - o.x, y - o.y) < 0.08)) break;
          }
          ctx.stroke();
        }
      });
    }
    // forces on charges 0 & 1
    const [ax, ay] = P(qs[0].x, qs[0].y),
      [bx, by] = P(qs[1].x, qs[1].y);
    const dx = (bx - ax) / (Math.hypot(bx - ax, by - ay) || 1),
      dy = (by - ay) / (Math.hypot(bx - ax, by - ay) || 1);
    const attract = qs[0].q * qs[1].q < 0,
      L = Math.min(u * 0.9, 20 + F12 * 30);
    arrow(ctx, ax, ay, ax + (attract ? dx : -dx) * L, ay + (attract ? dy : -dy) * L, C.teal, 4, "F");
    arrow(ctx, bx, by, bx + (attract ? -dx : dx) * L, by + (attract ? -dy : dy) * L, C.teal, 4, "F");
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = C.dim;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.setLineDash([]);
    mono(ctx, `r = ${f1(r12, 2)} m`, (ax + bx) / 2, (ay + by) / 2 - 12, C.dim, 11, "center");
    qs.forEach(c => {
      const [px, py] = P(c.x, c.y),
        col = c.q > 0 ? C.tang : C.cobalt;
      glow(ctx, col, 22);
      circle(ctx, px, py, 16 + Math.abs(c.q) * 2, col);
      noGlow(ctx);
      text(ctx, c.q > 0 ? "+" : "−", px, py - 1, C.chalk, 22, "center", 800);
      mono(ctx, `${c.q > 0 ? "+" : ""}${c.q} μC`, px, py + 32, col, 11, "center");
    });
    text(ctx, attract ? T("Opposite charges ATTRACT 🧲") : T("Equal charges REPEL ↔"), w / 2, 20, attract ? C.teal : C.pink, 15, "center", 800);
  }, [qs, lines, vecs], {
    animate: false
  });
  const toU = e => {
    const r = e.currentTarget.getBoundingClientRect(),
      {
        cx,
        cy,
        u
      } = geo.current;
    return {
      x: (e.clientX - r.left - cx) / u,
      y: (cy - (e.clientY - r.top)) / u
    };
  };
  const onPointer = {
    onPointerDown: e => {
      const p = toU(e);
      let best = -1,
        bd = 0.5;
      qs.forEach((c, i) => {
        const d = Math.hypot(c.x - p.x, c.y - p.y);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      drag.current = best >= 0 ? best : null;
      if (best >= 0) e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerMove: e => {
      if (drag.current == null) return;
      const p = toU(e);
      setQs(a => a.map((c, i) => i === drag.current ? {
        ...c,
        x: Math.round(p.x * 20) / 20,
        y: Math.round(p.y * 20) / 20
      } : c));
    },
    onPointerUp: () => {
      drag.current = null;
    }
  };
  const setQ = (i, v) => setQs(a => a.map((c, j) => j === i ? {
    ...c,
    q: v || 1
  } : c));
  return <SimFrame compact={compact} canvasRef={ref} onPointer={onPointer} hint={T("Drag the charges ✋")} readouts={[{
    l: T("Force between 1 & 2"),
    v: F12 < 0.01 ? F12.toExponential(2) : f1(F12, 3),
    u: "N",
    c: C.teal
  }, {
    l: T("distance r"),
    v: f1(r12, 2),
    u: "m"
  }, {
    l: T("type"),
    v: qs[0].q * qs[1].q < 0 ? "attraction" : "repulsion",
    u: "",
    c: C.pink
  }]} controls={<>
        <Slider label={T("Charge 1")} value={qs[0].q} min={-5} max={5} unit="μC" onChange={v => setQ(0, v)} color={C.tang} />
        <Slider label={T("Charge 2")} value={qs[1].q} min={-5} max={5} unit="μC" onChange={v => setQ(1, v)} color={C.cobalt} />
        {qs[2] && <Slider label={T("Charge 3")} value={qs[2].q} min={-5} max={5} unit="μC" onChange={v => setQ(2, v)} color={C.lilac} />}
        <div className="sim-row"><Check label={T("Field lines")} value={lines} onChange={setLines} /><Check label={T("Field arrows")} value={vecs} onChange={setVecs} /></div>
        <div className="sim-row">
          <button className="sim-btn ghost" onClick={() => setQs(a => a.length < 3 ? [...a, {
        x: 0,
        y: 1.2,
        q: 2
      }] : a.slice(0, 2))}>{qs.length < 3 ? T("➕ Add charge") : T("➖ Remove 3rd")}</button>
          <button className="sim-btn ghost" onClick={() => setQs([{
        x: -1,
        y: 0,
        q: 3
      }, {
        x: 1,
        y: 0,
        q: -3
      }])}>{T("Dipole")}</button>
        </div>
      </>} formula={"F = k\\dfrac{|q_1 q_2|}{r^2},\\; k = 9\\times10^9"} />;
}

/* =====================================================================
   CIRCUIT BUILDER — single / series / parallel + conductor test
   ===================================================================== */
const MATS = [[T("Copper wire"), 0.01, "conductor"], [T("Graphite (pencil)"), 3, "conductor"], [T("Salt water"), 15, "conductor"], [T("Plastic"), Infinity, "insulator"], [T("Wood"), Infinity, "insulator"]];
export function Circuit({
  compact
}) {
  const [V, setV] = useState(9),
    [R1, setR1] = useState(10),
    [R2, setR2] = useState(10),
    [mode, setMode] = useState("series"),
    [closed, setClosed] = useState(true),
    [mat, setMat] = useState(0);
  const Rm = MATS[mat][1];
  let Rt, I, I1, I2, V1, V2;
  if (mode === "single") {
    Rt = R1 + Rm;
    I = closed && isFinite(Rt) ? V / Rt : 0;
    I1 = I;
    I2 = 0;
    V1 = I * R1;
    V2 = 0;
  } else if (mode === "series") {
    Rt = R1 + R2 + Rm;
    I = closed && isFinite(Rt) ? V / Rt : 0;
    I1 = I2 = I;
    V1 = I * R1;
    V2 = I * R2;
  } else {
    const Rp = R1 * R2 / (R1 + R2);
    Rt = Rp + Rm;
    I = closed && isFinite(Rt) ? V / Rt : 0;
    const Vp = I * Rp;
    I1 = Vp / R1;
    I2 = Vp / R2;
    V1 = V2 = Vp;
  }
  const P1 = I1 * I1 * R1,
    P2 = I2 * I2 * R2;
  const S = useRef({
    phase: 0
  });
  const ref = useCanvas((ctx, w, h, t, dt) => {
    clear(ctx, w, h);
    grid(ctx, w, h, 32);
    const L = 60,
      R = w - 60,
      Tv = 60,
      B = h - 60,
      mx = (L + R) / 2;
    S.current.phase += I * dt * 40;
    const wire = (pts, cur) => {
      ctx.strokeStyle = C.chalk;
      ctx.lineWidth = 4;
      ctx.lineJoin = "round";
      ctx.beginPath();
      pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.stroke();
      if (cur <= 0) return;
      let tot = 0;
      const seg = [];
      for (let i = 1; i < pts.length; i++) {
        const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        seg.push(l);
        tot += l;
      }
      for (let d = S.current.phase * (cur / Math.max(I, 1e-9)) % 26; d < tot; d += 26) {
        let rem = d,
          i = 0;
        while (i < seg.length && rem > seg[i]) {
          rem -= seg[i];
          i++;
        }
        if (i >= seg.length) break;
        const [x1, y1] = pts[i],
          [x2, y2] = pts[i + 1],
          f = rem / seg[i];
        circle(ctx, x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, 3.5, C.cobalt);
      }
    };
    const bulb = (x, y, P, label) => {
      const b = Math.min(1, P / 8);
      glow(ctx, C.sun, 10 + b * 50);
      circle(ctx, x, y, 22, `rgba(255,193,46,${0.12 + b * 0.88})`, C.chalk, 2);
      noGlow(ctx);
      ctx.strokeStyle = C.board;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 8, y + 6);
      ctx.lineTo(x - 4, y - 6);
      ctx.lineTo(x, y + 6);
      ctx.lineTo(x + 4, y - 6);
      ctx.lineTo(x + 8, y + 6);
      ctx.stroke();
      mono(ctx, label, x, y + 38, C.chalk, 11, "center");
    };
    // battery on the left
    wire([[L, B], [L, (Tv + B) / 2 + 26]], I);
    wire([[L, (Tv + B) / 2 - 26], [L, Tv]], I);
    rrect(ctx, L - 20, (Tv + B) / 2 - 26, 40, 52, 8, "#2a2e6e", C.chalk, 2);
    text(ctx, `${V} V`, L, (Tv + B) / 2, C.sun, 13, "center", 800);
    text(ctx, "+", L + 28, (Tv + B) / 2 - 18, C.tang, 16, "center", 800);
    // material slot on bottom wire
    const gx = mx;
    wire([[L, B], [gx - 40, B]], I);
    wire([[gx + 40, B], [R, B]], I);
    rrect(ctx, gx - 40, B - 12, 80, 24, 6, isFinite(Rm) ? "#7a5c2e" : "#5a3a6a", C.chalk, 1.5);
    text(ctx, MATS[mat][0], gx, B + 28, isFinite(Rm) ? C.teal : C.pink, 12, "center", 800);
    // switch on top-left
    const sw = L + 70;
    wire([[L, Tv], [sw, Tv]], I);
    ctx.strokeStyle = C.chalk;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(sw, Tv);
    ctx.lineTo(sw + 40, closed ? Tv : Tv - 26);
    ctx.stroke();
    circle(ctx, sw, Tv, 5, C.chalk);
    circle(ctx, sw + 40, Tv, 5, C.chalk);
    if (mode === "parallel") {
      const x1 = mx - 40,
        x2 = mx + 80;
      wire([[sw + 40, Tv], [R, Tv]], I);
      wire([[R, Tv], [R, B]], I);
      wire([[x1, Tv], [x1, B]], I1);
      wire([[x2, Tv], [x2, B]], I2);
      bulb(x1, (Tv + B) / 2, P1, `${R1} Ω`);
      bulb(x2, (Tv + B) / 2, P2, `${R2} Ω`);
    } else {
      wire([[sw + 40, Tv], [R, Tv], [R, B]], I);
      bulb(mx, Tv, P1, `R₁ ${R1} Ω`);
      if (mode === "series") bulb(R, (Tv + B) / 2, P2, `R₂ ${R2} Ω`);
    }
    if (!closed) text(ctx, T("Open circuit → no current"), w / 2, 24, C.pink, 15, "center", 800);else if (!isFinite(Rm)) text(ctx, T("{0} is an INSULATOR — no current!", MATS[mat][0]), w / 2, 24, C.pink, 15, "center", 800);else text(ctx, `I = ${f1(I, 3)} A`, w / 2, 24, C.cobalt, 15, "center", 800);
  }, []);
  return <SimFrame compact={compact} canvasRef={ref} readouts={[{
    l: T("total current I"),
    v: f1(I, 3),
    u: "A",
    c: C.cobalt
  }, {
    l: T("equivalent R"),
    v: isFinite(Rt) ? f1(Rt, 2) : "∞",
    u: "Ω"
  }, {
    l: "R₁: V · I · P",
    v: `${f1(V1, 1)} V · ${f1(I1, 2)} A`,
    u: `· ${f1(P1, 1)} W`,
    c: C.sun
  }, ...(mode !== "single" ? [{
    l: "R₂: V · I · P",
    v: `${f1(V2, 1)} V · ${f1(I2, 2)} A`,
    u: `· ${f1(P2, 1)} W`,
    c: C.sun
  }] : [])]} controls={<>
        <Seg value={mode} options={[["single", T("1 bulb")], ["series", T("Series")], ["parallel", T("Parallel")]]} onChange={setMode} />
        <Slider label={T("Battery voltage")} value={V} min={1.5} max={24} step={1.5} unit="V" onChange={setV} color={C.sun} />
        <Slider label="R₁" value={R1} min={1} max={50} unit="Ω" onChange={setR1} color={C.tang} />
        {mode !== "single" && <Slider label="R₂" value={R2} min={1} max={50} unit="Ω" onChange={setR2} color={C.lilac} />}
        <b className="sim-label">{T("Test a material (conductor or insulator?)")}</b>
        <Seg value={mat} options={MATS.map((m, i) => [i, m[0]])} onChange={setMat} />
        <button className="sim-btn ghost" onClick={() => setClosed(c => !c)}>{closed ? T("🔓 Open switch") : T("🔒 Close switch")}</button>
      </>} formula={"V = IR \\qquad P = VI \\qquad R_s = R_1 + R_2 \\qquad \\tfrac{1}{R_p} = \\tfrac{1}{R_1} + \\tfrac{1}{R_2}"} />;
}

/* =====================================================================
   FARADAY INDUCTION — drag the magnet through the coil
   ===================================================================== */
export function Induction({
  compact
}) {
  const [N, setN] = useState(10),
    [auto, setAuto] = useState(false),
    [flip, setFlip] = useState(false);
  const S = useRef({
    x: -3,
    prevPhi: 0,
    emf: 0,
    hist: [],
    t: 0,
    dragging: false
  });
  const geo = useRef({
    cx: 0,
    u: 60
  });
  const [live, push] = useLive({
    emf: 0,
    phi: 0
  });
  const ref = useCanvas((ctx, w, h, t, dt) => {
    const s = S.current;
    if (auto && !s.dragging) s.x = Math.sin(t * 2.2) * 3;
    const phi = (flip ? -1 : 1) * Math.exp(-(s.x * s.x) / 0.8);
    const emf = dt > 0 ? -N * (phi - s.prevPhi) / dt / 10 : 0;
    s.emf += (emf - s.emf) * 0.3;
    s.prevPhi = phi;
    s.t += dt;
    if (!s.hist.length || s.t - s.hist[s.hist.length - 1][0] > 0.03) {
      s.hist.push([s.t, s.emf]);
      if (s.hist.length > 200) s.hist.shift();
    }
    push({
      emf: s.emf,
      phi
    });
    clear(ctx, w, h);
    grid(ctx, w, h, 32);
    const u = Math.min(70, w / 10),
      cx = w / 2,
      cy = h * 0.34;
    geo.current = {
      cx,
      u
    };
    // coil back
    const cw = 26 + N * 1.5;
    for (let i = 0; i < Math.min(N, 30); i++) {
      const x = cx - cw + i * 2 * cw / Math.min(N, 30);
      ctx.strokeStyle = "#c27a3a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(x, cy, 8, 46, 0, Math.PI / 2, 3 * Math.PI / 2);
      ctx.stroke();
    }
    // magnet
    const mx = cx + s.x * u;
    rrect(ctx, mx - 50, cy - 16, 50, 32, 4, flip ? C.cobalt : C.red);
    rrect(ctx, mx, cy - 16, 50, 32, 4, flip ? C.red : C.cobalt);
    text(ctx, flip ? "S" : "N", mx - 25, cy, C.chalk, 16, "center", 800);
    text(ctx, flip ? "N" : "S", mx + 25, cy, C.chalk, 16, "center", 800);
    for (let i = 0; i < Math.min(N, 30); i++) {
      const x = cx - cw + i * 2 * cw / Math.min(N, 30);
      ctx.strokeStyle = "#e89a55";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(x, cy, 8, 46, 0, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    }
    // galvanometer
    const gx = cx,
      gy = cy + 120,
      gr = 44;
    ctx.strokeStyle = "#e89a55";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - cw, cy + 46);
    ctx.lineTo(cx - cw, gy);
    ctx.lineTo(gx - gr, gy);
    ctx.moveTo(cx + cw, cy + 46);
    ctx.lineTo(cx + cw, gy);
    ctx.lineTo(gx + gr, gy);
    ctx.stroke();
    circle(ctx, gx, gy, gr, "#0d0f2b", C.chalk, 3);
    const a = -Math.PI / 2 + Math.max(-1.2, Math.min(1.2, s.emf / 6));
    arrow(ctx, gx, gy, gx + Math.cos(a) * gr * 0.85, gy + Math.sin(a) * gr * 0.85, C.tang, 3);
    mono(ctx, "0", gx, gy - gr + 10, C.dim, 10, "center");
    const b = Math.min(1, Math.abs(s.emf) / 8);
    glow(ctx, C.sun, b * 40);
    circle(ctx, gx + 110, gy, 18, `rgba(255,193,46,${0.1 + b * 0.9})`, C.chalk, 2);
    noGlow(ctx);
    if (h > 330) plot(ctx, {
      x: 12,
      y: gy + gr + 16,
      w: w - 24,
      h: h - gy - gr - 24
    }, [{
      pts: s.hist.map(p => [p[0] - s.hist[0][0], p[1]]),
      color: C.tang,
      label: T("EMF")
    }], {
      title: T("induced EMF vs time"),
      xmax: Math.max(4, (s.hist.at(-1)?.[0] || 0) - (s.hist[0]?.[0] || 0)),
      ymin: -12,
      ymax: 12
    });
    text(ctx, auto ? T("Auto mode: the magnet oscillates") : T("Drag the magnet in and out ✋"), 14, 18, C.dim, 12);
  }, []);
  const onPointer = {
    onPointerDown: e => {
      S.current.dragging = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerMove: e => {
      if (!S.current.dragging) return;
      const r = e.currentTarget.getBoundingClientRect();
      S.current.x = Math.max(-5, Math.min(5, (e.clientX - r.left - geo.current.cx) / geo.current.u));
    },
    onPointerUp: () => {
      S.current.dragging = false;
    }
  };
  return <SimFrame compact={compact} canvasRef={ref} onPointer={onPointer} readouts={[{
    l: T("flux Φ (relative)"),
    v: f1(live.phi, 2),
    u: "",
    c: C.cobalt
  }, {
    l: T("induced EMF"),
    v: f1(live.emf, 2),
    u: "V",
    c: C.tang
  }, {
    l: T("turns N"),
    v: N,
    u: ""
  }]} controls={<>
        <Slider label={T("Number of turns N")} value={N} min={1} max={50} onChange={setN} color={C.sun} />
        <div className="sim-row"><Check label={T("Auto-move magnet")} value={auto} onChange={setAuto} /><Check label={T("Flip magnet (N↔S)")} value={flip} onChange={setFlip} /></div>
        <p className="sim-note">{T("Still magnet = no current. Faster motion = bigger EMF (Faraday). The current opposes the change (Lenz).")}</p>
      </>} formula={"\\varepsilon = -N\\dfrac{\\Delta\\Phi}{\\Delta t}"} />;
}

/* =====================================================================
   PHOTOELECTRIC EFFECT
   ===================================================================== */
const METALS = [[T("Cesium"), 2.1], [T("Sodium"), 2.3], [T("Zinc"), 4.3], [T("Copper"), 4.7]];
const nmToColor = nm => {
  if (nm < 380) return "#b49bff";
  if (nm < 450) return "#7b5cff";
  if (nm < 495) return "#3d8bff";
  if (nm < 570) return "#2fd47a";
  if (nm < 590) return "#ffe14a";
  if (nm < 620) return "#ff9a3d";
  return "#ff4d4d";
};
export function Photoelectric({
  compact
}) {
  const [nm, setNm] = useState(450),
    [I, setI] = useState(50),
    [metal, setMetal] = useState(1);
  const E = 1240 / nm,
    phi = METALS[metal][1],
    Ek = Math.max(0, E - phi);
  const S = useRef({
    ph: [],
    el: [],
    acc: 0
  });
  const ref = useCanvas((ctx, w, h, t, dt) => {
    const s = S.current;
    clear(ctx, w, h);
    const plateX = w * 0.42,
      lampX = 60,
      col = nmToColor(nm);
    s.acc += dt * (I / 8);
    while (s.acc > 1) {
      s.acc -= 1;
      s.ph.push({
        x: lampX + 30,
        y: h * 0.25 + Math.random() * h * 0.5
      });
    }
    s.ph.forEach(p => p.x += 420 * dt);
    s.ph = s.ph.filter(p => {
      if (p.x >= plateX) {
        if (Ek > 0) s.el.push({
          x: plateX + 6,
          y: p.y,
          vx: 60 + Math.sqrt(Ek) * 120,
          vy: (Math.random() - 0.5) * 60
        });
        return false;
      }
      return true;
    });
    s.el.forEach(e => {
      e.x += e.vx * dt;
      e.y += e.vy * dt;
    });
    s.el = s.el.filter(e => e.x < w - 60);
    // lamp
    glow(ctx, col, 30);
    rrect(ctx, lampX - 20, h / 2 - 40, 50, 80, 12, col);
    noGlow(ctx);
    ctx.fillStyle = col;
    ctx.globalAlpha = 0.07 + I / 900;
    ctx.beginPath();
    ctx.moveTo(lampX + 30, h / 2 - 40);
    ctx.lineTo(plateX, h * 0.18);
    ctx.lineTo(plateX, h * 0.82);
    ctx.lineTo(lampX + 30, h / 2 + 40);
    ctx.fill();
    ctx.globalAlpha = 1;
    s.ph.forEach(p => {
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let k = 0; k < 18; k++) {
        const xx = p.x - k,
          yy = p.y + Math.sin(xx * 2 * Math.PI / (nm / 30)) * 4;
        k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy);
      }
      ctx.stroke();
    });
    rrect(ctx, plateX, h * 0.15, 14, h * 0.7, 4, "#b8bccf");
    text(ctx, METALS[metal][0], plateX + 7, h * 0.12, C.chalk, 12, "center", 800);
    rrect(ctx, w - 60, h * 0.15, 14, h * 0.7, 4, "#555a80");
    text(ctx, T("collector"), w - 53, h * 0.12, C.dim, 11, "center");
    s.el.forEach(e => {
      glow(ctx, C.cobalt, 10);
      circle(ctx, e.x, e.y, 5, C.cobalt);
      noGlow(ctx);
      text(ctx, "−", e.x, e.y - 1, C.chalk, 10, "center", 800);
    });
    text(ctx, Ek > 0 ? T("⚡ Electrons ejected!") : T("No electrons — frequency below threshold (brightness doesn't help!)"), w / 2 + 20, 20, Ek > 0 ? C.teal : C.pink, 14, "center", 800);
  }, []);
  return <SimFrame compact={compact} canvasRef={ref} readouts={[{
    l: T("photon energy hf"),
    v: f1(E, 2),
    u: "eV",
    c: C.sun
  }, {
    l: T("work function φ"),
    v: phi,
    u: "eV"
  }, {
    l: T("Ek max = hf − φ"),
    v: f1(Ek, 2),
    u: "eV",
    c: C.teal
  }, {
    l: T("frequency"),
    v: f1(3e8 / (nm * 1e-9) / 1e14, 2),
    u: "×10¹⁴ Hz"
  }]} controls={<>
        <Slider label={T("Wavelength (colour)")} value={nm} min={150} max={750} unit="nm" onChange={setNm} color={nmToColor(nm)} />
        <div className="spectrum" />
        <Slider label={T("Intensity (brightness)")} value={I} min={5} max={100} unit="%" onChange={setI} color={C.sun} />
        <Seg value={metal} options={METALS.map((m, i) => [i, m[0]])} onChange={setMetal} />
      </>} formula={"E = hf \\qquad E_{k,max} = hf - \\phi"} />;
}