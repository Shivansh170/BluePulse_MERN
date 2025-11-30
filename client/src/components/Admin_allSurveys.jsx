import { useEffect, useState } from "react";

export default function AdminAllSurveys() {
  const [surveys, setSurveys] = useState([]);
  const [search, setSearch] = useState("");

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

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#005c]">All Surveys</h2>

        <input
          type="text"
          placeholder="Search by location or surveyor..."
          className="px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#363795] w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-xl border border-[#005c]/20">
        <table className="w-full text-left border-collapse">
          {/* Header Row */}
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

          {/* Body */}
          <tbody>
            {surveys
              .filter((s) =>
                (s.location?.name + s.user?.name)
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((s, index) => {
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
                    className={`transition ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-[#24C6DC]/10`}
                  >
                    {/* Location */}
                    <td className="p-4 font-medium text-[#005c]">
                      {s.location?.name}
                    </td>

                    {/* Surveyor */}
                    <td className="p-4">
                      {user?.name}
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </td>

                    {/* Survey Time */}
                    <td className="p-4">
                      {new Date(t.surveyorTime).toLocaleString()}
                    </td>

                    {/* Measurements */}
                    <td className="p-4">{m.ph}</td>
                    <td className="p-4">{m.turbidity}</td>
                    <td className="p-4">{m.temperature}</td>

                    {/* Auto Check */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 text-xs rounded-full font-medium tracking-wide
    ${
      autoFails
        ? "bg-red-50 text-red-600 border border-red-200"
        : "bg-green-50 text-green-600 border border-green-200"
    }
  `}
                      >
                        {autoFails ? "Issues" : "Valid"}
                      </span>
                    </td>

                    {/* Admin Review Status */}
                    <td className="p-4">
                      <span className="px-3 py-1 text-sm rounded-full font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
                        {s.status.split(" ")[0]}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
