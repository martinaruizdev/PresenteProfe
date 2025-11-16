import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import MateriasPage from "./pages/MateriasPage";
import ClasesPage from "./pages/ClasesPage";
import LoginPage from "./pages/LoginPage";
import ClaseDetalle from "./pages/ClaseDetallePage";
import Checkin from "./components/Checkin/Checkin";
import fondoImage from "./assets/fondo.png";

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
      <div className="flex flex-col bg-cover bg-center" 
            style={{ backgroundImage: `url(${fondoImage})` }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/materias" element={<MateriasPage />} />
        <Route path="/clases" element={<ClasesPage />} />
        <Route path="/clases/:claseId" element={<ClaseDetalle />} />
        <Route path="/checkin" element={<Checkin />} />
        <Route
          path="/login"
          element={<LoginPage onLogin={(u) => {
            setUser(u);
            window.location.href = "/clases";
          }} />}
        />
         <Route path="/checkin" element={<Checkin />} />
      </Routes>
      </div>
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
