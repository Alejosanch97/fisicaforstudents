/* =====================================================================
   MOMENTUM · ICFES-STYLE QUESTION BANK
   100 questions per grade = 4 terms × (5 conceptual + 20 generated).
   Generated questions use a SEEDED random generator, so the bank is
   always the same (question #37 of grade 9 is always question #37).
   ===================================================================== */
import { UNITS } from "./curriculum";

/* ---------- seeded RNG ---------- */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const makeR = (seed) => {
  const r = mulberry32(seed);
  return {
    f: r,
    int: (a, b) => a + Math.floor(r() * (b - a + 1)),
    pick: (arr) => arr[Math.floor(r() * arr.length)],
    step: (a, b, s) => a + s * Math.floor(r() * (Math.floor((b - a) / s) + 1)),
  };
};

/* ---------- number formatting ---------- */
const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
export function fmt(n) {
  if (!isFinite(n)) return "—";
  const a = Math.abs(n);
  if (a !== 0 && (a >= 1e6 || a < 1e-3)) {
    const e = Math.floor(Math.log10(a));
    let m = n / 10 ** e;
    m = Math.round(m * 100) / 100;
    return `${m} × 10${String(e).split("").map((c) => SUP[c]).join("")}`;
  }
  const r = a >= 100 ? Math.round(n * 10) / 10 : a >= 1 ? Math.round(n * 100) / 100 : Math.round(n * 1000) / 1000;
  return r.toLocaleString("en-US", { maximumFractionDigits: 3 });
}

/* ---------- build 4 options from the correct value + typical mistakes ---------- */
function options(R, a, wrong, unit) {
  const u = unit ? " " + unit : "";
  const set = [fmt(a) + u];
  const extra = [a * 2, a / 2, a * 10, a / 10, a * 1.5, a + (Math.abs(a) > 5 ? 3 : 0.5), a * 4, -a];
  [...wrong, ...extra].forEach((w) => {
    if (set.length >= 4 || !isFinite(w)) return;
    const s = fmt(w) + u;
    if (!set.includes(s)) set.push(s);
  });
  const order = set.map((s, i) => ({ s, k: R.f(), i })).sort((x, y) => x.k - y.k);
  return { opts: order.map((o) => o.s), ans: order.findIndex((o) => o.i === 0) };
}

const deg = (x) => (x * Math.PI) / 180;
const G = 10;

/* =====================================================================
   TEMPLATES: (R) => { q, a, u, w:[typical wrong answers], ex, lv }
   ===================================================================== */
const T = {
  /* ---- measurement ---- */
  unitLen: (R) => { const v = R.pick([1.2, 2.5, 3.75, 12, 45, 0.8, 7.4]); const k = R.pick(["km→m", "m→cm", "cm→mm", "m→mm"]); const f = { "km→m": 1000, "m→cm": 100, "cm→mm": 10, "m→mm": 1000 }[k]; const [a1, b1] = k.split("→"); return { q: `A school path for wheelchairs measures ${v} ${a1}. How long is it in ${b1}?`, a: v * f, u: b1, w: [v / f, v * f / 10, v * f * 10], ex: `Going down the staircase from ${a1} to ${b1}: multiply by ${f}.`, lv: 1 }; },
  unitMass: (R) => { const v = R.pick([350, 1250, 4500, 80, 2700]); return { q: `A bag of rice has a mass of ${v} g. What is its mass in kilograms?`, a: v / 1000, u: "kg", w: [v * 1000, v / 100, v / 10], ex: "1 kg = 1 000 g, so divide by 1 000.", lv: 1 }; },
  unitTime: (R) => { const h = R.pick([1.5, 2, 0.25, 3, 0.75]); return { q: `A football training lasts ${h} hours. How many seconds is that?`, a: h * 3600, u: "s", w: [h * 60, h * 360, h * 100], ex: "1 h = 3 600 s.", lv: 1 }; },
  imperial: (R) => { const k = R.pick(["in", "ft", "mi", "lb"]); const v = R.int(2, 40); const d = { in: [2.54, "cm", "A tablet screen is"], ft: [30.48, "cm", "A door is"], mi: [1.609, "km", "A marathon route is"], lb: [0.454, "kg", "A dog has a mass of"] }[k]; return { q: `${d[2]} ${v} ${k}. Convert to ${d[1]}.`, a: v * d[0], u: d[1], w: [v / d[0], v * d[0] * 10, v + d[0]], ex: `1 ${k} = ${d[0]} ${d[1]}.`, lv: 2 }; },
  prefix: (R) => { const p = R.pick([["kilo", 1000], ["centi", 0.01], ["milli", 0.001], ["mega", 1e6], ["micro", 1e-6]]); return { q: `What does the prefix "${p[0]}" mean?`, a: p[1], u: "× base unit", w: [1 / p[1], p[1] * 10, p[1] / 10], ex: `${p[0]} = ${fmt(p[1])}.`, lv: 1 }; },
  sciNot: (R) => { const m = R.pick([3.2, 4.5, 6.02, 1.6, 7.8]); const e = R.pick([-6, -4, 5, 7, 8]); return { q: `Which number equals ${(m * 10 ** e).toLocaleString("en-US", { maximumFractionDigits: 8 })}?`, a: m * 10 ** e, w: [m * 10 ** -e, m * 10 ** (e + 1), m * 10 ** (e - 1)], ex: "Count how many places the decimal point jumps.", lv: 2 }; },

  /* ---- matter & heat ---- */
  density: (R) => { const m = R.step(20, 400, 20), V = R.pick([10, 20, 25, 40, 50]); return { q: `A recycled block has mass ${m} g and volume ${V} cm³. What is its density?`, a: m / V, u: "g/cm³", w: [V / m, m * V, m - V], ex: "ρ = m / V.", lv: 1 }; },
  weight: (R) => { const m = R.int(3, 90); return { q: `What is the weight of a ${m} kg object on Earth? (g = 10 m/s²)`, a: m * G, u: "N", w: [m, m / G, m * 9.8 * 10], ex: "W = m·g.", lv: 1 }; },
  tempCF: (R) => { const c = R.pick([10, 20, 25, 30, 35, 40, -10, 100]); return { q: `The temperature in Valledupar is ${c} °C. What is it in °F?`, a: c * 1.8 + 32, u: "°F", w: [c * 1.8, (c + 32) * 1.8, (c - 32) / 1.8], ex: "°F = 1.8·°C + 32.", lv: 2 }; },
  tempFC: (R) => { const f = R.pick([50, 68, 86, 104, 212, 14, 32]); return { q: `A recipe from the USA says ${f} °F. What is that in °C?`, a: (f - 32) / 1.8, u: "°C", w: [f / 1.8 - 32, (f + 32) / 1.8, f * 1.8 + 32], ex: "°C = (°F − 32) / 1.8. Subtract FIRST.", lv: 2 }; },
  tempCK: (R) => { const c = R.pick([-20, 0, 27, 37, 100, -196]); return { q: `Convert ${c} °C to kelvin.`, a: c + 273, u: "K", w: [c - 273, 273 - c, c * 273], ex: "K = °C + 273.", lv: 1 }; },
  tempKC: (R) => { const k = R.pick([77, 250, 300, 373, 400, 1000]); return { q: `A gas is at ${k} K. What is its temperature in °C?`, a: k - 273, u: "°C", w: [k + 273, 273 - k, k / 273], ex: "°C = K − 273.", lv: 1 }; },
  heatQ: (R) => { const m = R.pick([0.5, 1, 2, 3]), dT = R.pick([5, 10, 20, 25, 40]); const mat = R.pick([["water", 4186], ["aluminium", 900], ["iron", 450]]); return { q: `How much heat raises ${m} kg of ${mat[0]} by ${dT} °C? (c = ${mat[1]} J/kg·°C)`, a: m * mat[1] * dT, u: "J", w: [mat[1] * dT, m * mat[1], m * dT], ex: "Q = m·c·ΔT.", lv: 2 }; },
  latent: (R) => { const m = R.pick([0.2, 0.5, 1, 2]); return { q: `How much energy melts ${m} kg of ice at 0 °C? (L = 334 000 J/kg)`, a: m * 334000, u: "J", w: [334000 / m, m * 4186, m * 33400], ex: "Q = m·L. Temperature doesn't change during melting.", lv: 2 }; },

  /* ---- kinematics ---- */
  speed: (R) => { const d = R.step(20, 300, 10), t = R.pick([4, 5, 10, 20, 25]); return { q: `A sea turtle swims ${d} m in ${t} s. What is its average speed?`, a: d / t, u: "m/s", w: [d * t, t / d, d - t], ex: "v = d / t.", lv: 1 }; },
  distance: (R) => { const v = R.pick([2, 3, 5, 8, 12]), t = R.step(10, 120, 10); return { q: `A boat moves at ${v} m/s for ${t} s. How far does it travel?`, a: v * t, u: "m", w: [t / v, v / t, v + t], ex: "d = v·t.", lv: 1 }; },
  kmh: (R) => { const v = R.pick([18, 36, 54, 72, 90, 108]); return { q: `A bus travels at ${v} km/h. What is its speed in m/s?`, a: v / 3.6, u: "m/s", w: [v * 3.6, v / 36, v / 60], ex: "Divide km/h by 3.6.", lv: 1 }; },
  accel: (R) => { const v = R.step(10, 40, 5), t = R.pick([2, 4, 5, 10]); return { q: `A delivery truck goes from 0 to ${v} m/s in ${t} s. What is its acceleration?`, a: v / t, u: "m/s²", w: [v * t, t / v, v / (2 * t)], ex: "a = Δv / t.", lv: 1 }; },
  uva: (R) => { const a = R.pick([1, 2, 3, 4]), t = R.pick([2, 4, 5, 6, 10]); return { q: `A car starts from rest with a = ${a} m/s². How far does it go in ${t} s?`, a: 0.5 * a * t * t, u: "m", w: [a * t * t, a * t, 0.5 * a * t], ex: "x = ½·a·t² (v₀ = 0).", lv: 2 }; },
  mruPos: (R) => { const x0 = R.step(-50, 100, 10), v = R.pick([-6, -4, 3, 5, 8, 12]), t = R.pick([3, 5, 10]); return { q: `A cyclist starts at x₀ = ${x0} m and moves at v = ${v} m/s. Where is she after ${t} s?`, a: x0 + v * t, u: "m", w: [v * t, x0 - v * t, x0 + v + t], ex: "x = x₀ + v·t.", lv: 2 }; },
  brake: (R) => { const v = R.pick([10, 15, 20, 25, 30]), a = R.pick([2, 4, 5]); return { q: `A car moving at ${v} m/s brakes with a = −${a} m/s² until it stops. What is the braking distance?`, a: (v * v) / (2 * a), u: "m", w: [(v * v) / a, v / a, v * a], ex: "0 = v₀² + 2aΔx → Δx = v₀² / 2a.", lv: 3 }; },
  vgArea: (R) => { const v = R.pick([4, 6, 8, 10, 15]), t = R.pick([3, 5, 6, 8]); return { q: `A v–t graph shows a constant velocity of ${v} m/s from t = 0 to t = ${t} s. What is the displacement?`, a: v * t, u: "m", w: [v / t, 0.5 * v * t, v + t], ex: "Displacement = area under the v–t graph.", lv: 2 }; },
  freefallH: (R) => { const t = R.pick([1, 2, 3, 4]); return { q: `A mango falls from a tree for ${t} s (no air). How far does it fall? (g = 10 m/s²)`, a: 0.5 * G * t * t, u: "m", w: [G * t, G * t * t, 0.5 * G * t], ex: "h = ½·g·t².", lv: 2 }; },
  freefallV: (R) => { const t = R.pick([1, 2, 3, 5]); return { q: `What is the speed of a falling object after ${t} s, starting from rest? (g = 10 m/s²)`, a: G * t, u: "m/s", w: [0.5 * G * t * t, G / t, G * t * t], ex: "v = g·t.", lv: 1 }; },
  freefallT: (R) => { const h = R.pick([5, 20, 45, 80, 125]); return { q: `How long does it take for a stone to fall ${h} m from rest? (g = 10 m/s²)`, a: Math.sqrt((2 * h) / G), u: "s", w: [h / G, (2 * h) / G, Math.sqrt(h / G)], ex: "t = √(2h/g).", lv: 2 }; },
  vectorMag: (R) => { const [a, b] = R.pick([[3, 4], [6, 8], [5, 12], [8, 15]]); return { q: `A drone flies ${a} km east and then ${b} km north. What is the magnitude of its displacement?`, a: Math.hypot(a, b), u: "km", w: [a + b, b - a, a * b], ex: "R = √(A² + B²).", lv: 2 }; },
  components: (R) => { const F = R.pick([10, 20, 50, 100]); const [th, c, s] = R.pick([[37, 0.8, 0.6], [53, 0.6, 0.8], [30, 0.866, 0.5], [60, 0.5, 0.866]]); return { q: `A ${F} N force is applied at ${th}° above the horizontal. Horizontal component? (cos ${th}° = ${c})`, a: F * c, u: "N", w: [F * s, F / c, F], ex: "Fx = F·cos θ.", lv: 2 }; },
  dotProduct: (R) => { const A = R.int(2, 9), B = R.int(2, 9); const [th, c] = R.pick([[0, 1], [60, 0.5], [90, 0], [180, -1]]); return { q: `Vectors A = ${A} and B = ${B} form an angle of ${th}°. What is A·B?`, a: A * B * c, w: [A * B, A + B, A * B * (c === 0 ? 1 : 0)], ex: "A·B = AB·cos θ.", lv: 2 }; },

  /* ---- projectiles & circles ---- */
  horizLaunch: (R) => { const h = R.pick([5, 20, 45, 80]), v = R.pick([2, 3, 5, 8, 10]); const t = Math.sqrt((2 * h) / G); return { q: `A ball rolls off a ${h} m platform at ${v} m/s horizontally. How far from the base does it land? (g = 10)`, a: v * t, u: "m", w: [v * h / G, v * (2 * h) / G, h], ex: `t = √(2h/g) = ${fmt(t)} s; x = v·t.`, lv: 3 }; },
  range: (R) => { const v = R.pick([10, 20, 30, 40]); const th = R.pick([15, 30, 45, 60, 75]); return { q: `A projectile is launched at ${v} m/s and ${th}° (same height, no air). Range? (g = 10)`, a: (v * v * Math.sin(deg(2 * th))) / G, u: "m", w: [(v * v) / G, (v * v * Math.sin(deg(th))) / G, (v * Math.sin(deg(2 * th))) / G], ex: "R = v₀²·sin2θ / g.", lv: 3 }; },
  maxHeight: (R) => { const v = R.pick([10, 20, 30]); const th = R.pick([30, 45, 90]); const s = Math.sin(deg(th)); return { q: `A ball is kicked at ${v} m/s and ${th}°. Maximum height? (g = 10)`, a: (v * v * s * s) / (2 * G), u: "m", w: [(v * v * s) / (2 * G), (v * v) / G, (v * s) / G], ex: "H = v₀²·sin²θ / 2g.", lv: 3 }; },
  circularV: (R) => { const r = R.pick([0.5, 1, 2, 5, 10]), T = R.pick([0.5, 1, 2, 4]); return { q: `A point on a wheel of radius ${r} m completes one turn every ${T} s. Linear speed? (π ≈ 3.14)`, a: (2 * Math.PI * r) / T, u: "m/s", w: [(Math.PI * r) / T, (2 * Math.PI * T) / r, r / T], ex: "v = 2πr / T.", lv: 2 }; },
  centripetal: (R) => { const v = R.pick([2, 4, 6, 10, 20]), r = R.pick([1, 2, 4, 5, 10]); return { q: `A car takes a curve of radius ${r} m at ${v} m/s. Centripetal acceleration?`, a: (v * v) / r, u: "m/s²", w: [v / r, v * r, (v * v) / (2 * r)], ex: "ac = v² / r.", lv: 2 }; },
  periodFreq: (R) => { const f = R.pick([0.5, 2, 4, 5, 10, 50]); return { q: `A wind turbine (or wave) has a frequency of ${f} Hz. What is its period?`, a: 1 / f, u: "s", w: [f, 2 * f, 2 * Math.PI * f], ex: "T = 1 / f.", lv: 1 }; },

  /* ---- dynamics ---- */
  force: (R) => { const m = R.int(2, 50), a = R.pick([0.5, 1, 2, 3, 4]); return { q: `What net force accelerates a ${m} kg boat at ${a} m/s²?`, a: m * a, u: "N", w: [m / a, a / m, m + a], ex: "F = m·a.", lv: 1 }; },
  forceAcc: (R) => { const F = R.step(20, 200, 10), m = R.pick([4, 5, 10, 20]); return { q: `You push a ${m} kg cart with ${F} N (no friction). Acceleration?`, a: F / m, u: "m/s²", w: [F * m, m / F, F - m], ex: "a = F / m.", lv: 1 }; },
  netForce: (R) => { const a = R.step(10, 80, 5), b = R.step(5, 60, 5); return { q: `Two teams pull a rope: ${a} N to the right and ${b} N to the left. Net force?`, a: a - b, u: "N", w: [a + b, b - a, (a + b) / 2], ex: "Opposite forces subtract.", lv: 1 }; },
  friction: (R) => { const m = R.pick([5, 10, 20, 40]), mu = R.pick([0.1, 0.2, 0.3, 0.5]); return { q: `A ${m} kg box rests on a floor with μ = ${mu}. Friction force when it slides? (g = 10)`, a: mu * m * G, u: "N", w: [mu * m, m * G, (m * G) / mu], ex: "f = μN = μmg.", lv: 2 }; },
  netFriction: (R) => { const m = R.pick([5, 10, 20]), mu = R.pick([0.1, 0.2, 0.3]), F = R.step(60, 150, 10); return { q: `A ${m} kg box is pulled with ${F} N on a floor with μ = ${mu}. Acceleration? (g = 10)`, a: (F - mu * m * G) / m, u: "m/s²", w: [F / m, (F + mu * m * G) / m, F - mu * m * G], ex: "a = (F − μmg) / m.", lv: 3 }; },
  lift: (R) => { const m = R.pick([50, 60, 70, 80]), a = R.pick([1, 2, 3]); const up = R.f() > 0.5; return { q: `A ${m} kg person stands on a scale in a lift accelerating ${up ? "UP" : "DOWN"} at ${a} m/s². Scale reading? (g = 10)`, a: m * (G + (up ? a : -a)), u: "N", w: [m * G, m * (G + (up ? -a : a)), m * a], ex: "N = m(g ± a).", lv: 3 }; },
  hooke: (R) => { const k = R.pick([50, 100, 200, 400]), x = R.pick([0.02, 0.05, 0.1, 0.2]); return { q: `A spring with k = ${k} N/m is stretched ${x} m. Restoring force?`, a: k * x, u: "N", w: [k / x, x / k, 0.5 * k * x * x], ex: "|F| = k·x.", lv: 1 }; },

  /* ---- energy ---- */
  kinetic: (R) => { const m = R.pick([2, 4, 10, 50, 1000]), v = R.pick([2, 3, 4, 5, 10, 20]); return { q: `What is the kinetic energy of a ${m} kg object moving at ${v} m/s?`, a: 0.5 * m * v * v, u: "J", w: [m * v * v, 0.5 * m * v, m * v], ex: "Ek = ½mv². Don't forget the square!", lv: 2 }; },
  potential: (R) => { const m = R.pick([1, 2, 5, 10, 50]), h = R.pick([1.5, 2, 3, 10, 20]); return { q: `A ${m} kg backpack is lifted to a height of ${h} m. Gain in potential energy? (g = 10)`, a: m * G * h, u: "J", w: [m * h, 0.5 * m * G * h, m * G], ex: "Ep = mgh.", lv: 1 }; },
  work: (R) => { const F = R.step(10, 200, 10), d = R.pick([2, 3, 5, 10]); return { q: `A worker pushes a cart with ${F} N over ${d} m. Work done?`, a: F * d, u: "J", w: [F / d, F + d, 0.5 * F * d], ex: "W = F·d.", lv: 1 }; },
  workAngle: (R) => { const F = R.pick([20, 40, 50, 100]), d = R.pick([5, 10, 20]); const [th, c] = R.pick([[60, 0.5], [0, 1], [37, 0.8], [90, 0]]); return { q: `A suitcase is pulled with ${F} N at ${th}° to the horizontal for ${d} m. Work? (cos ${th}° = ${c})`, a: F * d * c, u: "J", w: [F * d, (F * d) / (c || 2), F * c], ex: "W = F·d·cos θ.", lv: 2 }; },
  power: (R) => { const W = R.step(100, 3000, 100), t = R.pick([2, 5, 10, 20]); return { q: `A machine does ${W} J of work in ${t} s. Power?`, a: W / t, u: "W", w: [W * t, t / W, W - t], ex: "P = W / t.", lv: 1 }; },
  mechSpeed: (R) => { const h = R.pick([5, 20, 45, 80, 1.25]); return { q: `A skater drops from a ${h} m ramp (no friction). Speed at the bottom? (g = 10)`, a: Math.sqrt(2 * G * h), u: "m/s", w: [2 * G * h, G * h, Math.sqrt(G * h)], ex: "mgh = ½mv² → v = √(2gh).", lv: 2 }; },
  workEnergy: (R) => { const m = R.pick([2, 4, 10]), v1 = R.pick([1, 2, 3]), v2 = R.pick([4, 5, 6]); return { q: `A ${m} kg cart speeds up from ${v1} m/s to ${v2} m/s. Net work done?`, a: 0.5 * m * (v2 * v2 - v1 * v1), u: "J", w: [0.5 * m * (v2 - v1) ** 2, m * (v2 - v1), 0.5 * m * v2 * v2], ex: "W_net = ½m(v_f² − v_i²).", lv: 2 }; },
  efficiency: (R) => { const Q = R.step(1000, 5000, 500), W = R.pick([200, 300, 500, 800]); return { q: `An engine receives ${Q} J of heat and produces ${W} J of useful work. Efficiency?`, a: (W / Q) * 100, u: "%", w: [(Q / W) * 100, ((Q - W) / Q) * 100, W / Q], ex: "η = W / Q × 100%.", lv: 2 }; },
  frictionEnergy: (R) => { const E = R.step(200, 1000, 100), f = R.pick([10, 20, 25]), d = R.pick([4, 5, 8]); return { q: `A sled starts with ${E} J of mechanical energy and slides ${d} m against ${f} N of friction. Final mechanical energy?`, a: E - f * d, u: "J", w: [E + f * d, E - f, f * d], ex: "E_f = E_i − f·d.", lv: 2 }; },

  /* ---- momentum ---- */
  momentum: (R) => { const m = R.pick([0.5, 2, 60, 1000, 1500]), v = R.pick([3, 5, 10, 20]); return { q: `What is the momentum of a ${m} kg object at ${v} m/s?`, a: m * v, u: "kg·m/s", w: [0.5 * m * v * v, m / v, m + v], ex: "p = m·v.", lv: 1 }; },
  impulse: (R) => { const F = R.step(100, 2000, 100), t = R.pick([0.01, 0.05, 0.1, 0.5]); return { q: `A racket applies ${F} N to a ball for ${t} s. Impulse?`, a: F * t, u: "N·s", w: [F / t, t / F, F * t * 10], ex: "J = F·Δt.", lv: 1 }; },
  recoil: (R) => { const M = R.pick([40, 50, 60, 80]), m = R.pick([20, 30, 40]), v = R.pick([2, 3, 4]); return { q: `Two skaters (${M} kg and ${m} kg) push apart from rest. The ${m} kg one moves at ${v} m/s. Speed of the ${M} kg skater?`, a: (m * v) / M, u: "m/s", w: [(M * v) / m, v, (m + M) / v], ex: "0 = M·V + m·v → V = m·v / M.", lv: 2 }; },
  inelastic: (R) => { const m1 = R.pick([1, 2, 3, 4]), v1 = R.pick([2, 4, 6, 9]), m2 = R.pick([1, 2, 3]); return { q: `A ${m1} kg cart at ${v1} m/s hits a ${m2} kg cart at rest and they stick together. Final velocity?`, a: (m1 * v1) / (m1 + m2), u: "m/s", w: [v1, (m1 * v1) / m2, v1 / 2], ex: "v_f = m₁v₁ / (m₁ + m₂).", lv: 2 }; },
  ekLost: (R) => { const m1 = 2, v1 = R.pick([3, 6, 9]), m2 = R.pick([1, 2, 4]); const vf = (m1 * v1) / (m1 + m2); const lost = 0.5 * m1 * v1 * v1 - 0.5 * (m1 + m2) * vf * vf; return { q: `A 2 kg cart at ${v1} m/s sticks to a ${m2} kg cart at rest. How much kinetic energy is lost?`, a: lost, u: "J", w: [0.5 * m1 * v1 * v1, 0.5 * (m1 + m2) * vf * vf, 0], ex: `v_f = ${fmt(vf)} m/s; compare Ek before and after.`, lv: 3 }; },
  restitution: (R) => { const v = R.pick([5, 8, 10, 20]), b = R.pick([0.5, 0.6, 0.75, 0.9]); return { q: `A ball hits the floor at ${v} m/s and bounces up at ${fmt(v * b)} m/s. Coefficient of restitution?`, a: b, w: [1 / b, b * b, 1 - b], ex: "e = v_after / v_before.", lv: 2 }; },
  elastic: (R) => { const m = R.pick([1, 2, 5]), v = R.pick([2, 3, 4, 6]); return { q: `In an elastic collision, a ${m} kg ball at ${v} m/s hits an identical ball at rest. Velocity of the second ball after?`, a: v, u: "m/s", w: [v / 2, 0, 2 * v], ex: "Equal masses swap velocities.", lv: 2 }; },

  /* ---- waves & sound ---- */
  waveSpeed: (R) => { const l = R.pick([0.5, 1, 2, 4]), f = R.pick([2, 5, 10, 50, 100]); return { q: `A wave has wavelength ${l} m and frequency ${f} Hz. Speed?`, a: l * f, u: "m/s", w: [l / f, f / l, l + f], ex: "v = λ·f.", lv: 1 }; },
  wavelength: (R) => { const f = R.pick([170, 340, 440, 680, 1000]); return { q: `A sound of ${f} Hz travels in air at 340 m/s. Wavelength?`, a: 340 / f, u: "m", w: [f / 340, 340 * f, 340 / (2 * f)], ex: "λ = v / f.", lv: 2 }; },
  period: (R) => { const f = R.pick([2, 4, 5, 10, 20]); return { q: `A vibrating string has f = ${f} Hz. What is its period?`, a: 1 / f, u: "s", w: [f, 2 * f, f / 10], ex: "T = 1 / f.", lv: 1 }; },
  soundDist: (R) => { const t = R.pick([2, 3, 5, 6, 9]); return { q: `You hear thunder ${t} s after seeing the lightning. How far is the storm? (v = 340 m/s)`, a: 340 * t, u: "m", w: [340 / t, 170 * t, 3 * t], ex: "d = v·t.", lv: 1 }; },
  echo: (R) => { const t = R.pick([0.5, 1, 2, 4]); return { q: `A bat hears the echo of its call ${t} s later. How far is the wall? (v = 340 m/s)`, a: (340 * t) / 2, u: "m", w: [340 * t, 680 * t, 340 / t], ex: "d = v·t / 2 (sound goes and returns).", lv: 2 }; },
  harmonic: (R) => { const L = R.pick([0.5, 0.65, 0.8, 1]), v = R.pick([200, 260, 320, 400]), n = R.pick([1, 2, 3]); return { q: `A guitar string ${L} m long has wave speed ${v} m/s. Frequency of harmonic n = ${n}?`, a: (n * v) / (2 * L), u: "Hz", w: [(n * v) / L, (n * v) / (4 * L), v / (2 * L)], ex: "fₙ = n·v / 2L.", lv: 3 }; },
  openTube: (R) => { const L = R.pick([0.5, 0.85, 1, 1.7]); return { q: `Fundamental frequency of an OPEN tube ${L} m long? (v = 340 m/s)`, a: 340 / (2 * L), u: "Hz", w: [340 / (4 * L), 340 / L, 340 * 2 * L], ex: "f₁ = v / 2L.", lv: 2 }; },
  closedTube: (R) => { const L = R.pick([0.25, 0.5, 0.85, 1]); return { q: `Fundamental frequency of a CLOSED tube ${L} m long? (v = 340 m/s)`, a: 340 / (4 * L), u: "Hz", w: [340 / (2 * L), 340 / L, 340 * 4 * L], ex: "f₁ = v / 4L.", lv: 2 }; },
  doppler: (R) => { const f = R.pick([500, 600, 700, 800]), vs = R.pick([10, 20, 30, 40]); const toward = R.f() > 0.4; return { q: `An ambulance (siren ${f} Hz) moves ${toward ? "TOWARD" : "AWAY FROM"} you at ${vs} m/s. Frequency you hear? (v = 340 m/s)`, a: (f * 340) / (340 + (toward ? -vs : vs)), u: "Hz", w: [(f * 340) / (340 + (toward ? vs : -vs)), f, f + vs], ex: "f' = f·v / (v ∓ vs).", lv: 3 }; },
  snell: (R) => { const n2 = R.pick([1.33, 1.5]); const th = R.pick([30, 45, 60]); const s = Math.sin(deg(th)) / n2; return { q: `Light enters ${n2 === 1.33 ? "water (n = 1.33)" : "glass (n = 1.5)"} from air at ${th}°. Sine of the refraction angle?`, a: s, w: [Math.sin(deg(th)) * n2, Math.sin(deg(th)), n2 / Math.sin(deg(th))], ex: "sin θ₂ = n₁ sin θ₁ / n₂.", lv: 3 }; },
  refIndex: (R) => { const v = R.pick([2e8, 2.25e8, 1.25e8]); return { q: `Light travels at ${fmt(v)} m/s in a material. Refractive index? (c = 3 × 10⁸ m/s)`, a: 3e8 / v, w: [v / 3e8, 3e8 * v, 1], ex: "n = c / v.", lv: 2 }; },
  lensEq: (R) => { const [f, d] = R.pick([[10, 30], [10, 15], [20, 60], [15, 30], [5, 20]]); return { q: `An object is ${d} cm from a converging lens with f = ${f} cm. Image distance?`, a: 1 / (1 / f - 1 / d), u: "cm", w: [d - f, 1 / (1 / f + 1 / d), f], ex: "1/dᵢ = 1/f − 1/dₒ.", lv: 3 }; },
  magnification: (R) => { const [dO, dI] = R.pick([[30, 15], [20, 20], [15, 30], [12, 60]]); return { q: `An object at ${dO} cm forms a real image at ${dI} cm. Magnification?`, a: -dI / dO, w: [dI / dO, -dO / dI, dO / dI], ex: "M = −dᵢ / dₒ (negative = inverted).", lv: 2 }; },

  /* ---- fluids & gases ---- */
  pressure: (R) => { const F = R.step(200, 1000, 100), A = R.pick([0.01, 0.02, 0.04, 0.05, 0.1]); return { q: `A ${F} N force acts on ${A} m². Pressure?`, a: F / A, u: "Pa", w: [F * A, A / F, F / (A * 10)], ex: "P = F / A.", lv: 1 }; },
  hydro: (R) => { const h = R.pick([2, 5, 10, 20, 30]); return { q: `Water pressure (gauge) at ${h} m depth in a tank? (ρ = 1 000 kg/m³, g = 10)`, a: 1000 * G * h, u: "Pa", w: [1000 * h, G * h, 1000 * G / h], ex: "P = ρgh.", lv: 2 }; },
  buoyancy: (R) => { const V = R.pick([0.001, 0.002, 0.005, 0.01]); return { q: `A ${V} m³ object is fully submerged in water. Buoyant force? (ρ = 1 000 kg/m³, g = 10)`, a: 1000 * G * V, u: "N", w: [1000 * V, G * V, 1000 * G / V], ex: "E = ρ_fluid·g·V_sub.", lv: 2 }; },
  boyle: (R) => { const P1 = R.pick([1, 2, 3]), V1 = R.pick([2, 4, 6, 12]), V2 = R.pick([1, 2, 3]); return { q: `A gas at ${P1} atm occupies ${V1} L. It is compressed to ${V2} L at constant T. New pressure?`, a: (P1 * V1) / V2, u: "atm", w: [(P1 * V2) / V1, P1, P1 + V1 - V2], ex: "P₁V₁ = P₂V₂.", lv: 2 }; },
  charles: (R) => { const V1 = R.pick([2, 3, 4]), T1 = R.pick([200, 300]), T2 = R.pick([400, 450, 600]); return { q: `A balloon has ${V1} L at ${T1} K. It is heated to ${T2} K (constant P). New volume?`, a: (V1 * T2) / T1, u: "L", w: [(V1 * T1) / T2, V1, V1 + (T2 - T1)], ex: "V₁/T₁ = V₂/T₂ (kelvin!).", lv: 2 }; },
  gayLussac: (R) => { const P1 = R.pick([1, 2, 3]), T1 = 300, T2 = R.pick([450, 600, 900]); return { q: `A sealed can at ${P1} atm and ${T1} K is heated to ${T2} K. New pressure?`, a: (P1 * T2) / T1, u: "atm", w: [(P1 * T1) / T2, P1, P1 * (T2 - T1)], ex: "P₁/T₁ = P₂/T₂.", lv: 2 }; },
  idealGas: (R) => { const n = R.pick([0.5, 1, 2]), T = R.pick([273, 300]); return { q: `Volume of ${n} mol of ideal gas at 1 atm and ${T} K? (R = 0.082 atm·L/mol·K)`, a: n * 0.082 * T, u: "L", w: [(0.082 * T) / n, n * 8.31 * T, n * T], ex: "V = nRT / P.", lv: 3 }; },
  firstLaw: (R) => { const Q = R.step(200, 1000, 100), W = R.step(50, 400, 50); return { q: `A gas absorbs ${Q} J of heat and does ${W} J of work. Change in internal energy?`, a: Q - W, u: "J", w: [Q + W, W - Q, Q], ex: "ΔU = Q − W.", lv: 2 }; },
  gasWork: (R) => { const P = R.pick([1e5, 2e5, 1.5e5]), dV = R.pick([0.001, 0.002, 0.005]); return { q: `A gas at ${fmt(P)} Pa expands by ${dV} m³ at constant pressure. Work done by the gas?`, a: P * dV, u: "J", w: [P / dV, dV / P, P * dV * 10], ex: "W = P·ΔV.", lv: 2 }; },
  carnot: (R) => { const Th = R.pick([500, 600, 800]), Tc = R.pick([300, 400]); return { q: `Maximum efficiency of an engine between ${Th} K and ${Tc} K?`, a: (1 - Tc / Th) * 100, u: "%", w: [(Tc / Th) * 100, (1 - Th / Tc) * 100, (Th - Tc) / 10], ex: "η = 1 − Tc/Th.", lv: 3 }; },

  /* ---- electricity & magnetism ---- */
  coulombRatio: (R) => { const F = R.pick([16, 36, 48, 80]); const k = R.pick([["doubled", 0.25], ["halved", 4], ["tripled", 1 / 9]]); return { q: `Two charges attract with ${F} N. If the distance is ${k[0]}, the new force is…`, a: F * k[1], u: "N", w: [F * (k[1] === 4 ? 2 : 0.5), F, F * (k[1] === 4 ? 0.5 : 2)], ex: "F ∝ 1/r².", lv: 2 }; },
  coulombCalc: (R) => { const q = R.pick([1, 2, 3, 4]), r = R.pick([0.1, 0.2, 0.3]); return { q: `Two charges of ${q} μC each are ${r} m apart. Electric force? (k = 9 × 10⁹)`, a: (9e9 * (q * 1e-6) ** 2) / (r * r), u: "N", w: [(9e9 * (q * 1e-6) ** 2) / r, 9e9 * q * q / (r * r), (9e9 * q * 1e-6) / (r * r)], ex: "F = kq₁q₂/r² (convert μC → C).", lv: 3 }; },
  chargeCount: (R) => { const n = R.pick([1e10, 5e12, 2e13]); return { q: `A balloon gains ${fmt(n)} electrons. Its charge? (e = 1.6 × 10⁻¹⁹ C)`, a: -n * 1.6e-19, u: "C", w: [n * 1.6e-19, n / 1.6e-19, -1.6e-19], ex: "q = n·e (negative: extra electrons).", lv: 2 }; },
  capacitor: (R) => { const C = R.pick([0.001, 0.002, 0.005]), V = R.pick([6, 9, 12, 24]); return { q: `A ${C} F capacitor is connected to ${V} V. Stored charge?`, a: C * V, u: "C", w: [C / V, V / C, 0.5 * C * V * V], ex: "Q = C·V.", lv: 1 }; },
  fieldE: (R) => { const Q = R.pick([2, 3, 5]), r = R.pick([0.1, 0.3, 0.5]); return { q: `Electric field at ${r} m from a ${Q} μC charge? (k = 9 × 10⁹)`, a: (9e9 * Q * 1e-6) / (r * r), u: "N/C", w: [(9e9 * Q * 1e-6) / r, (9e9 * Q) / (r * r), 9e9 * Q * 1e-6 * r], ex: "E = kQ/r².", lv: 3 }; },
  currentQ: (R) => { const Q = R.pick([10, 30, 60, 120]), t = R.pick([5, 10, 20, 60]); return { q: `${Q} C of charge pass through a wire in ${t} s. Current?`, a: Q / t, u: "A", w: [Q * t, t / Q, Q - t], ex: "I = Q / t.", lv: 1 }; },
  ohm: (R) => { const V = R.pick([1.5, 3, 6, 9, 12, 24]), Rr = R.pick([2, 3, 4, 6, 10]); return { q: `A ${V} V battery is connected to a ${Rr} Ω resistor. Current?`, a: V / Rr, u: "A", w: [V * Rr, Rr / V, V - Rr], ex: "I = V / R.", lv: 1 }; },
  powerElec: (R) => { const V = R.pick([110, 120, 220]), I = R.pick([0.5, 2, 5, 10]); return { q: `A device at ${V} V draws ${I} A. Power?`, a: V * I, u: "W", w: [V / I, I / V, V * I * I], ex: "P = V·I.", lv: 1 }; },
  seriesR: (R) => { const a = R.pick([2, 4, 6, 10]), b = R.pick([3, 5, 8, 12]), V = R.pick([6, 12, 24]); return { q: `Resistors of ${a} Ω and ${b} Ω in SERIES with ${V} V. Current?`, a: V / (a + b), u: "A", w: [V / a + V / b, V / ((a * b) / (a + b)), (a + b) / V], ex: "R_s = R₁ + R₂, I = V / R_s.", lv: 2 }; },
  parallelR: (R) => { const [a, b] = R.pick([[6, 6], [6, 3], [12, 4], [10, 10], [20, 5]]); return { q: `Equivalent resistance of ${a} Ω and ${b} Ω in PARALLEL?`, a: (a * b) / (a + b), u: "Ω", w: [a + b, (a + b) / 2, 1 / a + 1 / b], ex: "R_p = R₁R₂ / (R₁ + R₂).", lv: 2 }; },
  faraday: (R) => { const N = R.pick([50, 100, 200]), dP = R.pick([0.01, 0.02, 0.05]), dt = R.pick([0.1, 0.2, 0.5]); return { q: `A coil of ${N} turns has a flux change of ${dP} Wb in ${dt} s. Induced EMF (magnitude)?`, a: (N * dP) / dt, u: "V", w: [dP / dt, N * dP * dt, (N * dt) / dP], ex: "|ε| = N·ΔΦ/Δt.", lv: 2 }; },

  /* ---- oscillations & modern ---- */
  pendulumT: (R) => { const L = R.pick([0.25, 1, 2.45, 4]); return { q: `Period of a ${L} m simple pendulum? (g = 9.8 m/s², π ≈ 3.14)`, a: 2 * Math.PI * Math.sqrt(L / 9.8), u: "s", w: [2 * Math.PI * (L / 9.8), Math.PI * Math.sqrt(L / 9.8), 2 * Math.PI * Math.sqrt(9.8 / L)], ex: "T = 2π√(L/g).", lv: 2 }; },
  springT: (R) => { const m = R.pick([0.1, 0.5, 1, 2]), k = R.pick([10, 50, 100, 200]); return { q: `Period of a ${m} kg mass on a spring with k = ${k} N/m?`, a: 2 * Math.PI * Math.sqrt(m / k), u: "s", w: [2 * Math.PI * Math.sqrt(k / m), 2 * Math.PI * (m / k), Math.sqrt(m / k)], ex: "T = 2π√(m/k).", lv: 2 }; },
  shmEnergy: (R) => { const k = R.pick([50, 100, 200, 400]), A = R.pick([0.05, 0.1, 0.2]); return { q: `Total energy of a spring oscillator with k = ${k} N/m and amplitude ${A} m?`, a: 0.5 * k * A * A, u: "J", w: [k * A * A, 0.5 * k * A, k * A], ex: "E = ½kA².", lv: 2 }; },
  vmax: (R) => { const A = R.pick([0.1, 0.2, 0.5]), T = R.pick([1, 2, 3.14]); return { q: `An oscillator has amplitude ${A} m and period ${T} s. Maximum speed?`, a: A * ((2 * Math.PI) / T), u: "m/s", w: [A / T, A * T, (2 * Math.PI) / T], ex: "v_max = Aω, ω = 2π/T.", lv: 3 }; },
  emc2: (R) => { const m = R.pick([0.001, 0.01, 1]); return { q: `Energy equivalent of ${m} kg of mass? (c = 3 × 10⁸ m/s)`, a: m * 9e16, u: "J", w: [m * 3e8, m * 9e8, m * 3e16], ex: "E = mc².", lv: 2 }; },
  photonE: (R) => { const f = R.pick([5e14, 6e14, 1e15, 1.5e15]); return { q: `Energy of a photon with f = ${fmt(f)} Hz? (h = 6.63 × 10⁻³⁴ J·s)`, a: 6.63e-34 * f, u: "J", w: [6.63e-34 / f, f / 6.63e-34, 6.63e-34 * f * 10], ex: "E = h·f.", lv: 2 }; },
  photoelectric: (R) => { const E = R.pick([5, 6, 8]), phi = R.pick([2.3, 3, 4.3]); return { q: `Photons of ${E} eV hit a metal with work function ${phi} eV. Max kinetic energy of electrons?`, a: E - phi, u: "eV", w: [E + phi, phi, E], ex: "Ek,max = hf − φ.", lv: 2 }; },
  gamma: (R) => { const [v, g] = R.pick([[0.6, 1.25], [0.8, 1 / 0.6], [0.866, 2]]); return { q: `A spaceship moves at ${v}c. Lorentz factor γ?`, a: g, w: [1 / g, v, 1 + v], ex: "γ = 1/√(1 − v²/c²).", lv: 3 }; },
  deBroglie: (R) => { const v = R.pick([1e6, 2e6, 5e6]); return { q: `de Broglie wavelength of an electron (m = 9.1 × 10⁻³¹ kg) at ${fmt(v)} m/s? (h = 6.63 × 10⁻³⁴)`, a: 6.63e-34 / (9.1e-31 * v), u: "m", w: [(9.1e-31 * v) / 6.63e-34, 6.63e-34 * 9.1e-31 * v, 6.63e-34 / v], ex: "λ = h / mv.", lv: 3 }; },
};

/* =====================================================================
   BUILD THE BANK
   ===================================================================== */
let CACHE = null;
export function buildBank() {
  if (CACHE) return CACHE;
  const out = [];
  UNITS.forEach((u) => {
    let n = 0;
    u.quiz.forEach(([q, opts, ans, ex], i) => {
      out.push({ id: `G${u.g}P${u.p}C${i + 1}`, grade: u.g, period: u.p, topic: u.title, level: 1, kind: "concept", q, opts, ans, ex });
      n++;
    });
    const R = makeR(u.g * 1000 + u.p * 97 + 13);
    let k = 0;
    const seen = new Set();
    while (n < 25 && u.gen.length && k < 400) {
      const name = u.gen[k % u.gen.length];
      const t = T[name];
      k++;
      if (!t) continue;
      const g = t(R);
      if (seen.has(g.q) && k < 300) continue;
      seen.add(g.q);
      const { opts, ans } = options(R, g.a, g.w || [], g.u);
      out.push({ id: `G${u.g}P${u.p}N${n + 1}`, grade: u.g, period: u.p, topic: u.title, level: g.lv || 2, kind: "calc", q: g.q, opts, ans, ex: g.ex });
      n++;
    }
  });
  CACHE = out;
  return out;
}

/* Teacher questions from Google Sheets → same shape */
export function fromSheet(row) {
  const opts = [row.Opcion_A, row.Opcion_B, row.Opcion_C, row.Opcion_D].map((x) => String(x ?? ""));
  const letter = String(row.Correcta || "A").trim().toUpperCase();
  return {
    id: row.Id, grade: Number(row.Grado), period: Number(row.Periodo) || 0, topic: row.Tema || "My questions",
    level: Number(row.Nivel) || 2, kind: "mine", q: String(row.Pregunta || ""), opts, ans: Math.max(0, "ABCD".indexOf(letter)), ex: String(row.Explicacion || ""), mine: true,
  };
}

export function shuffle(arr, seed = Date.now()) {
  const R = mulberry32(seed % 2147483647);
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
