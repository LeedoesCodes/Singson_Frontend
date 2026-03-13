const API_URL = process.env.REACT_APP_API_URL;

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function registerUser({ name, email, password }) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}
