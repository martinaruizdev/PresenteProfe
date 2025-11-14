import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-img.png";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="flex justify-center py-4">
      <div className="flex justify-between items-center bg-[#f7f6f0] backdrop-blur-md rounded-2xl px-8 py-2 shadow-lg w-[750px]">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="h-6 w-auto" />
        </Link>

        {/* Botones de navegación */}
        <div className="flex space-x-3">
          {user && user.rol === "DOCENTE" && (
            <>
              <Link to="/materias" className="border-2 border-teal-500 text-teal-500 hover:bg-teal-100 font-medium py-2 px-5 rounded-2xl flex items-center justify-center text-sm transition-colors">Materias</Link>
              <Link to="/clases"  className="border-2 border-teal-500 text-teal-500 hover:bg-teal-100 font-medium py-2 px-5 rounded-2xl flex items-center justify-center text-sm transition-colors">Clases</Link>
            </>
          )}
          {user && user.rol === "ALUMNO" && (
            <Link to="/clases" className="border-2 border-teal-500 text-teal-500 hover:bg-teal-100 font-medium py-2 px-5 rounded-2xl flex items-center justify-center text-sm transition-colors">Clases</Link>
          )}

          {!user ? (
            <Link
              to="/login"
              className="bg-teal-500 hover:bg-teal-600 text-dark font-medium py-2 px-5 rounded-2xl flex items-center justify-center text-sm transition-colors"
            >
              Iniciar Sesión
            </Link>
          ) : (
            <button
              onClick={onLogout}
               className="border-2 border-red-500 text-red-500 hover:bg-red-100 font-medium py-2 px-5 rounded-2xl flex items-center justify-center text-sm transition-colors"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
