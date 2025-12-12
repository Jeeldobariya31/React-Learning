import React from "react";
import { Container, PostForm } from "../components";

// Blue & White styled AddPost Page
export default function AddPost() {
  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <Container>
        <div className="max-w-7xl h-auto bg-white shadow-md rounded-2xl border border-blue-100 p-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
            Create New Post
          </h1>

          {/* form */}
          <PostForm />
        </div>
      </Container>
    </div>
  );
}
