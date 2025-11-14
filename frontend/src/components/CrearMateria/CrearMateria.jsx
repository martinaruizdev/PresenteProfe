import { useState } from "react";
import { crearMateria } from "../../api/api";

export default function CrearMateria({ onCreated }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidadAlumnos, setCantidadAlumnos] = useState(30); // valor por defecto
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    if (!cantidadAlumnos || cantidadAlumnos <= 0) {
      alert("La cantidad de alumnos debe ser mayor a 0");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await crearMateria({ nombre, descripcion, cantidad_alumnos: cantidadAlumnos });
      alert("Materia creada con éxito");
      setNombre("");
      setDescripcion("");
      setCantidadAlumnos(30);

      if (onCreated) onCreated();
    } catch (err) {
      console.log("BACKEND ERROR:", err.response?.data);
      alert("Error al crear materia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Crear nueva materia
            </h2>
            <p className="text-slate-500">
              Completa los datos para agregar una materia
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Nombre de la materia
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 border-2 rounded-2xl bg-white transition-all focus:outline-none focus:ring-2 focus:ring-teal-400/50 ${errors.nombre
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 focus:border-teal-400"
                  }`}
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setErrors({ ...errors, nombre: undefined });
                }}
                placeholder="Ej: Matemática"
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
                className={`w-full px-4 py-3 border-2 rounded-2xl bg-white transition-all focus:outline-none focus:ring-2 focus:ring-teal-400/50 ${errors.cantidadAlumnos
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
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
