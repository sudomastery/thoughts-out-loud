// frontend/src/api/comments.js
// API helpers for post comments
import { apiRequest } from './client';

export function listComments(postId) {
  return apiRequest(`/posts/${postId}/comments`);
}

export function createComment({ postId, content, token }) {
  return apiRequest(`/posts/${postId}/comments`, {
    method: 'POST',
    body: { content },
    token,
  });
}
