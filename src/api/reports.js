const API_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export async function getSalesReport(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/reports/sales${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function getBestSellers(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/reports/best-sellers${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function getCategoryBreakdown(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/reports/category-breakdown${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function getOrderTrends(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/reports/trends${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}
