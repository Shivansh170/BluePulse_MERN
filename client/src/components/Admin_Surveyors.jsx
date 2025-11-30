import { useEffect, useState } from "react";

export default function ManageSurveyors() {
  const [surveyors, setSurveyors] = useState([]);

  useEffect(() => {
    const fetchAllSurveyors = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const res = await fetch(
          "http://localhost:3000/api/admin/fetch-all-surveyors",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        console.log(data.data.surveyors);
        setSurveyors(data.data.surveyors);
      } catch (error) {
        console.log(
          "Error in fetching Surveyors in Admin Dashboard..",
          error.message
        );
      }
    };
    fetchAllSurveyors();
  }, []);

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#005c]">Manage Surveyors</h2>

        <button className="bg-linear-to-r from-[#005c] via-[#363795] to-[#24C6DC] text-white py-2 px-5 rounded-xl shadow-md hover:shadow-lg transition">
          + Add New Surveyor
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-xl border border-[#005c]/20">
        <table className="w-full border-collapse text-left">
          {/* Table Header */}
          <thead>
            <tr className="bg-linear-to-r from-[#005c] via-[#363795] to-[#24C6DC] text-white">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {surveyors.map((s, index) => (
              <tr
                key={s.id}
                className={`transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-[#24C6DC]/10`}
              >
                {/* Name */}
                <td className="p-4 text-[#005c] font-medium">{s.name}</td>

                {/* Email */}
                <td className="p-4">{s.email}</td>
                {/* Delete Button */}
                <td className="p-4">
                  <button className="bg-linear-to-r from-red-500 to-red-600 text-white py-1 px-4 rounded-lg shadow hover:shadow-md transition">
                    Delete
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
