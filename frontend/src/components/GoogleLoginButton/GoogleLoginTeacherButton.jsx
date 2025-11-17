/* global google */
import { useEffect, useCallback, useState } from "react";
import axios from "axios";

export default function GoogleLoginTeacherButton({ onLogin }) {
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleCredentialResponse = useCallback(async (response) => {
    try {
      const idToken = response.credential;

      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE}/api/auth/google-teacher/`,
        { credential: idToken }
      );

      const { access, refresh, user } = res.data;

      localStorage.setItem("token", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      onLogin?.(user);

    } catch (err) {
      console.error(err);
      setShowErrorModal(true);
    }
  }, [onLogin]);

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("g-btn-teacher"),
      {
        theme: "outline",
        size: "large",
        width: 300
      }
    );
  }, [handleCredentialResponse]);

  return (
    <>
      <div id="g-btn-teacher"></div>

      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                Error en login de profesor
              </h3>
              
              <p className="text-slate-500 mb-8">
                No se pudo iniciar sesión. Verifica que tu cuenta tenga permisos de profesor.
              </p>
              
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}