const API_BASE_URL = 'http://localhost:5000';

export async function likePost(postId, userId) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to like post');
  }

  return response.json();
}

export async function unlikePost(postId, userId) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/unlike`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to unlike post');
  }

  return response.json();
}
