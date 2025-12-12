import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import appwriteService from "../appWrite/config";
import { useNavigate, useParams } from "react-router-dom";

// Styled EditPost page (Blue & White theme)
export default function EditPost() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) setPost(post);
        else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

  return post ? (
    <div className="min-h-screen bg-blue-50 py-12">
      <Container>
        <div className="max-w-full mx-auto bg-white rounded-2xl border border-blue-100 shadow-md py-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Edit Post</h1>
          <PostForm post={post} />
        </div>
      </Container>
    </div>
  ) : null;
}
