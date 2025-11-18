const API_BASE_URL = 'http://localhost:5000';

export async function listPosts() {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
}

export async function createPost(content, userId) {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, user_id: userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create post');
  }

  return response.json();
}

export async function getPost(postId) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }

  return response.json();
}

export async function updatePost(postId, content) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update post');
  }

  return response.json();
}

export async function deletePost(postId) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete post');
  }

  return response.json();
}
