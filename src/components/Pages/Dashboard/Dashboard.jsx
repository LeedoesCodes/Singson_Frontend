import React, { useEffect, useState } from "react";
import Statcard from "./components/Statcard/Statcard";
import RecentActivity from "./components/RecentActivity/RecentActivity";
import { getDashboardData } from "../../../api/dashboard";

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

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardData();
        console.log("Dashboard data:", data); // Debug log

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

  if (loading) {
    return <p className="p-4">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Statcard
          title="Total Orders"
          value={stats.totalOrders}
          icon="📦"
          color="blue"
        />
        <Statcard
          title="Total Products"
          value={stats.totalProducts}
          icon="🍔"
          color="green"
        />
        <Statcard
          title="Total Customers"
          value={stats.totalCustomers}
          icon="👥"
          color="purple"
        />
        <Statcard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon="⚠️"
          color="yellow"
        />
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">
            Today's Sales
          </h3>
          <p className="text-3xl font-bold text-orange-500">
            ₱{Number(stats.todaySales).toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">
            This Week
          </h3>
          <p className="text-3xl font-bold text-orange-500">
            ₱{Number(stats.weekSales).toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">
            This Month
          </h3>
          <p className="text-3xl font-bold text-orange-500">
            ₱{Number(stats.monthSales).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Order Status Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Order Status Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {stats.orderStatusCounts.pending}
            </div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {stats.orderStatusCounts.preparing}
            </div>
            <div className="text-sm text-gray-500">Preparing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {stats.orderStatusCounts.ready}
            </div>
            <div className="text-sm text-gray-500">Ready</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-500">
              {stats.orderStatusCounts.completed}
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {stats.orderStatusCounts.cancelled}
            </div>
            <div className="text-sm text-gray-500">Cancelled</div>
          </div>
        </div>
      </div>

      <RecentActivity orders={stats.recentOrders} />
    </div>
  );
};

export default Dashboard;
