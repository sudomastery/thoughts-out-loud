// frontend/src/api/hashtags.js
// PURPOSE: Get posts for a hashtag from backend.
// BEGINNER: If user clicks #world we ask server for all posts that have that tag.

import { apiRequest } from './client';

export function getHashtagPosts(name) {
  return apiRequest(`/hashtags/${encodeURIComponent(name)}`);
}
