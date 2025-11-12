// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import MateriasPage from "./pages/MateriasPage";
import ClasesPage from "./pages/ClasesPage";
import EncuestasPage from "./pages/EncuestasPage";
import LoginPage from "./pages/LoginPage";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/materias" element={<MateriasPage />} />
        <Route path="/clases" element={<ClasesPage />} />
        <Route path="/encuestas" element={<EncuestasPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
