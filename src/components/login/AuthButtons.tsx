import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL;

export default function AuthButtons() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/me`, { withCredentials: true })
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false));
  }, []);

  const handleLogin = () => {
    window.location.href = `${API_URL}/oauth2/authorize/google`;
  };

  const handleLogout = () => {
    axios
      .post(`${API_URL}/auth/logout`, {}, { withCredentials: true })
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
