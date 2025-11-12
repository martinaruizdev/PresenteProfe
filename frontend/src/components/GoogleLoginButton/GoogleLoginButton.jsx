import { useEffect } from "react";
import { googleLogin } from "../../api/api";

export default function GoogleLoginButton({ onLogin }) {
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (res) => {
          const result = await googleLogin(res.credential);
          localStorage.setItem("token", result.data.access);
          onLogin && onLogin();
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-login"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  return <div id="google-login"></div>;
}
