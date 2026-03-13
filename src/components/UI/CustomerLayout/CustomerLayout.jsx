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
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-orange-500 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold hover:text-orange-200">
            🍔 Canteen System
          </Link>

          {user ? (
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-white hover:text-orange-200 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/menu"
                className="text-white hover:text-orange-200 font-medium transition-colors"
              >
                Menu
              </Link>
              <Link
                to="/my-orders"
                className="text-white hover:text-orange-200 font-medium transition-colors"
              >
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-white hover:text-orange-200 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/menu"
                className="text-white hover:text-orange-200 font-medium transition-colors"
              >
                Menu
              </Link>
              <Link
                to="/track"
                className="text-white hover:text-orange-200 font-medium transition-colors"
              >
                Track Order
              </Link>
              <Link
                to="/login"
                className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>

      {/* Simple Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Canteen Management System. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
