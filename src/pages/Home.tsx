import NavBar from "../components/layout/NavBar";

export default function Home() {
  return (
    <div className="p-6 text-center">
      <NavBar/>
      <h1 className="text-3xl font-bold mb-4">Demo de Testimonios</h1>
      <p className="text-gray-600">Explorá testimonios y moderalos si sos admin.</p>
    </div>
  );
}
