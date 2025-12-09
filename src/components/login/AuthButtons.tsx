import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // importante para enviar cookies

export default function AuthButtons() {
  const [loggedIn, setLoggedIn] = useState(false);

  // Chequear si hay cookie (solo un intento básico)
  useEffect(() => {
    axios.get("http://localhost:8080/auth/me", { withCredentials: true })
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false));
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorize/google";
  };

  const handleLogout = () => {
    axios.post("http://localhost:8080/auth/logout", {}, { withCredentials: true })
      .then(() => setLoggedIn(false));
  };

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      {!loggedIn ? (
        <button onClick={handleLogin}>Login con Google</button>
      ) : (
        <button onClick={handleLogout}>Cerrar sesión</button>
      )}
    </div>
  );
}
