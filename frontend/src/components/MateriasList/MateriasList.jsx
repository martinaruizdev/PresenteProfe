import { useEffect, useState } from "react";
import { getMaterias } from "../../api/api";

export default function MateriasList() {
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    getMaterias().then((res) => setMaterias(res.data));
  }, []);

  return (
    <>
    <h1 className="text-3xl text-center mt-8">Listado de Materias</h1>
    <h2 className="text-xl text-center mt-8">Elegí la materia para pasar asistencia</h2>
    <div className="grid md:grid-cols-2 gap-4 p-4">
      {materias.map((m) => (
        <div key={m.id} className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold text-lg">{m.nombre}</h3>
          <p>{m.descripcion}</p>
        </div>
      ))}
    </div>
    </>
  );
}
