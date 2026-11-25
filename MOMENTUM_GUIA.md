# ⚡ MOMENTUM · Guía paso a paso

## 1) Poner el código en tu repo `fisicaforstudents`

En la **raíz** del repo (donde está `package.json`):

```bash
# 1. descomprimir encima (sobrescribe lo que haga falta)
unzip -o momentum-fisica.zip -d .

# 2. (opcional pero recomendado) borrar archivos viejos del boilerplate que ya no se usan
rm -rf src/pages/Demo.jsx src/pages/Single.jsx src/components/Navbar.jsx src/components/Footer.jsx \
       src/store.js src/hooks src/index.css src/assets README.es.md 4geeks.ico learn.json

# 3. instalar dependencias nuevas (katex y lucide-react) y arrancar
npm install
npm run dev
```

Abre `http://localhost:3000`. Sin URL de Apps Script la app entra en **modo demo**:
usuario `profe@momentum.app`, clave `physics` (las preguntas se guardan solo en el navegador).

---

## 2) Crear la Google Sheet y el Apps Script

1. En Google Drive crea una hoja nueva llamada **MOMENTUM**.
2. Menú **Extensiones → Apps Script**.
3. Borra lo que haya en `Código.gs` y pega **todo** el archivo `apps-script/Code.gs`. Guarda (💾).
4. Arriba, en el selector de funciones, elige **`setupMomentum`** y pulsa **Ejecutar**.
   - Google pedirá permisos → *Revisar permisos* → tu cuenta → *Configuración avanzada* → *Ir a… (no seguro)* → *Permitir*.
   - Se crean solas las 4 hojas con columnas, colores, listas desplegables y un usuario demo.

### Hojas y columnas que quedan creadas

| Hoja | Columnas | Para qué |
|---|---|---|
| **Users** | User_Id · Nombre · Email · Password · Rol · Grados · Activo · Ultimo_Login · Creado | Profes que pueden entrar |
| **Questions** | Id · Grado · Periodo · Tema · Nivel · Pregunta · Opcion_A · Opcion_B · Opcion_C · Opcion_D · Correcta · Explicacion · Autor · Activa · Creado · Actualizado | Preguntas propias (salen en el banco y en los juegos) |
| **Class_Log** | Id · Fecha · Email · Grado · Periodo · Tema · Recurso · Notas | Diario “Mark as taught” |
| **Game_Scores** | Id · Fecha · Email · Juego · Grado · Equipo · Puntos · Detalle_JSON | Resultados de Millionaire y Board Battle |

### Usuarios
- Usuario demo creado: **profe@momentum.app / physics2027** (cámbialo).
- Para agregar profes: una fila por profe en **Users** → `Nombre`, `Email`, `Password`, `Rol` (teacher/admin), `Activo` = TRUE.
- (Opcional) ejecuta **`hashPasswords`** para convertir las claves a SHA-256; el login sigue funcionando igual.

### Preguntas desde la hoja
Puedes escribirlas directo en **Questions**: `Grado` 6–11, `Periodo` 1–4, `Nivel` 1–3, `Correcta` A/B/C/D, `Activa` TRUE.
También desde la app en **My questions** (una por una o pegando muchas: `Pregunta | A | B | C | D | Correcta | Explicación`).

---

## 3) Publicar la Web App (la URL que conecta todo)

1. En Apps Script: **Implementar → Nueva implementación**.
2. Tipo (⚙️): **Aplicación web**.
3. *Ejecutar como*: **Yo** · *Quién tiene acceso*: **Cualquier usuario**.
4. **Implementar** → copia la URL que termina en **`/exec`**.

Pégala en `src/api.js`:

```js
// busca esto:
export const SCRIPT_URL = "";

// reemplaza por:
export const SCRIPT_URL = "https://script.google.com/macros/s/TU_ID/exec";
```

> Alternativa: en Vercel/Netlify crea la variable `VITE_SCRIPT_URL` con esa URL.

**Sin CORS:** igual que FinFluent, los `POST` van con el body como texto plano (sin headers) y los `GET` con query params, así el navegador no hace preflight.

Prueba rápida: abre en el navegador `TU_URL/exec?action=ping` → debe responder `{"status":"success",...}`.

⚠️ **Cada vez que cambies `Code.gs`**: *Implementar → Administrar implementaciones → ✏️ Editar → Versión: Nueva versión → Implementar*. (La URL no cambia.)

---

## 4) Desplegar el front

- **Vercel**: el repo ya trae `vercel.json` (rewrite a `index.html`). Build: `npm run build`, salida `dist`.
- **Netlify**: build `npm run build`, publish `dist` (ya va `public/_redirects`).

---

## 5) Qué hay dentro (mapa rápido)

| Ruta | Qué es |
|---|---|
| `/` | Landing con branding Momentum y un cañón jugable |
| `/login` | Login contra la hoja **Users** |
| `/app` | Dashboard: mundos por grado, sims rápidas, diario |
| `/app/grade/:g` | 4 periodos del grado con ODS, temas y sims |
| `/app/grade/:g/p/:p` | Unidad: Overview (clase de 45′), Formulas, Virtual labs (Predict→Observe→Explain), Worked examples, Reading, Questions, Teacher tips |
| `/present/:g/:p` | **Presentación** del periodo (→ / espacio / clic, `F` pantalla completa) con simulaciones vivas dentro |
| `/app/sims` | 24 simulaciones con filtros por familia y grado |
| `/app/games` | Millionaire · Board Battle · Spin the Wheel |
| `/app/bank` | 600 preguntas ICFES (100 por grado) + las tuyas, modo proyector e impresión |
| `/app/my-questions` | Crear / pegar / editar / borrar preguntas en la Sheet |
| `/app/formulas` | Muro de fórmulas con trucos, clic para proyectar |

### Dónde editar contenido
- Temas, ideas, fórmulas, ejemplos, laboratorios y lecturas: `src/data/curriculum6_8.js` y `src/data/curriculum9_11.js` (un objeto por periodo).
- Banco ICFES: 5 preguntas conceptuales (`quiz`) por periodo + 20 generadas con plantillas (`gen`) en `src/data/bank.js`. Son **fijas** (semilla), la pregunta #37 de 9° siempre es la misma.
- Simulaciones: `src/sims/*.jsx` (registro en `src/sims/index.js`).
- Colores y estilos: `src/styles/app.css` y `src/styles/sims.css`.
