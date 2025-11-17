import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../../api/api";

export default function GoogleLoginButton({ onLogin }) {

  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const result = await googleLogin(idToken);

      localStorage.setItem("token", result.data.access);
      
      localStorage.setItem("refresh", result.data.refresh);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      onLogin && onLogin(result.data.user);

    } catch (err) {
      console.error(err);
      alert("Error en login con Google");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
        type="standard"
        theme="outline"
        size="large"
        width="100%"
      />
    </div>
  );
}
