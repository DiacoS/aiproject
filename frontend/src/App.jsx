// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage.jsx";
import Cv from "./components/Cv.jsx";
import Applications from "./components/Applications.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/cv" element={<Cv />} />
      <Route path="/ansøgninger" element={<Applications />} />
    </Routes>
  );
}
