// frontend/src/store/authStore.js
import { create } from 'zustand';

// Shape contract:
// state.token: JWT string or null
// state.user: { id, username, email? } or null
// login({ token, user }): sets both
// logout(): clears both
// setUser(patch): shallow merge into existing user (if present)
// isAuthed: derived convenience flag

export const useAuthStore = create((set, get) => ({
  token: null,
  user: null,

  login: ({ token, user }) => {
    // basic validation
    if (!token) throw new Error('Token required for login');
    set({ token, user });
  },

  logout: () => {
    set({ token: null, user: null });
  },

  setUser: (patch) => {
    const current = get().user;
    if (!current) return; // silently ignore if not logged in
    set({ user: { ...current, ...patch } });
  },

  // Derived selector example usage: useAuthStore(s => s.isAuthed)
  isAuthed: () => !!get().token,
}));