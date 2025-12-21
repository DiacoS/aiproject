// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "../src/styles/cv-editor.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import { loadInitialTheme } from "./components/settings/theme";
loadInitialTheme();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
