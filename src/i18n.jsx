/* =====================================================================
   MOMENTUM · IDIOMA (English / Español)
   - T("English text") devuelve la versión en español si el idioma es "es".
   - Las traducciones de la interfaz están en src/i18n/es.json
   - El contenido de cada periodo en español está en src/data/curriculumES*.js
   ===================================================================== */
import { createContext, useContext, useState, useEffect } from "react";
import ES from "./i18n/es.json";

const KEY = "mm_lang";
let LANG = (() => { try { return localStorage.getItem(KEY) || "en"; } catch { return "en"; } })();
export const getLang = () => LANG;

/* T("Text {0} more {1}", a, b) */
export function T(s, ...args) {
  if (s == null) return s;
  let out = String(s);
  if (LANG === "es") {
    const m = out.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const tr = ES[m[2]];
    out = m[1] + (tr ?? m[2]) + m[3];
  }
  return args.length ? out.replace(/\{(\d+)\}/g, (_, i) => args[Number(i)]) : out;
}

const Ctx = createContext({ lang: "en", setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(LANG);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l) => {
    LANG = l;
    try { localStorage.setItem(KEY, l); } catch { /* ignore */ }
    setLangState(l);
    // recarga para que TODO (incluidos datos y simulaciones) se pinte en el nuevo idioma
    window.location.reload();
  };
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);

export function LangToggle({ dark = false, compact = false }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`lang-toggle ${dark ? "dark" : ""} ${compact ? "compact" : ""}`} role="group" aria-label="Language">
      <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} title="English">🇺🇸 EN</button>
      <button className={lang === "es" ? "on" : ""} onClick={() => setLang("es")} title="Español">🇨🇴 ES</button>
    </div>
  );
}
