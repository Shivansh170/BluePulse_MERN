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
  const [waterBody, setWaterBody] = useState({});
  const [prediction, setPrediction] = useState(null);

  // OPTIONAL: Surveys passed via navigate
  const passedSurveys = location.state?.surveys || null;

  useEffect(() => {
    if (passedSurveys) {
      processSurveys(passedSurveys);
    } else {
      fetchAllSurveys();
    }
  }, []);

  // 👉 Fetch all surveys from existing route
  const fetchAllSurveys = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/surveys", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      const filtered = data.surveys.filter(
        (s) => s.location?.name === waterBodyName
      );

      processSurveys(filtered);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const processSurveys = async (bodySurveys) => {
    setSurveys(bodySurveys);

    // Extract water body info from first survey
    setWaterBody({
      name: waterBodyName,
      city: bodySurveys[0]?.location?.city || "Unknown",
    });

    await runPrediction(bodySurveys);

    setLoading(false);
  };

  // 👉 RUN AI PREDICTION
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
        "http://localhost:3000/api/admin/predict-water-quality",
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
      if (data.success) {
        setPrediction(data.data);
      }
    } catch (err) {
      console.error("Prediction error", err);
    }
  };

  if (loading)
    return <p className="p-6 text-gray-600 text-lg">Loading prediction...</p>;

  // GRAPH DATA
  const graphData = surveys.map((s) => ({
    name: new Date(s.timestamps?.serverReceivedTime).toLocaleDateString(),
    ph: s.measurements.ph,
    turbidity: s.measurements.turbidity,
    temp: s.measurements.temperature,
    do: s.measurements.dissolvedOxygen,
  }));

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="bg-linear-to-r from-blue-500 to-purple-600 p-10 rounded-3xl shadow-xl text-white">
        <h1 className="text-5xl font-bold">{waterBody.name}</h1>
        <p className="text-lg mt-2 opacity-90">
          AI-powered water quality prediction & insights
        </p>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraphCard title="pH Levels" data={graphData} dataKey="ph" />
        <GraphCard title="Turbidity" data={graphData} dataKey="turbidity" />
        <GraphCard title="Temperature" data={graphData} dataKey="temp" />
        <GraphCard title="Dissolved Oxygen" data={graphData} dataKey="do" />
      </div>

      {/* AI PREDICTION */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800">AI Forecast</h2>

        {prediction ? (
          <>
            <p className="mt-4 text-xl">
              <strong>Risk level:</strong>{" "}
              <span className="text-red-500">{prediction.risk_level}</span>
            </p>
            <p className="text-gray-700 mt-2">{prediction.trend_summary}</p>

            <h3 className="mt-8 text-xl font-semibold">7-Day Forecast</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {prediction["7_day_forecast"].map((d) => (
                <div
                  key={d.day}
                  className="bg-gray-100 p-4 rounded-xl shadow text-gray-700"
                >
                  <p className="font-bold">Day {d.day}</p>
                  <p>pH: {d.ph}</p>
                  <p>Turbidity: {d.turbidity}</p>
                  <p>Temp: {d.temperature}°C</p>
                  <p>DO: {d.dissolvedOxygen}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 mt-3">
            Not enough surveys to generate prediction.
          </p>
        )}
      </div>
    </div>
  );
}
function GraphCard({ title, data, dataKey }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip />
            <Line dataKey={dataKey} stroke="#4A37FF" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
