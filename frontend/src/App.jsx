// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage.jsx";
import Cv from "./components/Cv.jsx";
import Applications from "./components/Applications.jsx";
import Profile from "./components/settings/Profile.jsx";
import { loadInitialTheme } from "./components/settings/theme";
import CVBuilderPage from "./pages/CVBuilderPage";

loadInitialTheme();

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/cv" element={<Cv />} />
      <Route path="/ansøgninger" element={<Applications />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/cv/builder" element={<CVBuilderPage />} />
    </Routes>
  );
}
