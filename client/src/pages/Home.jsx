import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LiveChart from "../components/Livechart";
import Testimony from "../components/Testimony";
import "./Home.css";
export default function Home() {
  return (
    <>
      <Header />
      <div className="hero">
        <section className="flex items-center justify-center h-[50vh] w-full mb-8 animate-fadeIn">
          <div className="w-[70%] text-center animate-gradientMove p-6 pb-0 rounded-xl hover:pb-8 hover:pr-3 transition-all">
            <h1 className="text-white text-4xl md:text-5xl font-playwrite">
              "United for Delhi: Protect Water, Preserve Life, and Make a
              Difference"
            </h1>
          </div>
        </section>
        <section className="flex items-center justify-center w-full h-[20vh] animate-fadeIn">
          <div className="w-[70%] text-center text-white font-playwrite text-sm md:text-lg">
            <h2>
              "Join the mission to restore water bodies. Monitor real-time data,
              report concerns, and contribute to a healthier future for our
              city’s precious resources."
            </h2>
          </div>
        </section>
        <LiveChart />
        <Testimony />
      </div>

      <Footer />
    </>
  );
}
