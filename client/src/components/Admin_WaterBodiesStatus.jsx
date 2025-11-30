import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function WaterBodiesStatus() {
  const parseLocationName = (loc) => {
    if (typeof loc !== "string") return loc;

    try {
      // Extract the "name: '...'"
      const match = loc.match(/name:\s*'([^']+)'/);
      if (match) return match[1];

      return loc; // fallback
    } catch {
      return loc;
    }
  };

  const navigate = useNavigate();

  const [bodies, setBodies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  const [search, setSearch] = useState("");

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
      } catch (err) {
        console.error(err);
        if (mounted) setGlobalError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBodies();
    return () => (mounted = false);
  }, []);

  // Status Badge Colors
  const StatusBadge = ({ status }) => {
    const styles = {
      Good: "bg-green-50 text-green-700 border-green-200",
      Moderate: "bg-yellow-50 text-yellow-700 border-yellow-200",
      Poor: "bg-orange-50 text-orange-700 border-orange-200",
      Critical: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      <span
        className={`px-4 py-1 rounded-full border text-sm font-semibold shadow-sm ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  // Score Dot Color
  const ScoreDot = ({ score }) => {
    const colors = {
      4: "bg-green-500",
      3: "bg-yellow-500",
      2: "bg-orange-500",
      1: "bg-red-500",
      0: "bg-red-600",
    };
    return (
      <span
        className={`h-3 w-3 rounded-full inline-block mr-2 ${colors[score]}`}
      />
    );
  };

  // Search filter
  const filtered = useMemo(() => {
    if (!search) return bodies;
    const q = search.toLowerCase();
    return bodies.filter(
      (b) =>
        b.location.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q)
    );
  }, [bodies, search]);

  const openSurvey = (surveyId) => navigate(`/admin/surveys/${surveyId}`);

  return (
    <div className="p-6">
      {/* linear Header */}
      <div className="rounded-xl bg-linear-to-r from-[#005c] via-[#363795] to-[#24C6DC] p-6 mb-6 text-white shadow-xl">
        <h2 className="text-3xl font-bold tracking-wide flex items-center gap-3">
          <span className="text-4xl">🌊</span> Water Bodies Status
        </h2>
        <p className="opacity-90 text-base mt-1">
          Real-time environmental health indicators for monitored water bodies.
        </p>
      </div>

      {/* Stat Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl bg-white shadow-sm p-4 border">
          <div className="text-gray-500 text-sm">Total Water Bodies</div>
          <div className="text-2xl font-bold text-[#005c]">{bodies.length}</div>
        </div>

        <div className="rounded-xl bg-green-50 shadow-sm p-4 border border-green-200">
          <div className="text-green-700 text-sm">Good Condition</div>
          <div className="text-xl font-bold">
            {bodies.filter((b) => b.status === "Good").length}
          </div>
        </div>

        <div className="rounded-xl bg-yellow-50 shadow-sm p-4 border border-yellow-200">
          <div className="text-yellow-700 text-sm">Moderate</div>
          <div className="text-xl font-bold">
            {bodies.filter((b) => b.status === "Moderate").length}
          </div>
        </div>

        <div className="rounded-xl bg-red-50 shadow-sm p-4 border border-red-200">
          <div className="text-red-700 text-sm">Critical</div>
          <div className="text-xl font-bold">
            {
              bodies.filter(
                (b) => b.status === "Critical" || b.status === "Poor"
              ).length
            }
          </div>
        </div>
      </div>

      {/* Card Container */}
      <div className="rounded-xl bg-gray-50 border shadow p-6">
        {/* Search Bar */}
        <div className="flex items-center justify-between mb-6">
          <input
            className="w-80 rounded-xl border px-4 py-2 bg-white shadow-sm outline-none text-sm focus:ring-2 focus:ring-[#24C6DC]"
            placeholder="Search water body..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={() => setSearch("")}
            className="px-4 py-2 rounded-xl border bg-white shadow text-sm hover:bg-gray-100"
          >
            Clear
          </button>
        </div>

        {/* Loading, Error, Empty */}
        {loading ? (
          <div className="py-20 text-center text-gray-500 text-lg">
            Loading water bodies...
          </div>
        ) : globalError ? (
          <div className="py-6 text-center text-red-600">{globalError}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            No water bodies found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-linear-to-r from-[#005c] via-[#363795] to-[#24C6DC] text-white shadow-md">
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
                {filtered.map((b, idx) => {
                  const rowBg = idx % 2 === 0 ? "bg-gray-50" : "bg-white";
                  return (
                    <tr
                      key={b.surveyId}
                      className={`${rowBg} hover:bg-[#24C6DC]/10 transition cursor-pointer`}
                    >
                      <td className="px-4 py-5 font-medium text-gray-800 flex items-center gap-2">
                        <span className="text-lg">📍</span>{" "}
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
                          className="px-5 py-2 rounded-xl text-white bg-[#363795] hover:bg-[#28306f] shadow-md font-medium text-sm transition"
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
        )}
      </div>
    </div>
  );
}
