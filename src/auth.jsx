import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { apiGet, apiPost } from "./api";

const Ctx = createContext(null);
const KEY = "mm_session";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem(KEY) || "null"); return s && s.exp > Date.now() ? s : null; } catch { return null; }
  });
  const [myQuestions, setMyQuestions] = useState([]);

  const login = async (email, password) => {
    const r = await apiPost({ action: "login", email, password });
    if (r.status !== "success") throw new Error(r.message || "Login failed");
    const s = { token: r.token, user: r.user, exp: Date.now() + 7 * 24 * 3600e3 };
    localStorage.setItem(KEY, JSON.stringify(s));
    setSession(s);
    return s;
  };
  const logout = () => { localStorage.removeItem(KEY); setSession(null); setMyQuestions([]); };

  const refreshQuestions = useCallback(async () => {
    if (!session) return;
    try {
      const r = await apiGet({ action: "questions", token: session.token });
      if (r.status === "success") setMyQuestions(r.questions || []);
      else if (/token|sesi/i.test(r.message || "")) logout();
    } catch { /* offline: keep what we have */ }
  }, [session]);

  useEffect(() => { refreshQuestions(); }, [refreshQuestions]);

  return <Ctx.Provider value={{ session, user: session?.user, token: session?.token, login, logout, myQuestions, refreshQuestions }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

export function RequireAuth({ children }) {
  const { session } = useAuth();
  const loc = useLocation();
  if (!session) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  return children;
}
