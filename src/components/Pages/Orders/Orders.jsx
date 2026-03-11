import React from 'react';
import './Orders.css';

const Orders = () => {
  // Dummy data to test the UI
  const orderData = [
    { id: 'ORD-1001', customer: 'Alice Johnson', date: '2026-03-01', amount: '$120.50', status: 'Completed' },
    { id: 'ORD-1002', customer: 'Bob Smith', date: '2026-03-02', amount: '$45.00', status: 'Pending' },
    { id: 'ORD-1003', customer: 'Tech Corp', date: '2026-03-03', amount: '$850.00', status: 'Processing' },
    { id: 'ORD-1004', customer: 'Diana Prince', date: '2026-03-04', amount: '$99.99', status: 'Completed' },
    { id: 'ORD-1005', customer: 'Evan Wright', date: '2026-03-05', amount: '$210.00', status: 'Cancelled' },
  ];

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h3>Order Management</h3>
        <button className="new-order-btn">+ Create Order</button>
      </div>

      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orderData.map((order) => (
              <tr key={order.id}>
                <td className="fw-bold">{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>{order.amount}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;