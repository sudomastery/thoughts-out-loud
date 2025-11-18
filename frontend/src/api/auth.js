// frontend/src/api/auth.js
// PURPOSE: Functions for signup and login so pages can call them easily.
// Each returns the server response (user + token).
// BEGINNER: Think of these as buttons wired to the backend. Instead of writing
// fetch code in the component, we keep it here to stay organized.

import { apiRequest } from './client';

export function signup({ username, email, password }) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: { username, email, password },
  });
}

export function login({ email, password }) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}
