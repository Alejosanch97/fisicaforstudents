import { UNITS_6_8 } from "./curriculum6_8";
import { UNITS_9_11 } from "./curriculum9_11";

export const UNITS = [...UNITS_6_8, ...UNITS_9_11];
export const unitsOf = (g) => UNITS.filter((u) => u.g === Number(g)).sort((a, b) => a.p - b.p);
export const getUnit = (g, p) => UNITS.find((u) => u.g === Number(g) && u.p === Number(p));

/* Suggested 45-minute class flow for every unit */
export const classFlow = (u) => [
  { min: 5, icon: "Sparkles", t: "Hook", d: u.labs[0]?.predict || u.bigIdea },
  { min: 10, icon: "Presentation", t: "Explain", d: `Project the deck: ${u.ideas.map((i) => i.t).slice(0, 3).join(" · ")}` },
  { min: 10, icon: "FlaskConical", t: "Simulate", d: u.labs[0] ? `${u.labs[0].t} — predict, observe, explain.` : "Open a simulation." },
  { min: 10, icon: "PenLine", t: "Practise", d: `Worked example + ${u.formulas[0]?.n || "formula"} drill.` },
  { min: 10, icon: "Trophy", t: "Play", d: "Millionaire or Board Battle with this term's questions." },
];
