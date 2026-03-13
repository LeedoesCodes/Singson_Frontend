const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export async function getInventoryLogs(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/inventory/logs${queryString ? `?${queryString}` : ""}`;

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

export async function restockProducts(items, notes = "") {
  const response = await fetch(`${API_URL}/inventory/restock`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ items, notes }),
  });

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function adjustStock(productId, newStock, reason) {
  const response = await fetch(
    `${API_URL}/inventory/products/${productId}/adjust`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ new_stock: newStock, reason }),
    },
  );

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function getLowStockProducts() {
  const response = await fetch(`${API_URL}/inventory/low-stock`, {
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
