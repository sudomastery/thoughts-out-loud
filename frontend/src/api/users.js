// frontend/src/api/users.js
// PURPOSE: User related API calls (search, fetch one)
// BEGINNER: These functions ask the server for users.

import { apiRequest } from './client';

export function searchUsers(query) {
  const q = encodeURIComponent(query);
  return apiRequest(`/users?q=${q}`);
}

export function getUser(id) {
  return apiRequest(`/users/${id}`);
}

export function getUserByUsername(username) {
  return apiRequest(`/users/username/${encodeURIComponent(username)}`);
}

export function getUserPostsByUsername(username) {
  return apiRequest(`/users/username/${encodeURIComponent(username)}/posts`);
}
