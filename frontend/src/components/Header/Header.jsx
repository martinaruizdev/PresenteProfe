import React from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header
      id="hero-header"
      className="min-h-screen w-full flex flex-col bg-cover bg-center"
    >
      <div className="w-full h-full flex flex-col items-start justify-start px-6 lg:px-28 py-20 pt-48 lg:pt-32 xl:pt-56">
        <div className="flex flex-col justify-center items-start text-left w-full lg:w-2/3 space-y-8 ">
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-dark">
            Tomá
            <span className="text-blue-950"> lista en segundos</span>, sin papel
            ni estrés.
          </h1>

          <h2 className="text-dark/80 max-w-xl">
            Con PresenteProfe, tus estudiantes registran su asistencia
            escaneando un código QR. Simple, rápido y confiable.
          </h2>

          <Link to="/login" className="bg-teal-500 hover:bg-teal-600 transition-all duration-200 text-white font-bold py-3 px-8 rounded-2xl flex items-center justify-center">
            Probar Ahora <HiArrowNarrowRight className="ml-2 text-xl" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
