// frontend/src/components/layout/NavBar.jsx
// PURPOSE: Top navigation bar with brand, search, and account shortcut.
// BEGINNER: This bar appears on every page (when logged in) giving quick access.

import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar.jsx';
import { useAuthStore } from '../../store/authStore.js';

export default function NavBar() {
	const user = useAuthStore(s => s.user);
	const logout = useAuthStore(s => s.logout);
	const location = useLocation();
	const showSearch = location.pathname.startsWith('/feed') || location.pathname.startsWith('/hashtag') || location.pathname.startsWith('/search');
	return (
		<header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-40">
			<div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
				<Link to="/feed" className="inline-flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-gray-100">
					<div className="h-8 w-8 rounded-full bg-black dark:bg-white flex items-center justify-center">
						<span className="text-white dark:text-black text-sm font-bold">T</span>
					</div>
					Thoughts
				</Link>
				<div className="flex-1">
					{showSearch && <SearchBar />}
				</div>
				{user && (
					<div className="flex items-center gap-2">
						<Link
							to={`/u/${user.username}`}
							className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:underline"
						>
							{user.username}
						</Link>
						<button
							type="button"
							onClick={logout}
							className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30"
						>
							Sign out
						</button>
					</div>
				)}
			</div>
		</header>
	);
}
