import { T } from "../i18n";
import { useEffect } from "react";
import { X } from "lucide-react";
import { gradeMeta } from "../data/grades";
export function Logo({
  size = 36,
  light = false
}) {
  return <svg className="mm-logo" width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <rect width="64" height="64" rx="16" fill={light ? "#f4efe4" : "#17183b"} />
      <path d="M10 50 Q 30 -2 54 46" fill="none" stroke="#ff5a36" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 9" />
      <circle cx="46" cy="27" r="7" fill="#ffc12e" />
      <path d="M46 27 L58 33" stroke="#ffc12e" strokeWidth="3.5" strokeLinecap="round" />
    </svg>;
}
export function Brand({
  light
}) {
  return <span className={`mm-brand ${light ? "light" : ""}`}>
      <Logo size={34} light={light} />
      <span>{T("Moment")}<b>{T("um")}</b><small>{T("Physics Studio")}</small></span>
    </span>;
}
export function GradeBadge({
  g,
  big
}) {
  const m = gradeMeta(g);
  return <span className={`grade-badge ${big ? "big" : ""}`} style={{
    "--gc": m.color,
    "--gi": m.ink
  }}>{g}°</span>;
}
export function PageHead({
  kicker,
  title,
  sub,
  children,
  color
}) {
  return <header className="page-head" style={color ? {
    "--gc": color
  } : undefined}>
      <div>
        {kicker && <span className="kicker">{kicker}</span>}
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {children && <div className="page-head-actions">{children}</div>}
    </header>;
}
export function Modal({
  open,
  onClose,
  children,
  wide,
  title
}) {
  useEffect(() => {
    if (!open) return;
    const k = e => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return <div className="mm-modal-bg" onMouseDown={e => e.target === e.currentTarget && onClose?.()}>
      <div className={`mm-modal ${wide ? "wide" : ""}`}>
        {title && <h3 className="mm-modal-title">{title}</h3>}
        <button className="mm-modal-x" onClick={onClose} aria-label={T("Close")}><X size={20} /></button>
        {children}
      </div>
    </div>;
}
export function Pill({
  children,
  color
}) {
  return <span className="pill" style={color ? {
    "--pc": color
  } : undefined}>{children}</span>;
}

/* tiny sound effects for games (no files needed) */
let AC;
export function beep(kind = "ok") {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const seq = {
      ok: [[523, 0], [659, 0.09], [784, 0.18]],
      bad: [[220, 0], [180, 0.15]],
      tick: [[880, 0]],
      win: [[523, 0], [659, 0.12], [784, 0.24], [1046, 0.36]],
      spin: [[440, 0]]
    }[kind] || [[440, 0]];
    seq.forEach(([f, t]) => {
      const o = AC.createOscillator(),
        g = AC.createGain();
      o.type = kind === "bad" ? "sawtooth" : "triangle";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, AC.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.12, AC.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + t + 0.2);
      o.connect(g);
      g.connect(AC.destination);
      o.start(AC.currentTime + t);
      o.stop(AC.currentTime + t + 0.25);
    });
  } catch {/* audio not available */}
}