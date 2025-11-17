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
  const [loading, setLoading] = useState(true);
  const [votando, setVotando] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [votoInfo, setVotoInfo] = useState({ pregunta: "", opcion: "" });

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

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchEncuestas(), fetchAsistencias()]);
      setLoading(false);
    };

    fetchData();
  }, [claseId]);

  const handleVoto = async (id, opcion, pregunta) => {
    setVotando(id);
    try {
      await votarEncuesta(id, opcion);

      const [encuestasRes, estadisticasRes] = await Promise.all([
        getEncuestas(),
        claseId ? fetch(
          `${process.env.REACT_APP_API_BASE}/api/clases/${claseId}/estadisticas/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ) : null
      ]);

      setEncuestas(encuestasRes.data);
      
      if (estadisticasRes) {
        const data = await estadisticasRes.json();
        setPresentes(data.presentes);
        setAusentes(data.ausentes);
      }

      setVotoInfo({ pregunta, opcion });
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setShowErrorModal(true);
    } finally {
      setVotando(null);
    }
  };

  const asistenciaData = {
    labels: ["Presentes", "Ausentes"],
    datasets: [
      {
        data: [presentes ?? 0, ausentes ?? 0],
        backgroundColor: ["#2dd4bf", "#ef4444"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            size: 14,
            family: "system-ui",
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    cutout: "70%",
    maintainAspectRatio: true,
  };

  const totalVotos = presentes + ausentes;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6 pt-28">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="animate-spin h-12 w-12 text-teal-400 mb-4" viewBox="0 0 24 24">
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
            <p className="text-slate-600 text-lg">Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6 pt-28">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
              Asistencias y Encuestas
            </h1>
            <p className="text-slate-500 text-lg">
              Resultados en tiempo real de la clase
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Estado de Asistencia
              </h2>
              <p className="text-slate-500">
                Total de estudiantes: <span className="font-semibold text-slate-700">{totalVotos}</span>
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-80 h-80 relative">
                <Doughnut data={asistenciaData} options={chartOptions} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-slate-800">{totalVotos}</p>
                    <p className="text-sm text-slate-500 uppercase tracking-wide">Total</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-teal-50 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-teal-600 mb-1">{presentes}</div>
                <div className="text-sm text-teal-700 font-medium">Presentes</div>
                <div className="text-xs text-teal-600 mt-1">
                  {totalVotos > 0 ? Math.round((presentes / totalVotos) * 100) : 0}%
                </div>
              </div>
              <div className="bg-red-50 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">{ausentes}</div>
                <div className="text-sm text-red-700 font-medium">Ausentes</div>
                <div className="text-xs text-red-600 mt-1">
                  {totalVotos > 0 ? Math.round((ausentes / totalVotos) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>

          {encuestas.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-teal-400 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Encuestas Activas
                </h2>
              </div>

              {encuestas.map((e) => {
                const totalVotosEncuesta = e.resultados 
                  ? Object.values(e.resultados).reduce((a, b) => a + b, 0) 
                  : 0;

                return (
                  <div
                    key={e.id}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-8"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-1">
                          {e.pregunta}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {totalVotosEncuesta} {totalVotosEncuesta === 1 ? 'voto registrado' : 'votos registrados'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {e.opciones.map((op) => (
                        <button
                          key={op}
                          onClick={() => handleVoto(e.id, op, e.pregunta)}
                          disabled={votando === e.id}
                          className="relative px-6 py-4 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white font-semibold rounded-2xl shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {votando === e.id ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                              Votando...
                            </span>
                          ) : (
                            op
                          )}
                        </button>
                      ))}
                    </div>

                    {e.resultados && Object.keys(e.resultados).length > 0 && (
                      <div className="bg-slate-50 rounded-2xl p-6">
                        <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Resultados
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(e.resultados).map(([op, votos]) => {
                            const porcentaje = totalVotosEncuesta > 0 
                              ? Math.round((votos / totalVotosEncuesta) * 100) 
                              : 0;

                            return (
                              <div key={op} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-slate-700">{op}</span>
                                  <span className="text-sm text-slate-600">
                                    {votos} {votos === 1 ? 'voto' : 'votos'} ({porcentaje}%)
                                  </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-teal-400 to-cyan-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${porcentaje}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                ¡Voto registrado!
              </h3>
              
              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <p className="text-sm text-slate-600 mb-2">
                  {votoInfo.pregunta}
                </p>
                <p className="text-lg font-semibold text-slate-800">
                  Votaste: <span className="text-teal-600">{votoInfo.opcion}</span>
                </p>
              </div>
              
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-teal-400 hover:bg-teal-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de error */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                Error al registrar voto
              </h3>
              
              <p className="text-slate-500 mb-8">
                No se pudo registrar tu voto. Por favor, intenta nuevamente.
              </p>
              
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}