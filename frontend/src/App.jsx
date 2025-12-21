import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";

import Homepage from "./components/Homepage.jsx";
import Cv from "./components/Cv.jsx";
import Applications from "./components/Applications.jsx";
import Profile from "./components/settings/Profile.jsx";
import CVBuilderPage from "./pages/CVBuilderPage";

import { loadInitialTheme } from "./components/settings/theme";

loadInitialTheme();

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/cv" element={<Cv />} />
        <Route path="/ansøgninger" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cv/builder" element={<CVBuilderPage />} />
      </Route>
    </Routes>
  );
}
