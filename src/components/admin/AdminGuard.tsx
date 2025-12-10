import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import api from "../../config/axiosConfig";

interface Props {
  children: JSX.Element;
}

export default function AdminGuard({ children }: Props) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    api
      .get("/test/admin")
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false));
  }, []);

  if (isAdmin === null) {
    return <p className="p-6">Validando rol...</p>;
  }

  return isAdmin ? children : <Navigate to="/" />;
}
