import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Droplets,
  Thermometer,
  Gauge,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

// Circle Gauge Component
function CircleGauge({ value, max, label, icon: Icon, color }) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const progress = value / max;
  const offset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow">
      <div className="relative w-24 h-24">
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#ffffff30"
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
          <p className="text-lg font-bold">{value}</p>
        </div>
      </div>

      <p className="font-medium text-white/80 text-sm">{label}</p>
    </div>
  );
}

// Color helpers
function getRiskColor(risk) {
  if (risk === "low") return "text-green-400";
  if (risk === "medium") return "text-yellow-300";
  return "text-red-400";
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

export default function PredictPage() {
  const { name } = useParams();
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const runPredict = async () => {
      try {
        setLoading(true);
        setError("");

        // Get history first
        const historyRes = await fetch(
          `http://localhost:3000/api/user/results/${encodeURIComponent(name)}`
        );
        const historyData = await historyRes.json();

        if (!historyData.success) {
          setError("No historical data found.");
          setLoading(false);
          return;
        }
        // Take last 10 surveys (or fewer)
        const historyArray = historyData.waterBody.surveyHistory
          .slice(-10) // last 10
          .map((s) => ({
            ph: s.measurements.ph,
            turbidity: s.measurements.turbidity,
            temperature: s.measurements.temperature,
            dissolvedOxygen: s.measurements.dissolvedOxygen,
          }));

        // Prepare body
        const body = {
          location: historyData.waterBody.name,
          history: historyArray,
        };

        // Predict call
        const predictRes = await fetch(
          "http://localhost:3000/api/ai/predict-water-quality",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );

        const predictData = await predictRes.json();

        if (predictData.success) {
          setPrediction(predictData.data);
        } else {
          setError("Prediction failed.");
        }
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    runPredict();
  }, [name]);

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-[#071029] to-[#003c5c] py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-8">
          Prediction for <span className="text-cyan-300">{name}</span>
        </h1>

        {loading && (
          <p className="text-center text-white/70 animate-pulse text-lg">
            Predicting…
          </p>
        )}

        {!loading && error && (
          <div className="bg-red-500/10 text-red-300 p-5 border border-red-400/40 rounded-xl max-w-xl mx-auto">
            {error}
          </div>
        )}

        {!loading && prediction && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-xl text-white space-y-10">
            {/* Risk Level */}
            <div className="text-xl font-bold flex items-center gap-3">
              <AlertTriangle
                size={26}
                className={getRiskColor(prediction.risk_level)}
              />
              Risk Level:
              <span className={`ml-1 ${getRiskColor(prediction.risk_level)}`}>
                {prediction.risk_level.toUpperCase()}
              </span>
            </div>

            {/* Gauges */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-cyan-300">
                Predicted Water Quality
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <CircleGauge
                  value={prediction.predicted_ph}
                  max={14}
                  label="pH"
                  icon={Droplets}
                  color={getPhColor(prediction.predicted_ph)}
                />

                <CircleGauge
                  value={prediction.predicted_turbidity}
                  max={100}
                  label="Turbidity"
                  icon={Gauge}
                  color={getTurbidityColor(prediction.predicted_turbidity)}
                />

                <CircleGauge
                  value={prediction.predicted_temperature}
                  max={60}
                  label="Temperature"
                  icon={Thermometer}
                  color={getTemperatureColor(prediction.predicted_temperature)}
                />

                <CircleGauge
                  value={prediction.predicted_dissolvedOxygen}
                  max={14}
                  label="Dissolved Oxygen"
                  icon={Droplets}
                  color={getDOColor(prediction.predicted_dissolvedOxygen)}
                />
              </div>
            </div>

            {/* Trend Summary */}
            <div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300 flex gap-2">
                <TrendingUp /> Trend Summary
              </h3>
              <p className="text-white/80 leading-relaxed">
                {prediction.trend_summary}
              </p>
            </div>

            {/* Forecast */}
            <div>
              <h3 className="text-xl font-bold text-cyan-300 mb-4">
                7-Day Forecast
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {prediction["7_day_forecast"].map((day, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <p className="font-bold text-cyan-300">Day {day.day}</p>
                    <p className="text-white/80 text-sm">pH: {day.ph}</p>
                    <p className="text-white/80 text-sm">
                      Turb: {day.turbidity}
                    </p>
                    <p className="text-white/80 text-sm">
                      Temp: {day.temperature}°C
                    </p>
                    <p className="text-white/80 text-sm">
                      DO: {day.dissolvedOxygen}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
