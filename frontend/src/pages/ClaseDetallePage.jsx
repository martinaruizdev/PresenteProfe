import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import EncuestasList from "../components/EncuestasList/EncuestasList";
import libroImg from "../assets/libro.png";

export default function ClaseDetallePage() {
  const { claseId } = useParams();
  const navigate = useNavigate();
  const [qrUrl, setQrUrl] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [claseInfo, setClaseInfo] = useState(null);
  const [loadingClase, setLoadingClase] = useState(true);
  const [showQR, setShowQR] = useState(true);

  useEffect(() => {
    const fetchClaseInfo = async () => {
      setLoadingClase(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE}/api/clases/${claseId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Error al cargar la clase");
        const data = await res.json();
        setClaseInfo(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingClase(false);
      }
    };

    fetchClaseInfo();
  }, [claseId]);

  useEffect(() => {
    const fetchQR = async () => {
      setLoadingQR(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE}/api/clases/${claseId}/qr/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Error al generar QR");
        const data = await res.json();
        setQrUrl(data.checkin_url);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingQR(false);
      }
    };
    fetchQR();
  }, [claseId]);

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const opciones = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-AR', opciones);
  };

  const handleDescargarQR = () => {
    const svg = document.querySelector('#qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `QR-Clase-${claseId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleCopiarUrl = () => {
    if (qrUrl) {
      navigator.clipboard.writeText(qrUrl);
      const btn = document.getElementById('copy-btn');
      if (btn) {
        btn.textContent = '✓ Copiado';
        setTimeout(() => {
          btn.textContent = 'Copiar URL';
        }, 2000);
      }
    }
  };

  const handleDescargarExcel = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${process.env.REACT_APP_API_BASE}/api/clases/${claseId}/export-asistencias/`;
      
      console.log('=== DEBUG DESCARGA EXCEL ===');
      console.log('URL:', url);
      console.log('Token:', token ? 'Presente' : 'Ausente');
      console.log('ClaseId:', claseId);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Status:', res.status);
      console.log('Headers:', [...res.headers.entries()]);

      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        let errorText;

        if (contentType && contentType.includes('application/json')) {
          const errorJson = await res.json();
          console.error('Error JSON:', errorJson);
          errorText = errorJson.detail || JSON.stringify(errorJson);
        } else {
          errorText = await res.text();
          console.error('Error Text:', errorText);
        }

        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const blob = await res.blob();
      console.log('Blob size:', blob.size, 'bytes');
      console.log('Blob type:', blob.type);

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `Asistencias-Clase-${claseId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      console.log('✅ Descarga completada');
    } catch (err) {
      console.error('❌ Error completo:', err);
      alert('Error al descargar el archivo Excel: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6 pt-28">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>

          {loadingClase ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-200 rounded-2xl animate-pulse"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-8 bg-slate-200 rounded-xl w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded-lg w-1/2 animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : claseInfo ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-teal-400 rounded-2xl flex items-center justify-center ">
                    <img src={libroImg} alt="Icono libro" className="w-7 h-7 object-contain" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                      {claseInfo.materia?.nombre || "Clase"}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-600 mt-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">
                        {formatearFecha(claseInfo.fecha)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <p className="text-center text-slate-600">No se pudo cargar la información de la clase</p>
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Código QR de Asistencia
                </h2>
                <p className="text-sm text-slate-500">
                  Los estudiantes pueden escanear este código para registrar su asistencia
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowQR(!showQR)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg
                className={`w-6 h-6 transition-transform ${showQR ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {showQR && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="bg-white p-8 rounded-3xl shadow-md border-4 border-slate-100">
                  {loadingQR ? (
                    <div className="w-64 h-64 flex flex-col items-center justify-center">
                      <svg className="animate-spin h-16 w-16 text-teal-400 mb-4" viewBox="0 0 24 24">
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
                      <p className="text-slate-600 font-medium">Generando QR...</p>
                    </div>
                  ) : qrUrl ? (
                    <QRCodeSVG
                      id="qr-code"
                      value={qrUrl}
                      size={320}
                      level="H"
                      includeMargin={true}
                      fgColor="#212121"
                    />
                  ) : (
                    <div className="w-64 h-64 flex flex-col items-center justify-center text-center">
                      <svg className="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-slate-700 font-medium">No se pudo generar el QR</p>
                      <p className="text-sm text-slate-500 mt-2">Por favor, intenta nuevamente</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-2xl border-2 border-teal-200">
                  <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ¿Cómo funciona?
                  </h3>
                  <ol className="text-sm text-slate-600 space-y-2">
                    <li className="flex gap-2">
                      <span className="font-semibold text-teal-600">1.</span>
                      Los estudiantes escanean el código QR
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-teal-600">2.</span>
                      Se abre el enlace de registro automáticamente
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-teal-600">3.</span>
                      La asistencia queda registrada al instante
                    </li>
                  </ol>
                </div>

                <button
                  onClick={handleDescargarQR}
                  disabled={!qrUrl || loadingQR}
                  className="w-full bg-teal-400 hover:bg-teal-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar QR
                </button>

                <button
                  id="copy-btn"
                  onClick={handleCopiarUrl}
                  disabled={!qrUrl || loadingQR}
                  className="w-full border-2 border-teal-400 text-teal-600 hover:bg-teal-50 font-semibold py-4 px-6 rounded-2xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar URL
                </button>

                <button
                  onClick={handleDescargarExcel}
                  disabled={loadingClase}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descargar Excel de Asistencias
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Encuestas Component */}
        <EncuestasList claseId={claseId} />
      </div>
    </div>
  );
}