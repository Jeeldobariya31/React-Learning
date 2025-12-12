import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import appwriteService from "../appWrite/config";
import { Container, PostCard } from "../components";

// Blue & White themed Home page with search, filters, and skeleton loading
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [orderField] = useState("$createdAt");
  const [orderType, setOrderType] = useState("desc");
  const user = useSelector((state) => state.auth.userData);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await appwriteService.getPosts({
          search,
          authorId: onlyMine && user ? user.prefs?.authorId : null,
          limit: 50,
          orderField,
          orderType,
        });
        if (!cancelled) setPosts(res?.documents || []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // small debounce to avoid too many requests while typing
    const t = setTimeout(load, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [search, onlyMine, orderField, orderType, user]);

  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <Container>
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-blue-900">Posts</h1>
              <p className="text-blue-600 mt-1">Browse the latest articles from our community</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center bg-white rounded-lg shadow-sm border border-blue-100 px-3 py-2 w-full md:w-80">
                <svg className="w-5 h-5 text-blue-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 6.65 7.5 7.5 0 0116.65 16.65z"></path></svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full outline-none text-sm text-blue-800 bg-transparent"
                />
              </div>

              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="px-3 py-2 rounded-lg border border-blue-100 bg-white text-sm"
                title="Sort order"
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>

              {user && (
                <label className="inline-flex items-center gap-2 text-sm text-blue-700">
                  <input
                    type="checkbox"
                    checked={onlyMine}
                    onChange={(e) => setOnlyMine(e.target.checked)}
                    className="w-4 h-4 rounded border-blue-200 text-blue-600 focus:ring-blue-300"
                  />
                  My posts
                </label>
              )}
            </div>
          </header>

          {/* content */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-2">
                  <div className="animate-pulse bg-white rounded-2xl border border-blue-100 p-4 h-56" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10 text-blue-600">No posts found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.map((post) => (
                <div key={post.$id} className="p-2">
                  <PostCard {...post} className="h-full bg-white shadow-md border border-blue-100 rounded-2xl p-4 hover:shadow-lg transition-shadow duration-200" />
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
