import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Droplets, Thermometer, Gauge, MapPin, ArrowRight } from "lucide-react";

// SMART NORMALIZE: remove stopwords, normalize words, and sort them
function normalize(str) {
  if (!str) return "";

  const stopWords = [
    "river",
    "lake",
    "nadi",
    "talav",
    "talab",
    "jheel",
    "sarovar",
    "reservoir",
    "pond",
    "water",
    "waterbody",
    "dam",
  ];

  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w && !stopWords.includes(w))
    .sort()
    .join(""); // key for comparison
}

function CircleGauge({ value, max, label, icon: Icon, color }) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const progress = value / max;
  const offset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow">
      <div className="relative w-24 h-24">
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#ffffff30"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon size={20} style={{ color }} />
          <p className="text-lg font-bold">{value}</p>
        </div>
      </div>

      <p className="font-medium text-white/80 text-sm">{label}</p>
    </div>
  );
}

// Color helpers
const getPhColor = (ph) =>
  ph < 7 ? "#ef4444" : ph === 7 ? "#22c55e" : "#3b82f6";

const getTemperatureColor = (t) =>
  t <= 20 ? "#3b82f6" : t <= 32 ? "#f97316" : "#ef4444";

const getTurbidityColor = (t) =>
  t <= 5 ? "#22c55e" : t <= 25 ? "#f59e0b" : "#8b5cf6";

const getDOColor = (d) => (d >= 6 ? "#3b82f6" : d >= 3 ? "#facc15" : "#ef4444");

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const query = params.get("q");

  const [loading, setLoading] = useState(true);
  const [waterBody, setWaterBody] = useState(null);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    if (!query) return;

    const runSearch = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch all water bodies
        const listRes = await fetch("http://localhost:3000/api/user/results");
        const listData = await listRes.json();
        const allWaterBodies = listData.waterBodies || [];

        const userNorm = normalize(query);

        // Smart match
        const matched = allWaterBodies.find((wb) => {
          const wbNorm = normalize(wb.name);
          return (
            wbNorm === userNorm ||
            wbNorm.includes(userNorm) ||
            userNorm.includes(wbNorm)
          );
        });

        if (!matched) {
          setError("No matching water body found.");
          setLoading(false);
          return;
        }

        // Fetch detailed data
        const detailRes = await fetch(
          `http://localhost:3000/api/user/results/${encodeURIComponent(
            matched.name
          )}`
        );
        const detailData = await detailRes.json();

        if (detailData.success) {
          setWaterBody(detailData.waterBody);
        } else {
          setError("No detailed data found.");
        }
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [query]);

  const totalSurveys = waterBody?.surveyHistory?.length || 0;
  const totalPages = Math.ceil(totalSurveys / PER_PAGE);

  const paginatedSurveys =
    waterBody?.surveyHistory?.slice(
      (currentPage - 1) * PER_PAGE,
      currentPage * PER_PAGE
    ) || [];

  return (
    <div className="w-full bg-transparent min-h-[60vh]">
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-6">
          Search Results for{" "}
          <span className="text-cyan-400">
            {waterBody ? waterBody.name : query}
          </span>
        </h1>

        {loading && (
          <p className="text-center text-white/70 animate-pulse py-10">
            Loading results…
          </p>
        )}

        {!loading && error && (
          <div className="bg-red-500/10 border border-red-400/40 text-red-300 p-5 rounded-xl max-w-xl mx-auto text-center">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {!loading && waterBody && (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl text-white space-y-8">
            {/* Title */}
            <div className="flex items-center gap-3 text-2xl font-bold">
              <MapPin className="text-cyan-400" /> {waterBody.name}
            </div>

            {/* Predict Button */}
            <button
              onClick={() =>
                navigate(`/predict/${encodeURIComponent(waterBody.name)}`)
              }
              className="inline-flex items-center gap-2 bg-cyan-500 text-black font-semibold px-5 py-2 rounded-full shadow hover:bg-cyan-400 transition"
            >
              Predict Results <ArrowRight size={18} />
            </button>

            {/* Gauges */}
            <h3 className="text-xl font-bold mb-4 text-cyan-300">
              Water Quality Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <CircleGauge
                value={waterBody.averages.avgPH}
                max={14}
                label="pH"
                icon={Droplets}
                color={getPhColor(waterBody.averages.avgPH)}
              />
              <CircleGauge
                value={waterBody.averages.avgTurbidity}
                max={100}
                label="Turbidity"
                icon={Gauge}
                color={getTurbidityColor(waterBody.averages.avgTurbidity)}
              />
              <CircleGauge
                value={waterBody.averages.avgTemperature}
                max={60}
                label="Temperature"
                icon={Thermometer}
                color={getTemperatureColor(waterBody.averages.avgTemperature)}
              />
              <CircleGauge
                value={waterBody.averages.avgDissolvedOxygen}
                max={14}
                label="Dissolved Oxygen"
                icon={Droplets}
                color={getDOColor(waterBody.averages.avgDissolvedOxygen)}
              />
            </div>

            {/* Survey History */}
            <h3 className="text-xl font-bold mb-4 text-cyan-300">
              Survey History
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {paginatedSurveys.map((s, i) => (
                <div
                  key={i}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <p>
                    <strong>pH:</strong> {s.measurements.ph}
                  </p>
                  <p>
                    <strong>Turbidity:</strong> {s.measurements.turbidity}
                  </p>
                  <p>
                    <strong>Temperature:</strong> {s.measurements.temperature}
                  </p>
                  <p>
                    <strong>Dissolved Oxygen:</strong>{" "}
                    {s.measurements.dissolvedOxygen}
                  </p>
                  <p className="text-xs text-white/50 mt-2">
                    Surveyed on{" "}
                    {new Date(s.timestamps.surveyorTime).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-cyan-500 text-black hover:bg-cyan-400"
                  }`}
                >
                  Previous
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-cyan-500 text-black hover:bg-cyan-400"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
