import { useState } from "react";
import { MapPinned } from "lucide-react";

export default function SurveyorNewSurvey() {
  const token = sessionStorage.getItem("accessToken");

  const [location, setLocation] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const [photoProof, setPhotoProof] = useState("");
  const [measurements, setMeasurements] = useState({
    ph: "",
    turbidity: "",
    temperature: "",
    dissolvedOxygen: "",
  });

  const captureLocation = () => {
    if (!navigator.geolocation) {
      alert("GPS not supported on this device");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);
        setLocation(
          `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`
        );
        alert("Live location captured!");
      },
      () => alert("Unable to get your location!")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/surveys/createSurvey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        location: {
          name: location,
          latitude: lat || 0,
          longitude: lng || 0,
        },
        measurements: {
          ph: Number(measurements.ph),
          turbidity: Number(measurements.turbidity),
          temperature: Number(measurements.temperature),
          dissolvedOxygen: Number(measurements.dissolvedOxygen),
        },
        surveyorTime: new Date(),
        photoProof: {
          url: photoProof,
          publicId: "",
        },
      }),
    });

    const data = await res.json();
    if (data.success) alert("Survey Created Successfully!");
    else alert("Error: " + data.error);
  };

  const inputClasses =
    "w-full p-3 rounded-lg border focus:outline-none focus:border-0 focus:ring-2 focus:ring-[#4A37FF]";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-8 max-w-3xl mx-auto border border-gray-200"
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-[#4A37FF] mb-4">
        Submit New Survey
      </h2>

      <div className="space-y-3 bg-gray-50 p-5 sm:p-6 rounded-xl border">
        <label className="font-semibold text-lg">Location</label>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            className={inputClasses}
            placeholder="Enter location name or use GPS"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={captureLocation}
            className="flex items-center justify-center gap-2 bg-[#4A37FF] text-white px-2 py-1 rounded-lg hover:bg-[#3726d9] w-full sm:w-auto"
          >
            Live Location
          </button>
        </div>

        {lat && lng && (
          <p className="text-sm text-gray-600">
            📍 Latitude: {lat} | Longitude: {lng}
          </p>
        )}
      </div>

      <div className="bg-gray-50 p-5 sm:p-6 rounded-xl border space-y-4">
        <label className="font-semibold text-lg">Measurements</label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {["ph", "turbidity", "temperature", "dissolvedOxygen"].map((key) => (
            <div key={key}>
              <label className="font-medium">{key.toUpperCase()}</label>
              <input
                type="number"
                className={inputClasses}
                value={measurements[key]}
                onChange={(e) =>
                  setMeasurements({ ...measurements, [key]: e.target.value })
                }
                required
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-5 sm:p-6 rounded-xl border space-y-3">
        <label className="font-semibold text-lg">Photo Proof (URL)</label>
        <input
          type="text"
          placeholder="Upload photo somewhere and paste the link"
          className={inputClasses}
          value={photoProof}
          onChange={(e) => setPhotoProof(e.target.value)}
        />
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-linear-to-r from-[#4A37FF] to-[#6C5BFF] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-lg sm:text-xl hover:opacity-90 shadow-md w-full sm:w-auto"
        >
          Submit Survey
        </button>
      </div>
    </form>
  );
}
