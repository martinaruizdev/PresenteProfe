import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScanSuccess, onScanError }) {
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);

  const [cameras, setCameras] = useState([]);
  const [started, setStarted] = useState(false);

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
      const backCamera = cameras.find(camera =>
        camera.label.toLowerCase().includes('back') ||
        camera.label.toLowerCase().includes('rear') ||
        camera.label.toLowerCase().includes('environment')
      ) || cameras[cameras.length - 1];

      await scannerRef.current.start(
        backCamera.id,
        {
          fps: 10,
          qrbox: 250,
          aspectRatio: 1.0,
          facingMode: "environment"
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          stopScanner();
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
    } catch { }

    isRunningRef.current = false;
    setStarted(false);
  };

  return (
    <div className="w-full flex flex-col items-center p-6">

      {cameras.length === 0 && (
        <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-red-800 mb-1">
                No se encontró ninguna cámara
              </h3>
              <p className="text-sm text-red-600">
                Verifica los permisos de acceso a la cámara
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <div
          className={`relative w-80 h-80 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${started
            ? "ring-4 ring-teal-400 ring-offset-4"
            : "ring-2 ring-slate-300 ring-offset-4"
            }`}
        >
          <div id="qr-video" className="w-full h-full bg-slate-900"></div>

          {!started && cameras.length > 0 && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-teal-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <p className="text-white font-medium">
                  Presiona el botón para comenzar
                </p>
              </div>
            </div>
          )}

          {started && (
            <>

              <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-teal-400 rounded-tl-2xl animate-pulse" />
              <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-teal-400 rounded-tr-2xl animate-pulse" />
              <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-teal-400 rounded-bl-2xl animate-pulse" />
              <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-teal-400 rounded-br-2xl animate-pulse" />

              <div className="absolute left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-scan" />

              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-teal-400 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Escaneando...
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        {!started && cameras.length > 0 && (
          <button
            onClick={startScanner}
            className="px-8 py-4 bg-teal-400 hover:bg-teal-500 text-white font-semibold rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Iniciar escaneo
          </button>
        )}

        {started && (
          <button
            onClick={stopScanner}
            className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Detener escaneo
          </button>
        )}
      </div>

      {started && (
        <div className="mt-6 max-w-md">
          <div className="bg-slate-100 rounded-2xl p-4">
            <p className="text-sm text-slate-600 text-center">
              Coloca el código QR dentro del marco para escanearlo
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scan {
          0%, 100% {
            top: 2rem;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            top: calc(100% - 2rem);
          }
        }
        
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}