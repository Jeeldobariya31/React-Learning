import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import appwriteService from "../appWrite/config";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * EditPost Page
 * -----------------------------------
 * - Loads post by DOCUMENT ID
 * - Allows editing ONLY for author
 * - Redirects others to home
 */
export default function EditPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ This is DOCUMENT ID (not slug)
  const { id } = useParams();
  const navigate = useNavigate();

  // Logged-in user
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    let cancelled = false;

    const loadPost = async () => {
      try {
        if (!id) {
          navigate("/");
          return;
        }

        // ✅ Fetch post by ID
        const fetchedPost = await appwriteService.getPostById(id);
        if (!fetchedPost) {
          navigate("/");
          return;
        }

        // ✅ Normalize author field (authorID vs authorId)
        const postAuthorId =
          fetchedPost.authorId || fetchedPost.authorID || null;

        // ✅ Ensure auth is loaded
        if (!userData || !userData.$id) {
          return; // wait for auth
        }

        // 🔐 Ownership check
        if (String(postAuthorId) !== String(userData.$id)) {
          console.warn("🚫 Unauthorized edit attempt");
          navigate("/");
          return;
        }

        if (!cancelled) setPost(fetchedPost);
      } catch (error) {
        console.error("❌ Failed to load post for edit:", error);
        navigate("/");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPost();
    return () => {
      cancelled = true;
    };
  }, [id, navigate, userData]);

  /* =========================
     LOADING STATE
     ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <span className="text-blue-600">Loading editor…</span>
      </div>
    );
  }

  if (!post) return null;

  /* =========================
     RENDER EDIT FORM
     ========================= */
  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <Container>
        <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-blue-100 shadow-md p-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
            Edit Post
          </h1>

          {/* ✅ Pass post data to form */}
          <PostForm post={post} />
        </div>
      </Container>
    </div>
  );
}
