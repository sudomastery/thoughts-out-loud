// frontend/src/components/layout/NavBar.jsx
// PURPOSE: Top navigation bar with brand, search, and account shortcut.
// BEGINNER: This bar appears on every page (when logged in) giving quick access.



import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { Button } from 'flowbite-react';

const navItems = [
	{
		name: 'Home',
		to: '/feed',
		icon: (
			<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-2xl"><path d="M3 9.5L12 4l9 5.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/></svg>
		),
	},
	{
		name: 'Profile',
		to: '/profile',
		icon: (
			<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-2xl"><circle cx="12" cy="8" r="4"/><path d="M2 20c0-4 4-7 10-7s10 3 10 7"/></svg>
		),
	},
];

export default function NavBar() {
	const user = useAuthStore(s => s.user);
	const navItems = [
		{
			name: 'Home',
			to: '/feed',
			icon: (
				<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-2xl"><path d="M3 9.5L12 4l9 5.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/></svg>
			),
		},
		{
			name: 'Profile',
			to: user ? `/u/${user.username}` : '/profile',
			icon: (
				<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-2xl"><circle cx="12" cy="8" r="4"/><path d="M2 20c0-4 4-7 10-7s10 3 10 7"/></svg>
			),
		},
	];
	return (
		<nav className="fixed left-0 top-0 h-screen w-[20vw] min-w-[180px] max-w-[300px] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center py-12 px-2 border-r border-gray-800 z-50 shadow-xl">
			<div className="mb-10 flex flex-col items-center w-full">
				<div className="flex flex-col items-center w-full">
					<div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow mb-2">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 4l9 5.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/></svg>
					</div>
					<span className="font-bold text-3xl tracking-tight text-white">Thoughts</span>
				</div>
				<div className="flex flex-col gap-4 w-full items-center mt-8">
					{navItems.map((item, idx) => (
						<Link
							key={item.name}
							to={item.to}
							className={`flex items-center gap-4 px-8 py-4 rounded-full hover:bg-gray-700 transition text-xl font-semibold w-4/5 justify-start ${idx === 0 ? 'mt-2' : ''}`}
							style={{ color: 'white' }}
						>
							{item.icon}
							{item.name}
						</Link>
					))}
				</div>
			</div>
			{user && (
				<div className="mt-auto mb-8 flex flex-col items-center w-full">
					<div className="text-sm text-blue-400 mb-1">Logged in as</div>
					<div className="font-semibold text-xl mb-3 text-white">{user.username}</div>
					<Button
						color="blue"
						size="lg"
						className="w-40"
						onClick={useAuthStore.getState().logout}
					>
						Sign out
					</Button>
				</div>
			)}
		</nav>
	);
}
