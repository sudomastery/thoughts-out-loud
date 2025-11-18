// frontend/src/components/layout/SearchBar.jsx
// PURPOSE: Top navigation search input for users.
// BEGINNER: As you type, we wait a short moment (debounce) then ask server for matching users.

import { useState, useEffect, useRef } from 'react';
import { searchUsers } from '../../api/users.js';
import { Link, useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [value, setValue] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const timerRef = useRef();
  const boxRef = useRef();

  useEffect(() => {
    if (!value) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    setError(null);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const data = await searchUsers(value);
        setResults(data);
        setOpen(true);
      } catch (e) {
        setError(e.message || 'Search failed');
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce
    return () => clearTimeout(timerRef.current);
  }, [value]);

  useEffect(() => {
    function onDoc(e) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className="relative w-full max-w-sm" ref={boxRef}>
      <div className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 shadow-sm focus-within:ring-4 focus-within:ring-blue-500/30 transition">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-gray-500 dark:text-gray-400">
          <circle cx="11" cy="11" r="7" />
          <path d="M17 17l4 4" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search users"
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        {value && (
          <button
            type="button"
            onClick={() => { setValue(''); setOpen(false); }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      {open && (
  <div className="absolute left-0 right-0 mt-2 z-50 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
          {loading && <p className="p-3 text-xs text-gray-500">Loading...</p>}
          {error && <p className="p-3 text-xs text-red-600" role="alert">{error}</p>}
          {!loading && !error && results.length === 0 && (
            <p className="p-3 text-xs text-gray-500">No users found</p>
          )}
          {!loading && !error && results.map(u => (
            <Link
              key={u.id}
              to={`/u/${u.username}`}
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              {u.username} <span className="text-gray-400">({u.email})</span>
            </Link>
          ))}
          <button
            type="button"
            onClick={() => navigate(`/search?q=${encodeURIComponent(value)}`)}
            className="w-full text-left px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            View all results →
          </button>
        </div>
      )}
    </div>
  );
}
