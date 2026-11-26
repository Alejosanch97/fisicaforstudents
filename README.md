# ⚡ Momentum · Physics Studio

Plataforma para el **profesor de física** (grados 6° a 11°, todo en inglés A2 → B2):
24 simulaciones interactivas, presentaciones listas para proyectar (una por periodo),
juegos (Who Wants to Be a Physicist?, Board Battle, Spin the Wheel), banco ICFES de
100 preguntas por grado, lecturas CLIL, fórmulas con trucos de memoria y diario de clases.

- Front: React 18 + Vite + React Router + KaTeX + lucide-react
- Back: Google Apps Script + Google Sheets (`apps-script/Code.gs`)

## Arrancar
```bash
npm install
npm run dev
```
Sin URL de Apps Script la app funciona en **modo demo** (`profe@momentum.app` / `physics`).
Para conectar Google Sheets pega la URL de tu Web App en `src/api.js` → `SCRIPT_URL`.

Guía completa paso a paso: **MOMENTUM_GUIA.md**

## 🌐 Bilingual (English / Español)
The 🇺🇸 EN / 🇨🇴 ES toggle sits in the top bar, the side menu, the landing page, the login page, presentations and Millionaire. The choice is saved in the browser (`mm_lang`).
- Interface texts: `src/i18n/es.json` (English text → Spanish text).
- Spanish curriculum content: `src/data/curriculumES6_8.js` and `src/data/curriculumES9_11.js`.
- To translate a new text: wrap it in `T("English text")` and add it to `es.json`.
