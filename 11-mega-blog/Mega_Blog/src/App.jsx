// 📁 App.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";

import authService from "./appWrite/auth"; // uses your uploaded auth service :contentReference[oaicite:3]{index=3}
import { login, logout } from "./store/authSlice"; // actions from your auth slice :contentReference[oaicite:4]{index=4}
import { Header, Footer } from "./components";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AllPosts from "./pages/AllPosts";
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";
import Post from "./pages/Post";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import Protected from "./components/AuthLayout";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);

  useEffect(() => {
    

    // fetch current user (promise style) and sync to redux
    authService
      .getCurrentUser()
      .then((u) => {
        if (u) dispatch(login(u));
        else dispatch(logout());
      })
      .catch((err) => {
        console.error("❌ Failed to load current user:", err);
        dispatch(logout());
      })
      .finally(() => {
         setLoading(false);
      });

    
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="center">Loading...</div>;

  return (
    <div className="app-container min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-posts" element={<AllPosts />} />
          <Route
            path="/add-post"
            element={
              <Protected authentication={true}>
                <AddPost />
              </Protected>
            }
          />
          <Route
            path="/edit-post/:slug"
            element={
              <Protected authentication={true}>
                <EditPost />
              </Protected>
            }
          />
          <Route path="/post/:slug" element={<Post />} />

          <Route
            path="/login"
            element={
              <Protected authentication={false}>
                <LoginPage />
              </Protected>
            }
          />
          <Route
            path="/signup"
            element={
              <Protected authentication={false}>
                <SignupPage />
              </Protected>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
