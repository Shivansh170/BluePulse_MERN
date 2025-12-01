import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminPredictPage() {
  const { waterBodyName } = useParams();
  const location = useLocation();
  const token = sessionStorage.getItem("accessToken");

  const [loading, setLoading] = useState(true);
  const [surveys, setSurveys] = useState([]);
  const [waterBody, setWaterBody] = useState({ name: "", city: "Unknown" });
  const [prediction, setPrediction] = useState(null);

  const passedSurveys = location.state?.surveys || null;

  useEffect(() => {
    if (passedSurveys) processSurveys(passedSurveys);
    else fetchAllSurveys();
  }, []);

  const fetchAllSurveys = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/surveys", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      const filtered = data.surveys.filter(
        (s) => s.location?.name.trim() === waterBodyName.trim()
      );

      processSurveys(filtered);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const processSurveys = async (bodySurveys) => {
    setSurveys(bodySurveys);

    setWaterBody({
      name: waterBodyName.trim(),
      city: bodySurveys[0]?.location?.city || "Unknown",
    });

    await runPrediction(bodySurveys);

    setLoading(false);
  };

  const runPrediction = async (bodySurveys) => {
    if (bodySurveys.length < 3) return;

    const last3 = bodySurveys.slice(-3);

    const history = last3.map((s) => ({
      ...s.measurements,
      location: waterBodyName,
    }));

    const current = {
      ...last3[2].measurements,
      location: waterBodyName,
    };

    try {
      const res = await fetch(
        "https://bluepulse-mern.onrender.com/api/ai/predict-water-quality",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ history, current, location: waterBodyName }),
        }
      );

      const data = await res.json();
      if (data.success) setPrediction(data.data);
    } catch (err) {
      console.error("Prediction error", err);
    }
  };

  if (loading)
    return (
      <div className="p-6 flex justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#005c] rounded-full animate-spin"></div>
      </div>
    );

  const graphData = surveys.map((s) => ({
    name: new Date(s.timestamps?.serverReceivedTime).toLocaleDateString(),
    ph: s.measurements.ph,
    turbidity: s.measurements.turbidity,
    temp: s.measurements.temperature,
    do: s.measurements.dissolvedOxygen,
  }));

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div className="rounded-3xl p-10 shadow-xl bg-linear-to-r from-[#4A37FF] to-[#24C6DC] text-white">
        <h1
          className="text-5xl font-extrabold tracking-wide transition-opacity duration-300"
          style={{ opacity: loading ? 0 : 1 }}
        >
          {waterBody?.name || waterBodyName || "Water Body"}
        </h1>
        <p className="text-lg mt-3 opacity-90">
          Advanced AI prediction & water quality analysis
        </p>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <MetricCard label="Total Surveys" value={surveys.length} />
        <MetricCard label="Avg pH" value={avg(surveys, "ph")} />
        <MetricCard
          label="Avg Temperature"
          value={avg(surveys, "temperature") + "°C"}
        />
        <MetricCard label="Avg DO" value={avg(surveys, "dissolvedOxygen")} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GraphCard
          title="pH Levels"
          data={graphData}
          dataKey="ph"
          color="#4A37FF"
        />
        <GraphCard
          title="Turbidity"
          data={graphData}
          dataKey="turbidity"
          color="#F97316"
        />
        <GraphCard
          title="Temperature"
          data={graphData}
          dataKey="temp"
          color="#DC2626"
        />
        <GraphCard
          title="Dissolved Oxygen"
          data={graphData}
          dataKey="do"
          color="#22C55E"
        />
      </div>

      {/* PREDICTION SECTION */}
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-200 space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            AI Forecast
          </h2>

          {prediction && (
            <span
              className={`px-4 py-2 text-sm rounded-full font-semibold shadow text-white ${
                prediction.risk_level === "High"
                  ? "bg-red-500"
                  : prediction.risk_level === "Moderate"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            >
              Risk: {prediction.risk_level}
            </span>
          )}
        </div>

        {prediction ? (
          <>
            {/* AI SUMMARY */}
            <div className="bg-linear-to-r from-[#4A37FF]/10 to-[#24C6DC]/10 p-6 rounded-2xl backdrop-blur-md border shadow-inner">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                AI Insight Summary
              </h3>
              <p className="text-gray-600 leading-relaxed text-md">
                {prediction.trend_summary}
              </p>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mt-6">
              7-Day Trend Forecast
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mt-4">
              {prediction["7_day_forecast"].map((day) => (
                <div
                  key={day.day}
                  className="bg-white border border-gray-200 p-5 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  <p className="font-bold text-lg text-gray-800 mb-2">
                    Day {day.day}
                  </p>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-800">pH:</span>{" "}
                      {day.ph}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Turbidity:
                      </span>{" "}
                      {day.turbidity}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">Temp:</span>{" "}
                      {day.temperature}°C
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">DO:</span>{" "}
                      {day.dissolvedOxygen}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-lg mt-4">
            Not enough surveys to generate a prediction.
          </p>
        )}
      </div>
    </div>
  );
}

/* --- Metric Card --- */
function MetricCard({ label, value }) {
  return (
    <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border text-center hover:shadow-xl transition">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-3xl font-bold text-[#4A37FF] mt-2">{value}</p>
    </div>
  );
}

/* --- Graph Card --- */
function GraphCard({ title, data, dataKey, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-md border">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">{title}</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* --- Helpers --- */
function avg(surveys, key) {
  if (!surveys.length) return "-";
  const sum = surveys.reduce((a, s) => a + Number(s.measurements[key] || 0), 0);
  return (sum / surveys.length).toFixed(2);
}
