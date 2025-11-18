import { Link } from 'react-router-dom';

export default function ProfileHeader({ user }) {
    if (!user) return null;
    const initial = user.username?.slice(0,1).toUpperCase() || '?';
    return (
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-xl">
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(600px circle at 30% 30%, rgba(255,255,255,0.12), rgba(255,255,255,0.04) 18%, transparent 40%)',
                    mixBlendMode: 'overlay',
                }}
            />
            <div className="relative flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-black dark:bg-white flex items-center justify-center text-2xl font-bold">
                    <span className="text-white dark:text-black">{initial}</span>
                </div>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user.username}</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    {user.stats && (
                        <div className="mt-3 flex gap-6 text-sm">
                            <div>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{user.stats.posts_count}</span>{' '}
                                <span className="text-gray-500 dark:text-gray-400">Posts</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{user.stats.likes_received}</span>{' '}
                                <span className="text-gray-500 dark:text-gray-400">Likes received</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{user.stats.likes_given_count}</span>{' '}
                                <span className="text-gray-500 dark:text-gray-400">Likes given</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Link
                        to={`/u/${user.username}`}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Permalink
                    </Link>
                </div>
            </div>
        </div>
    );
}
