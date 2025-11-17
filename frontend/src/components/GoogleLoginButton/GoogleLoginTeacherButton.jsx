/* global google */
import { useEffect, useCallback } from "react";
import axios from "axios";

export default function GoogleLoginTeacherButton({ onLogin }) {

  const handleCredentialResponse = useCallback(async (response) => {
    try {
      const idToken = response.credential;

      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE}/api/auth/google-teacher/`,
        { credential: idToken }
      );

      const { access, refresh, user } = res.data;

      localStorage.setItem("token", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      onLogin?.(user);

    } catch (err) {
      console.error(err);
      alert("Error en login de profesor");
    }
  }, [onLogin]);

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("g-btn-teacher"),
      {
        theme: "outline",
        size: "large",
        width: 300
      }
    );
  }, [handleCredentialResponse]);

  return <div id="g-btn-teacher"></div>;
}
