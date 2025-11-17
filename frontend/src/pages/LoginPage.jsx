import GoogleLoginButton from "../components/GoogleLoginButton/GoogleLoginButton";
import GoogleLoginTeacherButton from "../components/GoogleLoginButton/GoogleLoginTeacherButton";
import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [showTeacherLogin, setShowTeacherLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4 pt-28">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1B2E56] mb-3">
            Presente<span className="text-teal-400">Profe</span>
          </h1>
          <p className="text-lg text-slate-600">
            Gestión de asistencias con QR
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Bienvenido
            </h2>
            <p className="text-slate-600">
              Iniciá sesión para continuar
            </p>
          </div>

          <div className="space-y-6">
            {!showTeacherLogin ? (
              <>
                <GoogleLoginButton onLogin={onLogin} />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/80 text-slate-500">
                      o continúa con
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowTeacherLogin(true)}
                  className="w-full py-4 px-6 bg-teal-400 hover:bg-teal-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Iniciar sesión como profesor</span>
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-slate-700 font-semibold">Ingresá como profesor</p>
                </div>
                
                <GoogleLoginTeacherButton onLogin={onLogin} />

                <button
                  onClick={() => setShowTeacherLogin(false)}
                  className="w-full py-3 px-6 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                >
                  ← Volver al inicio de sesión de alumno
                </button>
              </>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-slate-500">
                  Inicio de sesión seguro
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-100">
                <div className="w-8 h-8 bg-teal-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">
                    Acceso seguro
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Utilizamos Google para garantizar la seguridad de tu cuenta
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="w-8 h-8 bg-blue-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">
                    Rápido y fácil
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Un solo clic para acceder a todas tus clases
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            ¿Primera vez acá?{" "}
            <span className="text-teal-600 font-semibold">
              Iniciá sesión con Google para crear tu cuenta
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
