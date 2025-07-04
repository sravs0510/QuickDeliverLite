import React, { useEffect, useState } from "react";
import {
  User,
  Truck,
  PackageSearch,
  ClipboardList,
  CheckCircle,
  BarChart2,
} from "lucide-react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const StatsDashboard = () => {
  const [stats, setStats] = useState({
    totalDrivers: 0,
    totalCustomers: 0,
    activeDeliveries: 0,
    completedDeliveries: 0,
    totalRequests: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const cards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: <User className="h-8 w-8 text-blue-400" />,
      color: "blue",
    },
    {
      title: "Total Drivers",
      value: stats.totalDrivers,
      icon: <Truck className="h-8 w-8 text-green-400" />,
      color: "green",
    },
    {
      title: "Active Deliveries",
      value: stats.activeDeliveries,
      icon: <PackageSearch className="h-8 w-8 text-yellow-400" />,
      color: "yellow",
    },
    {
      title: "Completed Deliveries",
      value: stats.completedDeliveries,
      icon: <CheckCircle className="h-8 w-8 text-indigo-400" />,
      color: "indigo",
    },
    {
      title: "Total Requests",
      value: stats.totalRequests,
      icon: <ClipboardList className="h-8 w-8 text-purple-400" />,
      color: "purple",
    },
  ];

  // Chart Data
  const barChartData = {
    labels: ["Customers", "Drivers", "Active", "Completed", "Requests"],
    datasets: [
      {
        label: "Overview",
        data: [
          stats.totalCustomers,
          stats.totalDrivers,
          stats.activeDeliveries,
          stats.completedDeliveries,
          stats.totalRequests,
        ],
        backgroundColor: [
          "#3b82f6", // blue
          "#22c55e", // green
          "#eab308", // yellow
          "#6366f1", // indigo
          "#a855f7", // purple
        ],
        borderRadius: 8,
      },
    ],
  };

  const doughnutChartData = {
    labels: ["Active", "Completed"],
    datasets: [
      {
        label: "Deliveries",
        data: [stats.activeDeliveries, stats.completedDeliveries],
        backgroundColor: ["#facc15", "#4f46e5"],
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Statistics Overview</h1>
          <p className="text-gray-600">Track system performance at a glance.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-xl shadow-md border-l-4 border-${card.color}-500 flex items-center justify-between transition-transform hover:scale-[1.02]`}
            >
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className={`text-3xl font-bold text-${card.color}-600`}>
                  {card.value}
                </p>
              </div>
              {card.icon}
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <BarChart2 className="h-6 w-6 text-indigo-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Bar Chart Overview</h2>
            </div>
            <Bar data={barChartData} />
          </div>

          {/* Doughnut Chart */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-6 w-6 text-purple-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Deliveries Summary</h2>
            </div>
            <Doughnut data={doughnutChartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
