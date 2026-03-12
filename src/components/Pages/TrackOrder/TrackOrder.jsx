import React, { useState } from "react";
import { trackOrder } from "../../../api/order";
import {
  DocumentTextIcon,
  FireIcon,
  CheckCircleIcon,
  CubeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError("Please enter an order number");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);
    setSearched(true);

    try {
      const result = await trackOrder(orderNumber);
      if (result.ok) {
        setOrder(result.data.order);
      } else {
        setError(result.data.message || "Order not found");
      }
    } catch (err) {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = ["pending", "preparing", "ready", "completed"];
    return steps.indexOf(status);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500",
      preparing: "bg-blue-500",
      ready: "bg-green-500",
      completed: "bg-gray-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-300";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-600">
            Enter your order number to see real-time status
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="e.g., ORD-000001"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Track"}
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        {/* Order Details */}
        {searched && !loading && (
          <>
            {order ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Order #{order.order_number}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-white font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Status Timeline */}
                {order.status !== "cancelled" && (
                  <div className="px-6 py-6 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-4">
                      Order Progress
                    </h3>
                    <div className="relative">
                      <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
                      <div
                        className="absolute top-5 left-0 h-1 bg-orange-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${(getStatusStep(order.status) / 3) * 100}%`,
                        }}
                      ></div>
                      <div className="relative flex justify-between">
                        {["pending", "preparing", "ready", "completed"].map(
                          (step, index) => {
                            const isActive =
                              getStatusStep(order.status) >= index;
                            const isCurrent = order.status === step;
                            return (
                              <div
                                key={step}
                                className="flex flex-col items-center"
                              >
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    isActive
                                      ? "bg-orange-500 text-white"
                                      : "bg-gray-200 text-gray-500"
                                  } ${isCurrent ? "ring-4 ring-orange-200" : ""}`}
                                >
                                  {index === 0 && (
                                    <DocumentTextIcon className="w-5 h-5" />
                                  )}
                                  {index === 1 && (
                                    <FireIcon className="w-5 h-5" />
                                  )}
                                  {index === 2 && (
                                    <CheckCircleIcon className="w-5 h-5" />
                                  )}
                                  {index === 3 && (
                                    <CubeIcon className="w-5 h-5" />
                                  )}
                                </div>
                                <span
                                  className={`mt-2 text-xs font-medium ${
                                    isActive
                                      ? "text-orange-600"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {step.charAt(0).toUpperCase() + step.slice(1)}
                                </span>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3">Items</h3>
                  <div className="space-y-3">
                    {order.items &&
                      order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500">
                              x{item.quantity}
                            </span>
                            <span className="text-gray-800">
                              {item.product?.product_name || "Product"}
                            </span>
                          </div>
                          <span className="font-medium">
                            ₱{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="px-6 py-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700">Total</span>
                    <span className="text-xl font-bold text-orange-600">
                      ₱{order.total_amount}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                {order.user && (
                  <div className="px-6 py-4 text-sm text-gray-500 border-t border-gray-200">
                    <p>Order placed by: {order.user.name}</p>
                    <p>Email: {order.user.email}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No order found
                </h3>
                <p className="text-gray-500">
                  We couldn't find an order with that number. Please check and
                  try again.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
