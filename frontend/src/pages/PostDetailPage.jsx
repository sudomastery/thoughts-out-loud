import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/feed/PostCard.jsx";
import CommentComposer from "../components/comments/CommentComposer.jsx";
import { getPost } from "../api/posts.js";
import { listComments, createComment } from "../api/comments.js";
import { useAuthStore } from "../store/authStore.js";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuthStore();

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const data = await getPost(id);
        if (ignore) return;
        setPost({
          id: String(data.id),
          user: { username: data.username || `user-${data.user_id}` },
          body: data.content,
          createdAt: data.created_at,
          liked: false,
          likesCount: 0,
          repliesCount: 0,
        });
        // Load comments
        const cData = await listComments(id);
        if (!ignore) {
          setComments(cData.map(c => ({
            id: String(c.id),
            user: { username: c.username || `user-${c.user_id}` },
            body: c.content,
            createdAt: c.created_at,
          })));
          setPost(p => p ? { ...p, repliesCount: cData.length } : p);
        }
      } catch (e) {
        if (!ignore) setError(e.message || 'Failed to load post');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [id]);

  const handleLike = () => {
    setPost((it) => it ? {
      ...it,
      liked: !it.liked,
      likesCount: it.likesCount + (it.liked ? -1 : 1),
    } : it);
  };

  const handleAddComment = async (text) => {
    if (!auth.token) return; // require login
    try {
      const resp = await createComment({ postId: id, content: text, token: auth.token });
      const c = resp.comment;
      const newComment = {
        id: String(c.id),
        user: { username: c.username || `user-${c.user_id}` },
        body: c.content,
        createdAt: c.created_at,
      };
      setComments((prev) => [newComment, ...prev]);
      setPost(p => p ? { ...p, repliesCount: (p.repliesCount || 0) + 1 } : p);
      try {
        window.dispatchEvent(new CustomEvent('comment:created', { detail: { postId: id } }));
      } catch {}
    } catch (e) {
      setError(e.message || 'Failed to add comment');
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-6">
      <div className="mx-auto w-full max-w-2xl space-y-4">
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

        {loading && <p className="text-sm text-gray-500">Loading post…</p>}
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {post && <PostCard post={post} onLike={handleLike} />}

        {post && auth.token && (
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl p-5">
            <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Add a reply</h2>
            <CommentComposer onSubmit={handleAddComment} />
          </div>
        )}

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
          {!loading && comments.length === 0 && !error && (
            <p className="text-sm text-gray-500">No replies yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
}
