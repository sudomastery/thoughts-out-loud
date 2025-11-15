// frontend/src/pages/FeedPage.jsx
import { useState } from "react";
import NewPostForm from "../components/feed/NewPostForm.jsx";
import PostCard from "../components/feed/PostCard.jsx";



// sample data for testing
const initialPosts = [
  {
    id: "1",
    user: { username: "test" },
    body: "This is my first post: #welcome #thoughts",
    createdAt: new Date().toISOString(),
    liked: false,
    likesCount: 2,
  },
  {
    id: "2",
    user: { username: "bob" },
    body: "Krusty Crab #help",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    liked: true,
    likesCount: 5,
  },

   {
    id: "3",
    user: { username: "squidward" },
    body: "Krusty Crab hate #help",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    liked: true,
    likesCount: 5,
  },

   {
    id: "4",
    user: { username: "plankton" },
    body: "Krusty Crab secret recipe #help",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    liked: true,
    likesCount: 5,
  },
];

export default function FeedPage() {
  const [posts, setPosts] = useState(initialPosts);

  const handleCreate = (body) => {
    const newPost = {
      id: String(Date.now()),
      user: { username: "you" },
      body,
      createdAt: new Date().toISOString(),
      liked: false,
      likesCount: 0,
    };
    setPosts((p) => [newPost, ...p]);
  };

  const handleLike = (post) => {
    setPosts((p) =>
      p.map((it) =>
        it.id === post.id
          ? {
              ...it,
              liked: !it.liked,
              likesCount: it.likesCount + (it.liked ? -1 : 1),
            }
          : it
      )
    );
  };

  return (
    <div className="min-h-screen w-full px-4 py-6">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <NewPostForm onSubmit={handleCreate} />
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} />
        ))}
      </div>
    </div>
  );
}