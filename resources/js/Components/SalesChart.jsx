import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  BarController, // Ajout du contrôleur Bar
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

ChartJS.register(
  BarController, // Enregistrement du contrôleur Bar
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
);

const SalesChart = ({ salesTrend, timeRange }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Supprimer tout graphique existant pour éviter des duplications
      if (chartRef.current._chartInstance) {
        chartRef.current._chartInstance.destroy();
      }

      // Extraction des données pour le graphique
      const data = salesTrend[timeRange] || [];
      const labels = data.map((item) =>
        new Date(item.date).toLocaleDateString("fr-FR", { day: "numeric", month: "numeric" })
      );
      const totals = data.map((item) => item.total);

      // Création du nouveau graphique
      chartRef.current._chartInstance = new ChartJS(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Total des ventes",
              data: totals,
              backgroundColor: "rgba(59, 130, 246, 0.6)", // Couleur primaire DaisyUI
              borderColor: "rgba(59, 130, 246, 1)", // Couleur primaire DaisyUI
              borderWidth: 1,
              hoverBackgroundColor: "rgba(37, 99, 235, 0.8)", // Couleur focus DaisyUI
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.raw || 0;
                  return new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "CDF",
                  }).format(value);
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              ticks: {
                callback: (value) =>
                  new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "CDF",
                  }).format(value),
              },
            },
          },
        },
      });
    }
  }, [salesTrend, timeRange]);

  return (
    <div className="w-full h-96 p-4 bg-base-100 rounded-lg shadow-md">
      {salesTrend[timeRange] && salesTrend[timeRange].length > 0 ? (
        <canvas ref={chartRef}></canvas>
      ) : (
        <div className="text-center text-gray-500">Aucune donnée à afficher</div>
      )}
    </div>
  );
};

export default SalesChart;