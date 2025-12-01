import { useEffect, useState } from "react";
import LiveChart from "../components/Livechart";
import Testimony from "../components/Testimony";
import "../pages/Home.css";

export default function HomeContent() {
  const [surveyors, setSurveyors] = useState(0);
  const [surveys, setSurveys] = useState(0);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user/total-surveys");
        const data = await res.json();
        setSurveys(data.count);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSurveyors = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/user/total-surveyors"
        );
        const data = await res.json();
        setSurveyors(data.count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSurveyors();
    fetchSurveys();
  }, []);

  return (
    <main className="flex-1">
      <section className="container mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Protect Water. Preserve Life.
            </h1>
            <h2 className="mt-3 text-cyan-300 text-2xl md:text-3xl font-semibold">
              Be part of the change, every day.
            </h2>

            <p className="mt-6 text-sm md:text-base text-white/85">
              Blue Pulse connects surveyors and authorities with real-time
              monitoring, verified data, and AI-powered forecasting to restore
              and protect water bodies.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="#live-data"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-cyan-500 text-black font-semibold shadow-lg hover:scale-[1.02] transition"
              >
                View Live Data
              </a>
              <a
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black font-semibold shadow-sm hover:bg-gray-100 transition"
              >
                Login
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-linear-to-r from-[#07182a] to-[#082a3f] border border-white/5 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/80">Total Surveyors</div>
                  <div className="text-3xl font-bold text-white">
                    {surveyors}
                  </div>
                </div>
                <div className="text-cyan-400 text-sm">Connected</div>
              </div>
              <p className="mt-3 text-white/70 text-sm">
                Registered field surveyors actively collecting water data.
              </p>
            </div>

            <div className="bg-linear-to-r from-[#07182a] to-[#082a3f] border border-white/5 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/80">Total Surveys</div>
                  <div className="text-3xl font-bold text-white">{surveys}</div>
                </div>
                <div className="text-emerald-300 text-sm">Verified</div>
              </div>
              <p className="mt-3 text-white/70 text-sm">
                Approved water-quality records from real monitoring sites.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 container mx-auto px-6 pb-12">
        <h3 className="text-white text-2xl md:text-3xl font-bold text-center mb-8">
          Why Blue Pulse?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature
            title="Verified Water Quality Data"
            desc="Surveyor-submitted readings are validated by admins and auto-checked for anomalies, ensuring reliable water-quality insights."
          />
          <Feature
            title="Location-Based Monitoring"
            desc="Every survey is tied to a mapped water body, with aggregated pH, turbidity, temperature and oxygen levels computed in real-time."
          />
          <Feature
            title="AI-Powered Risk Forecast"
            desc="Smart analysis predicts pollution risk using historical patterns and trends to support early decision-making."
          />
        </div>
      </section>

      <section id="live-data" className="container mx-auto px-6 py-12">
        <h3 className="text-white text-2xl font-bold mb-4 text-center">
          Water Body Trends
        </h3>
        <LiveChart />
      </section>

      <section className="container mx-auto px-6 py-12">
        <Testimony />
      </section>
    </main>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-xl p-6 hover:scale-[1.02] transition shadow-md">
      <h4 className="text-white font-semibold text-lg">{title}</h4>
      <p className="mt-2 text-white/75 text-sm">{desc}</p>
    </div>
  );
}
