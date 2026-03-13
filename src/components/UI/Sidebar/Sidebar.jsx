import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  ChartBarIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  CakeIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ collapsed = false, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const role = user?.role;

  // State to manage expanded sections
  const [expandedMenus, setExpandedMenus] = useState(() => {
    // Auto-expand Inventory if any child is active on initial load
    const shouldExpand =
      location.pathname.startsWith("/inventory") &&
      location.pathname !== "/inventory";
    return { inventory: shouldExpand };
  });

  // Update expansion when location changes (e.g., user navigates directly to child)
  useEffect(() => {
    if (
      location.pathname.startsWith("/inventory") &&
      location.pathname !== "/inventory"
    ) {
      setExpandedMenus((prev) => ({ ...prev, inventory: true }));
    }
  }, [location.pathname]);

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  // Main navigation items (Settings removed)
  const navItems = [
    {
      path: "/dashboard",
      label: "Overview",
      icon: ChartBarIcon,
      roles: ["admin", "cashier"],
    },
    {
      path: "/pos",
      label: "POS",
      icon: ShoppingCartIcon,
      roles: ["admin", "cashier"],
    },
    {
      path: "/orders",
      label: "Orders",
      icon: ClipboardDocumentListIcon,
      roles: ["admin", "cashier"],
    },
    {
      path: "/products",
      label: "Products",
      icon: CakeIcon,
      roles: ["admin", "cashier"],
    },
    {
      path: "/inventory",
      label: "Inventory",
      icon: ArchiveBoxIcon,
      roles: ["admin", "cashier"],
      hasSubmenu: true,
      submenuItems: [
        {
          path: "/inventory/logs",
          label: "Inventory Logs",
          icon: DocumentTextIcon,
        },
        {
          path: "/inventory/low-stock",
          label: "Low Stock Alerts",
          icon: ExclamationTriangleIcon,
        },
      ],
    },
    {
      path: "/reports",
      label: "Reports",
      icon: ChartBarIcon,
      roles: ["admin"],
    },
    {
      path: "/user",
      label: "Users",
      icon: UserGroupIcon,
      roles: ["admin"],
    },
    // Settings item removed
  ];

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isChildActive = (parentPath) => {
    return (
      location.pathname.startsWith(parentPath + "/") &&
      location.pathname !== parentPath
    );
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } flex flex-col z-30 shadow-sm`}
    >
      {/* Sidebar Header with Toggle Button */}
      <div
        className={`flex items-center h-16 px-4 border-b border-gray-200 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {collapsed ? (
          <button
            onClick={onToggle}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Expand sidebar"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        ) : (
          <>
            <span className="text-xl font-bold text-gray-800">
              Canteen System
            </span>
            <button
              onClick={onToggle}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Collapse sidebar"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;

            // For items with submenu
            if (item.hasSubmenu) {
              const isParentActive =
                location.pathname === item.path || isChildActive(item.path);
              const isExpanded = expandedMenus.inventory;

              return (
                <li key={item.path}>
                  <div
                    className={`flex items-center justify-between px-4 py-3 text-sm transition-colors relative ${
                      isParentActive
                        ? "bg-orange-500 text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <NavLink
                      to={item.path}
                      className="flex items-center flex-1"
                      end
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {!collapsed && (
                        <span className="text-sm">{item.label}</span>
                      )}
                    </NavLink>
                    {!collapsed && (
                      <button
                        onClick={() => toggleMenu("inventory")}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {isExpanded ? (
                          <ChevronDownIcon className="w-4 h-4" />
                        ) : (
                          <ChevronRightIcon className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Submenu */}
                  {!collapsed && isExpanded && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {item.submenuItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        return (
                          <li key={subItem.path}>
                            <NavLink
                              to={subItem.path}
                              className={({ isActive }) =>
                                `flex items-center px-4 py-2 text-sm transition-colors ${
                                  isActive
                                    ? "bg-orange-100 text-orange-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`
                              }
                            >
                              <SubIcon className="w-4 h-4 mr-3" />
                              <span>{subItem.label}</span>
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            // Regular items without submenu
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm transition-colors relative ${
                      isActive
                        ? "bg-orange-500 text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <UserIcon className="w-8 h-8 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role || "Role"}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors ${
            collapsed ? "flex-col gap-1" : "gap-2"
          }`}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
