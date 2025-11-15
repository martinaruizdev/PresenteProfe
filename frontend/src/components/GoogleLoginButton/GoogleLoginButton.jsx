import { useEffect } from "react";
import { googleLogin } from "../../api/api";

export default function GoogleLoginButton({ onLogin }) {
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: async (res) => {
          try {
            const result = await googleLogin(res.credential);
            localStorage.setItem("token", result.data.access);
            localStorage.setItem("refresh", result.data.refresh);
            localStorage.setItem("user", JSON.stringify(result.data.user));
            onLogin && onLogin(result.data.user);
          } catch (err) {
            console.error(err);
            alert("Error en login con Google");
          }
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-login"),
        { theme: "outline", size: "large" }
      );
    }
  }, [onLogin]);

    return (
    <div className="w-full">
      <div id="google-login" className="flex justify-center"></div>
    </div>
  );
}
