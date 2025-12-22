import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Title,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Title
);

export default function HourlyChart({ hours }) {
  if (!hours) return null;

  const data = {
    labels: hours.slice(0, 12).map(h => {
      const time = h.time.split(" ")[1];
      return time.replace(":00", "");
    }),
    datasets: [
      {
        label: "Temperature (°C)",
        data: hours.slice(0, 12).map(h => h.temp_c),
        borderColor: "#8b5cf6",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(139, 92, 246, 0.3)");
          gradient.addColorStop(1, "rgba(139, 92, 246, 0.05)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#ffffff",
        bodyColor: "#e2e8f0",
        borderColor: "#8b5cf6",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.parsed.y}°C`
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
          callback: (value) => `${value}°C`,
        },
      },
    },
  };

  return (
    <div className="glass p-4 md:p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Hourly Forecast</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Next 12 hours
        </span>
      </div>
      <div className="h-64 md:h-72">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}