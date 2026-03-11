import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.scss";

const Sidebar = ({ collapsed = false }) => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const role = user?.role;

  const navItems = [
    {
      path: "/dashboard",
      label: "Overview",
      icon: "📊",
      roles: ["admin", "cashier"],
    },
    {
      path: "/products",
      label: "Products",
      icon: "🍔",
      roles: ["admin", "cashier"],
    },
    {
      path: "/orders",
      label: "Orders",
      icon: "📦",
      roles: ["admin", "cashier"],
    },
    { path: "/user", label: "Users", icon: "👥", roles: ["admin"] },
    { path: "/settings", label: "Settings", icon: "⚙️", roles: ["admin"] },
  ];

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">{collapsed ? "AP" : "Admin Panel"}</div>

      <ul className="sidebar-nav">
        {filteredNavItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      {!collapsed && (
        <div className="sidebar-footer">
          <NavLink to="/profile">
            <span>👤</span> Profile
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
