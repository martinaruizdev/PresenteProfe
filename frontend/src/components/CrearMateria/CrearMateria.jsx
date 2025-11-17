import { useState } from "react";
import { crearMateria } from "../../api/api";

export default function CrearMateria({ onCreated }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidadAlumnos, setCantidadAlumnos] = useState(30); 
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!cantidadAlumnos || cantidadAlumnos <= 0) {
      newErrors.cantidadAlumnos = "La cantidad de alumnos debe ser mayor a 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await crearMateria({ nombre, descripcion, cantidad_alumnos: cantidadAlumnos });
      setShowSuccessModal(true);
      setNombre("");
      setDescripcion("");
      setCantidadAlumnos(30);
      setErrors({});
    } catch (err) {
      console.log("BACKEND ERROR:", err.response?.data);
      setErrorMessage(err.response?.data?.message || "Error al crear materia. Intenta nuevamente.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    if (onCreated) onCreated();
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  return (
    <>
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <form
            onSubmit={handleSubmit}
            className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl mb-16"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                Crear nueva materia
              </h2>
              <p className="text-slate-500">
                Completa los datos para agregar una materia
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Nombre de la materia
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border-2 rounded-2xl bg-white transition-all focus:outline-none focus:ring-2 focus:ring-teal-400/50 ${
                    errors.nombre
                      ? "border-red-300 focus:border-red-400"
                      : "border-slate-200 focus:border-teal-400"
                  }`}
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    setErrors({ ...errors, nombre: undefined });
                  }}
                  placeholder="Ej: Matemática - Curso"
                />
                {errors.nombre && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Descripción
                </label>
                <textarea
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl bg-white transition-all focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 resize-none"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Agrega una descripción opcional"
                  rows="3"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Cantidad de alumnos
                </label>
                <input
                  type="number"
                  className={`w-full px-4 py-3 border-2 rounded-2xl bg-white transition-all focus:outline-none focus:ring-2 focus:ring-teal-400/50 ${
                    errors.cantidadAlumnos
                      ? "border-red-300 focus:border-red-400"
                      : "border-slate-200 focus:border-teal-400"
                  }`}
                  value={cantidadAlumnos}
                  onChange={(e) => {
                    setCantidadAlumnos(parseInt(e.target.value) || "");
                    setErrors({ ...errors, cantidadAlumnos: undefined });
                  }}
                  min={1}
                />
                {errors.cantidadAlumnos && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.cantidadAlumnos}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-teal-400 hover:bg-teal-500 text-white font-semibold py-4 rounded-2xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  Creando materia...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Crear materia
                </span>
              )}
            </button>
          </form>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                ¡Materia creada exitosamente!
              </h3>
              
              <p className="text-slate-500 mb-8">
                La materia <span className="font-semibold text-slate-700">{nombre}</span> ha sido agregada correctamente
              </p>
              
              <button
                onClick={handleCloseSuccessModal}
                className="w-full bg-teal-400 hover:bg-teal-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

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
                Error al crear materia
              </h3>
              
              <p className="text-slate-500 mb-8">
                {errorMessage}
              </p>
              
              <button
                onClick={handleCloseErrorModal}
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