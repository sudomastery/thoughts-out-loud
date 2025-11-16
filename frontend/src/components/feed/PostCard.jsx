// frontend/src/components/feed/PostCard.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore.js";
import PostActions from "./PostActions.jsx";

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

export default function PostCard({ post, onLike, onEdit, onDelete }) {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const isOwner = currentUser?.username && currentUser.username === post.user.username;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick, true);
    return () => document.removeEventListener('mousedown', onDocClick, true);
  }, [menuOpen]);
  return (
  <div className="relative overflow-visible rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl p-5">
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
          <div className="flex items-start justify-between gap-2">
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
            {isOwner && (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  aria-label="Post options"
                  title="Post options"
                  className="h-8 w-8 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-200 hover:text-white hover:bg-gray-700/50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((v) => !v);
                  }}
                >
                  <span aria-hidden className="text-xl leading-none">⋮</span>
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 z-50 min-w-28 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl p-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpen(false);
                        onDelete?.(post);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-2">
            <BodyWithHashtags text={post.body} />
          </div>
          <PostActions
            liked={post.liked}
            likesCount={post.likesCount}
            repliesCount={post.repliesCount}
            onReply={() => navigate(`/u/${post.user.username}/status/${post.id}`)}
            onLikeToggle={() => onLike?.(post)}
            onShare={() => {
              try {
                const url = window.location.origin + "/u/" + post.user.username + "/status/" + post.id;
                if (navigator.share) {
                  navigator.share({ url });
                } else if (navigator.clipboard) {
                  navigator.clipboard.writeText(url);
                }
              } catch {}
            }}
          />
        </div>
      </div>
    </div>
  );
}