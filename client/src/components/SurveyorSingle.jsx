import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Droplets,
  Thermometer,
  Gauge,
  Image as ImageIcon,
  Clock,
} from "lucide-react";

export default function SurveyorSingle() {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("accessToken");

  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSurvey = async () => {
    const res = await fetch(
      `https://bluepulse-mern.onrender.com/api/surveys/my/${surveyId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    if (data.success) setSurvey(data.survey);
    setLoading(false);
  };

  useEffect(() => {
    fetchSurvey();
  }, []);

  if (loading)
    return <p className="text-gray-600 animate-pulse text-lg">Loading…</p>;

  if (!survey) return <p className="text-red-500 text-lg">Survey not found.</p>;

  const badgeColor = {
    "Pending Verification": "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    "Flagged for Resurvey": "bg-red-100 text-red-700",
  };

  function CircleGauge({ value, max, label, icon: Icon, color }) {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const progress = value / max;
    const offset = circumference - progress * circumference;

    return (
      <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 border shadow-sm">
        <div className="relative w-24 h-24">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Icon size={20} style={{ color }} />
            <p className="text-lg font-bold text-gray-800">{value}</p>
          </div>
        </div>

        <p className="font-medium text-gray-600 text-sm">{label}</p>
      </div>
    );
  }

  function getPhColor(ph) {
    if (ph < 7) return "#ef4444";
    if (ph === 7) return "#22c55e";
    return "#3b82f6";
  }

  function getTemperatureColor(t) {
    if (t <= 20) return "#3b82f6";
    if (t <= 32) return "#f97316";
    return "#ef4444";
  }

  function getTurbidityColor(t) {
    if (t <= 5) return "#22c55e";
    if (t <= 25) return "#f59e0b";
    return "#8b5cf6";
  }

  function getDOColor(doVal) {
    if (doVal >= 6) return "#3b82f6";
    if (doVal >= 3) return "#facc15";
    return "#ef4444";
  }

  return (
    <div className="space-y-10 max-w-6xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#4A37FF] hover:underline text-lg"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 space-y-3">
        <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <MapPin className="text-[#4A37FF]" /> {survey.location?.name}
        </h2>

        <span
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            badgeColor[survey.status]
          }`}
        >
          {survey.status}
        </span>

        <p className="flex items-center gap-2 text-gray-500 text-sm mt-2">
          <Clock size={16} />
          {new Date(survey.timestamps?.serverReceivedTime).toLocaleString()}
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 space-y-5">
        <h3 className="text-2xl font-bold text-[#4A37FF] mb-4">Measurements</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <CircleGauge
            value={survey.measurements?.ph}
            max={14}
            label="pH Level"
            icon={Droplets}
            color={getPhColor(survey.measurements?.ph)}
          />

          <CircleGauge
            value={survey.measurements?.turbidity}
            max={100}
            label="Turbidity"
            icon={Gauge}
            color={getTurbidityColor(survey.measurements?.turbidity)}
          />

          <CircleGauge
            value={survey.measurements?.temperature}
            max={60}
            label="Temperature"
            icon={Thermometer}
            color={getTemperatureColor(survey.measurements?.temperature)}
          />

          <CircleGauge
            value={survey.measurements?.dissolvedOxygen}
            max={14}
            label="Dissolved Oxygen"
            icon={Droplets}
            color={getDOColor(survey.measurements?.dissolvedOxygen)}
          />
        </div>
      </div>

      {survey.photoProof?.url && (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 space-y-4 w-full">
          <h3 className="text-2xl font-bold text-[#4A37FF] flex items-center gap-2">
            <ImageIcon size={24} /> Photo Proof
          </h3>

          <img
            src={survey.photoProof.url || survey.photoProof}
            alt="Survey Proof"
            className="rounded-xl shadow-md border max-w-full"
          />
        </div>
      )}
    </div>
  );
}
