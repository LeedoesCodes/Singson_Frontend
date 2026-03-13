const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export async function getUsers() {
  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch users");
  return data;
}

export async function getUser(id) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch user");
  return data;
}

export async function createUser(userData) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

export async function updateUser(id, userData) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}
