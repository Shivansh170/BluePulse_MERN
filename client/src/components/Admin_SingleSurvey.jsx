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
          `https://bluepulse-mern.onrender.com/api/admin/survey/${surveyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setSurvey(data.survey);
      } catch (err) {}
    };
    fetchSurvey();
  }, [surveyId]);

  if (!survey)
    return (
      <div className="flex justify-center py-12">
        <div
          className="w-10 h-10 border-4 border-gray-200 rounded-full animate-spin"
          style={{ borderTopColor: "#363795" }}
        ></div>
      </div>
    );

  const { location, measurements, user, timestamps, autoChecks } = survey;

  const autoFails =
    !autoChecks.phValid ||
    !autoChecks.temperatureValid ||
    !autoChecks.turbidityValid ||
    !autoChecks.dissolvedOxygenValid;

  const verify = async () => {
    await fetch(
      `https://bluepulse-mern.onrender.com/api/admin/survey/${surveyId}/verify`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comments: "Verified by Admin" }),
      }
    );
    alert("Survey Verified Successfully!");
    navigate("/admin/surveys");
  };

  const flag = async () => {
    await fetch(
      `https://bluepulse-mern.onrender.com/api/admin/survey/${surveyId}/flag`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comments: "Flagged for resurvey",
          reasons: ["Anomalies Detected"],
        }),
      }
    );
    alert("Survey Flagged for Resurvey!");
    navigate("/admin/surveys");
  };

  return (
    <div className="p-4 sm:p-8">
      {/* HEADER (same for all screens) */}
      <div className="bg-linear-to-r from-[#005c] via-[#363795] to-[#24C6DC] p-5 sm:p-6 rounded-xl text-white shadow-md mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Survey Report</h2>
        <p className="text-sm opacity-90 mt-1">
          Review and verify the survey details below.
        </p>
      </div>

      {/* MOBILE UI */}
      <div className="lg:hidden space-y-6">
        <div className="space-y-6">
          <div className="p-4 rounded-xl border shadow-sm bg-gray-50">
            <h3 className="text-base font-semibold text-[#363795] mb-1">
              Location
            </h3>
            <p className="font-medium text-gray-800">{location?.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              Lat: {location?.latitude} | Lng: {location?.longitude}
            </p>
          </div>

          <div className="p-4 rounded-xl border shadow-sm bg-gray-50">
            <h3 className="text-base font-semibold text-[#363795] mb-1">
              Surveyor
            </h3>
            <p className="font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          <div className="p-4 rounded-xl border shadow-sm bg-gray-50">
            <h3 className="text-base font-semibold text-[#363795] mb-2">
              Measurements
            </h3>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• pH: {measurements.ph}</li>
              <li>• Turbidity: {measurements.turbidity}</li>
              <li>• Temperature: {measurements.temperature} °C</li>
              <li>• Dissolved Oxygen: {measurements.dissolvedOxygen}</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border shadow-sm bg-gray-50">
            <h3 className="text-base font-semibold text-[#363795] mb-2">
              Timestamps
            </h3>
            <p className="text-gray-700 text-sm">
              Surveyed: {new Date(timestamps.surveyorTime).toLocaleString()}
            </p>
            <p className="text-gray-700 text-sm mt-1">
              Received:{" "}
              {new Date(timestamps.serverReceivedTime).toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-xl border shadow-sm bg-gray-50">
            <h3 className="text-base font-semibold text-[#363795] mb-2">
              Auto Check
            </h3>

            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border
              ${
                autoFails
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-green-50 text-green-700 border-green-200"
              }`}
            >
              {autoFails ? "Issues Found" : "Valid"}
            </span>
          </div>

          <div className="p-4 rounded-xl border shadow-sm bg-gray-50">
            <h3 className="text-base font-semibold text-[#363795] mb-2">
              Admin Status
            </h3>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
              {survey.status}
            </span>
          </div>
        </div>

        <div>
          <img
            src={survey.photoProof?.url}
            className="rounded-xl shadow-lg w-full max-h-[350px] object-cover border"
          />
        </div>

        <div className="flex flex-col gap-4 mt-6">
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

      {/* DESKTOP UI (UNCHANGED) */}
      <div className="hidden lg:block p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-5 rounded-xl border shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold text-[#363795] mb-1">
                Location
              </h3>
              <p className="font-medium text-gray-800">{location?.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                Lat: {location?.latitude} | Lng: {location?.longitude}
              </p>
            </div>

            <div className="p-5 rounded-xl border shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold text-[#363795] mb-1">
                Surveyor
              </h3>
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

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
                  }`}
              >
                {autoFails ? "Issues Found" : "Valid"}
              </span>
            </div>

            <div className="p-5 rounded-xl border shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold text-[#363795] mb-2">
                Admin Status
              </h3>
              <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                {survey.status}
              </span>
            </div>
          </div>

          <div className="flex justify-center items-start">
            <img
              src={survey.photoProof?.url}
              className="rounded-xl shadow-lg w-full max-h-[450px] object-cover border"
            />
          </div>
        </div>

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
    </div>
  );
}
