// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import MateriasPage from "./pages/MateriasPage";
import ClasesPage from "./pages/ClasesPage";
import EncuestasPage from "./pages/EncuestasPage";
import LoginPage from "./pages/LoginPage";

function AppRoutes({ user, setUser }) {
  return (
    <>
      <Navbar
        user={user}
        onLogout={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user");
          setUser(null);
          window.location.href = "/"; 
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/materias" element={<MateriasPage />} />
        <Route path="/clases" element={<ClasesPage />} />
        <Route path="/encuestas" element={<EncuestasPage />} />
        <Route
          path="/login"
          element={<LoginPage onLogin={(u) => setUser(u)} />}
        />
      </Routes>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <Router>
      <AppRoutes user={user} setUser={setUser} />
    </Router>
  );
}
