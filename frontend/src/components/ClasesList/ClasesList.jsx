import { useEffect, useState } from "react";
import { getClases, marcarAsistencia } from "../../api/api";

export default function ClasesList() {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [markingId, setMarkingId] = useState(null);

  useEffect(() => {
    const fetchClases = async () => {
      setLoading(true);
      try {
        const res = await getClases();
        setClases(res.data);
      } catch (err) {
        console.error(err);
        alert("Error al cargar las clases 😞");
      } finally{
        setLoading(false);
      }
    };
    fetchClases();
  }, [reloadFlag]);

  const handleAsistencia = async (id) => {
    setMarkingId(id); 
    try {
      await marcarAsistencia(id);
      alert("Asistencia marcada ✅");
      setReloadFlag((prev) => !prev);
    } catch {
      alert("Error al marcar asistencia ❌");
    } finally {
      setMarkingId(false);
    }
  };

  const handleReload = () => {
    setReloadFlag((prev) => !prev); // 👈 toggle para recargar
  };

  
  if (loading && clases.length === 0) {
    return <p className="text-center mt-8">Cargando clases...</p>;
  }
  if (!clases.length && !loading) {
    return (
      <p className="text-center mt-8 text-gray-500">
        No hay clases disponibles 📚
      </p>
    );
  }

  return (
    <>
      <h1 className="text-3xl text-center mt-8">Clases</h1>
      <h2 className="text-xl text-center mt-2">
        Elegí la materia para darle tu Presente al Profe
      </h2>
      <button onClick={handleReload}>Recargar clases</button>
      <div className="grid md:grid-cols-2 gap-4 p-4">
        {clases.length === 0 ? (
          <p className="text-center text-gray-500 col-span-2">
            No hay clases disponibles 📚
          </p>
        ) : (
          clases.map((c) => (
            <div
              key={c.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{c.nombre}</h3>
                <p>{c.fecha}</p>
              </div>
              <button
                onClick={() => handleAsistencia(c.id)}
                disabled={loading}
                className={`px-3 py-1 rounded text-white ${
                  loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                 {markingId === c.id ? "Marcando..." : "Marcar"}
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}
