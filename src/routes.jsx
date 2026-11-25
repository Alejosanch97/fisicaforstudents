import { createBrowserRouter, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { AppShell } from "./pages/AppShell";
import { Dashboard } from "./pages/Dashboard";
import { GradePage } from "./pages/GradePage";
import { UnitPage } from "./pages/UnitPage";
import { SimLibrary, SimPage } from "./pages/SimPages";
import { GamesHub } from "./pages/GamesHub";
import { Millionaire } from "./games/Millionaire";
import { Jeopardy } from "./games/Jeopardy";
import { Wheel } from "./games/Wheel";
import { BankPage } from "./pages/BankPage";
import { MyQuestions } from "./pages/MyQuestions";
import { FormulaWall } from "./pages/FormulaWall";
import { Presentation } from "./pages/Presentation";
import { RequireAuth } from "./auth";

const guard = (el) => <RequireAuth>{el}</RequireAuth>;

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/present/:grade/:period", element: guard(<Presentation />) },
  {
    path: "/app",
    element: guard(<AppShell />),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "grade/:grade", element: <GradePage /> },
      { path: "grade/:grade/p/:period", element: <UnitPage /> },
      { path: "sims", element: <SimLibrary /> },
      { path: "sims/:simId", element: <SimPage /> },
      { path: "games", element: <GamesHub /> },
      { path: "games/millionaire", element: <Millionaire /> },
      { path: "games/board", element: <Jeopardy /> },
      { path: "games/wheel", element: <Wheel /> },
      { path: "bank", element: <BankPage /> },
      { path: "my-questions", element: <MyQuestions /> },
      { path: "formulas", element: <FormulaWall /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
