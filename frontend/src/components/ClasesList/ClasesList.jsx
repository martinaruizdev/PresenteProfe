import { useEffect, useState } from "react";
import { getClases } from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function ClasesList({ reloadFlag }) {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClases = async () => {
      setLoading(true);
      try {
        const res = await getClases();
        setClases(res.data);
      } catch (err) {
        console.error(err);
        alert("Error al cargar las clases 😞");
      } finally {
        setLoading(false);
      }
    };
    fetchClases();
  }, [reloadFlag]);

  const clasesPorMateria = clases.reduce((acc, clase) => {
    const nombreMateria = clase.materia.nombre;
    if (!acc[nombreMateria]) acc[nombreMateria] = [];
    acc[nombreMateria].push(clase);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(clasesPorMateria).map(([materia, clasesMateria]) => (
        <div key={materia} className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{materia}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {clasesMateria.map((c, index) => (
              <div
                key={c.id}
                className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/clases/${c.id}`)}
              >
                <h3 className="font-semibold text-lg">Clase {index + 1}</h3>
                <p>{new Date(c.fecha).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
