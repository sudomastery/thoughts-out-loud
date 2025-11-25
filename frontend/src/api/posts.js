// frontend/src/api/posts.js
// PURPOSE: Post-related requests (list, create, get one, update, delete)
// BEGINNER: These are like doors to the server for anything about posts.

import { apiRequest } from './client';

export function listPosts() {
  return apiRequest('/posts');
}

export function createPost({ content, token }) {
  return apiRequest('/posts', {
    method: 'POST',
    body: { content },
    token,
  });
}

export function getPost(id) {
  return apiRequest(`/posts/${id}`);
}

export function updatePost(id, { content, token }) {
  return apiRequest(`/posts/${id}`, {
    method: 'PATCH',
    body: { content },
    token,
  });
}

export function deletePost(id, { token }) {
  return apiRequest(`/posts/${id}`, {
    method: 'DELETE',
    token,
  });
}
