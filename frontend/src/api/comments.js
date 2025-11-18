const API_BASE_URL = 'http://localhost:5000';

export async function listComments(postId) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  return response.json();
}

export async function createComment(postId, content, userId) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, user_id: userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create comment');
  }

  return response.json();
}
