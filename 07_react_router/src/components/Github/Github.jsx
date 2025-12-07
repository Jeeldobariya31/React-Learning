import React, { useEffect, useState } from "react";
import { marked } from "marked";

const GITHUB_USERNAME = "jeeldobariya31";

export default function Github() {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [readmeHTML, setReadmeHTML] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [profileRes, reposRes, readmeRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
          ),
          fetch(
            `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}/main/README.md`
          ),
        ]);

        if (!profileRes.ok) throw new Error("Could not load profile data.");
        if (!reposRes.ok) throw new Error("Could not load repository list.");

        const profileData = await profileRes.json();
        const reposData = await reposRes.json();

        const readmeText = readmeRes.ok ? await readmeRes.text() : "";
        const readmeHTMLConverted = marked(readmeText);

        setProfile(profileData);
        setRepos(reposData);
        setReadmeHTML(readmeHTMLConverted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Language Stats
  const languageCounts = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const sortedLanguages = Object.entries(languageCounts).sort(
    (a, b) => b[1] - a[1]
  );

  // Loading
  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="inline-flex items-center gap-3 rounded-full border px-5 py-2 shadow-sm">
          <span className="h-3 w-3 rounded-full border-2 border-orange-600 border-t-transparent animate-spin" />
          <span className="text-sm">Loading GitHub Data...</span>
        </div>
      </div>
    );
  }

  // Error
  if (error || !profile) {
    return (
      <div className="py-20 text-center text-red-600 font-bold text-lg">
        {error || "Something went wrong."}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900">
          GitHub Overview
        </h1>
        <p className="text-gray-600">
          Stats, README, repositories & languages for{" "}
          <span className="font-semibold">@{GITHUB_USERNAME}</span>
        </p>
      </div>

      {/* Profile + Stats */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="bg-white border shadow-sm rounded-2xl p-6 text-center flex flex-col items-center">
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="w-24 h-24 rounded-full shadow"
          />

          <h2 className="mt-4 text-xl font-bold">{profile.name}</h2>
          <p className="text-gray-500">@{profile.login}</p>

          {profile.bio && (
            <p className="mt-3 text-sm text-gray-600">{profile.bio}</p>
          )}

          <div className="mt-5 grid grid-cols-3 gap-3 w-full text-sm">
            <div className="bg-gray-50 border rounded-xl p-2">
              <p className="text-xs text-gray-500">Repos</p>
              <p className="font-bold">{profile.public_repos}</p>
            </div>
            <div className="bg-gray-50 border rounded-xl p-2">
              <p className="text-xs text-gray-500">Followers</p>
              <p className="font-bold">{profile.followers}</p>
            </div>
            <div className="bg-gray-50 border rounded-xl p-2">
              <p className="text-xs text-gray-500">Following</p>
              <p className="font-bold">{profile.following}</p>
            </div>
          </div>

          <a
            href={profile.html_url}
            target="_blank"
            rel="noreferrer"
            className="mt-5 px-6 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Open GitHub Profile
          </a>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid gap-4">
          {/* Main Stats */}
          <div className="bg-white border p-4 rounded-2xl shadow">
            <h3 className="mb-2 font-semibold text-gray-800 text-sm">
              Profile Stats
            </h3>
            <img
              src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&theme=tokyonight`}
              alt="Stats"
              className="rounded-lg w-full"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Streak */}
            <div className="bg-white border p-4 rounded-2xl shadow">
              <h3 className="mb-2 font-semibold text-gray-800 text-sm">
                Streak Stats
              </h3>
              <img
                src={`https://github-readme-streak-stats.herokuapp.com/?user=${GITHUB_USERNAME}&theme=tokyonight`}
                alt="Streak"
                className="rounded-lg w-full"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Languages */}
            <div className="bg-white border p-4 rounded-2xl shadow">
              <h3 className="mb-2 font-semibold text-gray-800 text-sm">
                Top Languages
              </h3>
              <img
                src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USERNAME}&layout=compact&theme=tokyonight`}
                alt="Top Languages"
                className="rounded-lg w-full"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Language Summary */}
      {sortedLanguages.length > 0 && (
        <section className="bg-white border p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Most Used Languages (from repos)
          </h2>
          <div className="flex flex-wrap gap-2">
            {sortedLanguages.map(([lang, count]) => (
              <span
                key={lang}
                className="px-3 py-1 bg-gray-50 border rounded-full text-sm"
              >
                {lang} <span className="text-xs text-gray-500">({count})</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* README OUTPUT (HTML Rendered) */}
      {readmeHTML && (
        <section className="bg-white border p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Profile README.md</h2>

          <div
            className="
              prose prose-sm sm:prose-base lg:prose-lg
              max-w-none
              prose-headings:text-gray-900
              prose-headings:font-bold
              prose-h1:mt-6 prose-h1:mb-4
              prose-h2:mt-6 prose-h2:mb-3
              prose-h3:mt-5 prose-h3:mb-2
              prose-p:mb-3
              prose-ul:my-2
              prose-ol:my-2
              prose-li:my-1
              prose-strong:text-gray-800
              prose-code:bg-gray-200 prose-code:px-1 prose-code:py-[2px] prose-code:rounded
              prose-pre:bg-gray-900 prose-pre:text-gray-100
              prose-img:rounded-xl prose-img:shadow
              prose-a:text-orange-700 prose-a:font-semibold hover:prose-a:text-orange-600
            "
            dangerouslySetInnerHTML={{ __html: readmeHTML }}
          />
        </section>
      )}

      {/* Repositories */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">
          Public Repositories ({repos.length})
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold flex gap-2">
                {repo.name}
                {repo.fork && (
                  <span className="text-[10px] bg-gray-200 px-2 rounded">
                    fork
                  </span>
                )}
              </h3>

              {repo.description && (
                <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
              )}

              <div className="text-xs text-gray-500 mt-3 flex gap-4">
                {repo.language && <span>{repo.language}</span>}
                <span>★ {repo.stargazers_count}</span>
                <span>⑂ {repo.forks_count}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
