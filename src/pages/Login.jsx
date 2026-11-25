import { useState } from "react";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../auth";
import { isDemo } from "../api";
import { Brand } from "../components/ui";
import { Tex } from "../sims/kit";

const FLOAT = ["F = ma", "v = \\frac{d}{t}", "E_k = \\tfrac12 mv^2", "PV = nRT", "V = IR", "\\lambda = \\frac{h}{p}", "n_1\\sin\\theta_1 = n_2\\sin\\theta_2", "T = 2\\pi\\sqrt{L/g}", "Q = mc\\Delta T", "p = mv"];

export function Login() {
  const { login, session } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState(isDemo ? "profe@momentum.app" : "");
  const [pass, setPass] = useState(isDemo ? "physics" : "");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  if (session) return <Navigate to="/app" replace />;

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try { await login(email, pass); nav(loc.state?.from || "/app", { replace: true }); }
    catch (x) { setErr(x.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="login">
      <div className="login-board">
        {FLOAT.map((f, i) => <span key={f} className="login-float" style={{ "--i": i }}><Tex tex={f} /></span>)}
        <div className="login-board-txt">
          <h2>Good physics classes<br />are <em>built</em>, not improvised.</h2>
          <p>Simulations, decks, games and questions — ready before the bell rings.</p>
        </div>
      </div>
      <form className="login-form" onSubmit={submit}>
        <Link to="/" className="back"><ArrowLeft size={16} /> Back</Link>
        <Brand />
        <h1>Teacher login</h1>
        <p className="muted">Use the email and password from the <b>Users</b> sheet.</p>
        <label><span>Email</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teacher@school.edu.co" /></label>
        <label><span>Password</span><input type="password" required value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" /></label>
        {err && <div className="alert">{err}</div>}
        <button className="btn btn-tang btn-lg" disabled={busy}>{busy ? "Checking…" : <>Enter the studio <ArrowRight size={18} /></>}</button>
        {isDemo && <div className="demo-note">🧪 <b>Demo mode</b> — no Apps Script URL yet. Use <code>profe@momentum.app</code> / <code>physics</code>. Paste your Web App URL in <code>src/api.js</code> to connect Google Sheets.</div>}
      </form>
    </div>
  );
}
