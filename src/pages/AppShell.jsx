import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FlaskConical, Gamepad2, ClipboardList, NotebookPen, Sigma, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../auth";
import { isDemo } from "../api";
import { Brand } from "../components/ui";
import { GRADES } from "../data/grades";

export function AppShell() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [loc.pathname]);
  const first = (user?.Nombre || "Teacher").split(" ")[0];

  return (
    <div className={`shell ${open ? "open" : ""}`}>
      <aside className="side">
        <button className="side-brand" onClick={() => nav("/app")}><Brand /></button>
        <div className="side-user">
          <span className="avatar">{first[0]}</span>
          <div><b>{user?.Nombre || "Teacher"}</b><small>{isDemo ? "Demo mode" : user?.Rol || "teacher"}</small></div>
        </div>
        <nav>
          <NavLink end to="/app"><LayoutDashboard size={18} /> Dashboard</NavLink>
          <span className="side-label">Grades</span>
          <div className="side-grades">
            {GRADES.map((g) => (
              <NavLink key={g.g} to={`/app/grade/${g.g}`} style={{ "--gc": g.color, "--gi": g.ink }} title={g.name}>
                <b>{g.g}°</b><span>{g.name}</span>
              </NavLink>
            ))}
          </div>
          <span className="side-label">Toolbox</span>
          <NavLink to="/app/sims"><FlaskConical size={18} /> Simulations</NavLink>
          <NavLink to="/app/games"><Gamepad2 size={18} /> Games</NavLink>
          <NavLink to="/app/bank"><ClipboardList size={18} /> Question bank</NavLink>
          <NavLink to="/app/my-questions"><NotebookPen size={18} /> My questions</NavLink>
          <NavLink to="/app/formulas"><Sigma size={18} /> Formula wall</NavLink>
        </nav>
        <button className="side-out" onClick={() => { logout(); nav("/"); }}><LogOut size={17} /> Log out</button>
      </aside>
      <div className="main">
        <div className="topbar">
          <button onClick={() => setOpen((o) => !o)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
          <Brand />
        </div>
        <Outlet />
      </div>
      <div className="side-scrim" onClick={() => setOpen(false)} />
    </div>
  );
}
