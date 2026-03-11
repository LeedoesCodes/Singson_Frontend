import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../../api/order";
import "./Orders.scss";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getOrders();

      if (result.ok) {
        setOrders(result.data);
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

  const getStatusClass = (status) => {
    if (!status) return "unknown";
    return status.toLowerCase();
  };

  const handleAdvanceStatus = async (order) => {
    let nextStatus = null;

    if (order.status === "pending") {
      nextStatus = "preparing";
    } else if (order.status === "preparing") {
      nextStatus = "completed";
    } else {
      return;
    }

    try {
      setActionLoadingId(order.id);

      const result = await updateOrderStatus(order.id, nextStatus);

      if (result.ok) {
        await fetchOrders();
      } else {
        alert(result.data?.message || "Failed to update order status.");
      }
    } catch (err) {
      console.error("Update order status failed:", err);
      alert("Unable to connect to the server.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getActionButtonLabel = (status) => {
    if (status === "pending") return "Mark as Preparing";
    if (status === "preparing") return "Mark as Completed";
    return null;
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div>
          <h2>Order Management</h2>
          <p className="orders-subtitle">
            View and monitor incoming canteen orders.
          </p>
        </div>

        <button className="refresh-btn" onClick={fetchOrders}>
          Refresh Orders
        </button>
      </div>

      {loading && <p className="orders-message">Loading orders...</p>}

      {error && <p className="orders-error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="orders-message">No orders yet.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-top">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">
                    Created: {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`status-badge ${getStatusClass(order.status)}`}
                >
                  {formatStatus(order.status)}
                </span>
              </div>

              <div className="order-summary">
                <div className="summary-box">
                  <span className="summary-label">Total Amount</span>
                  <span className="summary-value">
                    ₱{Number(order.total_amount).toFixed(2)}
                  </span>
                </div>

                <div className="summary-box">
                  <span className="summary-label">Items Count</span>
                  <span className="summary-value">
                    {order.items ? order.items.length : 0}
                  </span>
                </div>
              </div>

              <div className="order-items-section">
                <h4>Order Items</h4>

                {order.items && order.items.length > 0 ? (
                  <div className="table-wrapper">
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              {item.product?.product_name || "Unknown Product"}
                            </td>
                            <td>{item.quantity}</td>
                            <td>₱{Number(item.price).toFixed(2)}</td>
                            <td>
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
                  <p className="no-items">No items found for this order.</p>
                )}
              </div>

              <div className="order-actions">
                {getActionButtonLabel(order.status) && (
                  <button
                    className="status-action-btn"
                    onClick={() => handleAdvanceStatus(order)}
                    disabled={actionLoadingId === order.id}
                  >
                    {actionLoadingId === order.id
                      ? "Updating..."
                      : getActionButtonLabel(order.status)}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
