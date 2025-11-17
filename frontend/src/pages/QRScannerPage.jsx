import { useState, useCallback } from "react";
import QRScanner from "../components/QRScanner/QRScanner";
import uno from "../assets/uno.png";
import dos from "../assets/dos.png";
import tres from "../assets/tres.png";

export default function QRScannerPage() {
  const [resultado, setResultado] = useState(null);
  const [procesando, setProcesando] = useState(false);

  const handleSuccess = useCallback((texto) => {
    setResultado(texto);
    setProcesando(true);

    try {
      const url = new URL(texto);
      const clase_id = url.searchParams.get("clase_id");
      const token = url.searchParams.get("token");

      if (clase_id && token) {
        // Pequeño delay para mostrar el feedback visual
        setTimeout(() => {
          window.location.href = `/checkin?clase_id=${clase_id}&token=${token}`;
        }, 800);
      } else {
        setProcesando(false);
        alert("QR inválido: faltan parámetros necesarios");
      }
    } catch {
      setProcesando(false);
      alert("QR inválido: no es una URL válida");
    }
  }, []);

  const handleError = useCallback((err) => {
    console.log("Scanner error:", err);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 pt-28 px-6 pb-12">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-400 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
            Escanear código QR
          </h1>
          <p className="text-slate-500 text-lg">
            Apunta tu cámara al código QR de asistencia
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-8">
          <QRScanner
            onScanSuccess={handleSuccess}
            onScanError={handleError}
          />
        </div>

        {resultado && (
          <div className="mt-8 animate-fadeIn">
            <div className={`rounded-3xl p-6 shadow-lg border ${
              procesando 
                ? 'bg-teal-50 border-teal-200' 
                : 'bg-white/80 border-white/50'
            }`}>
              <div className="flex items-center gap-4">
                {procesando ? (
                  <>
                    <div className="flex-shrink-0">
                      <svg className="animate-spin h-12 w-12 text-teal-400" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-teal-800 mb-1">
                        Procesando código QR...
                      </h3>
                      <p className="text-sm text-teal-600">
                        Redirigiendo a la página de confirmación
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-slate-800 mb-1">
                        Código detectado
                      </h3>
                      <p className="text-sm text-slate-600 break-all">
                        {resultado}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <img src={uno} alt="Uno" className="w-7 h-7 object-contain" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Permite el acceso
            </h3>
            <p className="text-sm text-slate-600">
              Autoriza el uso de la cámara cuando te lo solicite el navegador
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <img src={dos} alt="Dos" className="w-7 h-7 object-contain" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Escanea el código
            </h3>
            <p className="text-sm text-slate-600">
              Centra el código QR dentro del marco hasta que sea detectado
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <img src={tres} alt="Tres" className="w-7 h-7 object-contain" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Confirma tu asistencia
            </h3>
            <p className="text-sm text-slate-600">
              Serás redirigido automáticamente para confirmar tu presencia
            </p>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}