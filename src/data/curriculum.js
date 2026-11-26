import { UNITS_6_8 } from "./curriculum6_8";
import { UNITS_9_11 } from "./curriculum9_11";
import { ES_6_8 } from "./curriculumES6_8";
import { ES_9_11 } from "./curriculumES9_11";
import { getLang, T } from "../i18n";

/* ---------- mezcla el contenido en español sobre el inglés (misma estructura) ---------- */
const ES = { ...ES_6_8, ...ES_9_11 };
const pick = (es, en) => (es !== undefined && es !== null && es !== "" ? es : en);
function toSpanish(u) {
  const e = ES[`${u.g}-${u.p}`];
  if (!e) return u;
  return {
    ...u,
    title: pick(e.title, u.title), sdg: pick(e.sdg, u.sdg), challenge: pick(e.challenge, u.challenge), bigIdea: pick(e.bigIdea, u.bigIdea),
    topics: u.topics.map((x, i) => pick(e.topics?.[i], x)),
    ideas: u.ideas.map((x, i) => ({ ...x, t: pick(e.ideas?.[i]?.t, x.t), b: pick(e.ideas?.[i]?.b, x.b), pts: x.pts.map((p, k) => pick(e.ideas?.[i]?.pts?.[k], p)) })),
    formulas: u.formulas.map((f, i) => ({ ...f, n: pick(e.formulas?.[i]?.n, f.n), tip: pick(e.formulas?.[i]?.tip, f.tip), vars: f.vars.map(([s, m, un], k) => [s, pick(e.formulas?.[i]?.m?.[k], m), un]) })),
    examples: u.examples.map((x, i) => ({ q: pick(e.examples?.[i]?.q, x.q), steps: x.steps.map((s, k) => pick(e.examples?.[i]?.steps?.[k], s)), a: pick(e.examples?.[i]?.a, x.a) })),
    labs: u.labs.map((l, i) => { const s = e.labs?.[i] || {}; return { ...l, t: pick(s.t, l.t), predict: pick(s.predict, l.predict), observe: pick(s.observe, l.observe), explain: pick(s.explain, l.explain), steps: l.steps.map((x, k) => pick(s.steps?.[k], x)) }; }),
    tips: u.tips.map((x, i) => pick(e.tips?.[i], x)),
    reading: e.reading ? { t: pick(e.reading.t, u.reading.t), text: u.reading.text.map((p, i) => pick(e.reading.text?.[i], p)), gloss: u.reading.gloss.map((g, i) => e.reading.gloss?.[i] || g), qs: u.reading.qs.map((q, i) => e.reading.qs?.[i] || q) } : u.reading,
    quiz: u.quiz.map(([q, opts, ans, ex], i) => { const s = e.quiz?.[i]; return s ? [s[0], s[1], ans, s[2]] : [q, opts, ans, ex]; }),
  };
}

const ALL = [...UNITS_6_8, ...UNITS_9_11];
export const UNITS = getLang() === "es" ? ALL.map(toSpanish) : ALL;
export const unitsOf = (g) => UNITS.filter((u) => u.g === Number(g)).sort((a, b) => a.p - b.p);
export const getUnit = (g, p) => UNITS.find((u) => u.g === Number(g) && u.p === Number(p));

/* Suggested 45-minute class flow for every unit */
export const classFlow = (u) => [
  { min: 5, icon: "Sparkles", t: T("Hook"), d: u.labs[0]?.predict || u.bigIdea },
  { min: 10, icon: "Presentation", t: T("Explain"), d: T("Project the deck: {0}", u.ideas.map((i) => i.t).slice(0, 3).join(" · ")) },
  { min: 10, icon: "FlaskConical", t: T("Simulate"), d: u.labs[0] ? T("{0} — predict, observe, explain.", u.labs[0].t) : T("Open a simulation.") },
  { min: 10, icon: "PenLine", t: T("Practise"), d: T("Worked example + {0} drill.", u.formulas[0]?.n || "formula") },
  { min: 10, icon: "Trophy", t: T("Play"), d: T("Millionaire or Board Battle with this term's questions.") },
];
