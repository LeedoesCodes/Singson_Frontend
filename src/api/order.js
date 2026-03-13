const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Helper to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export async function placeOrder(cartItems) {
  const payload = {
    items: cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    })),
  };

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function getOrders() {
  const response = await fetch(`${API_URL}/orders`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  // Handle both response formats:
  // 1. Direct array: [...]
  // 2. Wrapped object: { orders: [...] }
  let orders = data;
  if (data && data.orders !== undefined) {
    orders = data.orders;
  }

  return {
    ok: response.ok,
    status: response.status,
    data: orders,
  };
}

export async function updateOrderStatus(orderId, status) {
  const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function getOrder(orderId) {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
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
export async function trackOrder(orderNumber) {
  const response = await fetch(`${API_URL}/orders/track/${orderNumber}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}
