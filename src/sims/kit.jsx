/* =====================================================================
   MOMENTUM · SIM KIT — shared canvas engine, controls and drawing tools
   ===================================================================== */
import { useEffect, useRef, useState, useMemo } from "react";
import katex from "katex";
import { RotateCcw, Play, Pause } from "lucide-react";

export const C = {
  board: "#14163a", board2: "#1d2052", chalk: "#f4efe4", dim: "rgba(244,239,228,.45)", faint: "rgba(244,239,228,.12)",
  grid: "rgba(244,239,228,.06)", tang: "#ff6a45", sun: "#ffc12e", teal: "#2fd4b5", cobalt: "#7b93ff", lilac: "#b49bff", pink: "#ff7eb6", red: "#ff5d5d",
};

/* ---------- KaTeX ---------- */
export function Tex({ tex, block = false, className = "" }) {
  const html = useMemo(() => {
    try { return katex.renderToString(tex, { throwOnError: false, displayMode: block }); } catch { return tex; }
  }, [tex, block]);
  return <span className={`tex ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ---------- Canvas hook: resize + DPR + animation loop ---------- */
export function useCanvas(draw, deps = [], { animate = true } = {}) {
  const ref = useRef(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;
  const size = useRef({ w: 300, h: 200 });

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const fit = () => {
      const r = cv.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.current = { w: Math.max(200, r.width), h: Math.max(180, r.height) };
      cv.width = size.current.w * dpr; cv.height = size.current.h * dpr;
      cv.style.width = size.current.w + "px"; cv.style.height = size.current.h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!animate) drawRef.current(ctx, size.current.w, size.current.h, 0, 0);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(cv.parentElement);
    fit();
    let raf, last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      drawRef.current(ctx, size.current.w, size.current.h, now / 1000, dt);
      raf = requestAnimationFrame(loop);
    };
    if (animate) raf = requestAnimationFrame(loop);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate]);

  useEffect(() => {
    if (!animate && ref.current) {
      const ctx = ref.current.getContext("2d");
      drawRef.current(ctx, size.current.w, size.current.h, 0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/* throttled live readouts (state that refreshes ~8 times/s) */
export function useLive(initial) {
  const [v, setV] = useState(initial);
  const last = useRef(0);
  const push = (val, force) => {
    const n = performance.now();
    if (force || n - last.current > 120) { last.current = n; setV(val); }
  };
  return [v, push];
}

/* ---------- drawing helpers ---------- */
export function clear(ctx, w, h) {
  ctx.fillStyle = C.board; ctx.fillRect(0, 0, w, h);
}
export function grid(ctx, w, h, step = 40, ox = 0, oy = 0) {
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.beginPath();
  for (let x = ((ox % step) + step) % step; x < w; x += step) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); }
  for (let y = ((oy % step) + step) % step; y < h; y += step) { ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); }
  ctx.stroke();
}
export function arrow(ctx, x1, y1, x2, y2, color = C.sun, width = 3, label) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  if (len < 2) return;
  const ang = Math.atan2(dy, dx), head = Math.min(14, 6 + width * 2);
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(ang) * head * 0.6, y2 - Math.sin(ang) * head * 0.6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(ang - 0.42), y2 - head * Math.sin(ang - 0.42));
  ctx.lineTo(x2 - head * Math.cos(ang + 0.42), y2 - head * Math.sin(ang + 0.42));
  ctx.closePath(); ctx.fill();
  if (label) text(ctx, label, x2 + Math.cos(ang) * 12, y2 + Math.sin(ang) * 12 - 4, color, 13, "center", 700);
}
export function text(ctx, s, x, y, color = C.chalk, size = 13, align = "left", weight = 600, font = "Figtree") {
  ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}, system-ui, sans-serif`; ctx.textAlign = align; ctx.textBaseline = "middle";
  ctx.fillText(s, x, y);
}
export function mono(ctx, s, x, y, color = C.chalk, size = 12, align = "left") {
  text(ctx, s, x, y, color, size, align, 600, "JetBrains Mono");
}
export function circle(ctx, x, y, r, fill, stroke, lw = 2) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}
export function rrect(ctx, x, y, w, h, r, fill, stroke, lw = 2) {
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}
export function glow(ctx, color, blur = 18) { ctx.shadowColor = color; ctx.shadowBlur = blur; }
export function noGlow(ctx) { ctx.shadowBlur = 0; ctx.shadowColor = "transparent"; }

/* mini plot inside a rectangle. series: [{pts:[[x,y]], color, label}] */
export function plot(ctx, r, series, o = {}) {
  const { x, y, w, h } = r;
  rrect(ctx, x, y, w, h, 12, "rgba(10,11,40,.72)", C.faint, 1);
  const pad = { l: 38, r: 10, t: 22, b: 22 };
  const X0 = x + pad.l, Y0 = y + h - pad.b, W = w - pad.l - pad.r, H = h - pad.t - pad.b;
  let xmax = o.xmax ?? 1, ymin = o.ymin ?? 0, ymax = o.ymax ?? 1;
  if (o.auto) {
    series.forEach((s) => s.pts.forEach(([px, py]) => { xmax = Math.max(xmax, px); ymax = Math.max(ymax, py); ymin = Math.min(ymin, py); }));
    if (ymax === ymin) ymax = ymin + 1;
  }
  const sx = (v) => X0 + (v / xmax) * W, sy = (v) => Y0 - ((v - ymin) / (ymax - ymin)) * H;
  ctx.strokeStyle = C.faint; ctx.lineWidth = 1; ctx.beginPath();
  for (let i = 0; i <= 4; i++) { const yy = Y0 - (H * i) / 4; ctx.moveTo(X0, yy); ctx.lineTo(X0 + W, yy); }
  ctx.stroke();
  ctx.strokeStyle = C.dim; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X0, y + pad.t - 4); ctx.lineTo(X0, Y0); ctx.lineTo(X0 + W + 4, Y0); ctx.stroke();
  if (ymin < 0 && ymax > 0) { ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X0, sy(0)); ctx.lineTo(X0 + W, sy(0)); ctx.stroke(); ctx.setLineDash([]); }
  mono(ctx, fmtS(ymax), X0 - 4, y + pad.t, C.dim, 10, "right");
  mono(ctx, fmtS(ymin), X0 - 4, Y0, C.dim, 10, "right");
  mono(ctx, fmtS(xmax), X0 + W, Y0 + 12, C.dim, 10, "right");
  if (o.title) text(ctx, o.title, X0, y + 11, C.chalk, 12, "left", 700);
  if (o.xl) text(ctx, o.xl, X0 + W / 2, Y0 + 12, C.dim, 10, "center", 600);
  series.forEach((s) => {
    if (!s.pts.length) return;
    ctx.strokeStyle = s.color; ctx.lineWidth = s.width || 2.5; ctx.lineJoin = "round"; ctx.beginPath();
    s.pts.forEach(([px, py], i) => { const X = sx(Math.min(px, xmax)), Y = sy(Math.max(ymin, Math.min(ymax, py))); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
    ctx.stroke();
    const [lx, ly] = s.pts[s.pts.length - 1];
    circle(ctx, sx(Math.min(lx, xmax)), sy(Math.max(ymin, Math.min(ymax, ly))), 4, s.color);
  });
  let lx = X0 + W;
  [...series].reverse().forEach((s) => { if (!s.label) return; ctx.font = "700 11px Figtree"; const tw = ctx.measureText(s.label).width; lx -= tw + 18; circle(ctx, lx + 4, y + 11, 4, s.color); text(ctx, s.label, lx + 11, y + 11, s.color, 11, "left", 700); });
}
const fmtS = (v) => (Math.abs(v) >= 1000 ? (v / 1000).toFixed(1) + "k" : Math.abs(v) < 10 && v % 1 ? v.toFixed(1) : Math.round(v).toString());

/* ---------- UI controls ---------- */
export function Slider({ label, value, min, max, step = 1, unit = "", onChange, color = "var(--tang)", fmt }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="sim-slider">
      <span className="sim-slider-top">
        <span>{label}</span>
        <b style={{ color }}>{fmt ? fmt(value) : value}{unit && <small> {unit}</small>}</b>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--pct": pct + "%", "--c": color }} />
    </label>
  );
}
export function Seg({ value, options, onChange }) {
  return (
    <div className="sim-seg">
      {options.map((o) => {
        const [v, l] = Array.isArray(o) ? o : [o, o];
        return <button key={v} className={value === v ? "on" : ""} onClick={() => onChange(v)}>{l}</button>;
      })}
    </div>
  );
}
export function Check({ label, value, onChange }) {
  return (
    <label className="sim-check">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <span className="box" />{label}
    </label>
  );
}
export function Readout({ items }) {
  return (
    <div className="sim-readouts">
      {items.map((it) => (
        <div key={it.l} className="sim-ro" style={{ "--c": it.c || "var(--chalk)" }}>
          <span>{it.l}</span>
          <b>{it.v}<small>{it.u ? " " + it.u : ""}</small></b>
        </div>
      ))}
    </div>
  );
}

/* ---------- the frame every sim uses ---------- */
export function SimFrame({ canvasRef, controls, readouts, formula, playing, onPlay, onReset, hint, compact, children, onPointer }) {
  return (
    <div className={`sim-frame ${compact ? "compact" : ""}`}>
      <div className="sim-stage">
        <canvas ref={canvasRef} {...(onPointer || {})} />
        {children}
        <div className="sim-stage-tools">
          {onPlay && <button className="sim-round" onClick={onPlay} title={playing ? "Pause" : "Play"}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>}
          {onReset && <button className="sim-round" onClick={onReset} title="Reset"><RotateCcw size={17} /></button>}
        </div>
        {hint && <div className="sim-hint">{hint}</div>}
      </div>
      <aside className="sim-panel">
        {readouts && <Readout items={readouts} />}
        <div className="sim-controls">{controls}</div>
        {formula && <div className="sim-formula"><Tex tex={formula} block /></div>}
      </aside>
    </div>
  );
}

export const f1 = (n, d = 1) => (Number.isFinite(n) ? n.toFixed(d) : "—");
