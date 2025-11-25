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
  const effectiveUsername = post.user?.username || post.username || `user-${post.user_id}`;
  const isOwner = currentUser?.username && currentUser.username === effectiveUsername;
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.body);
  const [saving, setSaving] = useState(false);
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
            {effectiveUsername.slice(0, 1).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
            <Link
              to={`/u/${effectiveUsername}`}
              className="font-semibold text-gray-900 dark:text-gray-100 hover:underline"
            >
              {effectiveUsername}
            </Link>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(post.createdAt)}
            </span>
            {post.edited && (
              <span className="text-xs text-gray-500 dark:text-gray-400">(edited)</span>
            )}
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
                {menuOpen && !editing && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 z-50 min-w-28 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl p-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isOwner && (
                      <button
                        type="button"
                        role="menuitem"
                        className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setMenuOpen(false);
                          setEditing(true);
                          setDraft(post.body);
                        }}
                      >
                        Edit
                      </button>
                    )}
                    {/* Edit option removed */}
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
            {editing ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!draft.trim()) return;
                  setSaving(true);
                  try {
                    await onEdit?.(post, draft.trim());
                    setEditing(false);
                  } catch (err) {
                    // could surface error
                  } finally {
                    setSaving(false);
                  }
                }}
                className="space-y-2"
              >
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={saving || !draft.trim()}
                    className="inline-flex items-center rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-gray-700 hover:bg-gray-600 px-3 py-1.5 text-xs font-semibold text-white"
                    onClick={() => { setEditing(false); setDraft(post.body); }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <BodyWithHashtags text={post.body} />
            )}
          </div>
          <PostActions
            liked={post.liked}
            likesCount={post.likesCount}
            repliesCount={post.repliesCount}
            onReply={() => navigate(`/u/${effectiveUsername}/status/${post.id}`)}
            onLikeToggle={() => onLike?.(post)}
            onShare={() => {
              try {
                const url = window.location.origin + "/u/" + effectiveUsername + "/status/" + post.id;
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