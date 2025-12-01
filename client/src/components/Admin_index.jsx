import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import AdminWaterBodies from "./AdminWaterBodies";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function AdminHero({ name }) {
  const [loading, setLoading] = useState(true);
  const [surveys, setSurveys] = useState([]);
  const [error, setError] = useState(null);
  const [currentWBIndex, setCurrentWBIndex] = useState(0);

  const token = sessionStorage.getItem("accessToken");

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://bluepulse-mern.onrender.com/api/admin/surveys",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setSurveys(data.surveys);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const totalSurveys = surveys.length;
  const totalWaterBodies = new Set(surveys.map((s) => s.location?.name)).size;
  const activeSurveyors = new Set(surveys.map((s) => s.user?._id)).size;

  const criticalAlertsCount = surveys.filter((s) => {
    const ac = s.autoChecks;
    return (
      !ac?.phValid ||
      !ac?.temperatureValid ||
      !ac?.turbidityValid ||
      !ac?.dissolvedOxygenValid ||
      s.status === "Flagged for Resurvey"
    );
  }).length;

  const recentSurveys = [...surveys]
    .sort(
      (a, b) =>
        new Date(b.timestamps?.serverReceivedTime) -
        new Date(a.timestamps?.serverReceivedTime)
    )
    .slice(0, 5);

  const grouped = {};
  surveys.forEach((s) => {
    const name = s.location?.name || "Unknown";
    if (!grouped[name]) grouped[name] = [];
    grouped[name].push(s);
  });

  const waterBodies = Object.keys(grouped).map((name) => ({
    name,
    surveys: grouped[name].sort(
      (a, b) =>
        new Date(a.timestamps?.serverReceivedTime) -
        new Date(b.timestamps?.serverReceivedTime)
    ),
  }));

  if (loading)
    return (
      <div className="flex items-center justify-center p-6 h-screen">
        <div role="status" className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-[#005c]" />
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  if (error) return <p className="p-6 text-red-500 text-lg">{error}</p>;
  if (!waterBodies.length)
    return <p className="p-6 text-gray-600">No Water Bodies Found</p>;

  const safeIndex = Math.min(currentWBIndex, waterBodies.length - 1);
  const currentWB = waterBodies[safeIndex];

  const chartDataWB = currentWB.surveys.map((s) => ({
    name: new Date(s.timestamps?.serverReceivedTime).toLocaleDateString(),
    ph: s.measurements?.ph,
    turbidity: s.measurements?.turbidity,
    temp: s.measurements?.temperature,
    do: s.measurements?.dissolvedOxygen,
  }));

  const prevWB = () =>
    setCurrentWBIndex((prev) =>
      prev === 0 ? waterBodies.length - 1 : prev - 1
    );

  const nextWB = () =>
    setCurrentWBIndex((prev) => (prev + 1) % waterBodies.length);

  return (
    <div className="space-y-10">
      <div className="px-2 sm:px-0">
        <h2 className="text-3xl sm:text-5xl font-bold text-[#4A37FF]">
          Welcome, {name}
        </h2>
        <p className="text-gray-600 text-base sm:text-lg">
          Monitoring India's water bodies in real-time.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            label: "Water Bodies",
            value: totalWaterBodies,
            color: "from-blue-400 to-blue-600",
          },
          {
            label: "Total Surveys",
            value: totalSurveys,
            color: "from-pink-400 to-purple-600",
          },
          {
            label: "Active Surveyors",
            value: activeSurveyors,
            color: "from-green-400 to-green-600",
          },
          {
            label: "Critical Alerts",
            value: criticalAlertsCount,
            color: "from-orange-400 to-red-500",
          },
        ].map((c, i) => (
          <div
            key={i}
            className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md flex flex-col items-center"
          >
            <div
              className={`w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center rounded-full text-white text-2xl sm:text-3xl font-bold bg-linear-to-br ${c.color}`}
            >
              {c.value}
            </div>
            <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-lg">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={prevWB}
            className="px-2 sm:px-3 py-2 sm:py-3 bg-[#005c] rounded-full hover:bg-[#4a37ff]"
          >
            <ChevronLeft color={"white"} size={20} />
          </button>

          <h3 className="text-xl sm:text-2xl font-bold text-[#4A37FF] text-center">
            {currentWB.name}
          </h3>

          <button
            onClick={nextWB}
            className="px-2 sm:px-3 py-2 sm:py-3 bg-[#005c] rounded-full hover:bg-[#4a37ff]"
          >
            <ChevronRight color={"white"} size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <ChartCard
            title="pH Trend"
            type="line"
            dataKey="ph"
            data={chartDataWB}
          />
          <ChartCard
            title="Turbidity Levels"
            type="bar"
            dataKey="turbidity"
            data={chartDataWB}
          />
          <ChartCard
            title="Temperature Trend"
            type="line"
            dataKey="temp"
            data={chartDataWB}
          />
          <ChartCard
            title="Dissolved Oxygen"
            type="bar"
            dataKey="do"
            data={chartDataWB}
          />
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
          Recent Survey Activity
        </h3>
        <ul className="space-y-3">
          {recentSurveys.map((s) => (
            <li
              key={s._id}
              className="p-3 sm:p-4 bg-gray-100 rounded-lg shadow-sm text-sm sm:text-base"
            >
              <strong>{s.user?.name}</strong> surveyed{" "}
              <strong>{s.location?.name}</strong> — pH {s.measurements?.ph},
              Turbidity {s.measurements?.turbidity}, Temp{" "}
              {s.measurements?.temperature}°C
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md overflow-x-auto">
        <AdminWaterBodies />
      </div>
    </div>
  );
}

function ChartCard({ title, type, dataKey, data }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
        {title}
      </h3>
      <div className="h-52 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === "line" ? (
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#4A37FF"
                strokeWidth={3}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip />
              <Bar dataKey={dataKey} fill="#4A37FF" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
