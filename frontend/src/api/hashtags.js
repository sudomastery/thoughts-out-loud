const API_BASE_URL = 'http://localhost:5000';

export async function getHashtagPosts(hashtag) {
  const response = await fetch(`${API_BASE_URL}/hashtags/${hashtag}/posts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch hashtag posts');
  }

  return response.json();
}
