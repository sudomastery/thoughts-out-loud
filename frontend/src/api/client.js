// frontend/src/api/client.js
// PURPOSE: Central helper to call the backend API. It sets the base URL and
// wraps fetch with JSON handling + error normalization, so components stay simple.
// BEGINNER EXPLANATION: Instead of writing fetch("http://localhost:5000/posts")
// everywhere, we create one reusable function that automatically adds the server
// address and turns responses into JavaScript objects.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`; // later when real JWT used

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = null; // non-JSON response
  }

  if (!res.ok) {
    // Normalize error object so UI can show message.
    const message = (data && (data.error || data.message)) || `Request failed (${res.status})`;
    throw { status: res.status, message, raw: data };
  }

  return data;
}

export { apiRequest, BASE_URL };
