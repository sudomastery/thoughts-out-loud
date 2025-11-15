
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import SignUpPage from './SignupPage.jsx';
import FeedPage from './FeedPage.jsx';
import ProfilePage from './ProfilePage.jsx';
import HashtagPage from './HashtagPage.jsx';
import { useAuthStore } from '../store/authStore.js';

// ProtectedRoute enforces auth by checking for a token.
// If absent, redirect to /login.

function ProtectedRoute({ children }) {
  console.log('AppRouter rendering');
  const token = useAuthStore(s => s.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}


export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected routes */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/u/:username"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hashtag/:name"
        element={
          <ProtectedRoute>
            <HashtagPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback: if authenticated go feed, else login */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Navigate to="/feed" replace />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}