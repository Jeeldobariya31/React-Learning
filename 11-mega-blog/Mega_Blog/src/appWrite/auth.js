// 📁 ./appWrite/auth.js
// 🔐 Appwrite Authentication Service
// Handles signup, login, logout, and fetching the current user

import { Client, Account, ID } from "appwrite";
import config from "../config"; // ⚙️ Appwrite config

class AuthService {
  // 🌐 Appwrite Client
  client;

  // 👤 Account instance
  account;

  constructor() {
    // 🚀 Initialize Appwrite Client
    this.client = new Client()
      .setEndpoint(config.appwriteUrl) // 🌐 API URL
      .setProject(config.appwriteProjectId); // 🆔 Project ID

    // 👤 Initialize Account API
    this.account = new Account(this.client);

    console.log("🚀 Appwrite Auth Service Initialized");
  }

  formatError(error, fallback = "Something went wrong") {
    const msg = (error?.message || "").toLowerCase();
    if (msg.includes("invalid credentials") || msg.includes("invalid email"))
      return "Invalid email or password.";
    if (msg.includes("user already exists")) return "Account already exists.";
    if (msg.includes("rate limit")) return "Too many attempts. Try again later.";
    if (msg.includes("network") || msg.includes("fetch"))
      return "Network error. Check your internet connection.";
    if (msg.includes("missing scopes") || msg.includes("401"))
      return "You are not signed in.";
    return error?.message || fallback;
  }

  // 📝 Create a new user (Sign Up)
  async createAccount({ email, password, name }) {
    console.log(`📝 Creating account for: ${email}`);

    try {
      const user = await this.account.create(
        ID.unique(), // 🔑 Auto-generated user ID
        email,
        password,
        name
      );

      console.log("✅ Account created successfully:", user);

      // 🔄 Auto-login after signup
      console.log("🔄 Auto-logging in new user...");
      const session = await this.login({ email, password });

      console.log("🎉 Signup + Auto-login successful:", session);
      return session;
    } catch (error) {
      const message = this.formatError(error, "Failed to create account");
      console.error("❌ createAccount error:", message);
      throw new Error(message);
    }
  }

  // 🔑 Login user
  async login({ email, password }) {
    console.log(`🔐 Attempting login for: ${email}`);

    try {
      // Appwrite JS SDK v13+
      const session = await this.account.createEmailPasswordSession(email, password);
      console.log("🔓 Login successful:", session);
      return session;
    } catch (error) {
      const message = this.formatError(error, "Login failed");
      console.error("❌ Login error:", message);
      throw new Error(message);
    }
  }

  // 🚪 Logout user (End session)
  async logout() {
    console.log("🚪 Logging out…");

    try {
      await this.account.deleteSession("current"); // correct API

      console.log("🏁 Logout successful");
      return true;
    } catch (error) {
      const message = this.formatError(error, "Logout failed");
      console.error("❌ Logout error:", message);
      throw new Error(message);
    }
  }

  // 👤 Get the currently logged-in user
  async getCurrentUser() {
    console.log("👀 Checking current session…");

    try {
      let user = await this.account.get();
      // ensure numeric authorId exists in prefs (required by posts schema)
      if (!user?.prefs || user?.prefs?.authorId === undefined || user?.prefs?.authorId === null) {
        try {
          const numericId = Math.floor(Date.now() * 1000 + Math.floor(Math.random() * 1000));
          await this.account.updatePrefs({ authorId: numericId });
          user = await this.account.get();
        } catch (e) {
          console.warn("⚠️ Unable to set authorId in prefs:", e?.message || e);
        }
      }
      console.log("👤 Current user:", user);
      return user;
    } catch (error) {
      console.warn("⚠️ No active session:", error?.message || error);
      return null; // normal when logged out
    }
  }
}

// 🟢 Export a single service instance
const authService = new AuthService();
export default authService;
