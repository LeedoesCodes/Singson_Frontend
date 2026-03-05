import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- Import UI Components ---
import Layout from './components/UI/Layout/Layout';

// --- Import Pages ---
import Dashboard from './components/Pages/Dashboard/Dashboard';
import Orders from './components/Pages/Orders/Orders';
import User from './components/Pages/User/User';
import Settings from './components/Pages/Settings/Settings';

// --- Import Auth ---
// Assuming you have a basic Login component inside the Login folder
import Login from './components/Login/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        
        <Route path="/login" element={<Login />} />

        
        <Route element={<Layout />}>
        
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/user" element={<User />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;