/* =====================================================================
   MOMENTUM · conexión con Google Apps Script
   👉 Pega aquí la URL de tu Web App (termina en /exec):
   ===================================================================== */
export const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxP5wS2md2G7CiSMXgaF4RypXXjZIGq9Vheemvu2Lo7DGS9uNlEcKOq9n-eVFyvhD-k3w/exec";

const URL_ = (import.meta.env.VITE_SCRIPT_URL || SCRIPT_URL || "").trim();
export const isDemo = !URL_;

/* GET: lectura simple con query params (sin headers = sin preflight CORS) */
export async function apiGet(params) {
  if (isDemo) return demo.get(params);
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${URL_}?${qs}`, { method: "GET", redirect: "follow" });
  return res.json();
}

/* POST: el body va como texto plano (igual que FinFluent) → sin preflight CORS */
export async function apiPost(payload) {
  if (isDemo) return demo.post(payload);
  const res = await fetch(URL_, { method: "POST", redirect: "follow", body: JSON.stringify(payload) });
  return res.json();
}

/* ---------------------------------------------------------------------
   MODO DEMO: si SCRIPT_URL está vacío, todo funciona con localStorage.
   Login demo → usuario: profe@momentum.app · clave: physics
   ------------------------------------------------------------------- */
const LS = (k, v) => {
  try {
    if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null");
    localStorage.setItem(k, JSON.stringify(v));
  } catch { return null; }
};
const demo = {
  async get(p) {
    if (p.action === "questions") return { status: "success", questions: LS("mm_demo_q") || [] };
    if (p.action === "log") return { status: "success", log: LS("mm_demo_log") || [] };
    if (p.action === "scores") return { status: "success", scores: LS("mm_demo_scores") || [] };
    return { status: "success", demo: true };
  },
  async post(p) {
    if (p.action === "login") {
      if (String(p.email).trim().toLowerCase() === "profe@momentum.app" && p.password === "physics")
        return { status: "success", token: "demo", user: { Nombre: "Demo Teacher", Email: "profe@momentum.app", Rol: "teacher", Grados: "6,7,8,9,10,11" } };
      return { status: "error", message: "Wrong email or password (demo: profe@momentum.app / physics)" };
    }
    const q = LS("mm_demo_q") || [];
    if (p.action === "question_save") {
      const item = { ...p.question, Id: p.question.Id || "Q" + Date.now().toString(36).toUpperCase(), Creado: new Date().toISOString() };
      const i = q.findIndex((x) => x.Id === item.Id);
      if (i >= 0) q[i] = item; else q.push(item);
      LS("mm_demo_q", q);
      return { status: "success", question: item };
    }
    if (p.action === "question_bulk") {
      const items = (p.questions || []).map((x, i) => ({ ...x, Id: "Q" + Date.now().toString(36).toUpperCase() + i, Creado: new Date().toISOString() }));
      LS("mm_demo_q", q.concat(items));
      return { status: "success", saved: items.length };
    }
    if (p.action === "question_delete") {
      LS("mm_demo_q", q.filter((x) => x.Id !== p.id));
      return { status: "success" };
    }
    if (p.action === "log_save") {
      const log = LS("mm_demo_log") || [];
      log.push({ ...p.entry, Id: "L" + Date.now(), Fecha: new Date().toISOString() });
      LS("mm_demo_log", log);
      return { status: "success" };
    }
    if (p.action === "score_save") {
      const s = LS("mm_demo_scores") || [];
      s.push({ ...p.score, Id: "S" + Date.now(), Fecha: new Date().toISOString() });
      LS("mm_demo_scores", s);
      return { status: "success" };
    }
    return { status: "error", message: "Unknown action" };
  },
};
