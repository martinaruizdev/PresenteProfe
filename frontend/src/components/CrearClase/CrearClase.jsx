import { useState, useEffect } from "react";
import { crearClase, getMaterias } from "../../api/api";

export default function CrearClase({ onClaseCreada }) {
  const [fecha, setFecha] = useState("");
  const [materia, setMateria] = useState("");
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadingMaterias, setLoadingMaterias] = useState(true);

  // Cargar materias al montar
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const res = await getMaterias();
        setMaterias(res.data);
      } catch {
        setErrors({ general: "Error al cargar materias" });
      } finally {
        setLoadingMaterias(false);
      }
    };
    fetchMaterias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!materia) {
      newErrors.materia = "Debe seleccionar una materia";
    }

    if (!fecha) {
      newErrors.fecha = "La fecha y hora son obligatorias";
    } else {
      const fechaSeleccionada = new Date(fecha);
      const ahora = new Date();

      if (fechaSeleccionada < ahora) {
        newErrors.fecha = "No se pueden seleccionar fechas pasadas";
      }

      const maxFecha = new Date();
      maxFecha.setDate(maxFecha.getDate() + 7);
      if (fechaSeleccionada > maxFecha) {
        newErrors.fecha = "La fecha no puede ser mayor a 7 días desde hoy";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await crearClase({ fecha, materia_id: materia });
      alert("Clase creada ✅");
      setFecha("");
      setMateria("");
      setErrors({});
      if (onClaseCreada) onClaseCreada();
    } catch (err) {
      console.error(err);
      setErrors({ general: "Error al crear clase. Intenta nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  const ahoraISO = new Date().toISOString().slice(0, 16);
  const maxISO = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl mb-16"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Crear nueva clase
            </h2>
            <p className="text-slate-500">Programa una clase para tu materia</p>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Materia
              </label>
              {loadingMaterias ? (
                <div className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl bg-slate-50 flex items-center gap-2 text-slate-400">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                  Cargando materias...
                </div>
              ) : (
                <select
                  value={materia}
                  onChange={(e) => {
                    setMateria(e.target.value);
                    setErrors({ ...errors, materia: undefined });
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-2xl bg-white transition-all focus:outline-none focus:ring-2 focus:ring-teal-400/50 appearance-none cursor-pointer ${
                    errors.materia
                      ? "border-red-300 focus:border-red-400"
                      : "border-slate-200 focus:border-teal-400"
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1.5rem",
                  }}
                >
                  <option value="">Seleccioná una materia</option>
                  {materias.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              )}
              {errors.materia && (
                <p className="mt-1.5 text-sm text-red-600">{errors.materia}</p>
              )}
            </div>

            {/* Input Fecha */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Fecha y hora
              </label>
              <input
                type="datetime-local"
                value={fecha}
                min={ahoraISO}
                max={maxISO}
                onChange={(e) => {
                  setFecha(e.target.value);
                  setErrors({ ...errors, fecha: undefined });
                }}
                className={`w-full px-4 py-3 border-2 rounded-2xl bg-white transition-all focus:outline-none focus:ring-2 focus:ring-teal-400/50 ${
                  errors.fecha
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 focus:border-teal-400"
                }`}
              />
              {errors.fecha && (
                <p className="mt-1.5 text-sm text-red-600">{errors.fecha}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || loadingMaterias}
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
                Creando clase...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Crear clase
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
