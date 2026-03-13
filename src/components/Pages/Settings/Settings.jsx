import React, { useState } from "react";
import {
  BuildingStorefrontIcon,
  ClockIcon,
  BellIcon,
  CurrencyDollarIcon,
  PrinterIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [settings, setSettings] = useState({
    // Store Information
    storeName: "Canteen ni Juan",
    storeEmail: "canteen@school.edu",
    storePhone: "09123456789",
    storeAddress: "University Campus, Manila",

    // Business Hours
    businessHours: {
      monday: { open: "07:00", close: "20:00", closed: false },
      tuesday: { open: "07:00", close: "20:00", closed: false },
      wednesday: { open: "07:00", close: "20:00", closed: false },
      thursday: { open: "07:00", close: "20:00", closed: false },
      friday: { open: "07:00", close: "20:00", closed: false },
      saturday: { open: "08:00", close: "18:00", closed: false },
      sunday: { open: "00:00", close: "00:00", closed: true },
    },

    // Notification Preferences
    notifications: {
      orderAlerts: true,
      lowStockAlerts: true,
      dailyReports: false,
    },

    // System Settings
    lowStockThreshold: 10,
    taxRate: 12,
    autoPrintReceipt: false,
    currency: "PHP",
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }));
  };

  const handleBusinessHourChange = (day, field, value) => {
    setSettings((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Settings saved:", settings);
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const tabs = [
    { id: "general", name: "General", icon: BuildingStorefrontIcon },
    { id: "hours", name: "Business Hours", icon: ClockIcon },
    { id: "notifications", name: "Notifications", icon: BellIcon },
    { id: "system", name: "System", icon: CurrencyDollarIcon },
  ];

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const dayLabels = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="p-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>✓ Settings saved successfully!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-4 px-4" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <form onSubmit={handleSave} className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Store Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) =>
                      handleInputChange("storeName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) =>
                      handleInputChange("storeEmail", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={settings.storePhone}
                    onChange={(e) =>
                      handleInputChange("storePhone", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={settings.storeAddress}
                    onChange={(e) =>
                      handleInputChange("storeAddress", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Business Hours */}
          {activeTab === "hours" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Operating Hours
              </h3>

              <div className="space-y-3">
                {days.map((day, index) => (
                  <div
                    key={day}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-24 font-medium text-gray-700">
                      {dayLabels[index]}
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!settings.businessHours[day].closed}
                        onChange={(e) =>
                          handleBusinessHourChange(
                            day,
                            "closed",
                            !e.target.checked,
                          )
                        }
                        className="w-4 h-4 text-orange-500 rounded"
                      />
                      <span className="text-sm text-gray-600">Open</span>
                    </label>

                    {!settings.businessHours[day].closed && (
                      <>
                        <input
                          type="time"
                          value={settings.businessHours[day].open}
                          onChange={(e) =>
                            handleBusinessHourChange(
                              day,
                              "open",
                              e.target.value,
                            )
                          }
                          className="px-2 py-1 border border-gray-300 rounded"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={settings.businessHours[day].close}
                          onChange={(e) =>
                            handleBusinessHourChange(
                              day,
                              "close",
                              e.target.value,
                            )
                          }
                          className="px-2 py-1 border border-gray-300 rounded"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Notification Preferences
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="orderAlerts"
                    checked={settings.notifications.orderAlerts}
                    onChange={(e) =>
                      handleNotificationChange("orderAlerts", e.target.checked)
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <div>
                    <label
                      htmlFor="orderAlerts"
                      className="font-medium text-gray-700"
                    >
                      Order Alerts
                    </label>
                    <p className="text-sm text-gray-500">
                      Get notified when new orders are placed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="lowStockAlerts"
                    checked={settings.notifications.lowStockAlerts}
                    onChange={(e) =>
                      handleNotificationChange(
                        "lowStockAlerts",
                        e.target.checked,
                      )
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <div>
                    <label
                      htmlFor="lowStockAlerts"
                      className="font-medium text-gray-700"
                    >
                      Low Stock Alerts
                    </label>
                    <p className="text-sm text-gray-500">
                      Receive alerts when items are running low
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="dailyReports"
                    checked={settings.notifications.dailyReports}
                    onChange={(e) =>
                      handleNotificationChange("dailyReports", e.target.checked)
                    }
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <div>
                    <label
                      htmlFor="dailyReports"
                      className="font-medium text-gray-700"
                    >
                      Daily Reports
                    </label>
                    <p className="text-sm text-gray-500">
                      Receive daily sales summary via email
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === "system" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                System Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={settings.lowStockThreshold}
                    onChange={(e) =>
                      handleInputChange(
                        "lowStockThreshold",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Items below this quantity will trigger alerts
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.taxRate}
                    onChange={(e) =>
                      handleInputChange("taxRate", parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) =>
                      handleInputChange("currency", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="PHP">PHP (₱)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Auto-print Receipt
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="autoPrint"
                      checked={settings.autoPrintReceipt}
                      onChange={(e) =>
                        handleInputChange("autoPrintReceipt", e.target.checked)
                      }
                      className="w-4 h-4 text-orange-500 rounded"
                    />
                    <label
                      htmlFor="autoPrint"
                      className="text-sm text-gray-600"
                    >
                      Automatically print receipt after order
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                // Reset to default logic here
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
