// frontend/src/pages/SearchResultsPage.jsx
// PURPOSE: Show full list of users for a given search query (?q=).
// BEGINNER: This page reads the search term from the URL and asks the server for matching users.

import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchUsers } from '../api/users.js';

export default function SearchResultsPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!q) return;
    let active = true;
    async function load() {
      setLoading(true); setError(null);
      try {
        const data = await searchUsers(q);
        if (active) setUsers(data);
      } catch (e) {
        if (active) setError(e.message || 'Search failed');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [q]);

  return (
    <div className="min-h-screen w-full px-4 py-6">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <h1 className="text-xl font-semibold">Search: <span className="text-blue-600 dark:text-blue-400">{q}</span></h1>
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {!loading && !error && users.length === 0 && <p className="text-sm text-gray-500">No users found.</p>}
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {users.map(u => (
            <li key={u.id} className="p-4 flex items-center justify-between bg-white dark:bg-gray-800">
              <div>
                <Link to={`/u/${u.username}`} className="font-medium text-gray-900 dark:text-gray-100 hover:underline">{u.username}</Link>
                <div className="text-xs text-gray-500 dark:text-gray-400">{u.email}</div>
              </div>
              <Link
                to={`/u/${u.username}`}
                className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30"
              >
                View profile
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
