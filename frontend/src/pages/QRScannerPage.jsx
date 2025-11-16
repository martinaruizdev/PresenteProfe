import { useState, useCallback } from "react";
import QRScanner from "../components/QRScanner/QRScanner";

export default function QRScannerPage() {
  const [resultado, setResultado] = useState(null);

  const handleSuccess = useCallback((texto) => {
    setResultado(texto);

    try {
      const url = new URL(texto);
      const clase_id = url.searchParams.get("clase_id");
      const token = url.searchParams.get("token");

      if (clase_id && token) {
        window.location.href = `/checkin?clase_id=${clase_id}&token=${token}`;
      }
    } catch {
      alert("QR inválido");
    }
  }, []);

  const handleError = useCallback((err) => {
    console.log("Scanner error:", err);
  }, []);

  return (
    <div className="flex flex-col items-center pt-32 px-4">
      <h1 className="text-xl font-bold mb-4">Escanear código QR</h1>

      <QRScanner
        onScanSuccess={handleSuccess}
        onScanError={handleError}
      />


      {resultado && (
        <p className="mt-4 p-2 bg-white rounded-xl text-center shadow">
          Código leído: {resultado}
        </p>
      )}
    </div>
  );
}

