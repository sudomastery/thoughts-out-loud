// frontend/src/pages/FeedPage.jsx
import { useState, useEffect } from "react";
import NewPostForm from "../components/feed/NewPostForm.jsx";
import PostCard from "../components/feed/PostCard.jsx";
import { listPosts, createPost, deletePost as apiDeletePost, updatePost } from '../api/posts.js';
import { likePost, unlikePost } from '../api/likes.js';
import { useAuthStore } from '../store/authStore.js';



// We start with an empty list; real posts come from the backend.
// Backend returns objects like { id, content, user_id, created_at }

function mapApiPost(p, currentUserId) {
  return {
    id: String(p.id),
    user: { username: p.username || `user-${p.user_id}` },
    user_id: p.user_id,
    username: p.username,
    body: p.content,
    createdAt: p.created_at,
    liked: !!p.liked,
    likesCount: p.likes_count || 0,
    repliesCount: p.replies_count || 0,
    isOwner: currentUserId === p.user_id,
  edited: !!p.edited,
  };
}

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuthStore();
  const currentUserId = auth.user?.id;

  useEffect(() => {
    async function load() {
      try {
        const data = await listPosts();
        setPosts(data.map(p => mapApiPost(p, currentUserId)));
      } catch (e) {
        setError(e.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUserId]);

  // Listen for comment creation events to update repliesCount without refetch
  useEffect(() => {
    function onCommentCreated(e) {
      const { postId } = e.detail || {};
      if (!postId) return;
      setPosts(prev => prev.map(p => p.id === String(postId) ? { ...p, repliesCount: (p.repliesCount || 0) + 1 } : p));
    }
    window.addEventListener('comment:created', onCommentCreated);
    return () => window.removeEventListener('comment:created', onCommentCreated);
  }, []);

  const handleCreate = async (body) => {
    try {
      const resp = await createPost({ content: body, token: auth.token });
      const apiPost = resp.post; // { id, content, user_id, created_at }
      setPosts(p => [mapApiPost(apiPost, currentUserId), ...p]);
    } catch (e) {
      setError(e.message || 'Failed to create post');
    }
  };

  const handleLike = async (post) => {
    if (!auth.token) return;
    const wasLiked = post.liked;
    // optimistic change
    setPosts(p => p.map(it => it.id === post.id ? { ...it, liked: !wasLiked, likesCount: it.likesCount + (wasLiked ? -1 : 1) } : it));
    try {
      const resp = wasLiked
        ? await unlikePost({ postId: post.id, token: auth.token })
        : await likePost({ postId: post.id, token: auth.token });
      // sync count from server if provided
      if (resp.likes_count !== undefined) {
        setPosts(p => p.map(it => it.id === post.id ? { ...it, likesCount: resp.likes_count } : it));
      }
    } catch (e) {
      // revert on failure
      setPosts(p => p.map(it => it.id === post.id ? { ...it, liked: wasLiked, likesCount: it.likesCount } : it));
      setError(e.message || 'Failed to toggle like');
    }
  };

  const handleDelete = async (post) => {
    // Optimistic remove; if server fails we could roll back (simplified for learning)
    setPosts(p => p.filter(it => it.id !== post.id));
    try {
      await apiDeletePost(post.id, { token: auth.token });
    } catch (e) {
      setError(e.message || 'Delete failed');
    }
  };

  const handleEdit = async (post, newContent) => {
    try {
      const resp = await updatePost(post.id, { content: newContent, token: auth.token });
      const apiPost = resp.post;
      setPosts(p => p.map(it => it.id === post.id ? { ...it, body: apiPost.content, edited: !!apiPost.edited } : it));
    } catch (e) {
      setError(e.message || 'Edit failed');
      throw e;
    }
  };


  return (
    <div className="min-h-screen w-full px-4 py-6">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <NewPostForm onSubmit={handleCreate} />
        {loading && <p className="text-sm text-gray-500">Loading posts...</p>}
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {!loading && posts.length === 0 && !error && (
          <p className="text-sm text-gray-500">No posts yet. Be the first!</p>
        )}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} onDelete={handleDelete} onEdit={handleEdit} />
        ))}
      </div>
    </div>
  );
}