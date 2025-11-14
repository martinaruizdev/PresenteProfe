import { useEffect, useState } from "react";
import { getEncuestas, votarEncuesta } from "../../api/api";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function EncuestasList({ claseId }) {
  const [encuestas, setEncuestas] = useState([]);
  const [presentes, setPresentes] = useState(0);
  const [ausentes, setAusentes] = useState(0);

  const fetchEncuestas = async () => {
    try {
      const res = await getEncuestas();
      setEncuestas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAsistencias = async () => {
    try {
      if (!claseId) return;
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/clases/${claseId}/estadisticas/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setPresentes(data.presentes);
      setAusentes(data.ausentes);
    } catch (err) {
      console.error(err);
    }
  };

useEffect(() => {
  const fetchEncuestas = async () => {
    try {
      const res = await getEncuestas();
      setEncuestas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAsistencias = async () => {
    try {
      if (!claseId) return;
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/clases/${claseId}/estadisticas/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setPresentes(data.presentes);
      setAusentes(data.ausentes);
    } catch (err) {
      console.error(err);
    }
  };

  fetchEncuestas();
  fetchAsistencias();
}, [claseId]);


  const handleVoto = async (id, opcion) => {
    try {
      await votarEncuesta(id, opcion);
      alert("Voto registrado ✅");
      fetchEncuestas();
      fetchAsistencias();
    } catch (err) {
      console.error(err);
      alert("Error al registrar el voto ❌");
    }
  };

  const asistenciaData = {
    labels: ["Presentes", "Ausentes"],
    datasets: [
      {
        data: [presentes, ausentes],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <h1 className="text-3xl text-center mt-8">Encuestas</h1>
      <h2 className="text-xl text-center mt-2">
        Resultados de asistencias y votos
      </h2>

      <div className="flex justify-center my-6">
        <div className="w-72">
          <Doughnut data={asistenciaData} />
        </div>
      </div>

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
            {e.resultados && (
              <div className="mt-2">
                {e.opciones.map((op) => (
                  <div key={op}>
                    {op}: {e.resultados[op] || 0} votos
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
