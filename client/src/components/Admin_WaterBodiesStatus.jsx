import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function WaterBodiesStatus() {
  const parseLocationName = (loc) => {
    if (typeof loc !== "string") return loc;
    try {
      const match = loc.match(/name:\s*'([^']+)'/);
      if (match) return match[1];
      return loc;
    } catch {
      return loc;
    }
  };

  const navigate = useNavigate();
  const [bodies, setBodies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let mounted = true;
    const token = sessionStorage.getItem("accessToken");

    const fetchBodies = async () => {
      setLoading(true);
      setGlobalError(null);
      try {
        const res = await fetch(
          "http://localhost:3000/api/admin/water-bodies/status",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        const data = await res.json();
        if (data?.results && mounted) setBodies(data.results);
        console.log(data);
      } catch (err) {
        if (mounted) setGlobalError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBodies();
    return () => {
      mounted = false;
    };
  }, []);

  const StatusBadge = ({ status }) => {
    const styles = {
      Good: "bg-green-100 text-green-700 border-green-300",
      Moderate: "bg-yellow-100 text-yellow-700 border-yellow-300",
      Poor: "bg-orange-100 text-orange-700 border-orange-300",
      Critical: "bg-red-100 text-red-700 border-red-300",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full border text-xs font-semibold ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  const ScoreDot = ({ score }) => {
    const colors = {
      4: "bg-green-500",
      3: "bg-yellow-500",
      2: "bg-orange-500",
      1: "bg-red-500",
      0: "bg-red-600",
    };
    return (
      <span className={`h-3 w-3 rounded-full inline-block ${colors[score]}`} />
    );
  };

  const filtered = useMemo(() => {
    if (!search) return bodies;
    const q = search.toLowerCase();
    return bodies.filter(
      (b) =>
        b.location.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q)
    );
  }, [bodies, search]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  const openSurvey = (surveyId) => navigate(`/admin/surveys/${surveyId}`);

  return (
    <div className="p-4 sm:p-6">
      <div className="rounded-xl bg-linear-to-r from-[#005c] via-[#363795] to-[#24C6DC] p-5 sm:p-6 mb-6 text-white shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-wide flex items-center gap-3">
          <span className="text-4xl">🌊</span> Water Bodies Status
        </h2>
        <p className="opacity-90 text-sm sm:text-base mt-1">
          Environmental health indicators from live survey data.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl bg-white shadow-sm p-4 border">
          <div className="text-gray-500 text-xs">Total Bodies</div>
          <div className="text-xl sm:text-2xl font-bold text-[#005c]">
            {bodies.length}
          </div>
        </div>

        <div className="rounded-xl bg-green-50 shadow-sm p-4 border border-green-200">
          <div className="text-green-700 text-xs">Good</div>
          <div className="text-lg sm:text-xl font-bold">
            {bodies.filter((b) => b.status === "Good").length}
          </div>
        </div>

        <div className="rounded-xl bg-yellow-50 shadow-sm p-4 border border-yellow-200">
          <div className="text-yellow-700 text-xs">Moderate</div>
          <div className="text-lg sm:text-xl font-bold">
            {bodies.filter((b) => b.status === "Moderate").length}
          </div>
        </div>

        <div className="rounded-xl bg-red-50 shadow-sm p-4 border border-red-200">
          <div className="text-red-700 text-xs">Critical</div>
          <div className="text-lg sm:text-xl font-bold">
            {
              bodies.filter((b) => ["Critical", "Poor"].includes(b.status))
                .length
            }
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 border shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <input
            className="w-full sm:w-80 rounded-xl border px-4 py-2 bg-white shadow-sm text-sm focus:ring-2 focus:ring-[#24C6DC]"
            placeholder="Search water body..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <button
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
            className="px-4 py-2 rounded-xl border bg-white shadow text-sm hover:bg-gray-100"
          >
            Clear
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div
              className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"
              style={{ borderTopColor: "#005c" }}
            ></div>
          </div>
        ) : globalError ? (
          <div className="py-6 text-center text-red-600">{globalError}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            No water bodies found.
          </div>
        ) : (
          <>
            <div className="md:hidden grid gap-4">
              {paginated.map((b) => (
                <div
                  key={b.surveyId}
                  onClick={() => openSurvey(b.surveyId)}
                  className="bg-white border rounded-xl shadow px-4 py-5 active:scale-[0.98] transition cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2 items-start">
                      <span className="text-xl">📍</span>
                      <h3 className="text-lg font-semibold text-[#005c] leading-snug">
                        {parseLocationName(b.location)}
                      </h3>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-sm text-gray-700 font-medium">
                    <ScoreDot score={b.score} />
                    {b.score} / 4
                  </div>

                  <button className="mt-4 w-full py-2 bg-[#363795] text-white rounded-lg text-sm font-medium hover:bg-[#28306f] transition">
                    View Details →
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center md:hidden mt-6">
              <button
                onClick={prevPage}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg ${
                  page === 1
                    ? "bg-gray-200 text-gray-400"
                    : "bg-[#005c] text-white"
                }`}
              >
                Previous
              </button>
              <span className="text-sm font-semibold">
                Page {page} / {totalPages}
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

            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <div className="max-h-[420px] overflow-y-auto rounded-b-xl">
                  <table className="min-w-full divide-y overflow-hidden">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-linear-to-r from-[#005c] via-[#363795] to-[#24C6DC] text-white">
                        <th className="px-4 py-4 text-left text-sm font-semibold rounded-tl-xl">
                          📍 Location
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold">
                          Condition
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold">
                          Score
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold">
                          Sampled At
                        </th>
                        <th className="px-4 py-4 text-right text-sm font-semibold rounded-tr-xl">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-white">
                      {paginated.map((b, idx) => {
                        const rowBg = idx % 2 === 0 ? "bg-gray-50" : "bg-white";
                        return (
                          <tr
                            key={b.surveyId}
                            className={`${rowBg} hover:bg-[#24C6DC]/10 transition cursor-pointer`}
                          >
                            <td className="px-4 py-5 font-medium text-gray-800 flex items-center gap-2">
                              <span className="text-lg">📍</span>
                              {parseLocationName(b.location)}
                            </td>

                            <td className="px-4 py-4">
                              <StatusBadge status={b.status} />
                            </td>

                            <td className="px-4 py-4 text-gray-700 font-semibold flex items-center">
                              <ScoreDot score={b.score} /> {b.score} / 4
                            </td>

                            <td className="px-4 py-4 text-gray-600">
                              {b.sampledAt
                                ? new Date(b.sampledAt).toLocaleString()
                                : "—"}
                            </td>

                            <td className="px-4 py-4 text-right">
                              <button
                                onClick={() => openSurvey(b.surveyId)}
                                className="px-5 py-2 rounded-xl text-white bg-[#363795] hover:bg-[#28306f] shadow-md text-sm transition"
                              >
                                Open Survey →
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center p-4">
                <button
                  onClick={prevPage}
                  disabled={page === 1}
                  className={`px-5 py-2 rounded-lg ${
                    page === 1
                      ? "bg-gray-200 text-gray-400"
                      : "bg-[#005c] text-white"
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm font-semibold">
                  Page {page} / {totalPages}
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
          </>
        )}
      </div>
    </div>
  );
}
