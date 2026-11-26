import { T } from "../i18n";
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
    a |= 0;
    a = a + 0x6d2b79f5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const makeR = seed => {
  const r = mulberry32(seed);
  return {
    f: r,
    int: (a, b) => a + Math.floor(r() * (b - a + 1)),
    pick: arr => arr[Math.floor(r() * arr.length)],
    step: (a, b, s) => a + s * Math.floor(r() * (Math.floor((b - a) / s) + 1))
  };
};

/* ---------- number formatting ---------- */
const SUP = {
  "-": "⁻",
  0: "⁰",
  1: "¹",
  2: "²",
  3: "³",
  4: "⁴",
  5: "⁵",
  6: "⁶",
  7: "⁷",
  8: "⁸",
  9: "⁹"
};
export function fmt(n) {
  if (!isFinite(n)) return "—";
  const a = Math.abs(n);
  if (a !== 0 && (a >= 1e6 || a < 1e-3)) {
    const e = Math.floor(Math.log10(a));
    let m = n / 10 ** e;
    m = Math.round(m * 100) / 100;
    return `${m} × 10${String(e).split("").map(c => SUP[c]).join("")}`;
  }
  const r = a >= 100 ? Math.round(n * 10) / 10 : a >= 1 ? Math.round(n * 100) / 100 : Math.round(n * 1000) / 1000;
  return r.toLocaleString("en-US", {
    maximumFractionDigits: 3
  });
}

/* ---------- build 4 options from the correct value + typical mistakes ---------- */
function options(R, a, wrong, unit) {
  const u = unit ? " " + unit : "";
  const set = [fmt(a) + u];
  const extra = [a * 2, a / 2, a * 10, a / 10, a * 1.5, a + (Math.abs(a) > 5 ? 3 : 0.5), a * 4, -a];
  [...wrong, ...extra].forEach(w => {
    if (set.length >= 4 || !isFinite(w)) return;
    const s = fmt(w) + u;
    if (!set.includes(s)) set.push(s);
  });
  const order = set.map((s, i) => ({
    s,
    k: R.f(),
    i
  })).sort((x, y) => x.k - y.k);
  return {
    opts: order.map(o => o.s),
    ans: order.findIndex(o => o.i === 0)
  };
}
const deg = x => x * Math.PI / 180;
const G = 10;

/* =====================================================================
   TEMPLATES: (R) => { q, a, u, w:[typical wrong answers], ex, lv }
   ===================================================================== */
const TPL = {
  /* ---- measurement ---- */
  unitLen: R => {
    const v = R.pick([1.2, 2.5, 3.75, 12, 45, 0.8, 7.4]);
    const k = R.pick(["km→m", "m→cm", "cm→mm", "m→mm"]);
    const f = {
      "km→m": 1000,
      "m→cm": 100,
      "cm→mm": 10,
      "m→mm": 1000
    }[k];
    const [a1, b1] = k.split("→");
    return {
      q: T("A school path for wheelchairs measures {0} {1}. How long is it in {2}?", v, a1, b1),
      a: v * f,
      u: b1,
      w: [v / f, v * f / 10, v * f * 10],
      ex: T("Going down the staircase from {0} to {1}: multiply by {2}.", a1, b1, f),
      lv: 1
    };
  },
  unitMass: R => {
    const v = R.pick([350, 1250, 4500, 80, 2700]);
    return {
      q: T("A bag of rice has a mass of {0} g. What is its mass in kilograms?", v),
      a: v / 1000,
      u: T("kg"),
      w: [v * 1000, v / 100, v / 10],
      ex: T("1 kg = 1 000 g, so divide by 1 000."),
      lv: 1
    };
  },
  unitTime: R => {
    const h = R.pick([1.5, 2, 0.25, 3, 0.75]);
    return {
      q: T("A football training lasts {0} hours. How many seconds is that?", h),
      a: h * 3600,
      u: "s",
      w: [h * 60, h * 360, h * 100],
      ex: "1 h = 3 600 s.",
      lv: 1
    };
  },
  imperial: R => {
    const k = R.pick(["in", "ft", "mi", "lb"]);
    const v = R.int(2, 40);
    const d = {
      in: [2.54, "cm", T("A tablet screen is")],
      ft: [30.48, "cm", T("A door is")],
      mi: [1.609, "km", T("A marathon route is")],
      lb: [0.454, "kg", T("A dog has a mass of")]
    }[k];
    return {
      q: T("{0} {1} {2}. Convert to {3}.", d[2], v, k, d[1]),
      a: v * d[0],
      u: d[1],
      w: [v / d[0], v * d[0] * 10, v + d[0]],
      ex: `1 ${k} = ${d[0]} ${d[1]}.`,
      lv: 2
    };
  },
  prefix: R => {
    const p = R.pick([["kilo", 1000], ["centi", 0.01], ["milli", 0.001], ["mega", 1e6], ["micro", 1e-6]]);
    return {
      q: T("What does the prefix \"{0}\" mean?", p[0]),
      a: p[1],
      u: T("× base unit"),
      w: [1 / p[1], p[1] * 10, p[1] / 10],
      ex: `${p[0]} = ${fmt(p[1])}.`,
      lv: 1
    };
  },
  sciNot: R => {
    const m = R.pick([3.2, 4.5, 6.02, 1.6, 7.8]);
    const e = R.pick([-6, -4, 5, 7, 8]);
    return {
      q: T("Which number equals {0}?", (m * 10 ** e).toLocaleString("en-US", {
        maximumFractionDigits: 8
      })),
      a: m * 10 ** e,
      w: [m * 10 ** -e, m * 10 ** (e + 1), m * 10 ** (e - 1)],
      ex: T("Count how many places the decimal point jumps."),
      lv: 2
    };
  },
  /* ---- matter & heat ---- */
  density: R => {
    const m = R.step(20, 400, 20),
      V = R.pick([10, 20, 25, 40, 50]);
    return {
      q: T("A recycled block has mass {0} g and volume {1} cm³. What is its density?", m, V),
      a: m / V,
      u: T("g/cm³"),
      w: [V / m, m * V, m - V],
      ex: "ρ = m / V.",
      lv: 1
    };
  },
  weight: R => {
    const m = R.int(3, 90);
    return {
      q: T("What is the weight of a {0} kg object on Earth? (g = 10 m/s²)", m),
      a: m * G,
      u: "N",
      w: [m, m / G, m * 9.8 * 10],
      ex: "W = m·g.",
      lv: 1
    };
  },
  tempCF: R => {
    const c = R.pick([10, 20, 25, 30, 35, 40, -10, 100]);
    return {
      q: T("The temperature in Valledupar is {0} °C. What is it in °F?", c),
      a: c * 1.8 + 32,
      u: "°F",
      w: [c * 1.8, (c + 32) * 1.8, (c - 32) / 1.8],
      ex: "°F = 1.8·°C + 32.",
      lv: 2
    };
  },
  tempFC: R => {
    const f = R.pick([50, 68, 86, 104, 212, 14, 32]);
    return {
      q: T("A recipe from the USA says {0} °F. What is that in °C?", f),
      a: (f - 32) / 1.8,
      u: "°C",
      w: [f / 1.8 - 32, (f + 32) / 1.8, f * 1.8 + 32],
      ex: T("°C = (°F − 32) / 1.8. Subtract FIRST."),
      lv: 2
    };
  },
  tempCK: R => {
    const c = R.pick([-20, 0, 27, 37, 100, -196]);
    return {
      q: T("Convert {0} °C to kelvin.", c),
      a: c + 273,
      u: "K",
      w: [c - 273, 273 - c, c * 273],
      ex: "K = °C + 273.",
      lv: 1
    };
  },
  tempKC: R => {
    const k = R.pick([77, 250, 300, 373, 400, 1000]);
    return {
      q: T("A gas is at {0} K. What is its temperature in °C?", k),
      a: k - 273,
      u: "°C",
      w: [k + 273, 273 - k, k / 273],
      ex: "°C = K − 273.",
      lv: 1
    };
  },
  heatQ: R => {
    const m = R.pick([0.5, 1, 2, 3]),
      dT = R.pick([5, 10, 20, 25, 40]);
    const mat = R.pick([[T("water"), 4186], [T("aluminium"), 900], [T("iron"), 450]]);
    return {
      q: T("How much heat raises {0} kg of {1} by {2} °C? (c = {3} J/kg·°C)", m, mat[0], dT, mat[1]),
      a: m * mat[1] * dT,
      u: "J",
      w: [mat[1] * dT, m * mat[1], m * dT],
      ex: "Q = m·c·ΔT.",
      lv: 2
    };
  },
  latent: R => {
    const m = R.pick([0.2, 0.5, 1, 2]);
    return {
      q: T("How much energy melts {0} kg of ice at 0 °C? (L = 334 000 J/kg)", m),
      a: m * 334000,
      u: "J",
      w: [334000 / m, m * 4186, m * 33400],
      ex: T("Q = m·L. Temperature doesn't change during melting."),
      lv: 2
    };
  },
  /* ---- kinematics ---- */
  speed: R => {
    const d = R.step(20, 300, 10),
      t = R.pick([4, 5, 10, 20, 25]);
    return {
      q: T("A sea turtle swims {0} m in {1} s. What is its average speed?", d, t),
      a: d / t,
      u: "m/s",
      w: [d * t, t / d, d - t],
      ex: "v = d / t.",
      lv: 1
    };
  },
  distance: R => {
    const v = R.pick([2, 3, 5, 8, 12]),
      t = R.step(10, 120, 10);
    return {
      q: T("A boat moves at {0} m/s for {1} s. How far does it travel?", v, t),
      a: v * t,
      u: "m",
      w: [t / v, v / t, v + t],
      ex: "d = v·t.",
      lv: 1
    };
  },
  kmh: R => {
    const v = R.pick([18, 36, 54, 72, 90, 108]);
    return {
      q: T("A bus travels at {0} km/h. What is its speed in m/s?", v),
      a: v / 3.6,
      u: "m/s",
      w: [v * 3.6, v / 36, v / 60],
      ex: T("Divide km/h by 3.6."),
      lv: 1
    };
  },
  accel: R => {
    const v = R.step(10, 40, 5),
      t = R.pick([2, 4, 5, 10]);
    return {
      q: T("A delivery truck goes from 0 to {0} m/s in {1} s. What is its acceleration?", v, t),
      a: v / t,
      u: "m/s²",
      w: [v * t, t / v, v / (2 * t)],
      ex: "a = Δv / t.",
      lv: 1
    };
  },
  uva: R => {
    const a = R.pick([1, 2, 3, 4]),
      t = R.pick([2, 4, 5, 6, 10]);
    return {
      q: T("A car starts from rest with a = {0} m/s². How far does it go in {1} s?", a, t),
      a: 0.5 * a * t * t,
      u: "m",
      w: [a * t * t, a * t, 0.5 * a * t],
      ex: "x = ½·a·t² (v₀ = 0).",
      lv: 2
    };
  },
  mruPos: R => {
    const x0 = R.step(-50, 100, 10),
      v = R.pick([-6, -4, 3, 5, 8, 12]),
      t = R.pick([3, 5, 10]);
    return {
      q: T("A cyclist starts at x₀ = {0} m and moves at v = {1} m/s. Where is she after {2} s?", x0, v, t),
      a: x0 + v * t,
      u: "m",
      w: [v * t, x0 - v * t, x0 + v + t],
      ex: "x = x₀ + v·t.",
      lv: 2
    };
  },
  brake: R => {
    const v = R.pick([10, 15, 20, 25, 30]),
      a = R.pick([2, 4, 5]);
    return {
      q: T("A car moving at {0} m/s brakes with a = −{1} m/s² until it stops. What is the braking distance?", v, a),
      a: v * v / (2 * a),
      u: "m",
      w: [v * v / a, v / a, v * a],
      ex: "0 = v₀² + 2aΔx → Δx = v₀² / 2a.",
      lv: 3
    };
  },
  vgArea: R => {
    const v = R.pick([4, 6, 8, 10, 15]),
      t = R.pick([3, 5, 6, 8]);
    return {
      q: T("A v–t graph shows a constant velocity of {0} m/s from t = 0 to t = {1} s. What is the displacement?", v, t),
      a: v * t,
      u: "m",
      w: [v / t, 0.5 * v * t, v + t],
      ex: T("Displacement = area under the v–t graph."),
      lv: 2
    };
  },
  freefallH: R => {
    const t = R.pick([1, 2, 3, 4]);
    return {
      q: T("A mango falls from a tree for {0} s (no air). How far does it fall? (g = 10 m/s²)", t),
      a: 0.5 * G * t * t,
      u: "m",
      w: [G * t, G * t * t, 0.5 * G * t],
      ex: "h = ½·g·t².",
      lv: 2
    };
  },
  freefallV: R => {
    const t = R.pick([1, 2, 3, 5]);
    return {
      q: T("What is the speed of a falling object after {0} s, starting from rest? (g = 10 m/s²)", t),
      a: G * t,
      u: "m/s",
      w: [0.5 * G * t * t, G / t, G * t * t],
      ex: "v = g·t.",
      lv: 1
    };
  },
  freefallT: R => {
    const h = R.pick([5, 20, 45, 80, 125]);
    return {
      q: T("How long does it take for a stone to fall {0} m from rest? (g = 10 m/s²)", h),
      a: Math.sqrt(2 * h / G),
      u: "s",
      w: [h / G, 2 * h / G, Math.sqrt(h / G)],
      ex: "t = √(2h/g).",
      lv: 2
    };
  },
  vectorMag: R => {
    const [a, b] = R.pick([[3, 4], [6, 8], [5, 12], [8, 15]]);
    return {
      q: T("A drone flies {0} km east and then {1} km north. What is the magnitude of its displacement?", a, b),
      a: Math.hypot(a, b),
      u: T("km"),
      w: [a + b, b - a, a * b],
      ex: "R = √(A² + B²).",
      lv: 2
    };
  },
  components: R => {
    const F = R.pick([10, 20, 50, 100]);
    const [th, c, s] = R.pick([[37, 0.8, 0.6], [53, 0.6, 0.8], [30, 0.866, 0.5], [60, 0.5, 0.866]]);
    return {
      q: T("A {0} N force is applied at {1}° above the horizontal. Horizontal component? (cos {2}° = {3})", F, th, th, c),
      a: F * c,
      u: "N",
      w: [F * s, F / c, F],
      ex: T("Fx = F·cos θ."),
      lv: 2
    };
  },
  dotProduct: R => {
    const A = R.int(2, 9),
      B = R.int(2, 9);
    const [th, c] = R.pick([[0, 1], [60, 0.5], [90, 0], [180, -1]]);
    return {
      q: T("Vectors A = {0} and B = {1} form an angle of {2}°. What is A·B?", A, B, th),
      a: A * B * c,
      w: [A * B, A + B, A * B * (c === 0 ? 1 : 0)],
      ex: T("A·B = AB·cos θ."),
      lv: 2
    };
  },
  /* ---- projectiles & circles ---- */
  horizLaunch: R => {
    const h = R.pick([5, 20, 45, 80]),
      v = R.pick([2, 3, 5, 8, 10]);
    const t = Math.sqrt(2 * h / G);
    return {
      q: T("A ball rolls off a {0} m platform at {1} m/s horizontally. How far from the base does it land? (g = 10)", h, v),
      a: v * t,
      u: "m",
      w: [v * h / G, v * (2 * h) / G, h],
      ex: `t = √(2h/g) = ${fmt(t)} s; x = v·t.`,
      lv: 3
    };
  },
  range: R => {
    const v = R.pick([10, 20, 30, 40]);
    const th = R.pick([15, 30, 45, 60, 75]);
    return {
      q: T("A projectile is launched at {0} m/s and {1}° (same height, no air). Range? (g = 10)", v, th),
      a: v * v * Math.sin(deg(2 * th)) / G,
      u: "m",
      w: [v * v / G, v * v * Math.sin(deg(th)) / G, v * Math.sin(deg(2 * th)) / G],
      ex: T("R = v₀²·sin2θ / g."),
      lv: 3
    };
  },
  maxHeight: R => {
    const v = R.pick([10, 20, 30]);
    const th = R.pick([30, 45, 90]);
    const s = Math.sin(deg(th));
    return {
      q: T("A ball is kicked at {0} m/s and {1}°. Maximum height? (g = 10)", v, th),
      a: v * v * s * s / (2 * G),
      u: "m",
      w: [v * v * s / (2 * G), v * v / G, v * s / G],
      ex: T("H = v₀²·sin²θ / 2g."),
      lv: 3
    };
  },
  circularV: R => {
    const r = R.pick([0.5, 1, 2, 5, 10]),
      Tv = R.pick([0.5, 1, 2, 4]);
    return {
      q: T("A point on a wheel of radius {0} m completes one turn every {1} s. Linear speed? (π ≈ 3.14)", r, Tv),
      a: 2 * Math.PI * r / Tv,
      u: "m/s",
      w: [Math.PI * r / Tv, 2 * Math.PI * Tv / r, r / Tv],
      ex: "v = 2πr / T.",
      lv: 2
    };
  },
  centripetal: R => {
    const v = R.pick([2, 4, 6, 10, 20]),
      r = R.pick([1, 2, 4, 5, 10]);
    return {
      q: T("A car takes a curve of radius {0} m at {1} m/s. Centripetal acceleration?", r, v),
      a: v * v / r,
      u: "m/s²",
      w: [v / r, v * r, v * v / (2 * r)],
      ex: T("ac = v² / r."),
      lv: 2
    };
  },
  periodFreq: R => {
    const f = R.pick([0.5, 2, 4, 5, 10, 50]);
    return {
      q: T("A wind turbine (or wave) has a frequency of {0} Hz. What is its period?", f),
      a: 1 / f,
      u: "s",
      w: [f, 2 * f, 2 * Math.PI * f],
      ex: "T = 1 / f.",
      lv: 1
    };
  },
  /* ---- dynamics ---- */
  force: R => {
    const m = R.int(2, 50),
      a = R.pick([0.5, 1, 2, 3, 4]);
    return {
      q: T("What net force accelerates a {0} kg boat at {1} m/s²?", m, a),
      a: m * a,
      u: "N",
      w: [m / a, a / m, m + a],
      ex: "F = m·a.",
      lv: 1
    };
  },
  forceAcc: R => {
    const F = R.step(20, 200, 10),
      m = R.pick([4, 5, 10, 20]);
    return {
      q: T("You push a {0} kg cart with {1} N (no friction). Acceleration?", m, F),
      a: F / m,
      u: "m/s²",
      w: [F * m, m / F, F - m],
      ex: "a = F / m.",
      lv: 1
    };
  },
  netForce: R => {
    const a = R.step(10, 80, 5),
      b = R.step(5, 60, 5);
    return {
      q: T("Two teams pull a rope: {0} N to the right and {1} N to the left. Net force?", a, b),
      a: a - b,
      u: "N",
      w: [a + b, b - a, (a + b) / 2],
      ex: T("Opposite forces subtract."),
      lv: 1
    };
  },
  friction: R => {
    const m = R.pick([5, 10, 20, 40]),
      mu = R.pick([0.1, 0.2, 0.3, 0.5]);
    return {
      q: T("A {0} kg box rests on a floor with μ = {1}. Friction force when it slides? (g = 10)", m, mu),
      a: mu * m * G,
      u: "N",
      w: [mu * m, m * G, m * G / mu],
      ex: T("f = μN = μmg."),
      lv: 2
    };
  },
  netFriction: R => {
    const m = R.pick([5, 10, 20]),
      mu = R.pick([0.1, 0.2, 0.3]),
      F = R.step(60, 150, 10);
    return {
      q: T("A {0} kg box is pulled with {1} N on a floor with μ = {2}. Acceleration? (g = 10)", m, F, mu),
      a: (F - mu * m * G) / m,
      u: "m/s²",
      w: [F / m, (F + mu * m * G) / m, F - mu * m * G],
      ex: T("a = (F − μmg) / m."),
      lv: 3
    };
  },
  lift: R => {
    const m = R.pick([50, 60, 70, 80]),
      a = R.pick([1, 2, 3]);
    const up = R.f() > 0.5;
    return {
      q: T("A {0} kg person stands on a scale in a lift accelerating {1} at {2} m/s². Scale reading? (g = 10)", m, up ? T("UP") : T("DOWN"), a),
      a: m * (G + (up ? a : -a)),
      u: "N",
      w: [m * G, m * (G + (up ? -a : a)), m * a],
      ex: "N = m(g ± a).",
      lv: 3
    };
  },
  hooke: R => {
    const k = R.pick([50, 100, 200, 400]),
      x = R.pick([0.02, 0.05, 0.1, 0.2]);
    return {
      q: T("A spring with k = {0} N/m is stretched {1} m. Restoring force?", k, x),
      a: k * x,
      u: "N",
      w: [k / x, x / k, 0.5 * k * x * x],
      ex: "|F| = k·x.",
      lv: 1
    };
  },
  /* ---- energy ---- */
  kinetic: R => {
    const m = R.pick([2, 4, 10, 50, 1000]),
      v = R.pick([2, 3, 4, 5, 10, 20]);
    return {
      q: T("What is the kinetic energy of a {0} kg object moving at {1} m/s?", m, v),
      a: 0.5 * m * v * v,
      u: "J",
      w: [m * v * v, 0.5 * m * v, m * v],
      ex: T("Ek = ½mv². Don't forget the square!"),
      lv: 2
    };
  },
  potential: R => {
    const m = R.pick([1, 2, 5, 10, 50]),
      h = R.pick([1.5, 2, 3, 10, 20]);
    return {
      q: T("A {0} kg backpack is lifted to a height of {1} m. Gain in potential energy? (g = 10)", m, h),
      a: m * G * h,
      u: "J",
      w: [m * h, 0.5 * m * G * h, m * G],
      ex: T("Ep = mgh."),
      lv: 1
    };
  },
  work: R => {
    const F = R.step(10, 200, 10),
      d = R.pick([2, 3, 5, 10]);
    return {
      q: T("A worker pushes a cart with {0} N over {1} m. Work done?", F, d),
      a: F * d,
      u: "J",
      w: [F / d, F + d, 0.5 * F * d],
      ex: "W = F·d.",
      lv: 1
    };
  },
  workAngle: R => {
    const F = R.pick([20, 40, 50, 100]),
      d = R.pick([5, 10, 20]);
    const [th, c] = R.pick([[60, 0.5], [0, 1], [37, 0.8], [90, 0]]);
    return {
      q: T("A suitcase is pulled with {0} N at {1}° to the horizontal for {2} m. Work? (cos {3}° = {4})", F, th, d, th, c),
      a: F * d * c,
      u: "J",
      w: [F * d, F * d / (c || 2), F * c],
      ex: T("W = F·d·cos θ."),
      lv: 2
    };
  },
  power: R => {
    const W = R.step(100, 3000, 100),
      t = R.pick([2, 5, 10, 20]);
    return {
      q: T("A machine does {0} J of work in {1} s. Power?", W, t),
      a: W / t,
      u: "W",
      w: [W * t, t / W, W - t],
      ex: "P = W / t.",
      lv: 1
    };
  },
  mechSpeed: R => {
    const h = R.pick([5, 20, 45, 80, 1.25]);
    return {
      q: T("A skater drops from a {0} m ramp (no friction). Speed at the bottom? (g = 10)", h),
      a: Math.sqrt(2 * G * h),
      u: "m/s",
      w: [2 * G * h, G * h, Math.sqrt(G * h)],
      ex: T("mgh = ½mv² → v = √(2gh)."),
      lv: 2
    };
  },
  workEnergy: R => {
    const m = R.pick([2, 4, 10]),
      v1 = R.pick([1, 2, 3]),
      v2 = R.pick([4, 5, 6]);
    return {
      q: T("A {0} kg cart speeds up from {1} m/s to {2} m/s. Net work done?", m, v1, v2),
      a: 0.5 * m * (v2 * v2 - v1 * v1),
      u: "J",
      w: [0.5 * m * (v2 - v1) ** 2, m * (v2 - v1), 0.5 * m * v2 * v2],
      ex: T("W_net = ½m(v_f² − v_i²)."),
      lv: 2
    };
  },
  efficiency: R => {
    const Q = R.step(1000, 5000, 500),
      W = R.pick([200, 300, 500, 800]);
    return {
      q: T("An engine receives {0} J of heat and produces {1} J of useful work. Efficiency?", Q, W),
      a: W / Q * 100,
      u: "%",
      w: [Q / W * 100, (Q - W) / Q * 100, W / Q],
      ex: "η = W / Q × 100%.",
      lv: 2
    };
  },
  frictionEnergy: R => {
    const E = R.step(200, 1000, 100),
      f = R.pick([10, 20, 25]),
      d = R.pick([4, 5, 8]);
    return {
      q: T("A sled starts with {0} J of mechanical energy and slides {1} m against {2} N of friction. Final mechanical energy?", E, d, f),
      a: E - f * d,
      u: "J",
      w: [E + f * d, E - f, f * d],
      ex: "E_f = E_i − f·d.",
      lv: 2
    };
  },
  /* ---- momentum ---- */
  momentum: R => {
    const m = R.pick([0.5, 2, 60, 1000, 1500]),
      v = R.pick([3, 5, 10, 20]);
    return {
      q: T("What is the momentum of a {0} kg object at {1} m/s?", m, v),
      a: m * v,
      u: T("kg·m/s"),
      w: [0.5 * m * v * v, m / v, m + v],
      ex: "p = m·v.",
      lv: 1
    };
  },
  impulse: R => {
    const F = R.step(100, 2000, 100),
      t = R.pick([0.01, 0.05, 0.1, 0.5]);
    return {
      q: T("A racket applies {0} N to a ball for {1} s. Impulse?", F, t),
      a: F * t,
      u: "N·s",
      w: [F / t, t / F, F * t * 10],
      ex: "J = F·Δt.",
      lv: 1
    };
  },
  recoil: R => {
    const M = R.pick([40, 50, 60, 80]),
      m = R.pick([20, 30, 40]),
      v = R.pick([2, 3, 4]);
    return {
      q: T("Two skaters ({0} kg and {1} kg) push apart from rest. The {2} kg one moves at {3} m/s. Speed of the {4} kg skater?", M, m, m, v, M),
      a: m * v / M,
      u: "m/s",
      w: [M * v / m, v, (m + M) / v],
      ex: "0 = M·V + m·v → V = m·v / M.",
      lv: 2
    };
  },
  inelastic: R => {
    const m1 = R.pick([1, 2, 3, 4]),
      v1 = R.pick([2, 4, 6, 9]),
      m2 = R.pick([1, 2, 3]);
    return {
      q: T("A {0} kg cart at {1} m/s hits a {2} kg cart at rest and they stick together. Final velocity?", m1, v1, m2),
      a: m1 * v1 / (m1 + m2),
      u: "m/s",
      w: [v1, m1 * v1 / m2, v1 / 2],
      ex: "v_f = m₁v₁ / (m₁ + m₂).",
      lv: 2
    };
  },
  ekLost: R => {
    const m1 = 2,
      v1 = R.pick([3, 6, 9]),
      m2 = R.pick([1, 2, 4]);
    const vf = m1 * v1 / (m1 + m2);
    const lost = 0.5 * m1 * v1 * v1 - 0.5 * (m1 + m2) * vf * vf;
    return {
      q: T("A 2 kg cart at {0} m/s sticks to a {1} kg cart at rest. How much kinetic energy is lost?", v1, m2),
      a: lost,
      u: "J",
      w: [0.5 * m1 * v1 * v1, 0.5 * (m1 + m2) * vf * vf, 0],
      ex: T("v_f = {0} m/s; compare Ek before and after.", fmt(vf)),
      lv: 3
    };
  },
  restitution: R => {
    const v = R.pick([5, 8, 10, 20]),
      b = R.pick([0.5, 0.6, 0.75, 0.9]);
    return {
      q: T("A ball hits the floor at {0} m/s and bounces up at {1} m/s. Coefficient of restitution?", v, fmt(v * b)),
      a: b,
      w: [1 / b, b * b, 1 - b],
      ex: T("e = v_after / v_before."),
      lv: 2
    };
  },
  elastic: R => {
    const m = R.pick([1, 2, 5]),
      v = R.pick([2, 3, 4, 6]);
    return {
      q: T("In an elastic collision, a {0} kg ball at {1} m/s hits an identical ball at rest. Velocity of the second ball after?", m, v),
      a: v,
      u: "m/s",
      w: [v / 2, 0, 2 * v],
      ex: T("Equal masses swap velocities."),
      lv: 2
    };
  },
  /* ---- waves & sound ---- */
  waveSpeed: R => {
    const l = R.pick([0.5, 1, 2, 4]),
      f = R.pick([2, 5, 10, 50, 100]);
    return {
      q: T("A wave has wavelength {0} m and frequency {1} Hz. Speed?", l, f),
      a: l * f,
      u: "m/s",
      w: [l / f, f / l, l + f],
      ex: "v = λ·f.",
      lv: 1
    };
  },
  wavelength: R => {
    const f = R.pick([170, 340, 440, 680, 1000]);
    return {
      q: T("A sound of {0} Hz travels in air at 340 m/s. Wavelength?", f),
      a: 340 / f,
      u: "m",
      w: [f / 340, 340 * f, 340 / (2 * f)],
      ex: "λ = v / f.",
      lv: 2
    };
  },
  period: R => {
    const f = R.pick([2, 4, 5, 10, 20]);
    return {
      q: T("A vibrating string has f = {0} Hz. What is its period?", f),
      a: 1 / f,
      u: "s",
      w: [f, 2 * f, f / 10],
      ex: "T = 1 / f.",
      lv: 1
    };
  },
  soundDist: R => {
    const t = R.pick([2, 3, 5, 6, 9]);
    return {
      q: T("You hear thunder {0} s after seeing the lightning. How far is the storm? (v = 340 m/s)", t),
      a: 340 * t,
      u: "m",
      w: [340 / t, 170 * t, 3 * t],
      ex: "d = v·t.",
      lv: 1
    };
  },
  echo: R => {
    const t = R.pick([0.5, 1, 2, 4]);
    return {
      q: T("A bat hears the echo of its call {0} s later. How far is the wall? (v = 340 m/s)", t),
      a: 340 * t / 2,
      u: "m",
      w: [340 * t, 680 * t, 340 / t],
      ex: T("d = v·t / 2 (sound goes and returns)."),
      lv: 2
    };
  },
  harmonic: R => {
    const L = R.pick([0.5, 0.65, 0.8, 1]),
      v = R.pick([200, 260, 320, 400]),
      n = R.pick([1, 2, 3]);
    return {
      q: T("A guitar string {0} m long has wave speed {1} m/s. Frequency of harmonic n = {2}?", L, v, n),
      a: n * v / (2 * L),
      u: T("Hz"),
      w: [n * v / L, n * v / (4 * L), v / (2 * L)],
      ex: "fₙ = n·v / 2L.",
      lv: 3
    };
  },
  openTube: R => {
    const L = R.pick([0.5, 0.85, 1, 1.7]);
    return {
      q: T("Fundamental frequency of an OPEN tube {0} m long? (v = 340 m/s)", L),
      a: 340 / (2 * L),
      u: T("Hz"),
      w: [340 / (4 * L), 340 / L, 340 * 2 * L],
      ex: "f₁ = v / 2L.",
      lv: 2
    };
  },
  closedTube: R => {
    const L = R.pick([0.25, 0.5, 0.85, 1]);
    return {
      q: T("Fundamental frequency of a CLOSED tube {0} m long? (v = 340 m/s)", L),
      a: 340 / (4 * L),
      u: T("Hz"),
      w: [340 / (2 * L), 340 / L, 340 * 4 * L],
      ex: "f₁ = v / 4L.",
      lv: 2
    };
  },
  doppler: R => {
    const f = R.pick([500, 600, 700, 800]),
      vs = R.pick([10, 20, 30, 40]);
    const toward = R.f() > 0.4;
    return {
      q: T("An ambulance (siren {0} Hz) moves {1} you at {2} m/s. Frequency you hear? (v = 340 m/s)", f, toward ? T("TOWARD") : T("AWAY FROM"), vs),
      a: f * 340 / (340 + (toward ? -vs : vs)),
      u: T("Hz"),
      w: [f * 340 / (340 + (toward ? vs : -vs)), f, f + vs],
      ex: T("f' = f·v / (v ∓ vs)."),
      lv: 3
    };
  },
  snell: R => {
    const n2 = R.pick([1.33, 1.5]);
    const th = R.pick([30, 45, 60]);
    const s = Math.sin(deg(th)) / n2;
    return {
      q: T("Light enters {0} from air at {1}°. Sine of the refraction angle?", n2 === 1.33 ? T("water (n = 1.33)") : T("glass (n = 1.5)"), th),
      a: s,
      w: [Math.sin(deg(th)) * n2, Math.sin(deg(th)), n2 / Math.sin(deg(th))],
      ex: T("sin θ₂ = n₁ sin θ₁ / n₂."),
      lv: 3
    };
  },
  refIndex: R => {
    const v = R.pick([2e8, 2.25e8, 1.25e8]);
    return {
      q: T("Light travels at {0} m/s in a material. Refractive index? (c = 3 × 10⁸ m/s)", fmt(v)),
      a: 3e8 / v,
      w: [v / 3e8, 3e8 * v, 1],
      ex: "n = c / v.",
      lv: 2
    };
  },
  lensEq: R => {
    const [f, d] = R.pick([[10, 30], [10, 15], [20, 60], [15, 30], [5, 20]]);
    return {
      q: T("An object is {0} cm from a converging lens with f = {1} cm. Image distance?", d, f),
      a: 1 / (1 / f - 1 / d),
      u: T("cm"),
      w: [d - f, 1 / (1 / f + 1 / d), f],
      ex: "1/dᵢ = 1/f − 1/dₒ.",
      lv: 3
    };
  },
  magnification: R => {
    const [dO, dI] = R.pick([[30, 15], [20, 20], [15, 30], [12, 60]]);
    return {
      q: T("An object at {0} cm forms a real image at {1} cm. Magnification?", dO, dI),
      a: -dI / dO,
      w: [dI / dO, -dO / dI, dO / dI],
      ex: T("M = −dᵢ / dₒ (negative = inverted)."),
      lv: 2
    };
  },
  /* ---- fluids & gases ---- */
  pressure: R => {
    const F = R.step(200, 1000, 100),
      A = R.pick([0.01, 0.02, 0.04, 0.05, 0.1]);
    return {
      q: T("A {0} N force acts on {1} m². Pressure?", F, A),
      a: F / A,
      u: T("Pa"),
      w: [F * A, A / F, F / (A * 10)],
      ex: "P = F / A.",
      lv: 1
    };
  },
  hydro: R => {
    const h = R.pick([2, 5, 10, 20, 30]);
    return {
      q: T("Water pressure (gauge) at {0} m depth in a tank? (ρ = 1 000 kg/m³, g = 10)", h),
      a: 1000 * G * h,
      u: T("Pa"),
      w: [1000 * h, G * h, 1000 * G / h],
      ex: T("P = ρgh."),
      lv: 2
    };
  },
  buoyancy: R => {
    const V = R.pick([0.001, 0.002, 0.005, 0.01]);
    return {
      q: T("A {0} m³ object is fully submerged in water. Buoyant force? (ρ = 1 000 kg/m³, g = 10)", V),
      a: 1000 * G * V,
      u: "N",
      w: [1000 * V, G * V, 1000 * G / V],
      ex: T("E = ρ_fluid·g·V_sub."),
      lv: 2
    };
  },
  boyle: R => {
    const P1 = R.pick([1, 2, 3]),
      V1 = R.pick([2, 4, 6, 12]),
      V2 = R.pick([1, 2, 3]);
    return {
      q: T("A gas at {0} atm occupies {1} L. It is compressed to {2} L at constant T. New pressure?", P1, V1, V2),
      a: P1 * V1 / V2,
      u: T("atm"),
      w: [P1 * V2 / V1, P1, P1 + V1 - V2],
      ex: "P₁V₁ = P₂V₂.",
      lv: 2
    };
  },
  charles: R => {
    const V1 = R.pick([2, 3, 4]),
      T1 = R.pick([200, 300]),
      T2 = R.pick([400, 450, 600]);
    return {
      q: T("A balloon has {0} L at {1} K. It is heated to {2} K (constant P). New volume?", V1, T1, T2),
      a: V1 * T2 / T1,
      u: "L",
      w: [V1 * T1 / T2, V1, V1 + (T2 - T1)],
      ex: T("V₁/T₁ = V₂/T₂ (kelvin!)."),
      lv: 2
    };
  },
  gayLussac: R => {
    const P1 = R.pick([1, 2, 3]),
      T1 = 300,
      T2 = R.pick([450, 600, 900]);
    return {
      q: T("A sealed can at {0} atm and {1} K is heated to {2} K. New pressure?", P1, T1, T2),
      a: P1 * T2 / T1,
      u: T("atm"),
      w: [P1 * T1 / T2, P1, P1 * (T2 - T1)],
      ex: "P₁/T₁ = P₂/T₂.",
      lv: 2
    };
  },
  idealGas: R => {
    const n = R.pick([0.5, 1, 2]),
      Tv = R.pick([273, 300]);
    return {
      q: T("Volume of {0} mol of ideal gas at 1 atm and {1} K? (R = 0.082 atm·L/mol·K)", n, Tv),
      a: n * 0.082 * Tv,
      u: "L",
      w: [0.082 * Tv / n, n * 8.31 * Tv, n * Tv],
      ex: T("V = nRT / P."),
      lv: 3
    };
  },
  firstLaw: R => {
    const Q = R.step(200, 1000, 100),
      W = R.step(50, 400, 50);
    return {
      q: T("A gas absorbs {0} J of heat and does {1} J of work. Change in internal energy?", Q, W),
      a: Q - W,
      u: "J",
      w: [Q + W, W - Q, Q],
      ex: "ΔU = Q − W.",
      lv: 2
    };
  },
  gasWork: R => {
    const P = R.pick([1e5, 2e5, 1.5e5]),
      dV = R.pick([0.001, 0.002, 0.005]);
    return {
      q: T("A gas at {0} Pa expands by {1} m³ at constant pressure. Work done by the gas?", fmt(P), dV),
      a: P * dV,
      u: "J",
      w: [P / dV, dV / P, P * dV * 10],
      ex: "W = P·ΔV.",
      lv: 2
    };
  },
  carnot: R => {
    const Th = R.pick([500, 600, 800]),
      Tc = R.pick([300, 400]);
    return {
      q: T("Maximum efficiency of an engine between {0} K and {1} K?", Th, Tc),
      a: (1 - Tc / Th) * 100,
      u: "%",
      w: [Tc / Th * 100, (1 - Th / Tc) * 100, (Th - Tc) / 10],
      ex: T("η = 1 − Tc/Th."),
      lv: 3
    };
  },
  /* ---- electricity & magnetism ---- */
  coulombRatio: R => {
    const F = R.pick([16, 36, 48, 80]);
    const k = R.pick([[T("doubled"), 0.25], [T("halved"), 4], [T("tripled"), 1 / 9]]);
    return {
      q: T("Two charges attract with {0} N. If the distance is {1}, the new force is…", F, k[0]),
      a: F * k[1],
      u: "N",
      w: [F * (k[1] === 4 ? 2 : 0.5), F, F * (k[1] === 4 ? 0.5 : 2)],
      ex: "F ∝ 1/r².",
      lv: 2
    };
  },
  coulombCalc: R => {
    const q = R.pick([1, 2, 3, 4]),
      r = R.pick([0.1, 0.2, 0.3]);
    return {
      q: T("Two charges of {0} μC each are {1} m apart. Electric force? (k = 9 × 10⁹)", q, r),
      a: 9e9 * (q * 1e-6) ** 2 / (r * r),
      u: "N",
      w: [9e9 * (q * 1e-6) ** 2 / r, 9e9 * q * q / (r * r), 9e9 * q * 1e-6 / (r * r)],
      ex: T("F = kq₁q₂/r² (convert μC → C)."),
      lv: 3
    };
  },
  chargeCount: R => {
    const n = R.pick([1e10, 5e12, 2e13]);
    return {
      q: T("A balloon gains {0} electrons. Its charge? (e = 1.6 × 10⁻¹⁹ C)", fmt(n)),
      a: -n * 1.6e-19,
      u: "C",
      w: [n * 1.6e-19, n / 1.6e-19, -1.6e-19],
      ex: T("q = n·e (negative: extra electrons)."),
      lv: 2
    };
  },
  capacitor: R => {
    const C = R.pick([0.001, 0.002, 0.005]),
      V = R.pick([6, 9, 12, 24]);
    return {
      q: T("A {0} F capacitor is connected to {1} V. Stored charge?", C, V),
      a: C * V,
      u: "C",
      w: [C / V, V / C, 0.5 * C * V * V],
      ex: "Q = C·V.",
      lv: 1
    };
  },
  fieldE: R => {
    const Q = R.pick([2, 3, 5]),
      r = R.pick([0.1, 0.3, 0.5]);
    return {
      q: T("Electric field at {0} m from a {1} μC charge? (k = 9 × 10⁹)", r, Q),
      a: 9e9 * Q * 1e-6 / (r * r),
      u: "N/C",
      w: [9e9 * Q * 1e-6 / r, 9e9 * Q / (r * r), 9e9 * Q * 1e-6 * r],
      ex: T("E = kQ/r²."),
      lv: 3
    };
  },
  currentQ: R => {
    const Q = R.pick([10, 30, 60, 120]),
      t = R.pick([5, 10, 20, 60]);
    return {
      q: T("{0} C of charge pass through a wire in {1} s. Current?", Q, t),
      a: Q / t,
      u: "A",
      w: [Q * t, t / Q, Q - t],
      ex: "I = Q / t.",
      lv: 1
    };
  },
  ohm: R => {
    const V = R.pick([1.5, 3, 6, 9, 12, 24]),
      Rr = R.pick([2, 3, 4, 6, 10]);
    return {
      q: T("A {0} V battery is connected to a {1} Ω resistor. Current?", V, Rr),
      a: V / Rr,
      u: "A",
      w: [V * Rr, Rr / V, V - Rr],
      ex: "I = V / R.",
      lv: 1
    };
  },
  powerElec: R => {
    const V = R.pick([110, 120, 220]),
      I = R.pick([0.5, 2, 5, 10]);
    return {
      q: T("A device at {0} V draws {1} A. Power?", V, I),
      a: V * I,
      u: "W",
      w: [V / I, I / V, V * I * I],
      ex: "P = V·I.",
      lv: 1
    };
  },
  seriesR: R => {
    const a = R.pick([2, 4, 6, 10]),
      b = R.pick([3, 5, 8, 12]),
      V = R.pick([6, 12, 24]);
    return {
      q: T("Resistors of {0} Ω and {1} Ω in SERIES with {2} V. Current?", a, b, V),
      a: V / (a + b),
      u: "A",
      w: [V / a + V / b, V / (a * b / (a + b)), (a + b) / V],
      ex: "R_s = R₁ + R₂, I = V / R_s.",
      lv: 2
    };
  },
  parallelR: R => {
    const [a, b] = R.pick([[6, 6], [6, 3], [12, 4], [10, 10], [20, 5]]);
    return {
      q: T("Equivalent resistance of {0} Ω and {1} Ω in PARALLEL?", a, b),
      a: a * b / (a + b),
      u: "Ω",
      w: [a + b, (a + b) / 2, 1 / a + 1 / b],
      ex: "R_p = R₁R₂ / (R₁ + R₂).",
      lv: 2
    };
  },
  faraday: R => {
    const N = R.pick([50, 100, 200]),
      dP = R.pick([0.01, 0.02, 0.05]),
      dt = R.pick([0.1, 0.2, 0.5]);
    return {
      q: T("A coil of {0} turns has a flux change of {1} Wb in {2} s. Induced EMF (magnitude)?", N, dP, dt),
      a: N * dP / dt,
      u: "V",
      w: [dP / dt, N * dP * dt, N * dt / dP],
      ex: "|ε| = N·ΔΦ/Δt.",
      lv: 2
    };
  },
  /* ---- oscillations & modern ---- */
  pendulumT: R => {
    const L = R.pick([0.25, 1, 2.45, 4]);
    return {
      q: T("Period of a {0} m simple pendulum? (g = 9.8 m/s², π ≈ 3.14)", L),
      a: 2 * Math.PI * Math.sqrt(L / 9.8),
      u: "s",
      w: [2 * Math.PI * (L / 9.8), Math.PI * Math.sqrt(L / 9.8), 2 * Math.PI * Math.sqrt(9.8 / L)],
      ex: "T = 2π√(L/g).",
      lv: 2
    };
  },
  springT: R => {
    const m = R.pick([0.1, 0.5, 1, 2]),
      k = R.pick([10, 50, 100, 200]);
    return {
      q: T("Period of a {0} kg mass on a spring with k = {1} N/m?", m, k),
      a: 2 * Math.PI * Math.sqrt(m / k),
      u: "s",
      w: [2 * Math.PI * Math.sqrt(k / m), 2 * Math.PI * (m / k), Math.sqrt(m / k)],
      ex: "T = 2π√(m/k).",
      lv: 2
    };
  },
  shmEnergy: R => {
    const k = R.pick([50, 100, 200, 400]),
      A = R.pick([0.05, 0.1, 0.2]);
    return {
      q: T("Total energy of a spring oscillator with k = {0} N/m and amplitude {1} m?", k, A),
      a: 0.5 * k * A * A,
      u: "J",
      w: [k * A * A, 0.5 * k * A, k * A],
      ex: T("E = ½kA²."),
      lv: 2
    };
  },
  vmax: R => {
    const A = R.pick([0.1, 0.2, 0.5]),
      Tv = R.pick([1, 2, 3.14]);
    return {
      q: T("An oscillator has amplitude {0} m and period {1} s. Maximum speed?", A, Tv),
      a: A * (2 * Math.PI / Tv),
      u: "m/s",
      w: [A / Tv, A * Tv, 2 * Math.PI / Tv],
      ex: T("v_max = Aω, ω = 2π/T."),
      lv: 3
    };
  },
  emc2: R => {
    const m = R.pick([0.001, 0.01, 1]);
    return {
      q: T("Energy equivalent of {0} kg of mass? (c = 3 × 10⁸ m/s)", m),
      a: m * 9e16,
      u: "J",
      w: [m * 3e8, m * 9e8, m * 3e16],
      ex: T("E = mc²."),
      lv: 2
    };
  },
  photonE: R => {
    const f = R.pick([5e14, 6e14, 1e15, 1.5e15]);
    return {
      q: T("Energy of a photon with f = {0} Hz? (h = 6.63 × 10⁻³⁴ J·s)", fmt(f)),
      a: 6.63e-34 * f,
      u: "J",
      w: [6.63e-34 / f, f / 6.63e-34, 6.63e-34 * f * 10],
      ex: "E = h·f.",
      lv: 2
    };
  },
  photoelectric: R => {
    const E = R.pick([5, 6, 8]),
      phi = R.pick([2.3, 3, 4.3]);
    return {
      q: T("Photons of {0} eV hit a metal with work function {1} eV. Max kinetic energy of electrons?", E, phi),
      a: E - phi,
      u: T("eV"),
      w: [E + phi, phi, E],
      ex: T("Ek,max = hf − φ."),
      lv: 2
    };
  },
  gamma: R => {
    const [v, g] = R.pick([[0.6, 1.25], [0.8, 1 / 0.6], [0.866, 2]]);
    return {
      q: T("A spaceship moves at {0}c. Lorentz factor γ?", v),
      a: g,
      w: [1 / g, v, 1 + v],
      ex: "γ = 1/√(1 − v²/c²).",
      lv: 3
    };
  },
  deBroglie: R => {
    const v = R.pick([1e6, 2e6, 5e6]);
    return {
      q: T("de Broglie wavelength of an electron (m = 9.1 × 10⁻³¹ kg) at {0} m/s? (h = 6.63 × 10⁻³⁴)", fmt(v)),
      a: 6.63e-34 / (9.1e-31 * v),
      u: "m",
      w: [9.1e-31 * v / 6.63e-34, 6.63e-34 * 9.1e-31 * v, 6.63e-34 / v],
      ex: T("λ = h / mv."),
      lv: 3
    };
  }
};

/* =====================================================================
   BUILD THE BANK
   ===================================================================== */
let CACHE = null;
export function buildBank() {
  if (CACHE) return CACHE;
  const out = [];
  UNITS.forEach(u => {
    let n = 0;
    u.quiz.forEach(([q, opts, ans, ex], i) => {
      out.push({
        id: `G${u.g}P${u.p}C${i + 1}`,
        grade: u.g,
        period: u.p,
        topic: u.title,
        level: 1,
        kind: "concept",
        q,
        opts,
        ans,
        ex
      });
      n++;
    });
    const R = makeR(u.g * 1000 + u.p * 97 + 13);
    let k = 0;
    const seen = new Set();
    while (n < 25 && u.gen.length && k < 400) {
      const name = u.gen[k % u.gen.length];
      const t = TPL[name];
      k++;
      if (!t) continue;
      const g = t(R);
      if (seen.has(g.q) && k < 300) continue;
      seen.add(g.q);
      const {
        opts,
        ans
      } = options(R, g.a, g.w || [], g.u);
      out.push({
        id: `G${u.g}P${u.p}N${n + 1}`,
        grade: u.g,
        period: u.p,
        topic: u.title,
        level: g.lv || 2,
        kind: "calc",
        q: g.q,
        opts,
        ans,
        ex: g.ex
      });
      n++;
    }
  });
  CACHE = out;
  return out;
}

/* Teacher questions from Google Sheets → same shape */
export function fromSheet(row) {
  const opts = [row.Opcion_A, row.Opcion_B, row.Opcion_C, row.Opcion_D].map(x => String(x ?? ""));
  const letter = String(row.Correcta || "A").trim().toUpperCase();
  return {
    id: row.Id,
    grade: Number(row.Grado),
    period: Number(row.Periodo) || 0,
    topic: row.Tema || "My questions",
    level: Number(row.Nivel) || 2,
    kind: "mine",
    q: String(row.Pregunta || ""),
    opts,
    ans: Math.max(0, "ABCD".indexOf(letter)),
    ex: String(row.Explicacion || ""),
    mine: true
  };
}
export function shuffle(arr, seed = Date.now()) {
  const R = mulberry32(seed % 2147483647);
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(R() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}