import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droplets, Thermometer, MapPin, Clock } from "lucide-react";

export default function SurveyorMySurveys() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const [page, setPage] = useState(1);
  const pageSize = 6;

  const token = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();

  const fetchMySurveys = async () => {
    try {
      const res = await fetch(
        "https://bluepulse-mern.onrender.com/api/surveys/getMysurveys",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) setSurveys(data.surveys);
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
    let filtered = surveys;
    if (filter !== "All")
      filtered = filtered.filter((s) => s.status === filter);
    return filtered;
  };

  const filteredData = filterSurveys();
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginated = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const nextPage = () => page < totalPages && setPage((p) => p + 1);
  const prevPage = () => page > 1 && setPage((p) => p - 1);

  const StatusBadge = ({ status }) => {
    const colors = {
      "Pending Verification": "bg-yellow-100 text-yellow-700",
      Verified: "bg-green-100 text-green-700",
      "Flagged for Resurvey": "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${colors[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#4A37FF] mb-2">
          My Surveys
        </h2>
        <p className="text-gray-600 text-base sm:text-lg">
          Review all your submitted surveys in one place.
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
        {[
          "All",
          "Verified",
          "Pending Verification",
          "Flagged for Resurvey",
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat);
              setPage(1);
            }}
            className={`px-4 sm:px-5 py-2 whitespace-nowrap rounded-full border transition text-sm font-medium ${
              filter === cat
                ? "bg-[#4A37FF] text-white shadow-md"
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredData.length === 0 ? (
        <p className="text-gray-600 text-lg">
          No surveys found under this category.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {paginated.map((s) => (
              <div
                key={s._id}
                onClick={() => navigate(`/surveyor/surveys/${s._id}`)}
                className="cursor-pointer bg-white p-5 sm:p-7 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 transition-all hover:-translate-y-1 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin size={20} className="text-[#4A37FF]" />
                    <span className="leading-tight">{s.location?.name}</span>
                  </h3>

                  <StatusBadge status={s.status} />
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
                  <p className="flex items-center gap-2 text-gray-700">
                    <Droplets size={18} className="text-blue-500" />
                    <span className="font-medium">pH:</span>{" "}
                    {s.measurements?.ph}
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

                <p className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm mt-3">
                  <Clock size={16} />
                  {new Date(s.timestamps?.serverReceivedTime).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between sm:justify-center items-center mt-8 gap-4">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg text-sm sm:text-base ${
                page === 1
                  ? "bg-gray-200 text-gray-400"
                  : "bg-[#4A37FF] text-white"
              }`}
            >
              Previous
            </button>

            <span className="text-sm font-semibold text-gray-700">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg text-sm sm:text-base ${
                page === totalPages
                  ? "bg-gray-200 text-gray-400"
                  : "bg-[#4A37FF] text-white"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
