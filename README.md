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
