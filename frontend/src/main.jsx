import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import AppRouter from './pages/router.jsx';
import NavBar from './components/layout/NavBar.jsx';
import { useAuthStore } from './store/authStore.js';

function Root() {
  const token = useAuthStore(s => s.token);
  return (
    <BrowserRouter>
      {token && <NavBar />}
      <AppRouter />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);