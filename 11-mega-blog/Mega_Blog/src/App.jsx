// 📁 src/App.jsx
// ===================================================
// MAIN APPLICATION ENTRY (ROUTING + AUTH BOOTSTRAP)
//
// Responsibilities:
// - Load current user on app start (page refresh safe)
// - Sync Appwrite auth → Redux store
// - Define public & protected routes
// - Render global layout (Header / Footer)
// ===================================================

import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./App.css";

// 🔐 Appwrite Auth Service
import authService from "./appWrite/auth";

// 🧠 Redux auth actions
import { login, logout } from "./store/authSlice";

// 🧩 Layout Components
import { Header, Footer } from "./components";

// 📄 Pages
import Home from "./pages/Home";
import AllPosts from "./pages/AllPosts";
import Post from "./pages/Post";
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import Terms from "./pages/Term";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";


// 🔒 Route Protection Wrapper
import Protected from "./components/AuthLayout";

function App() {
  // ⏳ Prevent UI flicker until auth is resolved
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);

  /* =================================================
     AUTH BOOTSTRAP (RUNS ON PAGE REFRESH)
     -------------------------------------------------
     - Checks if a user session already exists
     - Syncs Appwrite → Redux
     ================================================= */
  useEffect(() => {
    authService
      .getCurrentUser()
      .then((currentUser) => {
        if (currentUser) {
          dispatch(login(currentUser));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.error("❌ Failed to bootstrap auth:", error);
        dispatch(logout());
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  /* =================================================
     LOADING STATE
     -------------------------------------------------
     Prevents route mismatch before auth loads
     ================================================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-600">
        Loading application...
      </div>
    );
  }

  /* =================================================
     APP LAYOUT + ROUTES
     ================================================= */
  return (
    <div className="min-h-screen flex flex-col">
      {/* 🌐 GLOBAL HEADER */}
      <Header user={user} />

      {/* 🧠 MAIN CONTENT */}
      <main className="flex-1">
        <Routes>
          {/* =====================
              🌍 PUBLIC ROUTES
             ===================== */}
          <Route path="/" element={<Home />} />
          <Route path="/all-posts" element={<AllPosts />} />
          <Route path="/post/:slug" element={<Post />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />

          {/* =====================
              🔒 PROTECTED ROUTES
              (LOGIN REQUIRED)
             ===================== */}
          <Route
            path="/add-post"
            element={
              <Protected authentication={true}>
                <AddPost />
              </Protected>
            }
          />
          <Route
            path="/edit-post/:id"
            element={
              <Protected authentication={true}>
                <EditPost />
              </Protected>
            }
          />
          {/* =====================
              🔓 AUTH ROUTES
              (GUEST ONLY)
             ===================== */}
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

      {/* 🧱 GLOBAL FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
