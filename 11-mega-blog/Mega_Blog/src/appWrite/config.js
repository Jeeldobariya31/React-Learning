// --------------------------------------------------
// Frontend-only Appwrite service (FREE PLAN SAFE)
//
// Handles:
// - Posts CRUD
// - Image upload / view / delete
// - Ownership & permissions
// - Slug generation
// --------------------------------------------------

import {
  Client,
  ID,
  Databases,
  Storage,
  Query,
  Permission,
  Role,
} from "appwrite";

import config from "../conf";

class AppwriteService {
  client;
  db;
  storage;

  constructor() {
    // 🔌 Initialize Appwrite client
    this.client = new Client()
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    // 📦 Database & Storage
    this.db = new Databases(this.client);
    this.storage = new Storage(this.client);

    console.log("✅ Appwrite frontend service initialized");
  }

  /* ======================================================
     🔧 UTILITIES
     ====================================================== */

  // Convert title → URL-safe slug
  slugify(title = "") {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  // Ensure slug is unique
  async generateUniqueSlug(title) {
    const base = this.slugify(title);
    let slug = base;
    let counter = 1;

    while (true) {
      const res = await this.db.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        [Query.equal("slug", slug)]
      );

      if (res.documents.length === 0) return slug;
      slug = `${base}-${counter++}`;
    }
  }

  /* ======================================================
     📝 POSTS (CRUD)
     ====================================================== */

  // CREATE POST (FINAL)
  async createPost(data, user) {
    if (!user?.$id) throw new Error("Login required");

    const slug = await this.generateUniqueSlug(data.title);

    return await this.db.createDocument(
      config.appwriteDatabaseId,
      config.appwriteCollectionId,
      ID.unique(),
      {
        ...data,
        slug,

        // ✅ AUTHOR INFO (SNAPSHOT)
        authorID: user.$id,
        authorName: user.name || "Anonymous",
      },
      [
        Permission.read(Role.any()),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
      ]
    );
  }

  // UPDATE POST
  async updatePost(postId, data) {
    return await this.db.updateDocument(
      config.appwriteDatabaseId,
      config.appwriteCollectionId,
      postId,
      data
    );
  }

  // ❌ OLD DELETE (DOCUMENT ONLY)
  async deletePost(postId) {
    return await this.db.deleteDocument(
      config.appwriteDatabaseId,
      config.appwriteCollectionId,
      postId
    );
  }

  // ✅ NEW: DELETE POST + IMAGE (USE THIS)
  async deletePostWithImage(post) {
    if (!post) throw new Error("Post is required");

    // 1️⃣ Delete image FIRST
    if (post.featuredImage) {
      try {
        await this.storage.deleteFile(
          config.appwriteBucketId,
          post.featuredImage
        );
        console.log("🗑 Image deleted:", post.featuredImage);
      } catch (err) {
        console.warn("⚠ Image delete failed:", err.message);
        // do not stop execution
      }
    }

    // 2️⃣ Delete post document
    return await this.db.deleteDocument(
      config.appwriteDatabaseId,
      config.appwriteCollectionId,
      post.$id
    );
  }

  // GET POST BY ID
  async getPostById(postId) {
    return await this.db.getDocument(
      config.appwriteDatabaseId,
      config.appwriteCollectionId,
      postId
    );
  }

  // GET POST BY SLUG
  async getPostBySlug(slug) {
    const res = await this.db.listDocuments(
      config.appwriteDatabaseId,
      config.appwriteCollectionId,
      [Query.equal("slug", slug)]
    );
    return res.documents[0] || null;
  }

  // LIST POSTS
  async getPosts({ status = "", authorID = null } = {}) {
    const queries = [Query.orderDesc("$createdAt")];

    if (status) queries.push(Query.equal("status", status));
    if (authorID) queries.push(Query.equal("authorID", authorID));

    const res = await this.db.listDocuments(
      config.appwriteDatabaseId,
      config.appwriteCollectionId,
      queries
    );

    return res.documents;
  }

  /* ======================================================
     🖼️ IMAGES (STORAGE)
     ====================================================== */

  // UPLOAD IMAGE
  async uploadImage(file, userId) {
    if (!file || !userId) throw new Error("Invalid image upload");

    return await this.storage.createFile(
      config.appwriteBucketId,
      ID.unique(),
      file,
      [
        Permission.read(Role.any()),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
  }

  // DELETE IMAGE (used on UPDATE)
  async deleteImage(fileId) {
    if (!fileId) return;

    await this.storage.deleteFile(config.appwriteBucketId, fileId);
  }

  // VIEW IMAGE
  getImageUrl(fileId) {
    if (!fileId) return null;
    return this.storage.getFileView(config.appwriteBucketId, fileId);
  }
}

// ✅ Export singleton
const appwriteService = new AppwriteService();
export default appwriteService;
