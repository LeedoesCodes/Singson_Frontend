import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// UI Components
import Layout from "./components/UI/Layout/Layout";

// Pages
import Dashboard from "./components/Pages/Dashboard/Dashboard";
import Orders from "./components/Pages/Orders/Orders";
import User from "./components/Pages/User/User";
import Settings from "./components/Pages/Settings/Settings";
import Products from "./components/Pages/Products/Products";

// Auth
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";

import Menu from "./components/Pages/Menu/Menu";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Shared routes: admin + cashier */}
            <Route
              element={
                <RoleProtectedRoute allowedRoles={["admin", "cashier"]} />
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/products" element={<Products />} />
            </Route>

            {/* Admin-only routes */}
            <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/user" element={<User />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
