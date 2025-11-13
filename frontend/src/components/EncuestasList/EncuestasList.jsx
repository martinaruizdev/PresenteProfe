import { useEffect, useState } from "react";
import { getEncuestas, votarEncuesta } from "../../api/api";

export default function EncuestasList() {
  const [encuestas, setEncuestas] = useState([]);

  useEffect(() => {
    getEncuestas().then((res) => setEncuestas(res.data));
  }, []);

  const handleVoto = async (id, opcion) => {
    await votarEncuesta(id, opcion);
    alert("Voto registrado ✅");
  };

  return (
    <>
    <h1 className="text-3xl text-center mt-8">Encuestas</h1>
    <h2 className="text-xl text-center mt-8">Acá podes ver el resultado de las asistencias</h2>
    <div className="space-y-4 p-4">
      {encuestas.map((e) => (
        <div key={e.id} className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold">{e.pregunta}</h3>
          <div className="mt-2 space-x-2">
            {e.opciones.map((op) => (
              <button
                key={op}
                onClick={() => handleVoto(e.id, op)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                {op}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
    </>
  );
}
