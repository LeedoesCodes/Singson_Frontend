import React from 'react';
import './User.css';

const User = () => {
  // Dummy data for users
  const userData = [
    { id: 'USR-001', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { id: 'USR-002', name: 'Bob Smith', email: 'bob@example.com', role: 'Manager', status: 'Active' },
    { id: 'USR-003', name: 'Charlie Davis', email: 'charlie@example.com', role: 'Staff', status: 'Inactive' },
    { id: 'USR-004', name: 'Diana Prince', email: 'diana@example.com', role: 'Manager', status: 'Active' },
    { id: 'USR-005', name: 'Evan Wright', email: 'evan@example.com', role: 'Staff', status: 'Suspended' },
  ];

  return (
    <div className="user-container">
      <div className="user-header">
        <h3>User Management</h3>
        <button className="add-user-btn">+ Add New User</button>
      </div>

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user) => (
              <tr key={user.id}>
                <td className="fw-bold">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="role-tag">{user.role}</span>
                </td>
                <td>
                  <span className={`user-status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;