import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getOrders, updateOrderStatus } from "../../../api/order";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [filter, setFilter] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10); // Show 10 orders per page

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getOrders();
      console.log("Orders fetched:", result);

      if (result.ok) {
        setOrders(result.data || []);
        setCurrentPage(1); // Reset to first page on new fetch
      } else {
        setError(result.data?.message || "Failed to fetch orders.");
      }
    } catch (err) {
      console.error("Fetch orders failed:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#fbbf24",
      preparing: "#3b82f6",
      ready: "#10b981",
      completed: "#6b7280",
      cancelled: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  // Optimized status update - updates only the changed order
  const handleAdvanceStatus = async (order) => {
    const statusFlow = {
      pending: "preparing",
      preparing: "ready",
      ready: "completed",
      completed: null,
      cancelled: null,
    };

    const nextStatus = statusFlow[order.status];

    if (!nextStatus) {
      if (order.status === "completed") {
        alert("Order is already completed");
      } else if (order.status === "cancelled") {
        alert("Order is cancelled and cannot be updated");
      }
      return;
    }

    // Optimistically update UI
    const originalOrders = [...orders];
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === order.id ? { ...o, status: nextStatus } : o,
      ),
    );

    try {
      setActionLoadingId(order.id);
      const result = await updateOrderStatus(order.id, nextStatus);

      if (!result.ok) {
        // Revert on error
        setOrders(originalOrders);
        alert(result.data?.message || "Failed to update order status.");
      }
    } catch (err) {
      // Revert on error
      setOrders(originalOrders);
      console.error("Update order status failed:", err);
      alert("Unable to connect to the server.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Optimized manual status change
  const handleManualStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Change order status to ${formatStatus(newStatus)}?`)) {
      return;
    }

    // Find the order being updated
    const order = orders.find((o) => o.id === orderId);
    const originalStatus = order?.status;

    // Optimistically update UI
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o,
      ),
    );

    try {
      setActionLoadingId(orderId);
      const result = await updateOrderStatus(orderId, newStatus);

      if (!result.ok) {
        // Revert on error
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === orderId ? { ...o, status: originalStatus } : o,
          ),
        );
        alert(result.data?.message || "Failed to update status");
      }
    } catch (err) {
      // Revert on error
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === orderId ? { ...o, status: originalStatus } : o,
        ),
      );
      alert("Error updating status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getActionButtonLabel = (status) => {
    const labels = {
      pending: "Mark as Preparing",
      preparing: "Mark as Ready",
      ready: "Mark as Completed",
      completed: null,
      cancelled: null,
    };
    return labels[status] || null;
  };

  // Memoized filtered orders to prevent unnecessary recalculations
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (filter === "all") return true;
      return order.status === filter;
    });
  }, [orders, filter]);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Memoized stats to prevent unnecessary recalculations
  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      ready: orders.filter((o) => o.status === "ready").length,
      completed: orders.filter((o) => o.status === "completed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    }),
    [orders],
  );

  const getStatValueColor = (type) => {
    const colors = {
      pending: "text-amber-500",
      preparing: "text-blue-500",
      ready: "text-green-500",
      completed: "text-gray-500",
      cancelled: "text-red-500",
    };
    return colors[type] || "text-gray-800";
  };

  const getStatusBadgeStyle = (status) => {
    return {
      backgroundColor: getStatusColor(status) + "20",
      color: getStatusColor(status),
    };
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Order Management
          </h1>
          <p className="text-gray-500">
            View and monitor incoming canteen orders.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <span>🔄</span> Refresh Orders
        </button>
      </div>

      {/* Statistics Cards */}
      {!loading && !error && orders.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {/* Total Orders Card */}
          <div
            onClick={() => {
              setFilter("all");
              setCurrentPage(1);
            }}
            className={`bg-white p-5 rounded-xl shadow-sm text-center hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${
              filter === "all" ? "ring-2 ring-orange-500 ring-offset-2" : ""
            }`}
          >
            <span className="block text-sm text-gray-500 mb-2">
              Total Orders
            </span>
            <span className="block text-3xl font-semibold text-gray-800">
              {stats.total}
            </span>
          </div>

          {/* Pending Card */}
          <div
            onClick={() => {
              setFilter("pending");
              setCurrentPage(1);
            }}
            className={`bg-white p-5 rounded-xl shadow-sm text-center hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${
              filter === "pending" ? "ring-2 ring-amber-500 ring-offset-2" : ""
            }`}
          >
            <span className="block text-sm text-gray-500 mb-2">Pending</span>
            <span
              className={`block text-3xl font-semibold ${getStatValueColor("pending")}`}
            >
              {stats.pending}
            </span>
          </div>

          {/* Preparing Card */}
          <div
            onClick={() => {
              setFilter("preparing");
              setCurrentPage(1);
            }}
            className={`bg-white p-5 rounded-xl shadow-sm text-center hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${
              filter === "preparing" ? "ring-2 ring-blue-500 ring-offset-2" : ""
            }`}
          >
            <span className="block text-sm text-gray-500 mb-2">Preparing</span>
            <span
              className={`block text-3xl font-semibold ${getStatValueColor("preparing")}`}
            >
              {stats.preparing}
            </span>
          </div>

          {/* Ready Card */}
          <div
            onClick={() => {
              setFilter("ready");
              setCurrentPage(1);
            }}
            className={`bg-white p-5 rounded-xl shadow-sm text-center hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${
              filter === "ready" ? "ring-2 ring-green-500 ring-offset-2" : ""
            }`}
          >
            <span className="block text-sm text-gray-500 mb-2">Ready</span>
            <span
              className={`block text-3xl font-semibold ${getStatValueColor("ready")}`}
            >
              {stats.ready}
            </span>
          </div>

          {/* Completed Card */}
          <div
            onClick={() => {
              setFilter("completed");
              setCurrentPage(1);
            }}
            className={`bg-white p-5 rounded-xl shadow-sm text-center hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${
              filter === "completed" ? "ring-2 ring-gray-500 ring-offset-2" : ""
            }`}
          >
            <span className="block text-sm text-gray-500 mb-2">Completed</span>
            <span
              className={`block text-3xl font-semibold ${getStatValueColor("completed")}`}
            >
              {stats.completed}
            </span>
          </div>

          {/* Cancelled Card */}
          <div
            onClick={() => {
              setFilter("cancelled");
              setCurrentPage(1);
            }}
            className={`bg-white p-5 rounded-xl shadow-sm text-center hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${
              filter === "cancelled" ? "ring-2 ring-red-500 ring-offset-2" : ""
            }`}
          >
            <span className="block text-sm text-gray-500 mb-2">Cancelled</span>
            <span
              className={`block text-3xl font-semibold ${getStatValueColor("cancelled")}`}
            >
              {stats.cancelled}
            </span>
          </div>
        </div>
      )}

      {/* Filter indicator */}
      {filter !== "all" && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-700">
              Showing:{" "}
              <span className="font-bold text-gray-900">
                {formatStatus(filter)}
              </span>{" "}
              orders
            </span>
            <span className="text-gray-500 text-sm">
              ({filteredOrders.length} total)
            </span>
          </div>
          <button
            onClick={() => {
              setFilter("all");
              setCurrentPage(1);
            }}
            className="text-gray-500 hover:text-red-500 text-sm transition-colors"
          >
            Clear filter ✕
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm">
          Loading orders...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredOrders.length === 0 && (
        <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm">
          {orders.length === 0
            ? "No orders yet."
            : `No ${filter !== "all" ? formatStatus(filter) : ""} orders found.`}
        </div>
      )}

      {/* Orders List */}
      {!loading && !error && filteredOrders.length > 0 && (
        <>
          <div className="space-y-6">
            {currentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Order #{order.order_number || order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(order.created_at).toLocaleString()}
                    </p>
                    {order.user && (
                      <p className="text-sm text-gray-500">
                        Customer: {order.user.name}
                      </p>
                    )}
                  </div>

                  <span
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={getStatusBadgeStyle(order.status)}
                  >
                    {formatStatus(order.status)}
                  </span>
                </div>

                {/* Order Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <span className="block text-xs text-gray-500 mb-1">
                      Total Amount
                    </span>
                    <span className="block text-xl font-semibold text-gray-800">
                      ₱{Number(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs text-gray-500 mb-1">
                      Items Count
                    </span>
                    <span className="block text-xl font-semibold text-gray-800">
                      {order.items ? order.items.length : 0}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="text-base font-semibold text-gray-800 mb-4">
                    Order Items
                  </h4>

                  {order.items && order.items.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full border-collapse text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-3 text-left font-semibold text-gray-600 border-b border-gray-200">
                              Product
                            </th>
                            <th className="p-3 text-left font-semibold text-gray-600 border-b border-gray-200">
                              Quantity
                            </th>
                            <th className="p-3 text-left font-semibold text-gray-600 border-b border-gray-200">
                              Price
                            </th>
                            <th className="p-3 text-left font-semibold text-gray-600 border-b border-gray-200">
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                            >
                              <td className="p-3 text-gray-700">
                                {item.product?.product_name ||
                                  "Unknown Product"}
                              </td>
                              <td className="p-3 text-gray-700">
                                {item.quantity}
                              </td>
                              <td className="p-3 text-gray-700">
                                ₱{Number(item.price).toFixed(2)}
                              </td>
                              <td className="p-3 text-gray-700">
                                ₱
                                {(
                                  Number(item.price) * Number(item.quantity)
                                ).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 p-4 text-center bg-gray-50 rounded-lg">
                      No items found for this order.
                    </p>
                  )}
                </div>

                {/* Order Actions */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-end border-t border-gray-200 pt-6">
                  {getActionButtonLabel(order.status) && (
                    <button
                      className="px-4 py-2 text-white rounded-lg font-medium transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      onClick={() => handleAdvanceStatus(order)}
                      disabled={actionLoadingId === order.id}
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {actionLoadingId === order.id ? (
                        <span className="inline-block animate-spin">⏳</span>
                      ) : (
                        getActionButtonLabel(order.status)
                      )}
                    </button>
                  )}

                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleManualStatusChange(order.id, e.target.value)
                    }
                    disabled={actionLoadingId === order.id}
                    className="px-4 py-2 border border-gray-200 rounded-lg bg-white cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <>
              <div className="flex justify-center items-center gap-4 mt-8 flex-wrap">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm transition-all hover:bg-orange-500 hover:text-white hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-200"
                >
                  ← Previous
                </button>

                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-10 h-10 flex items-center justify-center border border-gray-200 bg-white rounded-lg text-sm transition-all hover:bg-orange-500 hover:text-white hover:border-orange-500 ${
                          currentPage === number
                            ? "bg-orange-500 text-white border-orange-500 font-bold"
                            : ""
                        }`}
                      >
                        {number}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm transition-all hover:bg-orange-500 hover:text-white hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-200"
                >
                  Next →
                </button>
              </div>

              {/* Showing info */}
              <div className="text-center mt-4 text-gray-500 text-sm">
                Showing {indexOfFirstOrder + 1} to{" "}
                {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
                {filteredOrders.length} orders
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
