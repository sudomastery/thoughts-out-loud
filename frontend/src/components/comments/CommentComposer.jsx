import { useState } from "react";

export default function CommentComposer({ onSubmit, max = 280, autoFocus = false }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const remaining = max - text.length;
  const canPost = text.trim().length > 0 && remaining >= 0 && !loading;

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!canPost) return;
    try {
      setLoading(true);
      await onSubmit?.(text.trim());
      setText("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a reply…"
        rows={2}
        autoFocus={autoFocus}
        maxLength={max}
        className="w-full resize-y bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-[15px] leading-6 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
      />
      <div className="flex items-center justify-end gap-3">
        <span className={`text-sm ${remaining < 0 ? 'text-red-400' : 'text-gray-400'}`}>{remaining}</span>
        <button
          type="submit"
          disabled={!canPost}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 
            ${canPost ? '!bg-blue-600 hover:!bg-blue-700 !text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}`}
        >
          {loading ? 'Replying…' : 'Reply'}
        </button>
      </div>
    </form>
  );
}
