import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droplets, Thermometer, MapPin, Clock } from "lucide-react";

export default function SurveyorMySurveys() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const token = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();

  const fetchMySurveys = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/surveys/getMysurveys",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        setSurveys(data.surveys);
      }
    } catch (err) {
      console.error("Error fetching surveys:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySurveys();
  }, []);

  if (loading)
    return (
      <p className="text-gray-500 text-lg animate-pulse">Loading surveys…</p>
    );

  const filterSurveys = () => {
    if (filter === "All") return surveys;
    return surveys.filter((s) => s.status === filter);
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      "Pending Verification": "bg-yellow-100 text-yellow-700",
      Approved: "bg-green-100 text-green-700",
      "Flagged for Resurvey": "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-4xl font-bold text-[#4A37FF] mb-2">My Surveys</h2>
        <p className="text-gray-600 text-lg">
          Review all your submitted surveys in one place.
        </p>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-3">
        {[
          "All",
          "Verified",
          "Pending Verification",
          "Flagged for Resurvey",
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full border transition text-sm font-medium ${
              filter === cat
                ? "bg-[#4A37FF] text-white shadow-md"
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SURVEY GRID */}
      {filterSurveys().length === 0 ? (
        <p className="text-gray-600 text-lg">
          No surveys found under this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filterSurveys().map((s) => (
            <div
              key={s._id}
              onClick={() => navigate(`/surveyor/surveys/${s._id}`)}
              className="cursor-pointer bg-white p-7 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 transition-all hover:-translate-y-1 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin size={20} className="text-[#4A37FF]" />
                  {s.location?.name}
                </h3>

                <StatusBadge status={s.status} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <p className="flex items-center gap-2 text-gray-700">
                  <Droplets size={18} className="text-blue-500" />
                  <span className="font-medium">pH:</span> {s.measurements?.ph}
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <Thermometer size={18} className="text-red-400" />
                  <span className="font-medium">Temp:</span>{" "}
                  {s.measurements?.temperature}°C
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <Droplets size={18} className="text-purple-500" />
                  <span className="font-medium">Turbidity:</span>{" "}
                  {s.measurements?.turbidity}
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <Droplets size={18} className="text-green-500" />
                  <span className="font-medium">DO:</span>{" "}
                  {s.measurements?.dissolvedOxygen}
                </p>
              </div>

              <p className="flex items-center gap-2 text-gray-500 text-sm mt-3">
                <Clock size={16} />{" "}
                {new Date(s.timestamps?.serverReceivedTime).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
