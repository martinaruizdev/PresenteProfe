import { useState } from "react";
import { updateMateria } from "../../api/api";
import lapiz from "../../assets/lapiz.png";

export default function EditMateriaModal({ materia, onSave, onCancel }) {
  const [nombre, setNombre] = useState(materia.nombre);
  const [descripcion, setDescripcion] = useState(materia.descripcion || "");
  const [cantidadAlumnos, setCantidadAlumnos] = useState(materia.cantidad_alumnos);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleSubmit = async () => {
    const newErrors = {};
    
    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }
    
    if (!cantidadAlumnos || cantidadAlumnos <= 0) {
      newErrors.cantidadAlumnos = "La cantidad debe ser mayor a 0";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await updateMateria(materia.id, { nombre, descripcion, cantidad_alumnos: cantidadAlumnos });
      onSave();
    } catch (err) {
      console.error(err);
      setErrors({ general: "Error al actualizar la materia" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-lg w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-400 rounded-2xl flex items-center justify-center ">
              <img src={lapiz} alt="Lapiz" className="w-7 h-7 object-contain" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Editar materia</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {errors.general && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
            {errors.general}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">Nombre</label>
            <input
              type="text"
              className={`w-full px-4 py-3 border-2 rounded-2xl bg-white transition-all focus:outline-none focus:ring-2 focus:ring-teal-400/50 ${
                errors.nombre ? "border-red-300" : "border-slate-200 focus:border-teal-400"
              }`}
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setErrors({ ...errors, nombre: undefined });
              }}
            />
            {errors.nombre && <p className="mt-1.5 text-sm text-red-600">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">Descripción</label>
            <textarea
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl bg-white transition-all focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 resize-none"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows="3"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">Cantidad de alumnos</label>
            <input
              type="number"
              className={`w-full px-4 py-3 border-2 rounded-2xl bg-white transition-all focus:outline-none focus:ring-2 focus:ring-teal-400/50 ${
                errors.cantidadAlumnos ? "border-red-300" : "border-slate-200 focus:border-teal-400"
              }`}
              value={cantidadAlumnos}
              onChange={(e) => {
                setCantidadAlumnos(parseInt(e.target.value) || "");
                setErrors({ ...errors, cantidadAlumnos: undefined });
              }}
              min={1}
            />
            {errors.cantidadAlumnos && <p className="mt-1.5 text-sm text-red-600">{errors.cantidadAlumnos}</p>}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 rounded-2xl transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-teal-400 hover:bg-teal-500 text-white font-semibold py-3 rounded-2xl transition-all disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}