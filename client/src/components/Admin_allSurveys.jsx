import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminAllSurveys() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchAllsurveys = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const res = await fetch("http://localhost:3000/api/admin/surveys", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setSurveys(data.surveys || []);
      } catch (error) {
        console.log("Error fetching surveys:", error.message);
      }
    };
    fetchAllsurveys();
  }, []);

  function getStatusBadgeClasses(status) {
    const main = status.split(" ")[0];
    switch (main) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "Verified":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Flagged":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-300";
    }
  }

  const filteredSurveys = surveys.filter((s) =>
    (s.location?.name + s.user?.name)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSurveys.length / pageSize);

  const paginatedSurveys = filteredSurveys.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#005c]">
          All Surveys
        </h2>

        <input
          type="text"
          placeholder="Search by location or surveyor..."
          className="px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#363795] w-full sm:w-72"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-4">
        {paginatedSurveys.map((s) => {
          const m = s.measurements;
          const t = s.timestamps;
          const auto = s.autoChecks;
          const user = s.user;

          const autoFails =
            !auto.phValid ||
            !auto.temperatureValid ||
            !auto.turbidityValid ||
            !auto.dissolvedOxygenValid;

          return (
            <div
              key={s._id}
              onClick={() => navigate(`/admin/surveys/${s._id}`)}
              className="p-4 border rounded-xl shadow-sm bg-gray-50 active:scale-[0.98] transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-[#005c]">
                  {s.location?.name}
                </h3>
                <span
                  className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${getStatusBadgeClasses(
                    s.status
                  )}`}
                >
                  {s.status.split(" ")[0]}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-1">
                Surveyed by <strong>{user?.name}</strong>
              </p>
              <p className="text-xs text-gray-500 mb-2">{user?.email}</p>

              <p className="text-xs text-gray-500 mb-3">
                {new Date(t.surveyorTime).toLocaleString()}
              </p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white p-2 rounded-lg shadow">
                  <strong>pH:</strong> {m.ph}
                </div>
                <div className="bg-white p-2 rounded-lg shadow">
                  <strong>Turb:</strong> {m.turbidity}
                </div>
                <div className="bg-white p-2 rounded-lg shadow">
                  <strong>Temp:</strong> {m.temperature}°C
                </div>
                <div className="bg-white p-2 rounded-lg shadow">
                  <strong>Check:</strong>{" "}
                  <span
                    className={`${
                      autoFails ? "text-red-600" : "text-green-600"
                    } font-semibold`}
                  >
                    {autoFails ? "Issues" : "Valid"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Mobile Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg ${
              page === 1 ? "bg-gray-200 text-gray-400" : "bg-[#005c] text-white"
            }`}
          >
            Previous
          </button>

          <span className="text-sm font-semibold">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg ${
              page === totalPages
                ? "bg-gray-200 text-gray-400"
                : "bg-[#005c] text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* DESKTOP TABLE (unchanged code) */}
      <div className="hidden md:block overflow-x-auto rounded-xl shadow-xl border border-[#005c]/20 mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-linear-to-r from-[#005c] via-[#363795] to-[#24C6DC] text-white">
              <th className="p-4 font-semibold">Location</th>
              <th className="p-4 font-semibold">Surveyor</th>
              <th className="p-4 font-semibold">Survey Time</th>
              <th className="p-4 font-semibold">pH</th>
              <th className="p-4 font-semibold">Turbidity</th>
              <th className="p-4 font-semibold">Temp (°C)</th>
              <th className="p-4 font-semibold">Auto Check</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedSurveys.map((s, index) => {
              const m = s.measurements;
              const t = s.timestamps;
              const user = s.user;
              const auto = s.autoChecks;

              const autoFails =
                !auto.phValid ||
                !auto.temperatureValid ||
                !auto.turbidityValid ||
                !auto.dissolvedOxygenValid;

              return (
                <tr
                  key={s._id}
                  onClick={() => navigate(`/admin/surveys/${s._id}`)}
                  className={`transition cursor-pointer ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-[#24C6DC]/10`}
                >
                  <td className="p-4 font-medium text-[#005c]">
                    {s.location?.name}
                  </td>

                  <td className="p-4">
                    {user?.name}
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </td>
                  <td className="p-4">
                    {new Date(t.surveyorTime).toLocaleString()}
                  </td>
                  <td className="p-4">{m.ph}</td>
                  <td className="p-4">{m.turbidity}</td>
                  <td className="p-4">{m.temperature}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 text-xs rounded-full font-medium tracking-wide ${
                        autoFails
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-green-50 text-green-600 border border-green-200"
                      }`}
                    >
                      {autoFails ? "Issues" : "Valid"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 text-xs rounded-full font-medium tracking-wide ${getStatusBadgeClasses(
                        s.status
                      )}`}
                    >
                      {s.status.split(" ")[0]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Desktop Pagination */}
        <div className="flex justify-between items-center p-4">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className={`px-5 py-2 rounded-lg ${
              page === 1 ? "bg-gray-200 text-gray-400" : "bg-[#005c] text-white"
            }`}
          >
            Previous
          </button>

          <span className="text-sm font-semibold">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={page === totalPages}
            className={`px-5 py-2 rounded-lg ${
              page === totalPages
                ? "bg-gray-200 text-gray-400"
                : "bg-[#005c] text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
