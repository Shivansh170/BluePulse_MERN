import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminWaterBodies() {
  const [loading, setLoading] = useState(true);
  const [waterBodies, setWaterBodies] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const navigate = useNavigate();
  const token = sessionStorage.getItem("accessToken");

  const fetchWaterBodies = async () => {
    try {
      const res = await fetch(
        "https://bluepulse-mern.onrender.com/api/admin/surveys",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error("Failed to load surveys");

      const surveys = data.surveys;
      const grouped = {};

      surveys.forEach((s) => {
        const name = s.location?.name || "Unknown Water Body";
        if (!grouped[name]) {
          grouped[name] = {
            name,
            city: s.location?.city || "Unknown",
            surveys: [],
          };
        }
        grouped[name].surveys.push(s);
      });

      const finalWaterBodies = Object.values(grouped).map((wb) => {
        const sorted = [...wb.surveys].sort(
          (a, b) =>
            new Date(b.timestamps?.serverReceivedTime) -
            new Date(a.timestamps?.serverReceivedTime)
        );

        return {
          name: wb.name,
          city: wb.city,
          lastSurvey: sorted[0]?.timestamps?.serverReceivedTime || null,
          totalSurveys: wb.surveys.length,
          surveys: wb.surveys,
        };
      });

      setWaterBodies(finalWaterBodies);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterBodies();
  }, []);

  const totalPages = Math.ceil(waterBodies.length / pageSize);
  const paginated = waterBodies.slice((page - 1) * pageSize, page * pageSize);

  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <div
          className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"
          style={{ borderTopColor: "#4A37FF" }}
        ></div>
      </div>
    );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#4A37FF]">
        Water Bodies
      </h1>
      <p className="text-gray-600 text-sm sm:text-base">
        Select a water body to run AI prediction.
      </p>

      {/* MOBILE LIST VIEW */}
      <div className="md:hidden space-y-4">
        {paginated.map((b) => (
          <div
            key={b.name}
            className="bg-white rounded-xl shadow border p-4 active:scale-[0.98] transition cursor-pointer"
            onClick={() =>
              navigate(`/admin/predict/${encodeURIComponent(b.name)}`, {
                state: { surveys: b.surveys, waterBodyName: b.name },
              })
            }
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-[#4A37FF] leading-tight">
                {b.name}
              </h3>
              <span className="text-xs text-gray-500">{b.city || "India"}</span>
            </div>

            <div className="mt-3 text-sm text-gray-700">
              <span className="font-medium text-[#4A37FF]">
                {b.totalSurveys}
              </span>{" "}
              surveys
            </div>

            <div className="text-xs text-gray-500 mt-1">
              {b.lastSurvey
                ? new Date(b.lastSurvey).toLocaleString()
                : "No surveys"}
            </div>

            <button className="mt-4 w-full py-2 bg-[#4A37FF] text-white rounded-lg text-sm hover:bg-[#3628d5] transition">
              Run Prediction →
            </button>
          </div>
        ))}

        {/* MOBILE PAGINATION */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg ${
              page === 1
                ? "bg-gray-200 text-gray-400"
                : "bg-[#4A37FF] text-white"
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
                : "bg-[#4A37FF] text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW (UNCHANGED) */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg p-6">
        <div className="overflow-x-auto overflow-y-auto max-h-[420px] rounded-xl">
          <table className="w-full text-left min-w-[650px]">
            <thead className="sticky top-0 bg-white z-10 border-b">
              <tr className="text-gray-500 text-sm sm:text-base">
                <th className="pb-3 px-2">Name</th>
                <th className="pb-3 px-2">Location</th>
                <th className="pb-3 px-2">Total Surveys</th>
                <th className="pb-3 px-2">Last Survey</th>
                <th className="pb-3 px-2">Action</th>
              </tr>
            </thead>

            {/* ⛔ TABLE BODY UNTOUCHED AS PROMISED */}
            <tbody>
              {paginated.map((b) => (
                <tr
                  key={b.name}
                  className="border-b hover:bg-gray-50 text-sm sm:text-base"
                >
                  <td className="py-3 px-2 font-semibold whitespace-nowrap">
                    {b.name}
                  </td>
                  <td className="py-3 px-2 whitespace-nowrap">India</td>
                  <td className="py-3 px-2">{b.totalSurveys}</td>
                  <td className="py-3 px-2 whitespace-nowrap">
                    {b.lastSurvey
                      ? new Date(b.lastSurvey).toLocaleString()
                      : "No surveys"}
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/predict/${encodeURIComponent(b.name)}`,
                          {
                            state: {
                              surveys: b.surveys,
                              waterBodyName: b.name,
                            },
                          }
                        )
                      }
                      className="px-4 py-2 bg-[#4A37FF] text-white rounded-lg shadow hover:opacity-90 text-sm"
                    >
                      Run Prediction
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* END TABLE — UNCHANGED */}
          </table>
        </div>

        {/* DESKTOP PAGINATION */}
        <div className="flex justify-between items-center p-4">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className={`px-5 py-2 rounded-lg ${
              page === 1
                ? "bg-gray-200 text-gray-400"
                : "bg-[#4A37FF] text-white"
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
                : "bg-[#4A37FF] text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
