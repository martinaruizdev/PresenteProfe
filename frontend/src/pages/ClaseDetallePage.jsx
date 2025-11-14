import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import EncuestasList from "../components/EncuestasList/EncuestasList";

export default function ClaseDetallePage() {
  const { claseId } = useParams();
  const [qrUrl, setQrUrl] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);

  useEffect(() => {
    const fetchQR = async () => {
      setLoadingQR(true);
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
        setQrUrl(data.checkin_url);
      } catch (err) {
        console.error(err);
        alert("No se pudo generar el QR ❌");
      } finally {
        setLoadingQR(false);
      }
    };

    fetchQR();
  }, [claseId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Detalle de Clase</h1>

      <div className="mb-8">
        <h2 className="text-xl mb-2">QR de asistencia</h2>
        {loadingQR ? (
          <p>Generando QR...</p>
        ) : qrUrl ? (
          <QRCodeSVG value={qrUrl} size={200} />
        ) : (
          <p>No se pudo generar el QR</p>
        )}
      </div>

      <EncuestasList claseId={claseId} />
    </div>
  );
}
