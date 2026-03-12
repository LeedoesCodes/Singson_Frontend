const API_URL = "http://127.0.0.1:8000/api";

// Helper to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export async function getDashboardData() {
  const response = await fetch(`${API_URL}/dashboard`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch dashboard data.");
  }

  // The API returns { success: true, data: { ... } }
  // or maybe just the data directly
  return data.data || data;
}
