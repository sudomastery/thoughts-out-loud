const API_BASE_URL = 'http://localhost:5000';

export async function searchUsers(query) {
  const response = await fetch(`${API_BASE_URL}/users?search=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to search users');
  }

  return response.json();
}

export async function getUser(userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return response.json();
}
