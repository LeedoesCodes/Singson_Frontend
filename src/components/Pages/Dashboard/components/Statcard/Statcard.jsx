import React from "react";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid";

const Statcard = ({ title, value, icon, color, trend, trendUp, alert }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    yellow: "bg-yellow-50 text-yellow-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow relative">
      {alert && (
        <span className="absolute top-2 right-2 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trendUp ? "text-green-600" : "text-red-600"
            }`}
          >
            {trendUp ? (
              <ArrowTrendingUpIcon className="w-3 h-3" />
            ) : (
              <ArrowTrendingDownIcon className="w-3 h-3" />
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default Statcard;
