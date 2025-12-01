import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function SurveyorHome() {
  const { name } = useOutletContext();
  const token = sessionStorage.getItem("accessToken");

  const [surveys, setSurveys] = useState([]);

  const fetchMySurveys = async () => {
    const res = await fetch("http://localhost:3000/api/surveys/getMysurveys", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (data.success) {
      setSurveys(data.surveys);
    }
  };

  useEffect(() => {
    fetchMySurveys();
  }, []);

  const total = surveys.length;
  const pending = surveys.filter(
    (s) => s.status === "Pending Verification"
  ).length;
  const approved = surveys.filter((s) => s.status === "Verified").length;
  const flagged = surveys.filter(
    (s) => s.status === "Flagged for Resurvey"
  ).length;

  const recent = [...surveys].slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-5xl font-bold text-[#4A37FF]">Welcome, {name}</h2>
        <p className="text-gray-600 text-lg">
          Your latest survey activity at a glance.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Surveys",
            value: total,
            color: "from-blue-400 to-blue-600",
          },
          {
            label: "Pending",
            value: pending,
            color: "from-yellow-400 to-orange-500",
          },
          {
            label: "Approved",
            value: approved,
            color: "from-green-400 to-green-600",
          },
          {
            label: "Flagged",
            value: flagged,
            color: "from-red-400 to-red-600",
          },
        ].map((c, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center"
          >
            <div
              className={`w-28 h-28 flex items-center justify-center rounded-full text-white text-3xl font-bold bg-linear-to-br ${c.color}`}
            >
              {c.value}
            </div>
            <p className="mt-3 text-gray-700 text-lg">{c.label}</p>
          </div>
        ))}
      </div>

      {/* RECENT SURVEYS */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          Recent Surveys
        </h3>

        <ul className="space-y-3">
          {recent.map((s) => (
            <li key={s._id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
              Survey at <strong>{s.location?.name}</strong> — pH{" "}
              {s.measurements?.ph}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
