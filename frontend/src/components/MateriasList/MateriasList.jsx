import { useEffect, useState } from "react";
import { getMaterias } from "../../api/api";
import CrearMateria from "../CrearMateria/CrearMateria";

export default function MateriasList() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    const fetchMaterias = async () => {
      setLoading(true);
      try {
        const res = await getMaterias();
        setMaterias(res.data);
      } catch (err) {
        console.error(err);
        alert("Error al cargar las materias 😞");
      } finally {
        setLoading(false);
      }
    };
    fetchMaterias();
  }, [reloadFlag]);

  const handleReload = () => {
    setReloadFlag((prev) => !prev);
  };

  if (loading && materias.length === 0) {
    return <p className="text-center mt-8">Cargando materias...</p>;
  }

  if (!materias.length && !loading) {
    return (
      <>
        <h1 className="text-3xl text-center mt-8">Materias</h1>
        <CrearMateria onCreated={handleReload} />
        <p className="text-center mt-8 text-gray-500">
          No hay materias disponibles 📚
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-3xl text-center mt-8">Materias</h1>
      <h2 className="text-xl text-center mt-2">
        Listado de materias disponibles
      </h2>

      <CrearMateria onCreated={handleReload} />

      <div className="text-center my-4">
        <button
          onClick={handleReload}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Recargar materias
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 p-4">
        {materias.map((m) => (
          <div
            key={m.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">{m.nombre}</h3>
              <p>{m.descripcion || "Sin descripción"}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
