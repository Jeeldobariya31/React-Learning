import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appWrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

/**
 * Post view — resolves author name by authorId (fetches user from Appwrite)
 *
 * Notes:
 * - For best results add a `getUserById(userId)` helper to your appwriteService that
 *   returns the public user document (name, avatar, etc.) from your users collection.
 * - If your frontend Appwrite client supports `client.users.get(userId)` this will
 *   try that too (may be blocked depending on Appwrite permissions).
 */

export default function Post() {
  const [post, setPost] = useState(null);
  const [authorName, setAuthorName] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const isAuthor =
    post && userData
      ? String(post.authorId) === String(userData?.prefs?.authorId)
      : false;

  useEffect(() => {
    if (!slug) {
      navigate("/");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const p = await appwriteService.getPost(slug);
        if (cancelled) return;
        if (!p) {
          navigate("/");
          return;
        }
        setPost(p);
      } catch (err) {
        console.error("Failed loading post:", err);
        navigate("/");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, navigate]);

  // Resolve author info AFTER post loads.
  useEffect(() => {
    if (!post) return;
    let cancelled = false;

    const getFromGetUserById = async (id) => {
      try {
        if (typeof appwriteService.getUserById === "function") {
          return await appwriteService.getUserById(id);
        }
      } catch (e) {
        console.warn("getUserById failed:", e);
      }
      return null;
    };

    const getFromClientUsers = async (id) => {
      try {
        // Some wrappers expose client and Users API (may not be allowed from browser)
        if (appwriteService.client && appwriteService.client.users && typeof appwriteService.client.users.get === "function") {
          return await appwriteService.client.users.get(id);
        }
      } catch (e) {
        console.warn("client.users.get failed:", e);
      }
      return null;
    };

    const getFromDatabasesDoc = async (id) => {
      try {
        // If you keep user profiles in a database collection and exposed client.databases
        const DATABASE_ID = appwriteService.databaseId || appwriteService.DATABASE_ID || process.env.REACT_APP_APPWRITE_DATABASE_ID;
        const USERS_COLLECTION_ID = appwriteService.usersCollectionId || appwriteService.USERS_COLLECTION_ID || process.env.REACT_APP_USERS_COLLECTION_ID;
        if (appwriteService.client && appwriteService.client.databases && DATABASE_ID && USERS_COLLECTION_ID) {
          const doc = await appwriteService.client.databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, id);
          return doc;
        }
      } catch (e) {
        console.warn("databases.getDocument failed:", e);
      }
      return null;
    };

    const resolveAuthor = async () => {
      const authorId = post.authorId ?? post.author ?? null;

      // If post has authorName embedded already, use it and skip lookups
      if (post.authorName && typeof post.authorName === "string") {
        setAuthorName(post.authorName);
        setAuthorAvatar(post.authorAvatar || post.authorImage || null);
        return;
      }

      if (!authorId) {
        setAuthorName("");
        setAuthorAvatar(null);
        return;
      }

      // Try helpers in order of preference
      try {
        // 1) Preferred: appwriteService.getUserById (your wrapper should implement this to call DB doc)
        const userDoc = await getFromGetUserById(authorId);
        if (userDoc && !cancelled) {
          const mapped = mapUserToProfile(userDoc);
          setAuthorName(mapped.name);
          setAuthorAvatar(mapped.avatar);
          return;
        }

        // 2) Try client.users.get (admin API — may fail on client)
        const clientUser = await getFromClientUsers(authorId);
        if (clientUser && !cancelled) {
          const mapped = mapUserToProfile(clientUser);
          setAuthorName(mapped.name);
          setAuthorAvatar(mapped.avatar);
          return;
        }

        // 3) Try reading from a public users DB collection (databases.getDocument)
        const dbUser = await getFromDatabasesDoc(authorId);
        if (dbUser && !cancelled) {
          const mapped = mapUserToProfile(dbUser);
          setAuthorName(mapped.name);
          setAuthorAvatar(mapped.avatar);
          return;
        }

        // 4) last fallback: try any other helper your service might provide
        if (typeof appwriteService.getUser === "function") {
          try {
            const u = await appwriteService.getUser(authorId);
            if (u && !cancelled) {
              const mapped = mapUserToProfile(u);
              setAuthorName(mapped.name);
              setAuthorAvatar(mapped.avatar);
              return;
            }
          } catch (e) {
            // ignore
          }
        }

        // Final fallback: show an empty or shortened id string (UX not ideal)
        if (!cancelled) {
          setAuthorName(String(authorId));
          setAuthorAvatar(null);
        }
      } catch (err) {
        console.error("Error resolving author:", err);
        if (!cancelled) {
          setAuthorName(String(authorId));
          setAuthorAvatar(null);
        }
      }
    };

    // small mapper to unify various user/doc shapes into {name, avatar}
    const mapUserToProfile = (user) => {
      if (!user) return { name: "", avatar: null };

      // Appwrite account object may have 'name' or 'email' fields, DB doc may have many shapes
      const name =
        (typeof user.name === "string" && user.name.trim()) ||
        (typeof user.fullName === "string" && user.fullName.trim()) ||
        (user?.prefs && typeof user.prefs.authorName === "string" && user.prefs.authorName.trim()) ||
        (user?.$id && String(user.$id)) ||
        (user?.email && String(user.email)) ||
        "";

      const avatar =
        (typeof user.avatar === "string" && user.avatar) ||
        (user?.prefs && user.prefs.avatar) ||
        (user?.profileImage && user.profileImage) ||
        null;

      return { name, avatar };
    };

    resolveAuthor();

    return () => {
      cancelled = true;
    };
  }, [post]);

  const deletePost = () => {
    if (!post) return;
    if (!window.confirm("Are you sure you want to delete this post? This cannot be undone.")) return;

    appwriteService.deletePost(post.$id).then((status) => {
      if (status) navigate("/");
    });
  };

  // safe image source fallback
  const imageSrc =
    post && typeof post.featuredImage === "string" && post.featuredImage.startsWith("http")
      ? post.featuredImage
      : post
      ? appwriteService.getFilePreview(post.featuredImage)
      : "";

  const computeInitials = (name) => {
    try {
      if (!name || typeof name !== "string") return "A";
      const parts = name.trim().split(/\s+/).filter(Boolean);
      if (parts.length === 0) return "A";
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      const first = parts[0].charAt(0).toUpperCase();
      const last = parts[parts.length - 1].charAt(0).toUpperCase();
      return `${first}${last}`;
    } catch {
      return "A";
    }
  };

  const authorInitials = computeInitials(authorName);
  const formattedDate = post?.$createdAt ? new Date(post.$createdAt).toLocaleDateString() : "";

  return post ? (
    <div className="min-h-screen bg-blue-50 py-10">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* top actions + breadcrumb */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
                ← Back
              </Link>
              <span className="text-sm text-blue-400">/</span>
              <span className="text-sm text-blue-700">{post.title}</span>
            </div>

            {isAuthor && (
              <div className="flex items-center gap-2">
                <Link to={`/edit-post/${post.$id}`}>
                  <Button className="px-4 py-2" bgColor="bg-white">
                    <span className="text-blue-700">Edit</span>
                  </Button>
                </Link>
                <Button onClick={deletePost} className="px-4 py-2" bgColor="bg-red-500">
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* card */}
          <article className="bg-white rounded-2xl shadow-md overflow-hidden border border-blue-100">
            {/* header image */}
            <div className="w-full relative bg-blue-100 flex items-center justify-center">
              {imageSrc ? (
                // show full image without cropping
                <img src={imageSrc} alt={post.title || "Post image"} className="w-full max-h-[520px] md:max-h-[640px] object-contain" />
              ) : (
                <div className="w-full h-64 md:h-96 flex items-center justify-center text-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-16 h-16">
                    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                  </svg>
                </div>
              )}

              {/* author badge */}
              <div className="absolute left-6 bottom-6 bg-white/95 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-3 border border-blue-50 z-20 shadow">
                {/* avatar */}
                {authorAvatar ? (
                  <img src={authorAvatar} alt={authorName || "Author"} className="w-11 h-11 rounded-full object-cover border border-white" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-lg border border-white shadow-sm">
                    {authorInitials}
                  </div>
                )}

                <div className="leading-tight">
                  <div className="text-sm font-medium text-blue-800">{authorName || "Author"}</div>
                  <div className="text-xs text-blue-500">{formattedDate}</div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 leading-tight mb-3">{post.title}</h1>

              <div className="flex items-center gap-4 text-sm text-blue-500 mb-6">
                {post.readTime && <div>{post.readTime} min read</div>}
                {post.tags && (
                  <div className="flex gap-2">
                    {post.tags.map((t, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="prose max-w-none prose-blue browser-css">{parse(post.content)}</div>

              {/* footer */}
              <div className="mt-8 pt-6 border-t border-blue-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                    {authorInitials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-800">{authorName || "Author"}</div>
                    <div className="text-xs text-blue-500">View author profile</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button className="px-4 py-2" bgColor="bg-white">
                    <span className="text-blue-700">Share</span>
                  </Button>
                  <Link to="/">
                    <Button className="px-4 py-2" bgColor="bg-blue-600">
                      <span className="text-white">Back to posts</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </Container>
    </div>
  ) : null;
}
