export default function ConfirmDeleteModal({ materia, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform animate-in">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">¿Eliminar materia?</h3>
          </div>
        </div>
        
        <p className="text-slate-600 mb-6">
          ¿Estás seguro que deseas eliminar <span className="font-semibold text-slate-800">"{materia.nombre}"</span>? Esta acción no se puede deshacer.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 rounded-2xl transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-2xl transition-all shadow-lg shadow-red-500/30"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}