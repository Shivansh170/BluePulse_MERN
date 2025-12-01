import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-[#071029] to-[#005c]">
      <Header />

      <Outlet />

      <Footer />
    </div>
  );
}
