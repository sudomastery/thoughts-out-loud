import { updatePost } from '../api/posts.js';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProfileHeader from '../components/user/ProfileHeader.jsx';
import PostCard from '../components/feed/PostCard.jsx';
import { getUserByUsername, getUserPostsByUsername } from '../api/users.js';
import { likePost, unlikePost } from '../api/likes.js';
import { useAuthStore } from '../store/authStore.js';

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

export default function ProfilePage() {
  const { username } = useParams();
  const auth = useAuthStore();
  const currentUserId = auth.user?.id;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const u = await getUserByUsername(username);
        setUser(u);
        const data = await getUserPostsByUsername(username);
        setPosts(data.map(p => mapApiPost(p, currentUserId)));
      } catch (e) {
        setError(e.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [username, currentUserId]);

  const handleLike = async (post) => {
    if (!auth.token) return;
    const wasLiked = post.liked;
    setPosts(p => p.map(it => it.id === post.id ? { ...it, liked: !wasLiked, likesCount: it.likesCount + (wasLiked ? -1 : 1) } : it));
    try {
      const resp = wasLiked
        ? await unlikePost({ postId: post.id, token: auth.token })
        : await likePost({ postId: post.id, token: auth.token });
      if (resp.likes_count !== undefined) {
        setPosts(p => p.map(it => it.id === post.id ? { ...it, likesCount: resp.likes_count } : it));
      }
    } catch (e) {
      setPosts(p => p.map(it => it.id === post.id ? { ...it, liked: wasLiked } : it));
      setError(e.message || 'Failed to toggle like');
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
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <ProfileHeader user={user} />
        {loading && <p className="text-sm text-gray-500">Loading posts...</p>}
        {!loading && posts.length === 0 && !error && (
          <p className="text-sm text-gray-500">No posts yet.</p>
        )}
        {posts.map(post => (
          <PostCard key={post.id} post={post} onLike={handleLike} onEdit={handleEdit} />
        ))}
      </div>
    </div>
  );
}