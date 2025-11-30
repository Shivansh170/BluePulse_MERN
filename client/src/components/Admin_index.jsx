import { useEffect, useState } from "react";

export default function AdminHero({ name }) {
  const [loading, setLoading] = useState(true);
  const [surveys, setSurveys] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all surveys using the admin route
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");

        const res = await fetch("http://localhost:3000/api/admin/surveys", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        setSurveys(data.surveys);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard fetch error:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  // =============================
  // 📊 Derived Dashboard Metrics
  // =============================

  const totalSurveys = surveys.length;

  const totalWaterBodies = new Set(surveys.map((s) => s.location?.name)).size;

  const activeSurveyors = new Set(surveys.map((s) => s.user?._id)).size;

  const criticalSurveys = surveys.filter((s) => {
    const ac = s.autoChecks;
    return (
      s.status === "Flagged for Resurvey" ||
      ac?.phValid === false ||
      ac?.temperatureValid === false ||
      ac?.turbidityValid === false ||
      ac?.dissolvedOxygenValid === false
    );
  });

  const criticalAlertsCount = criticalSurveys.length;

  // Recent surveys (latest by serverReceivedTime)
  const recentSurveys = [...surveys]
    .sort(
      (a, b) =>
        new Date(b.timestamps?.serverReceivedTime) -
        new Date(a.timestamps?.serverReceivedTime)
    )
    .slice(0, 5);

  // =============================
  // ⏳ Loading & Error UI
  // =============================

  if (loading) {
    return <div className="text-gray-500 text-lg p-6">Loading dashboard…</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-lg p-6">
        Error loading dashboard: {error}
      </div>
    );
  }

  // =============================
  // 💎 Final Dynamic Dashboard UI
  // =============================
  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-4xl font-bold text-[#005c]">Welcome, {name}</h2>
        <p className="text-gray-600 text-lg">
          Here’s what’s happening in India's water bodies today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-xl p-6 rounded-xl border-l-4 border-[#005c]">
          <h3 className="text-gray-500">Total Water Bodies</h3>
          <p className="text-3xl font-bold">{totalWaterBodies}</p>
        </div>

        <div className="bg-white shadow-xl p-6 rounded-xl border-l-4 border-[#24C6DC]">
          <h3 className="text-gray-500">Total Surveys</h3>
          <p className="text-3xl font-bold">{totalSurveys}</p>
        </div>

        <div className="bg-white shadow-xl p-6 rounded-xl border-l-4 border-[#363795]">
          <h3 className="text-gray-500">Active Surveyors</h3>
          <p className="text-3xl font-bold">{activeSurveyors}</p>
        </div>

        <div className="bg-white shadow-xl p-6 rounded-xl border-l-4 border-red-500">
          <h3 className="text-gray-500">Critical Alerts</h3>
          <p className="text-3xl font-bold">{criticalAlertsCount}</p>
        </div>
      </div>

      {/* Alerts + Recent Surveys */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        {/* Critical Alerts */}
        <div className="bg-white shadow-xl p-6 rounded-xl">
          <h3 className="text-2xl font-semibold text-[#363795] mb-4">
            Critical Alerts
          </h3>

          {criticalAlertsCount === 0 ? (
            <p className="text-green-600 bg-green-50 p-4 rounded-lg">
              No critical alerts 🎉
            </p>
          ) : (
            <ul className="space-y-3">
              {criticalSurveys.slice(0, 5).map((s) => (
                <li key={s._id} className="bg-red-100 p-4 rounded-lg shadow">
                  <strong>{s.location?.name}:</strong>{" "}
                  {!s.autoChecks.phValid && "pH abnormal. "}
                  {!s.autoChecks.turbidityValid && "High turbidity. "}
                  {!s.autoChecks.temperatureValid &&
                    "Temperature out of range. "}
                  {!s.autoChecks.dissolvedOxygenValid && "Low oxygen levels. "}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Surveys */}
        <div className="bg-white shadow-xl p-6 rounded-xl">
          <h3 className="text-2xl font-semibold text-[#24C6DC] mb-4">
            Recent Surveys
          </h3>

          <ul className="space-y-3">
            {recentSurveys.map((s) => (
              <li key={s._id} className="bg-blue-50 p-4 rounded-lg shadow">
                <strong>{s.user?.name}:</strong> surveyed{" "}
                <strong>{s.location?.name}</strong> — pH {s.measurements?.ph},
                Turbidity {s.measurements?.turbidity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
