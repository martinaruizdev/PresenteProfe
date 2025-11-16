import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function GoogleLoginTeacherButton({ onLogin }) {

  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE}/api/auth/google-teacher/`,
        { credential: idToken }
      );

      const { access, refresh, user } = response.data;

      // Usamos MISMAS keys que antes:
      localStorage.setItem("token", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      onLogin && onLogin(user);
      
    } catch (err) {
      console.error(err);
      alert("Error en login de profesor");
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
