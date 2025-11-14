import { useEffect, useState } from "react";
import { getClases } from "../../api/api";
import { QRCodeSVG } from "qrcode.react";

export default function ClasesList() {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [qrData, setQrData] = useState(null); // { claseId, url }
  const [qrLoadingId, setQrLoadingId] = useState(null);

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

  /*   const handleOpenQR = async (claseId) => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/clases/${claseId}/qr/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Error al generar QR");
        const data = await res.json();
        setQrData({ claseId, url: data.checkin_url });
      } catch (err) {
        console.error(err);
        alert("No se pudo generar el QR ❌");
      }
    }; */

  const handleOpenQR = async (claseId) => {
    setQrLoadingId(claseId);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/clases/${claseId}/qr/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Error al generar QR");
      const data = await res.json();
      setQrData({ claseId, url: data.checkin_url });
    } catch (err) {
      console.error(err);
      alert("No se pudo generar el QR ❌");
    } finally {
      setQrLoadingId(null);
    }
  };

  const handleCloseQR = () => setQrData(null);

  const handleReload = () => setReloadFlag((prev) => !prev);

  const clasesPorMateria = clases.reduce((acc, clase) => {
    const nombreMateria = clase.materia.nombre;
    if (!acc[nombreMateria]) acc[nombreMateria] = [];
    acc[nombreMateria].push(clase);
    return acc;
  }, {});

  return (
    <>
      <button
        onClick={handleReload}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Recargar clases
      </button>

      {Object.entries(clasesPorMateria).map(([materia, clasesMateria]) => (
        <div key={materia} className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{materia}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {clasesMateria.map((c, index) => (
              <div
                key={c.id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">Clase {index + 1}</h3>
                  <p>{new Date(c.fecha).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleOpenQR(c.id)}
                  disabled={qrLoadingId === c.id}
                  className="px-3 py-1 rounded text-white bg-green-500 hover:bg-green-600"
                >
                  {qrLoadingId === c.id ? "Generando..." : "Mostrar QR"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal QR */}
      {qrData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow relative">
            <button
              onClick={handleCloseQR}
              className="absolute top-2 right-2 text-gray-700 font-bold text-lg"
            >
              ✕
            </button>
            <h3 className="text-xl mb-4">Escaneá este QR para marcar asistencia</h3>
            <QRCodeSVG value={qrData.url} size={200} />
          </div>
        </div>
      )}
    </>
  );
}
