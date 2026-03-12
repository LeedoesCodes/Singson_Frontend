import React, { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../api/user";
import UserModal from "./UserModal";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const result = await deleteUser(id);
      if (result.ok) {
        alert("User deleted successfully");
        fetchUsers();
      } else {
        alert(result.data.message || "Failed to delete user");
      }
    } catch (err) {
      alert("Error deleting user");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      let result;
      if (editingUser) {
        // For update, only send changed fields
        const payload = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };
        if (formData.password) {
          payload.password = formData.password;
        }
        result = await updateUser(editingUser.id, payload);
      } else {
        result = await createUser(formData);
      }

      if (result.ok) {
        alert(editingUser ? "User updated" : "User created");
        setModalOpen(false);
        fetchUsers();
      } else {
        // Handle validation errors
        const errors = result.data.errors;
        if (errors) {
          const firstError = Object.values(errors)[0][0];
          alert(firstError);
        } else {
          alert(result.data.message || "Operation failed");
        }
      }
    } catch (err) {
      alert("Error saving user");
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "cashier":
        return "bg-blue-100 text-blue-800";
      case "customer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="m-0 text-gray-800 text-xl font-semibold">
          User Management
        </h3>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center gap-2"
        >
          <span>+</span> Add New User
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : error ? (
        <p className="text-red-600 font-medium mt-4">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="p-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-800">
                  Name
                </th>
                <th className="p-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-800">
                  Email
                </th>
                <th className="p-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-800">
                  Role
                </th>
                <th className="p-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-4 border-b border-gray-200 font-medium text-gray-800">
                      {user.name}
                    </td>
                    <td className="p-4 border-b border-gray-200 text-gray-600">
                      {user.email}
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role || "customer"}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                          disabled={user.role === "admin"} // optional: prevent deleting admin
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-600">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        user={editingUser}
      />
    </div>
  );
};

export default User;
