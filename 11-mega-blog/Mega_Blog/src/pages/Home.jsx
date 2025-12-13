import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import appwriteService from "../appWrite";
import { Container, PostCard } from "../components";

/**
 * Home Page
 * --------------------------------------------------
 * - Fetches posts from Appwrite
 * - Supports:
 *   • search
 *   • sort (new / old)
 *   • "my posts" filter
 * - Works with FREE Appwrite plan
 */
export default function Home() {
  const [posts, setPosts] = useState([]); // all posts
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [orderType, setOrderType] = useState("desc");

  // logged-in user from redux
  const user = useSelector((state) => state.auth.userData);

  /* =================================================
     LOAD POSTS FROM APPWRITE
     ================================================= */
  useEffect(() => {
    let cancelled = false;

    const loadPosts = async () => {
      setLoading(true);
      try {
        /**
         * IMPORTANT:
         * getPosts() RETURNS ARRAY
         * NOT { documents: [] }
         */
        const docs = await appwriteService.getPosts({
          // ✅ MUST match DB column name
          authorID: onlyMine && user ? user.$id : null,
        });

        if (!cancelled) {
          setPosts(docs || []);
        }
      } catch (err) {
        console.error("❌ Failed to load posts:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, [onlyMine, user]);

  /* =================================================
     CLIENT-SIDE SEARCH + SORT
     ================================================= */
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // 🔍 search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.content?.toLowerCase().includes(q)
      );
    }

    // ↕️ sort
    result.sort((a, b) => {
      const da = new Date(a.$createdAt).getTime();
      const db = new Date(b.$createdAt).getTime();
      return orderType === "asc" ? da - db : db - da;
    });

    return result;
  }, [posts, search, orderType]);

  /* =================================================
     RENDER
     ================================================= */
  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-blue-900">Posts</h1>
              <p className="text-blue-600 mt-1">
                Browse the latest articles from our community
              </p>
            </div>

            {/* CONTROLS */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* SEARCH */}
              <div className="flex items-center bg-white rounded-lg shadow-sm border border-blue-100 px-3 py-2 w-full md:w-80">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full outline-none text-sm text-blue-800 bg-transparent"
                />
              </div>

              {/* SORT */}
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="px-3 py-2 rounded-lg border border-blue-100 bg-white text-sm"
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>

              {/* MY POSTS */}
              {user && (
                <label className="inline-flex items-center gap-2 text-sm text-blue-700">
                  <input
                    type="checkbox"
                    checked={onlyMine}
                    onChange={(e) => setOnlyMine(e.target.checked)}
                  />
                  My posts
                </label>
              )}
            </div>
          </header>

          {/* CONTENT */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white h-56 rounded-2xl"
                />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-10 text-blue-600">
              No posts found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.$id}
                  {...post}
                  className="bg-white shadow-md border border-blue-100 rounded-2xl p-4 hover:shadow-lg transition-shadow"
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
