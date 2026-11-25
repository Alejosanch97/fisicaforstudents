/* WAVES & LIGHT SIMS: wave machine · sound studio · refraction · lens bench · doppler */
import { useEffect, useRef, useState } from "react";
import { C, useCanvas, clear, grid, arrow, text, mono, circle, rrect, glow, noGlow, Slider, Seg, Check, SimFrame, f1 } from "./kit";

/* =====================================================================
   WAVE MACHINE — transverse, longitudinal, superposition
   ===================================================================== */
export function Waves({ compact }) {
  const [mode, setMode] = useState("trans");
  const [A, setA] = useState(40), [f, setF] = useState(1), [v, setV] = useState(2), [f2, setF2] = useState(1.2), [ruler, setRuler] = useState(true);
  const lam = v / f;
  const ref = useCanvas((ctx, w, h, t) => {
    clear(ctx, w, h); grid(ctx, w, h, 40);
    const pxm = Math.max(40, (w - 60) / 6); // pixels per metre
    const x0 = 30, cy = h / 2, k = (2 * Math.PI) / lam, om = 2 * Math.PI * f;
    const y1 = (x) => A * Math.sin(k * x - om * t);
    // source
    rrect(ctx, 6, cy - 30, 18, 60, 6, C.tang);
    if (mode === "trans") {
      ctx.strokeStyle = C.cobalt; ctx.lineWidth = 3; ctx.beginPath();
      for (let X = 0; X < w - x0; X += 3) { const x = X / pxm; X ? ctx.lineTo(x0 + X, cy - y1(x)) : ctx.moveTo(x0 + X, cy - y1(x)); }
      ctx.stroke();
      for (let X = 0; X < w - x0; X += pxm / 4) circle(ctx, x0 + X, cy - y1(X / pxm), 4, C.chalk);
      const mx = 2.25; glow(ctx, C.red); circle(ctx, x0 + mx * pxm, cy - y1(mx), 8, C.red); noGlow(ctx);
      text(ctx, "this particle only goes up & down ↕", x0 + mx * pxm + 14, cy - A - 26, C.red, 12);
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C.faint; ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(w, cy); ctx.stroke(); ctx.setLineDash([]);
      arrow(ctx, w - 30, cy, w - 30, cy - A, C.pink, 2, "A");
    } else if (mode === "long") {
      const rows = 9;
      for (let r = 0; r < rows; r++) {
        for (let X0 = 0; X0 < w - x0; X0 += 12) {
          const x = X0 / pxm, dx = (A / 3) * Math.sin(k * x - om * t);
          const marked = r === 4 && Math.abs(X0 - 2.25 * pxm) < 6;
          circle(ctx, x0 + X0 + dx, cy - 80 + r * 20, marked ? 7 : 3.2, marked ? C.red : C.cobalt);
        }
      }
      text(ctx, "compression = particles close · rarefaction = particles apart", w / 2, cy + 110, C.dim, 12, "center");
    } else {
      const y2 = (x) => A * 0.8 * Math.sin(((2 * Math.PI * f2) / v) * x - 2 * Math.PI * f2 * t);
      [[y1, C.teal, cy - 110, 1.5], [y2, C.lilac, cy - 110, 1.5], [(x) => y1(x) + y2(x), C.sun, cy + 40, 3.5]].forEach(([fn, col, yy, lw]) => {
        ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
        for (let X = 0; X < w - x0; X += 3) { const x = X / pxm; X ? ctx.lineTo(x0 + X, yy - fn(x) * (yy === cy + 40 ? 0.8 : 0.6)) : ctx.moveTo(x0 + X, yy - fn(x) * 0.6); }
        ctx.stroke();
      });
      text(ctx, "wave 1 + wave 2", 40, 22, C.dim, 12); text(ctx, "= superposition (interference)", 40, cy - 30, C.sun, 13, "left", 700);
    }
    if (ruler && mode !== "super") {
      // measure one wavelength from a crest
      const phase = (om * t) / k; let xc = ((phase + lam / 4) % lam + lam) % lam; if (xc < 0.3) xc += lam;
      const yR = mode === "trans" ? cy + A + 34 : cy + 90;
      if (x0 + (xc + lam) * pxm < w - 10) {
        ctx.strokeStyle = C.sun; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + xc * pxm, yR); ctx.lineTo(x0 + (xc + lam) * pxm, yR); ctx.stroke();
        ctx.fillStyle = C.sun; ctx.fillRect(x0 + xc * pxm - 1, yR - 8, 2, 16); ctx.fillRect(x0 + (xc + lam) * pxm - 1, yR - 8, 2, 16);
        text(ctx, `λ = ${f1(lam, 2)} m`, x0 + (xc + lam / 2) * pxm, yR + 14, C.sun, 13, "center", 800);
      }
    }
    for (let m = 0; m * pxm < w - x0; m++) mono(ctx, m + " m", x0 + m * pxm, h - 12, C.dim, 10, "center");
  }, []);

  return (
    <SimFrame compact={compact} canvasRef={ref}
      readouts={[
        { l: "wavelength λ = v/f", v: f1(lam, 2), u: "m", c: C.sun }, { l: "period T = 1/f", v: f1(1 / f, 2), u: "s" },
        { l: "speed v", v: f1(v, 1), u: "m/s", c: C.cobalt }, ...(mode === "super" ? [{ l: "beat f = |f₁ − f₂|", v: f1(Math.abs(f - f2), 2), u: "Hz", c: C.lilac }] : []),
      ]}
      controls={<>
        <Seg value={mode} options={[["trans", "〰️ Transverse"], ["long", "⫴ Longitudinal"], ["super", "➕ Interference"]]} onChange={setMode} />
        <Slider label="Amplitude A" value={A} min={5} max={70} unit="px" onChange={setA} color={C.pink} />
        <Slider label="Frequency f" value={f} min={0.2} max={3} step={0.1} unit="Hz" onChange={setF} color={C.tang} />
        <Slider label="Wave speed v (medium)" value={v} min={0.5} max={5} step={0.1} unit="m/s" onChange={setV} color={C.cobalt} />
        {mode === "super" && <Slider label="Frequency of wave 2" value={f2} min={0.2} max={3} step={0.05} unit="Hz" onChange={setF2} color={C.lilac} />}
        <Check label="λ ruler" value={ruler} onChange={setRuler} />
      </>}
      formula={"v = \\lambda f \\qquad T = \\dfrac{1}{f}"}
    />
  );
}

/* =====================================================================
   SOUND STUDIO — real audio with WebAudio + oscilloscope
   ===================================================================== */
const NOTES = [["C4", 261.6], ["D4", 293.7], ["E4", 329.6], ["F4", 349.2], ["G4", 392], ["A4", 440], ["B4", 493.9], ["C5", 523.3]];
export function Sound({ compact }) {
  const [freq, setFreq] = useState(440), [vol, setVol] = useState(0.15), [type, setType] = useState("sine"), [on, setOn] = useState(false), [beat, setBeat] = useState(false), [f2, setF2] = useState(444);
  const A = useRef(null);
  useEffect(() => () => { if (A.current) { A.current.ctx.close(); A.current = null; } }, []);
  useEffect(() => {
    if (!on) { if (A.current) { A.current.ctx.close(); A.current = null; } return; }
    if (!A.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const gain = ctx.createGain(); const an = ctx.createAnalyser(); an.fftSize = 2048;
      const o1 = ctx.createOscillator(); const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
      o1.connect(gain); o2.connect(g2); g2.connect(gain); gain.connect(an); an.connect(ctx.destination);
      o1.start(); o2.start();
      A.current = { ctx, gain, an, o1, o2, g2, buf: new Float32Array(2048) };
    }
    const a = A.current;
    a.o1.type = type; a.o2.type = type;
    a.o1.frequency.setTargetAtTime(freq, a.ctx.currentTime, 0.02);
    a.o2.frequency.setTargetAtTime(f2, a.ctx.currentTime, 0.02);
    a.g2.gain.setTargetAtTime(beat ? 1 : 0, a.ctx.currentTime, 0.02);
    a.gain.gain.setTargetAtTime(vol * (beat ? 0.5 : 1), a.ctx.currentTime, 0.02);
  }, [on, freq, vol, type, beat, f2]);

  const ref = useCanvas((ctx, w, h, t) => {
    clear(ctx, w, h); grid(ctx, w, h, 32);
    const cy = h * 0.45, amp = (h * 0.3) * Math.min(1, vol / 0.3 + 0.25);
    ctx.strokeStyle = C.faint; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    glow(ctx, C.teal, 14); ctx.strokeStyle = C.teal; ctx.lineWidth = 3; ctx.beginPath();
    if (A.current) {
      const a = A.current; a.an.getFloatTimeDomainData(a.buf);
      let s0 = 0; for (let i = 1; i < 1024; i++) if (a.buf[i - 1] < 0 && a.buf[i] >= 0) { s0 = i; break; }
      const n = 900;
      for (let i = 0; i < n; i++) { const x = (i / n) * w, y = cy - (a.buf[s0 + i] / Math.max(0.05, vol)) * amp * 0.9; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    } else {
      const cycles = freq / 110;
      const wf = (p) => { const ph = p - Math.floor(p); if (type === "square") return ph < 0.5 ? 1 : -1; if (type === "triangle") return 4 * Math.abs(ph - 0.5) - 1; if (type === "sawtooth") return 2 * ph - 1; return Math.sin(2 * Math.PI * p); };
      for (let x = 0; x < w; x += 2) { const p = (x / w) * cycles - t * 0.3; const y = cy - wf(p) * amp * (beat ? Math.abs(Math.cos(Math.PI * (f2 - freq) * (x / w) * 0.05 * 20)) : 1); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    }
    ctx.stroke(); noGlow(ctx);
    // speaker + air particles
    const sy = h * 0.86;
    rrect(ctx, 10, sy - 22, 34, 44, 8, C.tang);
    for (let i = 0; i < 70; i++) { const x0 = 60 + i * ((w - 70) / 70); const dx = 6 * Math.sin((2 * Math.PI * freq) / 343 / 30 * x0 - t * (on ? 12 : 2)); circle(ctx, x0 + dx, sy + ((i * 37) % 30) - 15, 2.5, C.cobalt); }
    text(ctx, on ? "🔊 Playing — air particles vibrate back and forth" : "🔈 Press 'Play sound' (low volume!)", w / 2, 22, on ? C.teal : C.dim, 13, "center", 700);
  }, []);

  const note = NOTES.reduce((b, n) => (Math.abs(n[1] - freq) < Math.abs(b[1] - freq) ? n : b), NOTES[0]);
  return (
    <SimFrame compact={compact} canvasRef={ref}
      readouts={[
        { l: "frequency", v: Math.round(freq), u: "Hz", c: C.teal }, { l: "λ in air (343 m/s)", v: f1(343 / freq, 2), u: "m" },
        { l: "period", v: f1(1000 / freq, 2), u: "ms" }, { l: "closest note", v: note[0], u: "", c: C.sun },
        ...(beat ? [{ l: "beats per second", v: f1(Math.abs(f2 - freq), 1), u: "Hz", c: C.lilac }] : []),
      ]}
      controls={<>
        <button className={`sim-btn ${on ? "danger" : ""}`} onClick={() => setOn((o) => !o)}>{on ? "⏹ Stop sound" : "▶ Play sound"}</button>
        <Slider label="Frequency (pitch)" value={freq} min={80} max={2000} step={1} unit="Hz" onChange={setFreq} color={C.teal} />
        <Slider label="Volume (intensity)" value={vol} min={0} max={0.4} step={0.01} onChange={setVol} color={C.pink} fmt={(v) => Math.round(v * 250) + "%"} />
        <Seg value={type} options={[["sine", "∿ Pure"], ["triangle", "△ Soft"], ["square", "⊓ Retro"], ["sawtooth", "⩘ Buzz"]]} onChange={setType} />
        <div className="sim-keys">{NOTES.map(([n, fr]) => <button key={n} onClick={() => { setFreq(fr); setOn(true); }}>{n}</button>)}</div>
        <Check label="Add 2nd tone → beats" value={beat} onChange={setBeat} />
        {beat && <Slider label="2nd tone frequency" value={f2} min={freq - 15} max={freq + 15} step={0.5} unit="Hz" onChange={setF2} color={C.lilac} />}
      </>}
      formula={"\\lambda = \\dfrac{v}{f} \\qquad f_{beat} = |f_1 - f_2|"}
    />
  );
}

/* =====================================================================
   REFRACTION — Snell's law + total internal reflection
   ===================================================================== */
const MEDIA = [["Air", 1], ["Water", 1.33], ["Oil", 1.47], ["Glass", 1.5], ["Diamond", 2.42]];
export function Refraction({ compact }) {
  const [n1, setN1] = useState(1), [n2, setN2] = useState(1.33), [th, setTh] = useState(40);
  const s2 = (n1 * Math.sin((th * Math.PI) / 180)) / n2, tir = s2 > 1;
  const th2 = tir ? null : (Math.asin(s2) * 180) / Math.PI;
  const crit = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null;
  const ref = useCanvas((ctx, w, h, t) => {
    clear(ctx, w, h);
    const cy = h / 2, cx = w / 2, R = Math.min(w, h) * 0.42;
    ctx.fillStyle = `rgba(123,147,255,${0.05 + (n1 - 1) * 0.15})`; ctx.fillRect(0, 0, w, cy);
    ctx.fillStyle = `rgba(123,147,255,${0.05 + (n2 - 1) * 0.15})`; ctx.fillRect(0, cy, w, h - cy);
    text(ctx, `${MEDIA.find((m) => m[1] === n1)?.[0] || ""} · n₁ = ${n1}`, 14, 20, C.chalk, 13, "left", 700);
    text(ctx, `${MEDIA.find((m) => m[1] === n2)?.[0] || ""} · n₂ = ${n2}`, 14, h - 18, C.chalk, 13, "left", 700);
    ctx.strokeStyle = C.chalk; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.setLineDash([6, 6]); ctx.strokeStyle = C.dim; ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, "normal", cx + 6, cy - R + 8, C.dim, 11);
    const a = (th * Math.PI) / 180;
    const sx = cx - Math.sin(a) * R, sy = cy - Math.cos(a) * R;
    const pulse = (t * 0.6) % 1;
    const ray = (x1, y1, x2, y2, col, lw, alpha = 1) => { ctx.globalAlpha = alpha; glow(ctx, col, 12); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); noGlow(ctx); circle(ctx, x1 + (x2 - x1) * pulse, y1 + (y2 - y1) * pulse, lw + 1.5, C.chalk); ctx.globalAlpha = 1; };
    ray(sx, sy, cx, cy, C.sun, 4);
    rrect(ctx, sx - 14, sy - 8, 28, 16, 6, C.tang);
    ray(cx, cy, cx + Math.sin(a) * R, cy - Math.cos(a) * R, C.sun, tir ? 4 : 2, tir ? 1 : 0.35);
    if (!tir) { const b = (th2 * Math.PI) / 180; ray(cx, cy, cx + Math.sin(b) * R, cy + Math.cos(b) * R, C.teal, 4); }
    else { glow(ctx, C.pink); text(ctx, "TOTAL INTERNAL REFLECTION!", cx, cy + 40, C.pink, 18, "center", 800, "Bricolage Grotesque"); noGlow(ctx); }
    ctx.strokeStyle = C.sun; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, 46, -Math.PI / 2 - a, -Math.PI / 2); ctx.stroke();
    text(ctx, `θ₁ = ${th}°`, cx - 50, cy - 60, C.sun, 13, "right", 800);
    if (!tir) { const b = (th2 * Math.PI) / 180; ctx.strokeStyle = C.teal; ctx.beginPath(); ctx.arc(cx, cy, 46, Math.PI / 2 - b, Math.PI / 2); ctx.stroke(); text(ctx, `θ₂ = ${f1(th2, 1)}°`, cx + 54, cy + 62, C.teal, 13, "left", 800); }
  }, []);
  return (
    <SimFrame compact={compact} canvasRef={ref}
      readouts={[
        { l: "θ₂ (refracted)", v: tir ? "—" : f1(th2, 1), u: "°", c: C.teal }, { l: "critical angle", v: crit ? f1(crit, 1) : "none", u: crit ? "°" : "", c: C.pink },
        { l: "v in medium 1", v: f1(300 / n1, 0), u: "×10⁶ m/s" }, { l: "v in medium 2", v: f1(300 / n2, 0), u: "×10⁶ m/s" },
      ]}
      controls={<>
        <Slider label="Incident angle θ₁" value={th} min={0} max={89} unit="°" onChange={setTh} color={C.sun} />
        <b className="sim-label">Top medium</b><Seg value={n1} options={MEDIA.map(([n, v]) => [v, n])} onChange={setN1} />
        <b className="sim-label">Bottom medium</b><Seg value={n2} options={MEDIA.map(([n, v]) => [v, n])} onChange={setN2} />
        <button className="sim-btn ghost" onClick={() => { setN1(1.5); setN2(1); setTh(45); }}>💡 Optical fibre demo</button>
      </>}
      formula={"n_1\\sin\\theta_1 = n_2\\sin\\theta_2 \\qquad \\sin\\theta_c = \\dfrac{n_2}{n_1}"}
    />
  );
}

/* =====================================================================
   LENS BENCH — converging / diverging, principal rays
   ===================================================================== */
export function Lens({ compact }) {
  const [type, setType] = useState("conv"), [fA, setF] = useState(10), [dO, setDO] = useState(30), [hO, setHO] = useState(6);
  const f = type === "conv" ? fA : -fA;
  const dI = Math.abs(dO - f) < 1e-6 ? Infinity : 1 / (1 / f - 1 / dO);
  const M = -dI / dO, hI = M * hO;
  const ref = useCanvas((ctx, w, h) => {
    clear(ctx, w, h); grid(ctx, w, h, 30);
    const cx = w / 2, cy = h / 2, sc = Math.min((w / 2 - 20) / 55, (h / 2 - 20) / 18);
    const X = (x) => cx + x * sc, Y = (y) => cy - y * sc;
    ctx.strokeStyle = C.dim; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    // lens
    ctx.strokeStyle = C.cobalt; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, Y(16)); ctx.lineTo(cx, Y(-16)); ctx.stroke();
    const tip = (y, d) => { ctx.beginPath(); ctx.moveTo(cx - 9, Y(y) + d * 9); ctx.lineTo(cx, Y(y)); ctx.lineTo(cx + 9, Y(y) + d * 9); ctx.stroke(); };
    ctx.lineWidth = 3; if (type === "conv") { tip(16, 1); tip(-16, -1); } else { tip(16, -1); tip(-16, 1); }
    [[fA, "F"], [-fA, "F"], [2 * fA, "2F"], [-2 * fA, "2F"]].forEach(([x, l]) => { circle(ctx, X(x), cy, 4, C.sun); text(ctx, l, X(x), cy + 14, C.sun, 11, "center", 800); });
    // object
    arrow(ctx, X(-dO), cy, X(-dO), Y(hO), C.tang, 4, "object");
    const ray = (pts, col, dashed) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash(dashed ? [5, 5] : []); ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.stroke(); ctx.setLineDash([]); };
    const far = 60;
    // ray 1: parallel, then through F (or from virtual F)
    const s1 = -hO / f; // slope after lens
    ray([[-dO, hO], [0, hO], [far, hO + s1 * far]], C.sun);
    // ray 2: through the centre (straight)
    ray([[-dO, hO], [far, -(hO / dO) * far]], C.teal);
    // ray 3: towards the focal point, exits parallel
    const yAtLens = Math.abs(dO - f) < 1e-6 ? Infinity : (-hO * f) / (dO - f);
    if (isFinite(yAtLens) && Math.abs(yAtLens) < 40) ray([[-dO, hO], [0, yAtLens], [far, yAtLens]], C.pink);
    // virtual extensions
    if (isFinite(dI) && dI < 0) { ray([[0, hO], [dI, hI]], C.sun, true); ray([[-dO, hO], [dI, hI]], C.teal, true); }
    if (isFinite(dI) && Math.abs(dI) < 70 && Math.abs(hI) < 40) {
      ctx.globalAlpha = dI < 0 ? 0.55 : 1; arrow(ctx, X(dI), cy, X(dI), Y(hI), C.lilac, 4, dI < 0 ? "virtual image" : "image"); ctx.globalAlpha = 1;
    } else text(ctx, "Object at F → rays come out parallel, no image (∞)", w / 2, 20, C.pink, 14, "center", 700);
  }, [type, fA, dO, hO], { animate: false });
  const nature = !isFinite(dI) ? "No image (at infinity)" : `${dI > 0 ? "Real" : "Virtual"} · ${M < 0 ? "inverted" : "upright"} · ${Math.abs(M) > 1 ? "magnified" : "reduced"}`;
  return (
    <SimFrame compact={compact} canvasRef={ref}
      readouts={[
        { l: "image distance dᵢ", v: isFinite(dI) ? f1(dI, 1) : "∞", u: "cm", c: C.lilac }, { l: "magnification M", v: isFinite(M) ? f1(M, 2) : "∞", u: "×", c: C.sun },
        { l: "image height", v: isFinite(hI) ? f1(hI, 1) : "∞", u: "cm" }, { l: "nature", v: nature, u: "", c: C.teal },
      ]}
      controls={<>
        <Seg value={type} options={[["conv", "🔍 Converging"], ["div", "👓 Diverging"]]} onChange={setType} />
        <Slider label="Focal length |f|" value={fA} min={5} max={20} unit="cm" onChange={setF} color={C.sun} />
        <Slider label="Object distance dₒ" value={dO} min={2} max={50} unit="cm" onChange={setDO} color={C.tang} />
        <Slider label="Object height" value={hO} min={2} max={12} unit="cm" onChange={setHO} color={C.pink} />
        <p className="sim-note">🟡 parallel ray · 🟢 central ray · 🩷 focal ray</p>
      </>}
      formula={"\\dfrac{1}{f} = \\dfrac{1}{d_o} + \\dfrac{1}{d_i} \\qquad M = -\\dfrac{d_i}{d_o}"}
    />
  );
}

/* =====================================================================
   DOPPLER — moving source and wavefronts
   ===================================================================== */
export function Doppler({ compact }) {
  const [mach, setMach] = useState(0.4), [f0, setF0] = useState(500);
  const S = useRef({ x: 0, fronts: [], acc: 0 });
  const vs = mach * 340, fF = mach < 1 ? (f0 * 340) / (340 - vs) : Infinity, fB = (f0 * 340) / (340 + vs);
  const ref = useCanvas((ctx, w, h, _t, dt) => {
    const s = S.current, sc = 1.3, c = 60 * sc; // px per sim-second at sound speed
    s.x += mach * c * dt; if (s.x > w + 60) { s.x = -60; s.fronts = []; }
    s.acc += dt; if (s.acc > 0.18) { s.acc = 0; s.fronts.push({ x: s.x, r: 0 }); }
    s.fronts.forEach((fr) => (fr.r += c * dt)); s.fronts = s.fronts.filter((fr) => fr.r < w * 1.2);
    clear(ctx, w, h); grid(ctx, w, h, 40);
    const cy = h / 2;
    s.fronts.forEach((fr) => circle(ctx, fr.x, cy, fr.r, null, `rgba(123,147,255,${Math.max(0.1, 1 - fr.r / (w * 0.8))})`, 2));
    glow(ctx, C.tang); text(ctx, "🚑", s.x, cy, C.chalk, 34, "center"); noGlow(ctx);
    text(ctx, "👂", 40, cy + 70, C.chalk, 28, "center"); text(ctx, "👂", w - 40, cy + 70, C.chalk, 28, "center");
    mono(ctx, `behind: ${f1(fB, 0)} Hz (lower)`, 14, cy + 108, C.teal, 12);
    mono(ctx, mach < 1 ? `in front: ${f1(fF, 0)} Hz (higher)` : "SONIC BOOM 💥", w - 14, cy + 108, C.pink, 12, "right");
    if (mach >= 1) { glow(ctx, C.pink); text(ctx, mach === 1 ? "Mach 1 — wavefronts pile up!" : "Shock cone (Mach > 1)", w / 2, 24, C.pink, 16, "center", 800); noGlow(ctx); }
  }, []);
  return (
    <SimFrame compact={compact} canvasRef={ref}
      readouts={[
        { l: "source speed", v: f1(vs, 0), u: "m/s" }, { l: "heard in front", v: mach < 1 ? f1(fF, 0) : "boom", u: mach < 1 ? "Hz" : "", c: C.pink },
        { l: "heard behind", v: f1(fB, 0), u: "Hz", c: C.teal }, { l: "emitted", v: f0, u: "Hz", c: C.sun },
      ]}
      controls={<>
        <Slider label="Source speed (Mach)" value={mach} min={0} max={1.5} step={0.05} onChange={setMach} color={C.tang} fmt={(v) => v.toFixed(2)} />
        <Slider label="Emitted frequency" value={f0} min={200} max={1000} step={10} unit="Hz" onChange={setF0} color={C.sun} />
      </>}
      formula={"f' = f\\,\\dfrac{v}{v \\mp v_s}"}
    />
  );
}
