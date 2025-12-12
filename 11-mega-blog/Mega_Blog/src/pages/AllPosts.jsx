import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appWrite/config";

// Clean Blue & White UI for All Posts page
export default function AllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    appwriteService.getPosts({}).then((res) => {
      if (res) setPosts(res.documents);
    });
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <Container>
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900">Latest Posts</h1>
          <p className="text-blue-600 mt-2">
            Explore articles, tutorials, and updates from our creators
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.$id}
              {...post}
              className="bg-white shadow-md border border-blue-100 rounded-2xl p-4 hover:shadow-lg transition-shadow duration-200"
            />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center text-blue-600 mt-10 text-lg">
            No posts found.
          </div>
        )}
      </Container>
    </div>
  );
}
