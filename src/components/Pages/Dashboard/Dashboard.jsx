import React from "react";
import Statcard from "./components/Statcard/Statcard";
import RecentActivity from "./components/RecentActivity/RecentActivity";
import "./Dashboard.scss";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="stats-grid">
        <Statcard title="Total Orders" value="152" />
        <Statcard title="Active Inventory" value="8,430" />
        <Statcard title="System Alerts" value="0" />
      </div>

      <RecentActivity />
    </div>
  );
};

export default Dashboard;
