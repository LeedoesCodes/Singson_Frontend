import React from "react";

const RecentActivity = ({ orders = [] }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>

      {orders.length === 0 ? (
        <p className="text-gray-500 mt-2">No recent orders found.</p>
      ) : (
        <div className="flex flex-col gap-3 mt-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-1"
            >
              <div>
                <strong>Order #{order.id}</strong>
              </div>
              <div>Status: {order.status}</div>
              <div>Total: ₱{Number(order.total_amount).toFixed(2)}</div>
              <div>Date: {new Date(order.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
