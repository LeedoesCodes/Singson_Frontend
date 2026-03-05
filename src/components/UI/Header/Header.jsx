import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/login'); 
  };

  return (
    <header className="topbar">
      <h2>Dashboard Overview</h2>
      <button onClick={handleLogout} className="logout-btn">
        Log Out
      </button>
    </header>
  );
};

export default Header;