import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
      case "/dashboard":
        return "Dashboard Overview";
      case "/products":
        return "Product Management";
      case "/orders":
        return "Orders";
      case "/user":
        return "User Management";
      case "/settings":
        return "Settings";
      default:
        return "Admin Panel";
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <h2>{getPageTitle()}</h2>
      </div>

      <div className="header-right">
        <button onClick={handleLogout} className="logout-btn">
          Log Out
        </button>
      </div>
    </header>
  );
};

export default Header;
