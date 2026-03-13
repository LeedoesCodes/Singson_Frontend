import React, { useEffect, useState } from "react";
import Statcard from "./components/Statcard/Statcard";
import RecentActivity from "./components/RecentActivity/RecentActivity";
import { getDashboardData } from "../../../api/dashboard";
import {
  ShoppingBagIcon,
  CakeIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  FireIcon,
} from "@heroicons/react/24/solid";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStockItems: 0,
    todaySales: 0,
    weekSales: 0,
    monthSales: 0,
    recentOrders: [],
    orderStatusCounts: {
      pending: 0,
      preparing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("month"); // day, week, month

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardData();
        console.log("Dashboard data:", data);

        setStats({
          totalOrders: data.totalOrders || 0,
          totalProducts: data.totalProducts || 0,
          totalCustomers: data.totalCustomers || 0,
          lowStockItems: data.lowStockItems || 0,
          todaySales: data.todaySales || 0,
          weekSales: data.weekSales || 0,
          monthSales: data.monthSales || 0,
          recentOrders: data.recentOrders || [],
          orderStatusCounts: data.orderStatusCounts || {
            pending: 0,
            preparing: 0,
            ready: 0,
            completed: 0,
            cancelled: 0,
          },
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(
          err.message || "Something went wrong while loading dashboard.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const getSalesForPeriod = () => {
    switch (selectedPeriod) {
      case "day":
        return stats.todaySales;
      case "week":
        return stats.weekSales;
      case "month":
        return stats.monthSales;
      default:
        return stats.monthSales;
    }
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "day":
        return "Today";
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      default:
        return "This Month";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-orange-100">
          Here's what's happening with your canteen today.
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Statcard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingBagIcon className="w-6 h-6" />}
          color="blue"
          trend="+12.5%"
          trendUp={true}
        />
        <Statcard
          title="Total Products"
          value={stats.totalProducts}
          icon={<CakeIcon className="w-6 h-6" />}
          color="green"
        />
        <Statcard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<UserGroupIcon className="w-6 h-6" />}
          color="purple"
        />
        <Statcard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={<ExclamationTriangleIcon className="w-6 h-6" />}
          color="yellow"
          alert={stats.lowStockItems > 0}
        />
      </div>

      {/* Sales Overview with Period Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Sales Overview
            </h2>
            <p className="text-sm text-gray-500">
              Compare your sales performance
            </p>
          </div>
          <div className="flex gap-2 mt-3 sm:mt-0">
            {["day", "week", "month"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {period === "day"
                  ? "Today"
                  : period === "week"
                    ? "Week"
                    : "Month"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {getPeriodLabel()} Sales
                  </p>
                  <p className="text-4xl font-bold text-orange-600">
                    ₱
                    {Number(getSalesForPeriod()).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="bg-orange-500 p-3 rounded-full">
                  <CurrencyDollarIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">+8.2%</span>
                <span className="text-gray-500">vs last {selectedPeriod}</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Daily Average</p>
              <p className="text-xl font-bold text-gray-800">
                ₱{(stats.weekSales / 7).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Best Day</p>
              <p className="text-xl font-bold text-gray-800">Friday</p>
              <p className="text-xs text-green-600">+23% more orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Summary with Progress Bars */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Order Status Overview
            </h2>
            <p className="text-sm text-gray-500">
              Current distribution of orders
            </p>
          </div>
          <ChartBarIcon className="w-6 h-6 text-gray-400" />
        </div>

        <div className="space-y-4">
          {[
            {
              status: "Pending",
              count: stats.orderStatusCounts.pending,
              color: "bg-yellow-500",
              icon: <ClockIcon className="w-4 h-4 text-yellow-500" />,
            },
            {
              status: "Preparing",
              count: stats.orderStatusCounts.preparing,
              color: "bg-blue-500",
              icon: <FireIcon className="w-4 h-4 text-blue-500" />,
            },
            {
              status: "Ready",
              count: stats.orderStatusCounts.ready,
              color: "bg-green-500",
              icon: <CheckCircleIcon className="w-4 h-4 text-green-500" />,
            },
            {
              status: "Completed",
              count: stats.orderStatusCounts.completed,
              color: "bg-gray-500",
              icon: <CheckCircleIcon className="w-4 h-4 text-gray-500" />,
            },
            {
              status: "Cancelled",
              count: stats.orderStatusCounts.cancelled,
              color: "bg-red-500",
              icon: <XCircleIcon className="w-4 h-4 text-red-500" />,
            },
          ].map((item) => {
            const total = Object.values(stats.orderStatusCounts).reduce(
              (a, b) => a + b,
              0,
            );
            const percentage = total > 0 ? (item.count / total) * 100 : 0;

            return (
              <div key={item.status} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="font-medium text-gray-700">
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">
                      {item.count}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Activity
            </h2>
            <p className="text-sm text-gray-500">Latest orders and updates</p>
          </div>
          <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
            View All →
          </button>
        </div>
        <RecentActivity orders={stats.recentOrders} />
      </div>
    </div>
  );
};

export default Dashboard;
