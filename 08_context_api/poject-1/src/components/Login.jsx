import React, { useState, useContext } from "react";
import UserContext from "../context/userContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setUser, setRepos, setError, setLoading } = useContext(UserContext);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      alert("Enter username and password!");
      return;
    }

    // Reset old data
    setRepos([]);
    setError(null);
    setLoading(false);

    // Save user in context
    setUser({
      username,
      password,
      loggedIn: true,
      time: new Date().toLocaleString(),
    });
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Login</h2>

      {/* Username */}
      <input
        type="text"
        placeholder="GitHub Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          border: "1px solid gray",
          borderRadius: 6,
        }}
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          border: "1px solid gray",
          borderRadius: 6,
        }}
      />

      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: "10px",
          background: "black",
          color: "white",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </div>
  );
}
