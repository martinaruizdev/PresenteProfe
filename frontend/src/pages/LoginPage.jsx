import GoogleLoginButton from "../components/GoogleLoginButton/GoogleLoginButton";

export default function LoginPage({ onLogin }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-2xl font-bold">Iniciá sesión</h1>
      <GoogleLoginButton onLogin={onLogin} />
    </div>
  );
}
