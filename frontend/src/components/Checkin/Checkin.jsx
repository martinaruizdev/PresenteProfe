import { useEffect, useState } from "react";
import { marcarAsistencia } from "../../api/api";
import { useSearchParams } from "react-router-dom";

export default function Checkin() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [countdown, setCountdown] = useState(10);
  const clase_id = searchParams.get("clase_id");
  const token = searchParams.get("token");

  useEffect(() => {
    const marcar = async () => {
      try {
        await marcarAsistencia(clase_id, token); 
        setStatus("success");
        setTimeout(() => {
          window.close();
        }, 10000);
      } catch (err) {
        console.error(err);
        setStatus("error");
        setTimeout(() => {
          window.close();
        }, 10000);
      }
    };
    if (clase_id && token) {
      marcar();
    } else {
      setStatus("invalid");
      setTimeout(() => {
        window.close();
      }, 10000);
    }
  }, [clase_id, token]);

  useEffect(() => {
    if (status !== "loading") {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const timeout = setTimeout(() => {
        window.close();

        if (!window.closed) {
          window.history.back();
        }
      }, 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6 pt-28">
      <div className="max-w-2xl mx-auto my-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-12">
          
          {status === "loading" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <svg className="animate-spin h-16 w-16 text-teal-400" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-3">
                Verificando asistencia
              </h1>
              <p className="text-slate-500 text-lg">
                Un momento por favor...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-3">
                ¡Ya le pasaste tu presente al profe!
              </h1>
              <p className="text-slate-500 text-lg mb-4">
                Tu asistencia ha sido registrada exitosamente
              </p>
              <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm text-slate-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Esta ventana se cerrará en {countdown} segundos
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-3">
                Error al registrar
              </h1>
              <p className="text-slate-500 text-lg mb-6">
                No se pudo confirmar tu asistencia. El link puede haber expirado o ya fue usado.
              </p>
              <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm text-slate-600 mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Esta ventana se cerrará en {countdown} segundos
              </div>
              <div>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-teal-400 hover:bg-teal-500 text-white font-semibold rounded-xl transition-colors"
                >
                  Intentar nuevamente
                </button>
              </div>
            </div>
          )}

          {status === "invalid" && (
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-3">
                Link inválido
              </h1>
              <p className="text-slate-500 text-lg mb-4">
                El enlace de asistencia no es válido o está incompleto
              </p>
              <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm text-slate-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Esta ventana se cerrará en {countdown} segundos
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}