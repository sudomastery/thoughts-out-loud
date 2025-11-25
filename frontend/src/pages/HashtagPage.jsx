import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHashtagPosts } from '../api/hashtags.js';
import PostCard from '../components/feed/PostCard.jsx';

function mapApiPost(p) {
  return {
    id: String(p.id),
    user: { username: `user-${p.user_id}` },
    body: p.content,
    createdAt: p.created_at,
    liked: false,
    likesCount: 0,
  };
}

export default function HashtagPage() {
  const { name } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getHashtagPosts(name);
        if (!active) return;
        setPosts(data.map(mapApiPost));
      } catch (e) {
        if (active) setError(e.message || 'Failed to load hashtag posts');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [name]);

  return (
    <div className="min-h-screen w-full px-4 py-6">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <h1 className="text-xl font-semibold">#{name}</h1>
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {!loading && posts.length === 0 && !error && (
          <p className="text-sm text-gray-500">No posts for this hashtag yet.</p>
        )}
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}