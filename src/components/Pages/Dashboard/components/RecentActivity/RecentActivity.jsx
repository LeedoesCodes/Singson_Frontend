import React from "react";
import {
  ClockIcon,
  FireIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const RecentActivity = ({ orders = [] }) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending",
        icon: <ClockIcon className="w-4 h-4" />,
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-200",
      },
      preparing: {
        label: "Preparing",
        icon: <FireIcon className="w-4 h-4" />,
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
      },
      ready: {
        label: "Ready",
        icon: <CheckCircleIcon className="w-4 h-4" />,
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        borderColor: "border-green-200",
      },
      completed: {
        label: "Completed",
        icon: <CheckCircleIcon className="w-4 h-4" />,
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        borderColor: "border-gray-200",
      },
      cancelled: {
        label: "Cancelled",
        icon: <XCircleIcon className="w-4 h-4" />,
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        borderColor: "border-red-200",
      },
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Calculate total from recent orders safely
  const calculateTotal = () => {
    if (!orders || orders.length === 0) return 0;
    return orders.reduce((sum, order) => {
      const amount = order?.total_amount || 0;
      return sum + Number(amount);
    }, 0);
  };

  const totalAmount = calculateTotal();

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No Recent Orders
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          Orders will appear here once customers start ordering.
        </p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
        >
          View All Orders
          <ArrowPathIcon className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Orders
            </h3>
            <p className="text-sm text-gray-500">
              Latest {orders.length} orders from customers
            </p>
          </div>
          <Link
            to="/orders"
            className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1"
          >
            View All
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>

      {/* Orders List */}
      <div className="divide-y divide-gray-100">
        {orders.map((order) => {
          const status = getStatusConfig(order.status);
          return (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">
                      #{order.order_number || order.id}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.customer_name || "Customer"}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(order.created_at)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    {order.items_count || 0} items
                  </span>
                  {order.items_count > 0 && (
                    <span className="text-gray-400">•</span>
                  )}
                  {order.items_count > 0 && (
                    <span className="text-gray-600">
                      {order.items
                        ?.slice(0, 2)
                        .map((item) => item.product?.product_name)
                        .join(", ")}
                      {order.items_count > 2 && "..."}
                    </span>
                  )}
                </div>
                <span className="font-bold text-orange-600">
                  ₱{Number(order.total_amount || 0).toFixed(2)}
                </span>
              </div>

              {/* Mini progress bar for pending/preparing orders */}
              {(order.status === "pending" || order.status === "preparing") && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <span>Order Progress</span>
                    <span className="text-orange-500 font-medium">
                      {order.status === "pending" ? "25%" : "50%"}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        order.status === "pending"
                          ? "w-1/4 bg-yellow-500"
                          : "w-1/2 bg-blue-500"
                      } rounded-full transition-all duration-500`}
                    ></div>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer with quick stats */}
      {totalAmount > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total from recent orders:</span>
            <span className="font-bold text-gray-800">
              ₱{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
