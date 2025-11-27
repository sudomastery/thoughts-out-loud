// frontend/src/components/feed/PostActions.jsx
import React from "react";

// Compact number for counts (e.g., 22000 -> 22K)
function formatCount(n) {
  const num = typeof n === "number" ? n : 0;
  try {
    return new Intl.NumberFormat("en", { notation: "compact" }).format(num);
  } catch {
    if (num >= 1000) return Math.round(num / 100) / 10 + "K";
    return String(num);
  }
}

export default function PostActions({
  liked = false,
  likesCount = 0,
  repliesCount = 0,
  onReply,
  onLikeToggle,
  onShare,
}) {
  return (
    <div className="mt-3 flex items-center gap-6">
      {/* Comment */}
      <button
        type="button"
        onClick={onReply}
        className="group inline-flex items-center gap-1 rounded-md bg-transparent p-1 transition"
        aria-label="Comment"
        title="Comment"
      >
        {/* chat bubble icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5 text-gray-400 group-hover:text-gray-200"
          aria-hidden="true"
        >
          <path d="M7 8.25h10M7 12h6" />
          <path d="M21 12a8.25 8.25 0 11-4.75-7.5L21 4.5v7.5z" />
        </svg>
        <span className="ml-1 text-[13px] text-gray-400 group-hover:text-gray-200">
          {formatCount(repliesCount)}
        </span>
      </button>

      {/* Like */}
      <button
        type="button"
        onClick={onLikeToggle}
        className="group inline-flex items-center gap-1 rounded-md bg-transparent p-1 transition"
        aria-pressed={liked}
        aria-label={liked ? "Unlike" : "Like"}
        title={liked ? "Unlike" : "Like"}
      >
        {liked ? (
          // Solid heart for liked
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 text-white"
            aria-hidden="true"
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.017C4.688 15.36 2.25 12.462 2.25 9.348 2.25 7.12 4.057 5.25 6.318 5.25c1.329 0 2.623.58 3.477 1.545l.705.797.705-.797a4.6 4.6 0 013.477-1.545c2.261 0 4.068 1.87 4.068 4.098 0 3.114-2.438 6.012-4.739 8.312a25.175 25.175 0 01-4.244 3.017 15.247 15.247 0 01-.383.218l-.022.012-.007.003a.75.75 0 01-.659 0z" />
          </svg>
        ) : (
          // Outline heart for unliked
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5 text-gray-400 group-hover:text-gray-200"
            aria-hidden="true"
          >
            <path d="M21 8.25c0 3.114-2.438 6.012-4.739 8.312a25.175 25.175 0 01-4.244 3.017 15.247 15.247 0 01-.383.218l-.022.012-.007.003-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.017C5.438 14.262 3 11.364 3 8.25 3 6.021 4.807 4.151 7.068 4.151c1.329 0 2.623.58 3.477 1.545l.705.797.705-.797a4.6 4.6 0 013.477-1.545C19.193 4.151 21 6.021 21 8.25z" />
          </svg>
        )}
        <span className={`ml-1 text-[13px] ${liked ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
          {formatCount(likesCount)}
        </span>
      </button>

      {/* Share */}
      <button
        type="button"
        onClick={onShare}
        className="group inline-flex items-center gap-1 rounded-md bg-transparent p-1 transition"
        aria-label="Share"
        title="Share"
      >
        {/* share arrow icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5 text-gray-400 group-hover:text-gray-200"
          aria-hidden="true"
        >
          <path d="M7 8.5V7a4 4 0 014-4h2a4 4 0 014 4v1.5" />
          <path d="M12 14V4.5" />
          <path d="M8.5 11L12 7.5 15.5 11" />
          <rect x="4" y="11" width="16" height="9" rx="2" />
        </svg>
      </button>
    </div>
  );
}