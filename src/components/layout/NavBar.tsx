import { Link } from "react-router-dom";
import AuthButtons from "../login/AuthButtons";

export default function NavBar() {
  return (
    <nav className="p-4 border-b mb-6 flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/testimonials">Testimonios</Link>
      <Link to="/admin">Admin</Link>
      <AuthButtons/>
    </nav>
  );
}
