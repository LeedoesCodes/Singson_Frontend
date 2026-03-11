import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.scss";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/");
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          CORE<span className="accent">PANEL</span>
        </div>
        <ul className="sidebar-nav">
          <li className="active">Overview</li>
          <li>Inventory</li>
          <li>Orders</li>
          <li>Customers</li>
          <li>Reports</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <h2>Dashboard Overview</h2>
          <button onClick={handleLogout} className="logout-btn">
            Terminate Session
          </button>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Orders</h4>
              <p className="stat-value">152</p>
            </div>
            <div className="stat-card">
              <h4>Active Inventory</h4>
              <p className="stat-value">8,430</p>
            </div>
            <div className="stat-card alert-card">
              <h4>System Alerts</h4>
              <p className="stat-value">0</p>
            </div>
          </div>

          {/* Main Panel */}
          <div className="main-panel">
            <h3>Recent Activity</h3>
            <div className="activity-placeholder">
              <p>
                Your recent database entries and network activity will appear
                here.
              </p>
              <div className="scanning-line"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
