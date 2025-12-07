import React, { useContext, useEffect } from "react";
import UserContext from "../context/userContext";

export default function Profile() {
  const {
    user,
    setUser,
    repos,
    setRepos,
    loading,
    setLoading,
    error,
    setError,
  } = useContext(UserContext);

  // If no user, ask to login
  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h2>No User Logged In</h2>
        <p>Please login first.</p>
      </div>
    );
  }

  // Fetch GitHub repos when user changes
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        setError(null);
        setRepos([]);

        const res = await fetch(
          `https://api.github.com/users/${user.username}/repos`
        );

        if (!res.ok) {
          throw new Error(`Failed to load repos (${res.status})`);
        }

        const data = await res.json();
        setRepos(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [user.username, setLoading, setError, setRepos]);

  const handleLogout = () => {
    setUser(null);
    setRepos([]);
    setError(null);
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 16 }}>Profile</h2>

      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Login Time:</strong> {user.time}
      </p>

      {/* Loading / Error state */}
      {loading && <p style={{ marginTop: 10 }}>Loading repos...</p>}
      {error && (
        <p style={{ marginTop: 10, color: "red" }}>
          <strong>Error:</strong> {error}
        </p>
      )}

      {/* Repos List */}
      {!loading && !error && repos && repos.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Public Repositories:</h3>
          <ul style={{ marginTop: 10, paddingLeft: 20 }}>
            {repos.map((repo) => (
              <li key={repo.id} style={{ marginBottom: 6 }}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  {repo.name}
                </a>
                {repo.description && (
                  <div style={{ fontSize: 14, color: "#555" }}>
                    {repo.description}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No repos */}
      {!loading && !error && repos && repos.length === 0 && (
        <p style={{ marginTop: 10 }}>No repositories found.</p>
      )}

      <button
        onClick={handleLogout}
        style={{
          marginTop: 20,
          width: "100%",
          padding: "10px",
          background: "crimson",
          color: "white",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}
