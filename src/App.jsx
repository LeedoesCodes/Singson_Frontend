import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import Layout from "./components/UI/Layout/Layout";
import CustomerLayout from "./components/UI/CustomerLayout/CustomerLayout";

// Pages
import Landing from "./components/Pages/Landing/Landing";
import Dashboard from "./components/Pages/Dashboard/Dashboard";
import Orders from "./components/Pages/Orders/Orders";
import User from "./components/Pages/User/User";
// Remove Settings import
import Products from "./components/Pages/Products/Products";
import Menu from "./components/Pages/Menu/Menu";
import POSInterface from "./components/Pages/POS/POSInterface";
import Inventory from "./components/Pages/Inventory/Inventory";
import InventoryLogs from "./components/Pages/Inventory/components/InventoryLogs";
import LowStockAlerts from "./components/Pages/Inventory/components/LowStockAlerts";
import TrackOrder from "./components/Pages/TrackOrder/TrackOrder";
import Reports from "./components/Pages/Reports/Reports";
import CustomerOrders from "./components/Pages/CustomerOrders/CustomerOrders";

// Auth
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/track/:orderNumber" element={<TrackOrder />} />

        {/* Customer routes (public menu and protected customer pages) */}
        <Route element={<CustomerLayout />}>
          <Route path="/menu" element={<Menu />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/my-orders" element={<CustomerOrders />} />
          </Route>
        </Route>

        {/* Protected routes (require authentication) */}
        <Route element={<ProtectedRoute />}>
          {/* Admin / Cashier Layout with Sidebar */}
          <Route element={<Layout />}>
            {/* Routes accessible by both admin and cashier */}
            <Route
              element={
                <RoleProtectedRoute allowedRoles={["admin", "cashier"]} />
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/products" element={<Products />} />
              <Route path="/pos" element={<POSInterface />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/logs" element={<InventoryLogs />} />
              <Route path="/inventory/low-stock" element={<LowStockAlerts />} />
            </Route>

            {/* Routes accessible only by admin */}
            <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/user" element={<User />} />
              {/* Remove Settings route */}
              <Route path="/reports" element={<Reports />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback: redirect to home if no match */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
