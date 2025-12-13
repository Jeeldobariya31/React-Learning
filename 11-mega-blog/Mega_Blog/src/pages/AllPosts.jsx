import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appWrite";

/**
 * AllPosts Page
 * ------------------------------------------------
 * - Fetches all posts from Appwrite
 * - Displays them in a grid
 * - Handles loading & empty states
 */
export default function AllPosts() {
  const [posts, setPosts] = useState([]); // all posts
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    let mounted = true;

    const loadPosts = async () => {
      try {
        /**
         * getPosts() RETURNS AN ARRAY
         * ❌ NOT { documents: [] }
         * ✅ DIRECT ARRAY
         */
        const docs = await appwriteService.getPosts();

        if (mounted) {
          setPosts(docs || []);
        }
      } catch (err) {
        console.error("❌ Failed to load posts:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPosts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <Container>
        {/* HEADER */}
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900">
            Latest Posts
          </h1>
          <p className="text-blue-600 mt-2">
            Explore articles, tutorials, and updates from our creators
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center text-blue-600 text-lg">
            Loading posts…
          </div>
        )}

        {/* POSTS GRID */}
        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.$id}
                {...post}
                className="bg-white shadow-md border border-blue-100 rounded-2xl p-4 hover:shadow-lg transition-shadow"
              />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && posts.length === 0 && (
          <div className="text-center text-blue-600 mt-10 text-lg">
            No posts found.
          </div>
        )}
      </Container>
    </div>
  );
}
