import { useEffect, useState } from "react";
import { getClases, marcarAsistencia } from "../../api/api";

export default function ClasesList() {
  const [clases, setClases] = useState([]);

  useEffect(() => {
    getClases().then((res) => setClases(res.data));
  }, []);

  const handleAsistencia = async (id) => {
    await marcarAsistencia(id);
    alert("Asistencia marcada ✅");
  };

  return (
    <div className="grid md:grid-cols-2 gap-4 p-4">
      {clases.map((c) => (
        <div key={c.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">{c.nombre}</h3>
            <p>{c.fecha}</p>
          </div>
          <button
            onClick={() => handleAsistencia(c.id)}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Marcar
          </button>
        </div>
      ))}
    </div>
  );
}
