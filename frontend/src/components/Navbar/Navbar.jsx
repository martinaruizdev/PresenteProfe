import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    if (onLogout) onLogout();
  };

  return (
    <nav className={`top-0 z-50 fixed w-full transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
      }`} >
      <div className=" mx-auto">
        <div className="flex justify-between items-center bg-white backdrop-blur-sm px-6 md:px-8 py-4 shadow-xl border border-white/50">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-bold text-xl text-slate-800 hidden sm:block">
              PresenteProfe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {user && user.rol === "DOCENTE" && (
              <>
                <Link
                  to="/materias"
                  className="border-2 border-teal-400 text-teal-600 hover:bg-teal-50 font-semibold py-2.5 px-6 rounded-2xl transition-all"
                >
                  Materias
                </Link>
                <Link
                  to="/clases"
                  className="border-2 border-teal-400 text-teal-600 hover:bg-teal-50 font-semibold py-2.5 px-6 rounded-2xl transition-all"
                >
                  Clases
                </Link>
              </>
            )}

            {user && user.rol === "ALUMNO" && (
              <Link
                to="/escanear"
                className="bg-teal-500 text-white py-2 px-4 rounded-xl"
              >
                Escanear QR
              </Link>
            )}

            {!user ? (
              <Link
                to="/login"
                className="bg-teal-400 hover:bg-teal-500 text-white font-semibold py-2.5 px-6 rounded-2xl transition-all"
              >
                Iniciar Sesión
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="border-2 border-red-400 text-red-600 hover:bg-red-50 font-semibold py-2.5 px-6 rounded-2xl transition-all"
              >
                Cerrar Sesión
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-2xl hover:bg-slate-100 transition-colors"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6 text-slate-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-slate-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 bg-white backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden animate-in slide-in-from-top">
            <div className="p-4 space-y-2">
              {user && user.rol === "DOCENTE" && (
                <>
                  <Link
                    to="/materias"
                    onClick={() => setIsMenuOpen(false)}
                    className="block border-2 border-teal-400 text-teal-600 hover:bg-teal-50 font-semibold py-3 px-6 rounded-2xl transition-colors text-center"
                  >
                    Materias
                  </Link>
                  <Link
                    to="/clases"
                    onClick={() => setIsMenuOpen(false)}
                    className="block border-2 border-teal-400 text-teal-600 hover:bg-teal-50 font-semibold py-3 px-6 rounded-2xl transition-colors text-center"
                  >
                    Clases
                  </Link>
                </>
              )}

              {user && user.rol === "ALUMNO" && (
                <Link
                  to="/escanear"
                  className="block border-2 border-teal-400 text-teal-600 hover:bg-teal-50 font-semibold py-3 px-6 rounded-2xl transition-colors text-center"
                >
                  Escanear QR
                </Link>
              )}

              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block bg-teal-400 hover:bg-teal-500 text-white font-semibold py-3 px-6 rounded-2xl transition-colors text-center"
                >
                  Iniciar Sesión
                </Link>
              ) : (
                <>
                  <div className="px-4 py-3 bg-slate-50 rounded-2xl">
                    <p className="text-sm text-slate-600">Usuario</p>
                    <p className="font-semibold text-slate-800">
                      {user.nombre || user.email}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Rol: {user.rol}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full border-2 border-red-400 text-red-600 hover:bg-red-50 font-semibold py-3 px-6 rounded-2xl transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </ nav>
  );
}