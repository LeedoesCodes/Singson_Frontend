const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export async function getReviews() {
  const response = await fetch(`${API_URL}/reviews`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch reviews");
  return data;
}

export async function submitReview(reviewData) {
  const response = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: getAuthHeaders(), // This includes the Bearer token
    body: JSON.stringify(reviewData),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

export async function getMyReviews() {
  const response = await fetch(`${API_URL}/my-reviews`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch reviews");
  return data;
}
