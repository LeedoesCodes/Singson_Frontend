const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const getAuthHeaderOnly = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch products");
  return data;
}

export async function getProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch product");
  return data;
}

export async function createProduct(formData) {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...getAuthHeaderOnly(),
    },
    body: formData,
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

export async function updateProduct(id, formData) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT", // Changed from POST to PUT
    headers: {
      Accept: "application/json",
      ...getAuthHeaderOnly(),
    },
    body: formData,
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}
