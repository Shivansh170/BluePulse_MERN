import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminSingleSurvey() {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);

  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/admin/survey/${surveyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setSurvey(data.survey);
      } catch (err) {
        console.log("Error fetching survey:", err.message);
      }
    };
    fetchSurvey();
  }, [surveyId]);

  if (!survey)
    return <h2 className="text-xl font-semibold text-gray-600">Loading...</h2>;

  const { location, measurements, user, timestamps, autoChecks } = survey;

  const autoFails =
    !autoChecks.phValid ||
    !autoChecks.temperatureValid ||
    !autoChecks.turbidityValid ||
    !autoChecks.dissolvedOxygenValid;

  const verify = async () => {
    await fetch(`http://localhost:3000/api/admin/survey/${surveyId}/verify`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comments: "Verified by Admin" }),
    });
    alert("Survey Verified Successfully!");
    navigate("/admin/surveys");
  };

  const flag = async () => {
    await fetch(`http://localhost:3000/api/admin/survey/${surveyId}/flag`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comments: "Flagged for resurvey",
        reasons: ["Anomalies Detected"],
      }),
    });
    alert("Survey Flagged for Resurvey!");
    navigate("/admin/surveys");
  };

  return (
    <div className="p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
      {/* HEADER SECTION */}
      <div className="bg-linear-to-r from-[#005c] via-[#363795] to-[#24C6DC] p-6 rounded-xl text-white shadow-md mb-8">
        <h2 className="text-3xl font-bold">Survey Report</h2>
        <p className="text-sm opacity-90 mt-1">
          Review and verify the survey details below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* CARD: LOCATION */}
          <div className="p-5 rounded-xl border shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold text-[#363795] mb-1">
              Location
            </h3>
            <p className="font-medium text-gray-800">{location?.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              Lat: {location?.latitude} | Lng: {location?.longitude}
            </p>
          </div>

          {/* CARD: SURVEYOR */}
          <div className="p-5 rounded-xl border shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold text-[#363795] mb-1">
              Surveyor
            </h3>
            <p className="font-medium text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          {/* CARD: MEASUREMENTS */}
          <div className="p-5 rounded-xl border shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold text-[#363795] mb-2">
              Measurements
            </h3>
            <ul className="text-gray-700 space-y-1">
              <li>• pH: {measurements.ph}</li>
              <li>• Turbidity: {measurements.turbidity}</li>
              <li>• Temperature: {measurements.temperature} °C</li>
              <li>• Dissolved Oxygen: {measurements.dissolvedOxygen}</li>
            </ul>
          </div>

          {/* CARD: TIMESTAMPS */}
          <div className="p-5 rounded-xl border shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold text-[#363795] mb-2">
              Timestamps
            </h3>
            <p className="text-gray-700">
              <strong>Surveyed:</strong>{" "}
              {new Date(timestamps.surveyorTime).toLocaleString()}
            </p>
            <p className="text-gray-700 mt-1">
              <strong>Received:</strong>{" "}
              {new Date(timestamps.serverReceivedTime).toLocaleString()}
            </p>
          </div>

          {/* CARD: AUTO CHECK */}
          <div className="p-5 rounded-xl border shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold text-[#363795] mb-2">
              Auto Check
            </h3>

            <span
              className={`px-3 py-1.5 text-xs font-medium rounded-full border
                ${
                  autoFails
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-green-50 text-green-700 border-green-200"
                }
              `}
            >
              {autoFails ? "Issues Found" : "Valid"}
            </span>
          </div>

          {/* CARD: STATUS */}
          <div className="p-5 rounded-xl border shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold text-[#363795] mb-2">
              Admin Status
            </h3>
            <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
              {survey.status}
            </span>
          </div>
        </div>

        {/* RIGHT SIDE - PHOTO */}
        <div className="flex justify-center items-start">
          <img
            src={survey.photoProof?.url}
            className="rounded-xl shadow-lg w-full max-h-[450px] object-cover border"
          />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-4 mt-10">
        <button
          onClick={verify}
          className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
        >
          ✓ Verify
        </button>

        <button
          onClick={flag}
          className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
        >
          ⚠ Flag
        </button>
      </div>
    </div>
  );
}
