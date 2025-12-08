import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/layout/NavBar";
import Home from "./pages/Home";
import Testimonials from "./pages/Testimonials";
import AdminPanel from "./pages/AdminPanel";
import TestimonialList from "./components/home/TestimonialsList";

export default function App() {
  return (
    <BrowserRouter>
    <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/testimonials/list" element={<TestimonialList />} />
      </Routes>
    </BrowserRouter>
  );
}
