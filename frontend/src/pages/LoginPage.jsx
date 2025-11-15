import GoogleLoginButton from "../components/GoogleLoginButton/GoogleLoginButton";
import logoBuho from "../assets/logo-buho.png";

export default function LoginPage({ onLogin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#f7f7f1] rounded-3xl shadow-2xl shadow-teal-400/40 mb-6">
            <img src={logoBuho} alt="Logo" className="w-15 h-15 object-contain" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
            PresenteProfe
          </h1>
          <p className="text-lg text-slate-600">
            Gestión de asistencias con QR
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Bienvenido
            </h2>
            <p className="text-slate-600">
              Iniciá sesión para continuar
            </p>
          </div>

          {/* Google Login Button Container */}
          <div className="space-y-6">
            <GoogleLoginButton onLogin={onLogin} />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-slate-500">
                  Inicio de sesión seguro
                </span>
              </div>
            </div>

            {/* Info Cards */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-100">
                <div className="w-8 h-8 bg-teal-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">
                    Acceso seguro
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Utilizamos Google para garantizar la seguridad de tu cuenta
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="w-8 h-8 bg-blue-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">
                    Rápido y fácil
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Un solo clic para acceder a todas tus clases
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            ¿Primera vez aquí?{" "}
            <span className="text-teal-600 font-semibold">
              Iniciá sesión con Google para crear tu cuenta
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
