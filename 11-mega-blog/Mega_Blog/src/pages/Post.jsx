import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import parse from "html-react-parser";
import { ArrowLeft, User, Calendar, Pencil, Trash2 } from "lucide-react";

import appwriteService from "../appWrite";
import { Button, Container } from "../components";

/* ✅ EMAIL IMPORT */
import { sendArticleDeleteEmail } from "../utils/email";

export default function Post() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  /* ================= LOAD POST ================= */
  useEffect(() => {
    let cancelled = false;

    const loadPost = async () => {
      try {
        if (!slug) return navigate("/");

        const fetchedPost = await appwriteService.getPostBySlug(slug);
        if (!fetchedPost && !cancelled) return navigate("/");

        if (!cancelled) setPost(fetchedPost);
      } catch (err) {
        console.error(err);
        navigate("/");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPost();
    return () => (cancelled = true);
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <span className="text-blue-600">Loading post…</span>
      </div>
    );
  }

  if (!post) return null;

  /* ================= AUTHOR CHECK ================= */
  const isAuthor = (post.authorID || post.authorId) === userData?.$id;

  /* ================= DELETE ================= */
  const deletePost = async () => {
    if (!window.confirm("Delete this post permanently?")) return;

    try {
      await appwriteService.deletePostWithImage(post);

      /* 📧 DELETE EMAIL */
      sendArticleDeleteEmail({
        title: post.title,
        authorName: userData?.name,
        authorEmail: userData?.email,
      }).catch(() => console.warn("Delete email failed"));

      navigate("/");
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  const imageSrc = post.featuredImage
    ? appwriteService.getImageUrl(post.featuredImage)
    : null;

  const formattedDate = new Date(post.$createdAt).toLocaleDateString();

  return (
    <div className="min-h-screen bg-blue-50 py-10">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* TOP BAR */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={18} /> Back
            </Link>

            {isAuthor && (
              <div className="flex gap-2">
                <Link to={`/edit-post/${post.$id}`}>
                  <Button bgColor="bg-white">
                    <Pencil size={16} className="mr-1 text-blue-700" />
                    Edit
                  </Button>
                </Link>
                <Button onClick={deletePost} bgColor="bg-red-500">
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* POST */}
          <article className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
            {imageSrc && (
              <img
                src={imageSrc}
                alt={post.title}
                className="w-full max-h-[520px] object-contain bg-blue-100"
              />
            )}

            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-4">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-blue-500 mb-6">
                <span className="flex items-center gap-1">
                  <User size={16} />
                  {post.authorName || "Author"}
                </span>

                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {formattedDate}
                </span>
              </div>

              <div className="prose max-w-none prose-blue">
                {parse(post.content)}
              </div>

              <div className="mt-10 pt-6 border-t border-blue-100">
                <Link to="/">
                  <Button bgColor="bg-blue-600">← Back to posts</Button>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </Container>
    </div>
  );
}
