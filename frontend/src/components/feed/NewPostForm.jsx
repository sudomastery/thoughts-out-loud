import { useState } from "react";

// Simple avatar fallback using initial
function Avatar({ username }) {
    const initial = (username?.[0] || "?").toUpperCase();
    return (
        <div className="h-10 w-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
            <span className="text-white dark:text-black font-bold">{initial}</span>
        </div>
    );
}

export default function NewPostForm({ onSubmit, currentUser = { username: "you" } }) {
    const [body, setBody] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const max = 280;
    const remaining = max - body.length;
    const canPost = body.trim().length > 0 && remaining >= 0 && !submitting;

    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        if (!canPost) return;
        try {
            setSubmitting(true);
            await onSubmit?.(body.trim());
            setBody("");
        } finally {
            setSubmitting(false);
        }
    };

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

            <form className="relative" onSubmit={handleSubmit}>
                <div className="flex items-start gap-3">
                    <Avatar username={currentUser?.username} />
                    <div className="flex-1">
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="What's on your mind?"
                            rows={3}
                            className="w-full resize-y bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-[15px] leading-6"
                            maxLength={max}
                        />

                        {/* Reply scope hint */}
                        <div className="mt-2 text-sm text-blue-500 dark:text-blue-400 font-medium">
                            Post this to the everyone
                        </div>

                        {/* Actions row (only counter + Post) */}
                        <div className="mt-3 flex items-center justify-end gap-3">
                            <span className={`text-sm ${remaining < 0 ? 'text-red-400' : 'text-gray-400'}`}>{remaining}</span>
                            <button
                                type="submit"
                                disabled={!canPost}
                                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 
                                    ${canPost ? '!bg-blue-600 hover:!bg-blue-700 !text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                            >
                                {submitting ? 'Posting…' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

