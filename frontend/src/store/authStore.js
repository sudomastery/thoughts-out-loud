// frontend/src/store/authStore.js
import { create } from 'zustand';

// Persistence keys
const TOKEN_KEY = 'tol_token';
const USER_KEY = 'tol_user';

function loadPersisted() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);
    const user = rawUser ? JSON.parse(rawUser) : null;
    if (token && user) return { token, user };
    return { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

// Shape contract:
// state.token: JWT string or null
// state.user: { id, username, email? } or null
// login({ token, user }): sets both
// logout(): clears both
// setUser(patch): shallow merge into existing user (if present)
// isAuthed: derived convenience flag

export const useAuthStore = create((set, get) => ({
  ...loadPersisted(),

  login: ({ token, user }) => {
    if (!token) throw new Error('Token required for login');
    set({ token, user });
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {}
  },

  logout: () => {
    set({ token: null, user: null });
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
  },

  setUser: (patch) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...patch };
    set({ user: updated });
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
    } catch {}
  },

  // Derived selector example usage: useAuthStore(s => s.isAuthed)
  isAuthed: () => !!get().token,
}));