import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title
);

export default function WeeklyChart({ days }) {
  if (!days) return null;

  const data = {
    labels: days.map(d =>
      new Date(d.date).toLocaleDateString("en", { weekday: "short" })
    ),
    datasets: [
      {
        data: days.map(d => d.day.avgtemp_c),
        backgroundColor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          if (value > 30) return "#ef4444";
          if (value > 25) return "#f97316";
          if (value > 20) return "#eab308";
          return "#6366f1";
        },
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.6,
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
          label: (context) => `Avg: ${context.parsed.y}°C`
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
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
        <h3 className="text-lg font-semibold">Weekly Forecast</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          7-day average
        </span>
      </div>
      <div className="h-64 md:h-72">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}