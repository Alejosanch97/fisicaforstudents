/**
 * =====================================================================
 *  MOMENTUM · PHYSICS STUDIO — BACKEND (Google Apps Script)
 *  Base de datos: Google Sheets "MOMENTUM"
 *
 *  Hojas (se crean solas con setupMomentum):
 *    Users        → profesores que pueden entrar
 *    Questions    → preguntas propias (aparecen en el banco y en los juegos)
 *    Class_Log    → diario de clases ("Mark as taught")
 *    Game_Scores  → resultados de Millionaire y Board Battle
 *
 *  Endpoints (sin CORS: el front manda el body como texto plano):
 *    GET   ?action=ping
 *    GET   ?action=questions&token=…
 *    GET   ?action=log&token=…
 *    GET   ?action=scores&token=…
 *    POST  { action: login | question_save | question_bulk | question_delete | log_save | score_save, … }
 *
 *  PASOS RÁPIDOS:
 *   1) Crea una Google Sheet llamada MOMENTUM → Extensiones → Apps Script.
 *   2) Pega TODO este archivo en Code.gs y guarda.
 *   3) Ejecuta la función setupMomentum() UNA vez (acepta los permisos).
 *   4) Implementar → Nueva implementación → Aplicación web
 *        Ejecutar como: Yo · Quién tiene acceso: Cualquier usuario.
 *   5) Copia la URL que termina en /exec y pégala en src/api.js (SCRIPT_URL).
 * =====================================================================
 */

/* Si el script está VINCULADO a la hoja (Extensiones → Apps Script) deja esto vacío.
   Si es un proyecto independiente, pega aquí el ID de la Google Sheet. */
const SHEET_ID = '';
const ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();

const TOKEN_DAYS = 7;

const SCHEMA = {
  Users:       ['User_Id', 'Nombre', 'Email', 'Password', 'Rol', 'Grados', 'Activo', 'Ultimo_Login', 'Creado'],
  Questions:   ['Id', 'Grado', 'Periodo', 'Tema', 'Nivel', 'Pregunta', 'Opcion_A', 'Opcion_B', 'Opcion_C', 'Opcion_D', 'Correcta', 'Explicacion', 'Autor', 'Activa', 'Creado', 'Actualizado'],
  Class_Log:   ['Id', 'Fecha', 'Email', 'Grado', 'Periodo', 'Tema', 'Recurso', 'Notas'],
  Game_Scores: ['Id', 'Fecha', 'Email', 'Juego', 'Grado', 'Equipo', 'Puntos', 'Detalle_JSON'],
};

const COLORS = { Users: '#17183b', Questions: '#ff5a36', Class_Log: '#10a58c', Game_Scores: '#ffc12e' };

/* =====================================================================
   SETUP: crea hojas, encabezados, formato, validaciones y usuario demo
   ▶ Ejecuta esta función UNA vez desde el editor.
   ===================================================================== */
function setupMomentum() {
  Object.keys(SCHEMA).forEach(function (name) {
    const headers = SCHEMA[name];
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);

    // encabezados (si faltan columnas, las agrega al final sin borrar datos)
    const lastCol = Math.max(sh.getLastColumn(), 1);
    const current = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
    if (!current[0]) {
      sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    } else {
      headers.forEach(function (h) {
        if (current.indexOf(h) === -1) sh.getRange(1, sh.getLastColumn() + 1).setValue(h);
      });
    }

    const n = sh.getLastColumn();
    sh.getRange(1, 1, 1, n)
      .setFontWeight('bold').setFontColor(name === 'Game_Scores' ? '#17183b' : '#ffffff')
      .setBackground(COLORS[name]).setHorizontalAlignment('center');
    sh.setFrozenRows(1);
    sh.setRowHeight(1, 32);
    sh.getRange('A:A').setNumberFormat('@'); // IDs como texto
  });

  // ---------- Users ----------
  const u = ss.getSheetByName('Users');
  const uh = SCHEMA.Users;
  u.setColumnWidth(uh.indexOf('Nombre') + 1, 200);
  u.setColumnWidth(uh.indexOf('Email') + 1, 240);
  u.getRange(2, uh.indexOf('Password') + 1, 500, 1).setNumberFormat('@');
  u.getRange(2, uh.indexOf('Rol') + 1, 500, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['teacher', 'admin'], true).build());
  u.getRange(2, uh.indexOf('Activo') + 1, 500, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['TRUE', 'FALSE'], true).setAllowInvalid(true).build());
  if (u.getLastRow() < 2) {
    u.appendRow(['U001', 'Profe Demo', 'profe@momentum.app', 'physics2027', 'admin', '6,7,8,9,10,11', true, '', new Date()]);
  }

  // ---------- Questions ----------
  const q = ss.getSheetByName('Questions');
  const qh = SCHEMA.Questions;
  q.setColumnWidth(qh.indexOf('Pregunta') + 1, 380);
  ['Opcion_A', 'Opcion_B', 'Opcion_C', 'Opcion_D'].forEach(function (c) { q.setColumnWidth(qh.indexOf(c) + 1, 160); });
  q.setColumnWidth(qh.indexOf('Explicacion') + 1, 260);
  q.getRange(2, qh.indexOf('Grado') + 1, 2000, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['6', '7', '8', '9', '10', '11'], true).build());
  q.getRange(2, qh.indexOf('Periodo') + 1, 2000, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['1', '2', '3', '4'], true).build());
  q.getRange(2, qh.indexOf('Nivel') + 1, 2000, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['1', '2', '3'], true).setHelpText('1 = Easy · 2 = Medium · 3 = Hard').build());
  q.getRange(2, qh.indexOf('Correcta') + 1, 2000, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['A', 'B', 'C', 'D'], true).build());
  q.getRange(2, qh.indexOf('Activa') + 1, 2000, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['TRUE', 'FALSE'], true).setAllowInvalid(true).build());
  q.getRange(2, qh.indexOf('Pregunta') + 1, 2000, 1).setWrap(true);
  if (q.getLastRow() < 2) {
    q.appendRow(['Q-EXAMPLE', 8, 1, 'Vectors & Kinematics', 1, 'Which of these quantities is a vector?', 'Mass', 'Time', 'Velocity', 'Temperature', 'C', 'Velocity has magnitude and direction.', 'profe@momentum.app', true, new Date(), new Date()]);
  }

  // ---------- Class_Log & Game_Scores ----------
  ss.getSheetByName('Class_Log').setColumnWidth(SCHEMA.Class_Log.indexOf('Notas') + 1, 360);
  ss.getSheetByName('Game_Scores').setColumnWidth(SCHEMA.Game_Scores.indexOf('Detalle_JSON') + 1, 260);

  // borra la "Hoja 1" vacía si existe
  ['Hoja 1', 'Sheet1', 'Hoja1'].forEach(function (nm) {
    const s = ss.getSheetByName(nm);
    if (s && s.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s);
  });

  Logger.log('✅ MOMENTUM listo. Usuario demo: profe@momentum.app / physics2027 (cámbialo en la hoja Users).');
}

/* =====================================================================
   HELPERS
   ===================================================================== */
function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function sheet_(name) {
  const sh = ss.getSheetByName(name);
  if (!sh) throw new Error('Falta la hoja "' + name + '". Ejecuta setupMomentum().');
  return sh;
}

function headers_(sh) {
  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(function (h) { return String(h).trim(); });
}

function rows_(name) {
  const sh = sheet_(name);
  if (sh.getLastRow() < 2) return [];
  const values = sh.getDataRange().getValues();
  const h = values[0].map(function (x) { return String(x).trim(); });
  const out = [];
  for (let r = 1; r < values.length; r++) {
    if (values[r].every(function (c) { return c === '' || c === null; })) continue;
    const o = { _row: r + 1 };
    h.forEach(function (k, i) { if (k) o[k] = values[r][i] instanceof Date ? values[r][i].toISOString() : values[r][i]; });
    out.push(o);
  }
  return out;
}

function append_(name, obj) {
  const sh = sheet_(name);
  const h = headers_(sh);
  sh.appendRow(h.map(function (k) { return obj[k] === undefined ? '' : obj[k]; }));
}

function newId_(prefix) {
  return prefix + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 1296).toString(36).toUpperCase();
}

function sha256_(s) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s), Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
}

/* ---------- sesiones (tokens de 7 días en Script Properties) ---------- */
function createToken_(user) {
  const token = Utilities.getUuid();
  PropertiesService.getScriptProperties().setProperty('MM_' + token, JSON.stringify({
    email: user.Email, nombre: user.Nombre, rol: user.Rol, exp: Date.now() + TOKEN_DAYS * 864e5,
  }));
  return token;
}

function session_(token) {
  if (!token) return null;
  const props = PropertiesService.getScriptProperties();
  const raw = props.getProperty('MM_' + token);
  if (!raw) return null;
  const s = JSON.parse(raw);
  if (Date.now() > s.exp) { props.deleteProperty('MM_' + token); return null; }
  return s;
}

const NO_SESSION = { status: 'error', message: 'Session expired (token). Log out and log in again.' };

/* =====================================================================
   GET
   ===================================================================== */
function doGet(e) {
  try {
    const p = e.parameter || {};
    if (!p.action || p.action === 'ping') return json_({ status: 'success', app: 'Momentum Physics Studio', time: new Date() });

    const s = session_(p.token);
    if (!s) return json_(NO_SESSION);

    if (p.action === 'questions') {
      const qs = rows_('Questions').filter(function (q) {
        return q.Pregunta && q.Activa !== false && String(q.Activa).toUpperCase() !== 'FALSE';
      }).map(function (q) { delete q._row; return q; });
      return json_({ status: 'success', questions: qs });
    }

    if (p.action === 'log') {
      const log = rows_('Class_Log').filter(function (l) { return String(l.Email).toLowerCase() === String(s.email).toLowerCase(); })
        .map(function (l) { delete l._row; return l; });
      return json_({ status: 'success', log: log.slice(-50) });
    }

    if (p.action === 'scores') {
      const sc = rows_('Game_Scores').map(function (l) { delete l._row; return l; });
      return json_({ status: 'success', scores: sc.slice(-100) });
    }

    return json_({ status: 'error', message: 'Unknown action' });
  } catch (err) {
    return json_({ status: 'error', message: err.message });
  }
}

/* =====================================================================
   POST
   ===================================================================== */
function doPost(e) {
  try {
    const p = JSON.parse(e.postData.contents || '{}');

    /* ---------- LOGIN ---------- */
    if (p.action === 'login') {
      const email = String(p.email || '').trim().toLowerCase();
      const pass = String(p.password || '');
      const user = rows_('Users').find(function (u) { return String(u.Email).trim().toLowerCase() === email; });
      const stored = user ? String(user.Password) : '';
      const ok = user && (stored === pass || stored === 'sha256:' + sha256_(pass));
      if (!ok) return json_({ status: 'error', message: 'Wrong email or password.' });
      if (user.Activo === false || String(user.Activo).toUpperCase() === 'FALSE') return json_({ status: 'error', message: 'This user is inactive.' });

      const sh = sheet_('Users');
      const col = headers_(sh).indexOf('Ultimo_Login') + 1;
      if (col > 0) sh.getRange(user._row, col).setValue(new Date());

      return json_({
        status: 'success',
        token: createToken_(user),
        user: { Nombre: user.Nombre, Email: user.Email, Rol: user.Rol || 'teacher', Grados: String(user.Grados || '6,7,8,9,10,11') },
      });
    }

    const s = session_(p.token);
    if (!s) return json_(NO_SESSION);

    const lock = LockService.getScriptLock();
    if (!lock.tryLock(15000)) return json_({ status: 'error', message: 'Server busy, try again.' });
    try {
      /* ---------- GUARDAR / EDITAR PREGUNTA ---------- */
      if (p.action === 'question_save') {
        const q = clean_(p.question || {}, s);
        if (!q.Pregunta) return json_({ status: 'error', message: 'Write the question.' });
        const sh = sheet_('Questions');
        const h = headers_(sh);
        if (q.Id) {
          const found = rows_('Questions').find(function (r) { return String(r.Id) === String(q.Id); });
          if (found) {
            const merged = h.map(function (k) { return q[k] !== undefined ? q[k] : (found[k] === undefined ? '' : found[k]); });
            merged[h.indexOf('Actualizado')] = new Date();
            sh.getRange(found._row, 1, 1, h.length).setValues([merged]);
            return json_({ status: 'success', question: q });
          }
        }
        q.Id = newId_('Q');
        q.Creado = new Date(); q.Actualizado = new Date(); q.Activa = true;
        append_('Questions', q);
        return json_({ status: 'success', question: q });
      }

      /* ---------- PEGAR MUCHAS PREGUNTAS ---------- */
      if (p.action === 'question_bulk') {
        const list = (p.questions || []).slice(0, 300).map(function (x) { return clean_(x, s); }).filter(function (x) { return x.Pregunta; });
        if (!list.length) return json_({ status: 'error', message: 'No valid questions.' });
        const sh = sheet_('Questions');
        const h = headers_(sh);
        const now = new Date();
        const rows = list.map(function (q, i) {
          q.Id = newId_('Q') + i; q.Creado = now; q.Actualizado = now; q.Activa = true;
          return h.map(function (k) { return q[k] === undefined ? '' : q[k]; });
        });
        sh.getRange(sh.getLastRow() + 1, 1, rows.length, h.length).setValues(rows);
        return json_({ status: 'success', saved: rows.length });
      }

      /* ---------- BORRAR PREGUNTA ---------- */
      if (p.action === 'question_delete') {
        const found = rows_('Questions').find(function (r) { return String(r.Id) === String(p.id); });
        if (!found) return json_({ status: 'error', message: 'Question not found.' });
        sheet_('Questions').deleteRow(found._row);
        return json_({ status: 'success' });
      }

      /* ---------- DIARIO DE CLASE ---------- */
      if (p.action === 'log_save') {
        const en = p.entry || {};
        append_('Class_Log', {
          Id: newId_('L'), Fecha: new Date(), Email: s.email,
          Grado: Number(en.Grado) || '', Periodo: Number(en.Periodo) || '', Tema: String(en.Tema || '').slice(0, 120),
          Recurso: String(en.Recurso || '').slice(0, 60), Notas: String(en.Notas || '').slice(0, 1000),
        });
        return json_({ status: 'success' });
      }

      /* ---------- PUNTAJES DE JUEGOS ---------- */
      if (p.action === 'score_save') {
        const sc = p.score || {};
        append_('Game_Scores', {
          Id: newId_('S'), Fecha: new Date(), Email: s.email, Juego: String(sc.Juego || ''), Grado: Number(sc.Grado) || '',
          Equipo: String(sc.Equipo || '').slice(0, 60), Puntos: Number(sc.Puntos) || 0, Detalle_JSON: String(sc.Detalle_JSON || '').slice(0, 2000),
        });
        return json_({ status: 'success' });
      }

      return json_({ status: 'error', message: 'Unknown action' });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return json_({ status: 'error', message: err.message });
  }
}

/* limpia y valida una pregunta que viene del front */
function clean_(x, s) {
  const L = String(x.Correcta || 'A').trim().toUpperCase().charAt(0);
  return {
    Id: x.Id ? String(x.Id) : '',
    Grado: Math.min(11, Math.max(6, Number(x.Grado) || 6)),
    Periodo: Math.min(4, Math.max(1, Number(x.Periodo) || 1)),
    Tema: String(x.Tema || '').slice(0, 80),
    Nivel: Math.min(3, Math.max(1, Number(x.Nivel) || 2)),
    Pregunta: String(x.Pregunta || '').trim().slice(0, 600),
    Opcion_A: String(x.Opcion_A || '').slice(0, 200),
    Opcion_B: String(x.Opcion_B || '').slice(0, 200),
    Opcion_C: String(x.Opcion_C || '').slice(0, 200),
    Opcion_D: String(x.Opcion_D || '').slice(0, 200),
    Correcta: 'ABCD'.indexOf(L) >= 0 ? L : 'A',
    Explicacion: String(x.Explicacion || '').slice(0, 400),
    Autor: s.email,
  };
}

/* =====================================================================
   UTILIDADES MANUALES (ejecútalas desde el editor cuando las necesites)
   ===================================================================== */

/* Convierte todas las contraseñas en texto plano de Users a SHA-256 (opcional, más seguro) */
function hashPasswords() {
  const sh = sheet_('Users');
  const h = headers_(sh);
  const col = h.indexOf('Password') + 1;
  const n = sh.getLastRow() - 1;
  if (n < 1) return;
  const vals = sh.getRange(2, col, n, 1).getValues();
  const out = vals.map(function (r) { const v = String(r[0]); return [v && v.indexOf('sha256:') !== 0 ? 'sha256:' + sha256_(v) : v]; });
  sh.getRange(2, col, n, 1).setValues(out);
  Logger.log('🔒 Contraseñas convertidas: ' + n);
}

/* Borra todas las sesiones guardadas (obliga a todos a volver a entrar) */
function clearSessions() {
  const props = PropertiesService.getScriptProperties();
  const all = props.getProperties();
  let n = 0;
  Object.keys(all).forEach(function (k) { if (k.indexOf('MM_') === 0) { props.deleteProperty(k); n++; } });
  Logger.log('Sesiones borradas: ' + n);
}

/* Prueba rápida desde el editor: muestra cuántas filas tiene cada hoja */
function testMomentum() {
  Object.keys(SCHEMA).forEach(function (n) { Logger.log(n + ': ' + rows_(n).length + ' filas'); });
}
