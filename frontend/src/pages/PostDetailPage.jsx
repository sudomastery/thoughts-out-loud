import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/feed/PostCard.jsx";
import CommentComposer from "../components/comments/CommentComposer.jsx";

// Mock get post + comments by id from a feed-like source for MVP
function makeMockPost(id, username) {
  return {
    id,
    user: { username },
    body: "This is a detailed post body with some #hashtag for demo.",
    createdAt: new Date().toISOString(),
    liked: false,
    likesCount: 1,
    repliesCount: 2,
  };
}

export default function PostDetailPage() {
  const { id, username } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(() => makeMockPost(id, username));
  const [comments, setComments] = useState(() => [

    // Dummy data
    { id: "c1", user: { username: "Linus" }, body: "Well thought of", createdAt: new Date().toISOString() },
    { id: "c2", user: { username: "bob" }, body: "I dont really agree ", createdAt: new Date().toISOString() },
  ]);

  const handleLike = (p) => {
    setPost((it) => ({
      ...it,
      liked: !it.liked,
      likesCount: it.likesCount + (it.liked ? -1 : 1),
    }));
  };

  const handleAddComment = (text) => {
    const newComment = {
      id: String(Date.now()),
      user: { username: "you" },
      body: text,
      createdAt: new Date().toISOString(),
    };
    setComments((c) => [newComment, ...c]);
    setPost((p) => ({ ...p, repliesCount: (p.repliesCount || 0) + 1 }));
  };

  return (
    <div className="min-h-screen w-full px-4 py-6">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        {/* Back to feed */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate('/feed')}
            aria-label="Back to feed"
            title="Back to feed"
            className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30"
          >
            Back
          </button>
        </div>

        <PostCard post={post} onLike={handleLike} />

        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl p-5">
          <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Add a reply</h2>
          <CommentComposer onSubmit={handleAddComment} />
        </div>

        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl p-5">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-black dark:bg-white flex items-center justify-center">
                  <span className="text-white dark:text-black text-xs font-bold">{c.user.username[0].toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{c.user.username}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{c.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
