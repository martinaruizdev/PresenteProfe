import { useState } from "react";
import { crearMateria } from "../../api/api";

export default function CrearMateria({ onCreated }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    setLoading(true);
    try {
      await crearMateria({ nombre, descripcion });
      alert("Materia creada con éxito");
      setNombre("");
      setDescripcion("");

      if (onCreated) onCreated(); 
    } catch (err) {
        console.log("BACKEND ERROR:", err.response?.data);
      alert("Error al crear materia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow max-w-md mx-auto mt-6"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Crear nueva materia
      </h2>

      <div className="mb-4">
        <label className="block mb-1">Nombre</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Matemática"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Descripción</label>
        <textarea
          className="w-full p-2 border rounded"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción opcional"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
      >
        {loading ? "Creando..." : "Crear materia"}
      </button>
    </form>
  );
}
