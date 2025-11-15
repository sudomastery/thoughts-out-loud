// frontend/src/components/feed/PostCard.jsx
import { Link } from "react-router-dom";

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

// Compact number for counts (e.g., 22000 -> 22K)
function formatCount(n) {
  try {
    return new Intl.NumberFormat('en', { notation: 'compact' }).format(n);
  } catch {
    if (n >= 1000) return Math.round(n / 100) / 10 + 'K';
    return String(n);
  }
}

// Turn #tags into <Link>s, keep other text as plain.
function BodyWithHashtags({ text }) {
  const parts = text.split(/(\#[a-zA-Z0-9_]+)/g);
  return (
    <p className="text-gray-800 dark:text-gray-100 leading-6 whitespace-pre-wrap">
      {parts.map((part, idx) =>
        part.startsWith("#") ? (
          <Link
            key={idx}
            to={`/hashtag/${part.slice(1).toLowerCase()}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {part}
          </Link>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </p>
  );
}

export default function PostCard({ post, onLike }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl p-5">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background:
            "radial-gradient(420px circle at 50% 30%, rgba(255,255,255,0.10), rgba(255,255,255,0.04) 18%, transparent 40%)",
          opacity: 1,
          mixBlendMode: "overlay",
        }}
      />
      <div className="relative flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
          <span className="text-white dark:text-black font-bold">
            {post.user.username.slice(0, 1).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link
              to={`/u/${post.user.username}`}
              className="font-semibold text-gray-900 dark:text-gray-100 hover:underline"
            >
              {post.user.username}
            </Link>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(post.createdAt)}
            </span>
          </div>
          <div className="mt-2">
            <BodyWithHashtags text={post.body} />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => onLike?.(post)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition 
                ${post.liked 
                  ? 'border-gray-300 bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-gray-900/80 dark:text-white' 
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300 dark:hover:bg-gray-900'}`}
              aria-pressed={post.liked}
              aria-label={post.liked ? 'Unlike' : 'Like'}
              title={post.liked ? 'Unlike' : 'Like'}
            >
              {post.liked ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 text-white"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M2.25 9A.75.75 0 013 8.25h4.5A.75.75 0 018.25 9v12a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V9zm6.75 12h7.5a3 3 0 002.829-1.977l1.5-4.5A3 3 0 0018.96 11.25H14.5a1 1 0 01-.965-.741l-.964-3.857-.008-.036a1 1 0 00-1.953.18L9 12v9z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21V9H3v12h5.25zm1.5-9l2-6a2 2 0 013.9.36l.96 3.86h4.46a2.5 2.5 0 012.36 3.3l-1.5 4.5A3.5 3.5 0 0118.75 21H9.75v-9z" />
                </svg>
              )}
              <span className={`text-sm ${post.liked ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                {formatCount(post.likesCount)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}