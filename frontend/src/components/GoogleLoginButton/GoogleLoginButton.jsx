/* global google */
import { useEffect, useCallback } from "react";
import { googleLogin } from "../../api/api";

export default function GoogleLoginButton({ onLogin }) {

  const handleCredentialResponse = useCallback(async (response) => {
    try {
      const idToken = response.credential;
      const result = await googleLogin(idToken);

      localStorage.setItem("token", result.data.access);
      localStorage.setItem("refresh", result.data.refresh);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      onLogin?.(result.data.user);
    } catch (err) {
      console.error(err);
      alert("Error en login con Google");
    }
  }, [onLogin]);

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("g-btn"),
      {
        theme: "outline",
        size: "large",
        width: 300
      }
    );
  }, [handleCredentialResponse]);

  return <div id="g-btn"></div>;
}
