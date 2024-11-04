import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const productNames = [...new Set(products.map((product) => product.name))];
  const quantities = productNames.map((name) =>
    products
      .filter((product) => product.name === name)
      .reduce((total, product) => total + Number(product.quantity), 0)
  );

  const data = {
    labels: productNames,
    datasets: [
      {
        label: "Product Quantity",
        data: quantities,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Products Overview" },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "700px", height: "400px", margin: "auto" }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default Dashboard;
