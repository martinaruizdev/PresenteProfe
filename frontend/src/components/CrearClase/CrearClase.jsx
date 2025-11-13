import { useState, useEffect } from "react";
import { crearClase, getMaterias } from "../../api/api";

export default function CrearClase({ onClaseCreada }) {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [materia, setMateria] = useState("");
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const res = await getMaterias();
        setMaterias(res.data);
      } catch {
        alert("Error al cargar materias 😞");
      }
    };
    fetchMaterias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await crearClase({ nombre, fecha, materia });
      alert("Clase creada ✅");
      setNombre("");
      setFecha("");
      setMateria("");
      onClaseCreada(); // recarga la lista
    } catch (err) {
      console.error(err);
      alert("Error al crear clase ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4 bg-white shadow rounded-xl">
      <h2 className="text-2xl mb-4 text-center font-semibold">Crear nueva clase</h2>

      <label className="block mb-2">Materia</label>
      <select
        value={materia}
        onChange={(e) => setMateria(e.target.value)}
        required
        className="border p-2 w-full mb-4 rounded"
      >
        <option value="">Seleccioná una materia</option>
        {materias.map((m) => (
          <option key={m.id} value={m.id}>{m.nombre}</option>
        ))}
      </select>

      <label className="block mb-2">Nombre de la clase</label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="border p-2 w-full mb-4 rounded"
        placeholder="Ej: Clase 1 - Introducción"
      />

      <label className="block mb-2">Fecha y hora</label>
      <input
        type="datetime-local"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
        className="border p-2 w-full mb-4 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 text-white rounded ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        {loading ? "Creando..." : "Crear clase"}
      </button>
    </form>
  );
}
