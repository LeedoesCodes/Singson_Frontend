import React from "react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "Dashboard Overview";
    if (path === "/pos") return "Point of Sale";
    if (path === "/orders") return "Order Management";
    if (path === "/products") return "Product Management";
    if (path === "/inventory") return "Inventory Management";
    if (path === "/inventory/logs") return "Inventory Logs";
    if (path === "/inventory/low-stock") return "Low Stock Alerts";
    if (path === "/reports") return "Sales Reports";
    if (path === "/user") return "User Management";
    if (path === "/settings") return "Settings";
    return "Admin Panel";
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="header-left">
        <h2 className="text-xl font-semibold text-gray-800">
          {getPageTitle()}
        </h2>
      </div>
      <div className="header-right">
        {/* Logout button removed as requested */}
      </div>
    </header>
  );
};

export default Header;
