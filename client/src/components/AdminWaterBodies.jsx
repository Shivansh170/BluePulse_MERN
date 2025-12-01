import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminWaterBodies() {
  const [loading, setLoading] = useState(true);
  const [waterBodies, setWaterBodies] = useState([]);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("accessToken");

  const fetchWaterBodies = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/surveys", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("ALL SURVEYS:", data.surveys);

      if (!data.success) throw new Error("Failed to load surveys");

      const surveys = data.surveys;

      // 🔥 GROUP SURVEYS BY WATER BODY NAME
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

      // 🔥 Convert object → array format for the UI
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
          surveys: wb.surveys, // keep full data for prediction
        };
      });

      setWaterBodies(finalWaterBodies);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterBodies();
  }, []);

  if (loading) return <p className="p-6">Loading water bodies…</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-[#4A37FF]">Water Bodies</h1>
      <p className="text-gray-600">Select a water body to run AI prediction.</p>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="pb-3">Name</th>
              <th className="pb-3">Location</th>
              <th className="pb-3">Total Surveys</th>
              <th className="pb-3">Last Survey</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {waterBodies.map((b) => (
              <tr key={b.name} className="border-b hover:bg-gray-50">
                <td className="py-3 font-semibold">{b.name}</td>
                <td className="py-3">{b.city}</td>

                <td className="py-3">{b.totalSurveys}</td>

                <td className="py-3">
                  {b.lastSurvey
                    ? new Date(b.lastSurvey).toLocaleString()
                    : "No surveys"}
                </td>

                <td className="py-3">
                  <button
                    onClick={() =>
                      navigate(`/admin/predict/${encodeURIComponent(b.name)}`, {
                        state: { surveys: b.surveys, waterBodyName: b.name },
                      })
                    }
                    className="px-4 py-2 bg-[#4A37FF] text-white rounded-lg shadow hover:opacity-90"
                  >
                    Run Prediction
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
