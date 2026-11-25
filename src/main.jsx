import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "katex/dist/katex.min.css";
import "./styles/app.css";
import "./styles/sims.css";
import { router } from "./routes";
import { AuthProvider } from "./auth";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
