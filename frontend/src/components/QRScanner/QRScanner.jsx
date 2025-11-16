import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScanSuccess, onScanError }) {
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);

  const [cameras, setCameras] = useState([]);
  const [started, setStarted] = useState(false);

  // Obtener cámaras disponibles
  useEffect(() => {
    scannerRef.current = new Html5Qrcode("qr-video");

    Html5Qrcode.getCameras()
      .then((devices) => {
        setCameras(devices);
      })
      .catch(() => {
        setCameras([]);
      });
  }, []);

  const startScanner = async () => {
    if (isRunningRef.current || cameras.length === 0) return;

    try {
      await scannerRef.current.start(
        cameras[0].id, // primera cámara disponible
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          onScanSuccess(decodedText);
          stopScanner(); // detener automáticamente
        },
        onScanError
      );

      isRunningRef.current = true;
      setStarted(true);
    } catch (err) {
      console.error("Error iniciando cámara:", err);
    }
  };

  const stopScanner = async () => {
    if (!isRunningRef.current) return;

    try {
      await scannerRef.current.stop();
    } catch {}

    isRunningRef.current = false;
    setStarted(false);
  };

  return (
    <div className="w-full flex flex-col items-center p-4 text-center">

      {/* Mensajes si no hay cámara */}
      {cameras.length === 0 && (
        <p className="p-4 bg-red-200 text-red-700 rounded-lg">
          ❌ No se encontró ninguna cámara.
        </p>
      )}

      {/* Contenedor del escáner */}
      <div
        className={`relative w-72 h-72 mt-4 border-4 rounded-xl overflow-hidden transition ${
          started ? "border-green-500" : "border-gray-400"
        }`}
      >
        {/* Video */}
        <div id="qr-video" className="w-full h-full"></div>

        {/* Marco del escáner */}
        {started && (
          <>
            {/* Esquinas verdes */}
            <div className="scanner-corner top-left" />
            <div className="scanner-corner top-right" />
            <div className="scanner-corner bottom-left" />
            <div className="scanner-corner bottom-right" />

            {/* Línea láser */}
            <div className="scanner-laser" />
          </>
        )}
      </div>

      {/* Botones */}
      {!started && cameras.length > 0 && (
        <button
          onClick={startScanner}
          className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl text-lg shadow-lg"
        >
          📷 Iniciar escaneo
        </button>
      )}

      {started && (
        <button
          onClick={stopScanner}
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl text-lg shadow-lg"
        >
          ✖ Detener escaneo
        </button>
      )}
    </div>
  );
}
