import React from "react";
import logo from "../../assets/logo-img.png";
const Navbar = () => {
  return (
    <nav className="flex justify-center py-4">
      <ul className="flex space-x-32 bg-white/80 backdrop-blur-md rounded-2xl px-10 py-3 shadow-lg">
        <li>
          <a
            href="#home"
            className="text-gray-700 hover:text-teal-500 font-medium"
          >
            <img src={logo} alt="Logo" />
          </a>
        </li>
        <li>
          <a
            href="#about"
            className="text-gray-700 hover:text-teal-500 font-medium"
          >
            Iniciar Sesión
          </a>
        </li>
        <li>
          <a
            href="#services"
            className="text-gray-700 hover:text-teal-500 font-medium"
          >
            Registrarse
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
