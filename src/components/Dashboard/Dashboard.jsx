import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      

      <aside className="sidebar">
        <div className="sidebar-header">
          Admin Panel
        </div>
        <ul className="sidebar-nav">
          <li className="active">Overview</li>
          <li>Inventory</li>
          <li>Orders</li>
          <li>Customers</li>
          <li>Reports</li>
        </ul>
      </aside>

    
      <main className="main-content">
        
 
        <header className="topbar">
          <h2>Dashboard Overview</h2>
          <button onClick={handleLogout} className="logout-btn">
            Log Out
          </button>
        </header>

      
        <div className="content-area">
          
     
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Orders</h4>
              <p>152</p>
            </div>
            <div className="stat-card">
              <h4>Active Inventory</h4>
              <p>8,430</p>
            </div>
            <div className="stat-card">
              <h4>System Alerts</h4>
              <p>0</p>
            </div>
          </div>

         
          <div className="main-panel">
            <h3>Recent Activity</h3>
            <p style={{ marginTop: '1rem', color: '#666' }}>
              Your recent database entries and activity will appear here.
            </p>
          </div>
          
        </div>
      </main>
      
    </div>
  );
};

export default Dashboard;