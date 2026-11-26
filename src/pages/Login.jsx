import { LangToggle } from "../i18n";
import { T } from "../i18n";
import { useState } from "react";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../auth";
import { isDemo } from "../api";
import { Brand } from "../components/ui";
import { Tex } from "../sims/kit";
const SPOTS = [[8, 8], [55, 6], [30, 18], [72, 20], [10, 32], [48, 34], [20, 50], [65, 46], [38, 58], [80, 60]];
const FLOAT = [T("F = ma"), T("v = \\frac{d}{t}"), T("E_k = \\tfrac12 mv^2"), T("PV = nRT"), T("V = IR"), T("\\lambda = \\frac{h}{p}"), T("n_1\\sin\\theta_1 = n_2\\sin\\theta_2"), T("T = 2\\pi\\sqrt{L/g}"), T("Q = mc\\Delta T"), T("p = mv")];
/* posiciones fijas repartidas en la parte de arriba del tablero (el texto queda abajo) */

export function Login() {
  const {
    login,
    session
  } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState(isDemo ? "profe@momentum.app" : "");
  const [pass, setPass] = useState(isDemo ? "physics" : "");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  if (session) return <Navigate to="/app" replace />;
  const submit = async e => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(email, pass);
      nav(loc.state?.from || "/app", {
        replace: true
      });
    } catch (x) {
      setErr(x.message);
    } finally {
      setBusy(false);
    }
  };
  return <div className="login">
      <div className="login-board">
        <div className="login-floats">
          {FLOAT.map((f, i) => <span key={f} className="login-float" style={{
          "--i": i,
          left: SPOTS[i][0] + "%",
          top: SPOTS[i][1] + "%"
        }}><Tex tex={f} /></span>)}
        </div>
        <div className="login-board-txt">
          <h2>{T("Good physics classes")}<br />{T("are")} <em>{T("built")}</em>{T(", not improvised.")}</h2>
          <p>{T("Simulations, decks, games and questions — ready before the bell rings.")}</p>
        </div>
      </div>
      <form className="login-form" onSubmit={submit}>
        <div className="login-top"><Link to="/" className="back"><ArrowLeft size={16} /> {T("Back")}</Link><LangToggle /></div>
        <Brand />
        <h1>{T("Teacher login")}</h1>
        <p className="muted">{T("Use the email and password from the")} <b>{T("Users")}</b> {T("sheet.")}</p>
        <label><span>{T("Email")}</span><input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={T("teacher@school.edu.co")} /></label>
        <label><span>{T("Password")}</span><input type="password" required value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" /></label>
        {err && <div className="alert">{err}</div>}
        <button className="btn btn-tang btn-lg" disabled={busy}>{busy ? T("Checking…") : <>{T("Enter the studio")} <ArrowRight size={18} /></>}</button>
        {isDemo && <div className="demo-note">🧪 <b>{T("Demo mode")}</b> {T("— no Apps Script URL yet. Use")} <code>{T("profe@momentum.app")}</code> / <code>{T("physics")}</code>{T(". Paste your Web App URL in")} <code>{T("src/api.js")}</code> {T("to connect Google Sheets.")}</div>}
      </form>
    </div>;
}