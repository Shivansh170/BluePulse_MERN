import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";

export default function LiveChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // fallback (only if API fails)
  const fallback = {
    "Yamuna River": { ph: 7.2, turbidity: 12, temperature: 28 },
    "Rithala Lake": { ph: 6.9, turbidity: 8, temperature: 26 },
    "Hauz Khas": { ph: 7.6, turbidity: 5, temperature: 25 },
  };

  useEffect(() => {
    let canceled = false;

    fetch("http://localhost:3000/api/user/results")
      .then((r) => r.json())
      .then((data) => {
        if (canceled) return;
        if (!data.success || !data.waterBodies) throw new Error("API error");

        let bodies = data.waterBodies;
        if (bodies.length > 3) {
          bodies = bodies
            .sort((a, b) => b.totalSurveys - a.totalSurveys)
            .slice(0, 3);
        }
        const formatted = {};
        bodies.forEach((wb) => {
          formatted[wb.name] = {
            ph: wb.avgPH,
            turbidity: wb.avgTurbidity,
            temperature: wb.avgTemperature,
          };
        });

        buildChart(formatted);
      })
      .catch(() => {
        buildChart(fallback);
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });

    return () => (canceled = true);
  }, []);

  function buildChart(data) {
    const labels = Object.keys(data);

    setChartData({
      labels,
      datasets: [
        {
          label: "pH",
          data: labels.map((l) => data[l].ph ?? null),
          backgroundColor: "rgba(34,197,94,0.6)",
          borderColor: "rgba(34,197,94,1)",
          borderWidth: 1,
        },
        {
          label: "Turbidity (NTU)",
          data: labels.map((l) => data[l].turbidity ?? null),
          backgroundColor: "rgba(59,130,246,0.6)",
          borderColor: "rgba(59,130,246,1)",
          borderWidth: 1,
        },
        {
          label: "Temperature (°C)",
          data: labels.map((l) => data[l].temperature ?? null),
          backgroundColor: "rgba(14,165,233,0.6)",
          borderColor: "rgba(14,165,233,1)",
          borderWidth: 1,
        },
      ],
    });
  }

  return (
    <div className="bg-white/5 p-6 rounded-xl shadow-lg h-[400px]">
      {loading && !chartData && (
        <div className="py-10 text-center text-white/70">Loading chart...</div>
      )}

      {chartData && (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: "#fff" },
              },
              x: {
                ticks: { color: "#fff" },
              },
            },
            plugins: {
              legend: {
                labels: { color: "#fff" },
              },
            },
          }}
        />
      )}
    </div>
  );
}
