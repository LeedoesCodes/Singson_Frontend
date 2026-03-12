import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const CustomerLayout = () => {
  const navigate = useNavigate();

  let user = null;

  try {
    const userData = localStorage.getItem("user");
    user = userData ? JSON.parse(userData) : null;
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/menu");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-orange-500 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <h1 className="text-xl font-bold">🍔 Canteen System</h1>

        {user ? (
          <div className="flex items-center gap-6">
            <Link
              to="/menu"
              className="text-white hover:text-orange-200 font-medium"
            >
              Menu
            </Link>
            <Link
              to="/my-orders"
              className="text-white hover:text-orange-200 font-medium"
            >
              My Orders
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50"
          >
            Login
          </Link>
        )}
      </header>

      {/* Page content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
