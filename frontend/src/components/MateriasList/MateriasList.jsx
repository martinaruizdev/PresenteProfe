import { useEffect, useState } from "react";
import { getMaterias, deleteMateria } from "../../api/api";
import CrearMateria from "../CrearMateria/CrearMateria";
import libroImg from "../../assets/libro.png";
import EditMateriaModal from "../EditMateriaModal.jsx/EditMateriaModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";

export default function MateriasList() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [editingMateria, setEditingMateria] = useState(null);
  const [deletingMateria, setDeletingMateria] = useState(null);

  useEffect(() => {
    const fetchMaterias = async () => {
      setLoading(true);
      try {
        const res = await getMaterias();
        setMaterias(res.data);
      } catch (err) {
        console.error(err);
        alert("Error al cargar las materias 😞");
      } finally {
        setLoading(false);
      }
    };
    fetchMaterias();
  }, [reloadFlag]);

  const handleReload = () => {
    setReloadFlag((prev) => !prev);
  };

    const handleEdit = (materia) => {
    setEditingMateria(materia);
  };

  const handleDelete = (materia) => {
    setDeletingMateria(materia);
  };

  const confirmDelete = async () => {
    try {
      await deleteMateria(deletingMateria.id);
      setDeletingMateria(null);
      handleReload();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar materia 😞");
    }
  };


  if (loading && materias.length === 0) {
    return <p className="text-center mt-8">Cargando materias...</p>;
  }

  if (!materias.length && !loading) {
    return (
      <>
        <h1 className="text-3xl text-center mt-8">Materias</h1>
        <CrearMateria onCreated={handleReload} />
        <p className="text-center mt-8 text-gray-500">
          No hay materias disponibles 📚
        </p>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6 pt-28">
      <div className="max-w-6xl mx-auto my-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
            Mis Materias
          </h1>
          <p className="text-slate-500 text-lg">
            Creá y gestioná materias para cada curso
          </p>
        </div>

        <CrearMateria onCreated={handleReload} />

        {loading && materias.length === 0 && (
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
            <p className="text-slate-600 text-lg">Cargando materias...</p>
          </div>
        )}

        {!materias.length && !loading && (
          <div className="text-center py-20">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-lg">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                No hay materias todavía
              </h3>
              <p className="text-slate-500">
                Crea tu primera materia para comenzar
              </p>
            </div>
          </div>
        )}

        {materias.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-600 font-medium">
                {materias.length} {materias.length === 1 ? 'materia' : 'materias'} registradas
              </p>
              <button
                onClick={handleReload}
                disabled={loading}
                className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors disabled:opacity-50"
              >
                <svg
                  className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Actualizar
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">
              {materias.map((m) => (
                <div
                  key={m.id}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-teal-400 rounded-2xl flex items-center justify-center ">
                          <img src={libroImg} alt="Icono libro" className="w-7 h-7 object-contain" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-slate-800">
                            {m.nombre}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {m.cantidad_alumnos} alumnos
                          </p>
                        </div>
                      </div>

                      <p className="text-slate-600 leading-relaxed">
                        {m.descripcion || "Sin descripción"}
                      </p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(m)}
                        className="w-10 h-10 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all flex items-center justify-center group-hover:scale-105"
                        title="Editar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(m)}
                        className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all flex items-center justify-center group-hover:scale-105"
                        title="Eliminar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {editingMateria && (
          <EditMateriaModal
            materia={editingMateria}
            onSave={() => {
              setEditingMateria(null);
              handleReload();
            }}
            onCancel={() => setEditingMateria(null)}
          />
        )}

        {deletingMateria && (
          <ConfirmDeleteModal
            materia={deletingMateria}
            onConfirm={confirmDelete}
            onCancel={() => setDeletingMateria(null)}
          />
        )}

      </div>
    </div>
  );
}
