import { useEffect, useState } from "react";
import { getClases } from "../../api/api";
import { useNavigate } from "react-router-dom";
import CrearClase from "../CrearClase/CrearClase";
import libroImg from "../../assets/libro.png";

export default function ClasesList() {

  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [reloadFlag, setReloadFlag] = useState(false);
  const handleClaseCreada = () => setReloadFlag(!reloadFlag);

  useEffect(() => {
    const fetchClases = async () => {
      setLoading(true);
      try {
        const res = await getClases();
        setClases(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClases();
  }, [reloadFlag]);

  const clasesPorMateria = clases.reduce((acc, clase) => {
    const nombreMateria = clase.materia.nombre;
    if (!acc[nombreMateria]) acc[nombreMateria] = [];
    acc[nombreMateria].push(clase);
    return acc;
  }, {});

  const handleClaseClick = (claseId) => {
    navigate(`/clases/${claseId}`)
  }

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const opciones = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-AR', opciones);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
        <div className="max-w-6xl mx-auto my-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">
              Mis Clases
            </h1>
            <p className="text-slate-500 text-lg">
              Organizadas por materia
            </p>
          </div>

          <CrearClase onClaseCreada={handleClaseCreada} />

          {loading && clases.length === 0 && (
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
              <p className="text-slate-600 text-lg">Cargando clases...</p>
            </div>
          )}

          {!clases.length && !loading && (
            <div className="text-center py-20">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-lg">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  No hay clases programadas
                </h3>
                <p className="text-slate-500">
                  Crea tu primera clase para comenzar
                </p>
              </div>
            </div>
          )}

          {Object.entries(clasesPorMateria).length > 0 && (
            <div className="space-y-8">
              {Object.entries(clasesPorMateria).map(([materia, clasesMateria], materiaIndex) => {

                return (
                  <div key={materia} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-teal-400 rounded-2xl flex items-center justify-center shadow-lg`}>
                        <img src={libroImg} alt="Icono libro" className="w-7 h-7 object-contain" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                          {materia}
                        </h2>
                        <p className="text-sm text-slate-500">
                          {clasesMateria.length} {clasesMateria.length === 1 ? 'clase' : 'clases'}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {clasesMateria.map((c, index) => (
                        <div
                          key={c.id}
                          onClick={() => handleClaseClick(c.id)}
                          className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer border border-white/50 group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 bg-teal-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md `}>
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-slate-800">
                                  Clase {index + 1}
                                </h3>
                              </div>
                            </div>

                            <svg
                              className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>

                          <div className="flex items-center gap-2 text-slate-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium">
                              {formatearFecha(c.fecha)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
