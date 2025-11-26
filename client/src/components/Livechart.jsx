import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";

export default function LiveChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch("/api/chart-data")
      .then((res) => res.json())
      .then((data) => {
        const labels = Object.keys(data);

        setChartData({
          labels,
          datasets: [
            {
              label: "pH Level",
              data: labels.map((loc) => data[loc].ph),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Turbidity",
              data: labels.map((loc) => data[loc].turbidity),
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
            },
            {
              label: "Temperature",
              data: labels.map((loc) => data[loc].temperature),
              backgroundColor: "rgba(255, 159, 64, 0.2)",
              borderColor: "rgba(255, 159, 64, 1)",
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((err) => console.error("Chart fetch error:", err));
  }, []);

  return (
    <div className="relative bg-black/70 w-[80%] mx-auto mt-10 rounded-xl p-6">
      <div className="absolute top-5 left-5 bg-red-600 text-white px-3 py-1 rounded-md font-playwrite">
        Live
      </div>

      {chartData ? (
        <Bar data={chartData} />
      ) : (
        <p className="text-center text-white">Loading chart...</p>
      )}
    </div>
  );
}
