// frontend/src/api/likes.js
// PURPOSE: Hit like/unlike endpoints.
// BEGINNER: These two functions talk to the server to add or remove your like.

import { apiRequest } from './client';

export function likePost({ postId, token }) {
  return apiRequest(`/posts/${postId}/like`, {
    method: 'POST',
    token,
  });
}

export function unlikePost({ postId, token }) {
  return apiRequest(`/posts/${postId}/like`, {
    method: 'DELETE',
    token,
  });
}
