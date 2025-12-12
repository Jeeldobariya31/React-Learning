// 📁 ./appWrite/appwrite_config.js
// ⚙️ Appwrite Database + Storage Full Service
// This file provides a comprehensive set of methods for working with the `artical` table:
// - Create, Read, Update, Delete (CRUD)
// - Ownership enforcement (only author can update/delete)
// - Permissions setup (document-level write permissions for owner)
// - Slug generation + uniqueness check
// - Image upload / delete / preview / download
// - Listing, filtering, pagination (including active-only paginated endpoint)
// - Realtime subscription helpers
// - Utilities: canEdit, canDelete, migratePermissions
//
// Permission summary for methods below:
// - PUBLIC: anyone (including unauthenticated) can call (read-only operations).
// - AUTH: requires user to be authenticated (uploading files, creating posts).
// - OWNER: only the article author (user:<authorId>) can modify/delete (enforced client-side and by document write perms).
// - ADMIN: (not implemented) operations that would require elevated privileges (notes included).

import { Client, ID, Databases, Storage, Query, Permission, Role } from "appwrite";
import config from "../config"; // 🔧 Appwrite config
import { deleteByPublicId, getPublicIdFromUrl } from "../utils/cloudinaryClient";

export class Service {
  client = new Client(); // 🌐 Appwrite Client
  database; // 🗄️ Database instance
  bucket; // 🪣 Storage instance

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl) // 🌍 API URL
      .setProject(config.appwriteProjectId); // 🆔 Project ID

    this.database = new Databases(this.client);
    this.bucket = new Storage(this.client);

    console.log("🚀 Appwrite Database + Storage Service Initialized");
  }

  /* ---------------------------
     Helper utilities
     --------------------------- */

  // 🔧 generateSlug(title)
  // - Input: string title
  // - Output: url-friendly slug (lowercase, dashes)
  // - Access: PUBLIC
  generateSlug(title = "") {
    return String(title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  // 🔧 generateUniqueSlug(title)
  // - Generates slug and ensures uniqueness by appending -1, -2 etc if needed.
  // - Access: PUBLIC
  async generateUniqueSlug(title = "") {
    const base = this.generateSlug(title);
    let slug = base;
    let index = 0;

    // Loop until unique (small loop; in the unlikely event of collisions it increments)
    while (true) {
      const found = await this.database.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        [Query.equal("slug", slug)]
      );

      if (!found.documents || found.documents.length === 0) return slug;

      index += 1;
      slug = `${base}-${index}`;
      // safety: avoid infinite loop (very unlikely)
      if (index > 1000) throw new Error("Unable to generate unique slug");
    }
  }

  // 🔧 setOwnerPermissions(appwriteUserId)
  // - Returns a permissions array suitable for createDocument (SDK v13+)
  // - Public read, owner write/update/delete
  // - Access: PUBLIC
  setOwnerPermissions(appwriteUserId) {
    const userRole = Role.user(String(appwriteUserId));
    const perms = [
      Permission.read(Role.any()),
      Permission.write(userRole),
      Permission.update(userRole),
      Permission.delete(userRole),
    ];
    return perms;
  }

  // 🔧 getCurrentUser()
  // - Helper wrapper to fetch the current authenticated user via authService
  // - Access: AUTH (caller should handle unauthenticated state)
  async getCurrentUser() {
    const { default: authService } = await import("./auth");
    return authService.getCurrentUser();
  }

  // 🔧 canEdit(post)
  // - Client-side helper to check if current user is owner
  // - Returns boolean
  // - Access: AUTH (returns false if not authenticated)
  async canEdit(post) {
    const user = await this.getCurrentUser();
    const authorNum = user?.prefs?.authorId;
    if (authorNum === undefined || authorNum === null) return false;
    return String(post?.authorId) === String(authorNum);
  }

  // 🔧 canDelete(post) - alias for canEdit
  async canDelete(post) {
    return this.canEdit(post);
  }

  // 🔧 formatDate(isoString)
  // - Friendly local format (falls back safely)
  formatDate(isoString) {
    if (!isoString) return "-";
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return isoString;
    }
  }

  // 🔧 timeAgo(isoString)
  // - Very small relative-time helper (e.g. "2 hours ago")
  timeAgo(isoString) {
    if (!isoString) return "-";
    const now = Date.now();
    const then = new Date(isoString).getTime();
    const sec = Math.floor((now - then) / 1000);
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.floor(hr / 24);
    if (day < 30) return `${day}d ago`;
    return new Date(isoString).toLocaleDateString();
  }

  /* ---------------------------
     CREATE
     --------------------------- */

  // 📝 createPost(data)
  // - Creates a new article document.
  // - Access required: AUTH (we require authorId - Appwrite user id string).
  // - Side effects: sets document permissions so only the author can write/delete.
  // - Data shape accepted:
  //   { title, tags, content, featuredImage, status, metaDescription, authorId, authorName }
  async createPost({
    title,
    tags,
    content,
    featuredImage = null,
    featuredImagePublicId = null,
    status = "draft",
    metaDescription = null,
    authorId, // must be Appwrite user id string (e.g. user.$id)
    authorName = "",
  }) {
    console.log("📝 Creating new article... (createPost)");

    try {
      // resolve current user for permissions and fallback author id
      const currentUser = await this.getCurrentUser();
      const ownerUserId = currentUser?.$id || currentUser?.id;
      const resolvedAuthorId =
        authorId !== undefined && authorId !== null
          ? authorId
          : currentUser?.prefs?.authorId;

      if (!title || !content || resolvedAuthorId === undefined || resolvedAuthorId === null)
        throw new Error("Title, content and authorId are required.");

      const slug = await this.generateUniqueSlug(title);

      // Build payload
      const payload = {
        title,
        slug,
        tags,
        content,
        featuredImage,
        featuredImagePublicId,
        status,
        metaDescription,
        authorId: resolvedAuthorId,
      };

      // Set document permissions (public read, owner write/update/delete)
      const permissions = this.setOwnerPermissions(ownerUserId);

      const post = await this.database.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        ID.unique(),
        payload,
        permissions
      );

      console.log("✅ Article created:", post);
      // Broadcast event for UI (browser only)
      if (typeof window !== "undefined") {
        try {
          window.dispatchEvent(
            new CustomEvent("article:created", { detail: post })
          );
        } catch (e) {
          console.warn("⚠️ dispatch article:created failed", e);
        }
      }
      return post;
    } catch (error) {
      console.error("❌ createPost error:", error?.message || error);
      throw error;
    }
  }

  /* ---------------------------
     READ
     --------------------------- */

  // 📖 getPostById(id)
  // - Fetch single article by document id
  // - Access: PUBLIC (assuming read permission is role:all)
  async getPostById(id) {
    console.log("🔍 getPostById:", id);
    try {
      const post = await this.database.getDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        id
      );
      return post;
    } catch (error) {
      console.error("❌ getPostById error:", error?.message || error);
      throw error;
    }
  }

  // 📖 getPostBySlug(slug)
  // - Fetch single article by slug (index: slug_key)
  // - Access: PUBLIC
  async getPostBySlug(slug) {
    console.log("🔍 getPostBySlug:", slug);
    try {
      const res = await this.database.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        [Query.equal("slug", slug)]
      );
      if (!res.documents || res.documents.length === 0) return null;
      return res.documents[0];
    } catch (error) {
      console.error("❌ getPostBySlug error:", error?.message || error);
      throw error;
    }
  }

  // 📚 getPosts({ search, status, authorId, limit, offset })
  // - List posts with optional search, filter, pagination
  // - Access: PUBLIC (reads subject to collection read perms)
  async getPosts({
    search = "",
    status = "",
    authorId = null,
    limit = 25,
    offset = 0,
    orderField = "$createdAt",
    orderType = "desc", // 'asc' or 'desc'
  } = {}) {
    console.log("📚 getPosts:", { search, status, authorId, limit, offset });

    try {
      const queries = [];

      if (search) queries.push(Query.search("title", search));
      if (status) queries.push(Query.equal("status", status));
      if (authorId) queries.push(Query.equal("authorId", authorId));

      // pagination / limit / offset
      queries.push(Query.limit(limit));
      queries.push(Query.offset(offset));
      // sort
      if (orderType === "desc") queries.push(Query.orderDesc(orderField));
      else queries.push(Query.orderAsc(orderField));

      const res = await this.database.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        queries
      );

      return {
        total: res.total || res.documents.length,
        documents: res.documents || [],
      };
    } catch (error) {
      console.error("❌ getPosts error:", error?.message || error);
      throw error;
    }
  }

  // 📚 getPostsByAuthor(authorId, options)
  // - Convenience method for listing posts by an author
  // - Access: PUBLIC
  async getPostsByAuthor(authorId, opts = {}) {
    return this.getPosts({ ...opts, authorId });
  }

  // 🔢 countPosts({status, authorId})
  // - Returns count (uses listDocuments total)
  // - Access: PUBLIC
  async countPosts({ status = "", authorId = null } = {}) {
    const res = await this.getPosts({ status, authorId, limit: 1, offset: 0 });
    return res.total;
  }

  /* ---------------------------
     UPDATE (owner-only)
     --------------------------- */

  // ✏️ updatePost(id, updateData)
  // - Only the original author may update the post.
  // - Access: OWNER (verified client-side and enforced by document write perms).
  // - updateData shape: same as createPost fields (title, tags, content, featuredImage, status, metaDescription, authorName)
  async updatePost(id, updateData = {}) {
    console.log("✏️ updatePost:", id);

    try {
      // fetch existing doc
      const existing = await this.database.getDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        id
      );

      // get current user
      const currentUser = await this.getCurrentUser();
      const currentAuthorId = currentUser?.prefs?.authorId;
      if (currentAuthorId === undefined || currentAuthorId === null)
        throw new Error("Authentication required.");

      // ownership check (by numeric authorId)
      if (String(existing.authorId) !== String(currentAuthorId))
        throw new Error("You are not the owner of this article.");

      // merge and validate
      const merged = { ...existing, ...updateData };
      merged.authorId = existing.authorId; // preserve owner

      if (!merged.title || !merged.content || !merged.authorId)
        throw new Error(
          "title, content, and authorId must be present after update."
        );

      // regenerate slug if title changed
      if (updateData.title && updateData.title !== existing.title) {
        merged.slug = await this.generateUniqueSlug(updateData.title);
      }

      // allowed payload (avoid system fields)
      const payload = {
        title: merged.title,
        slug: merged.slug,
        tags: merged.tags,
        content: merged.content,
        featuredImage: merged.featuredImage,
        featuredImagePublicId: merged.featuredImagePublicId,
        status: merged.status,
        metaDescription: merged.metaDescription,
        authorId: merged.authorId,
      };

      const updated = await this.database.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        id,
        payload
      );

      console.log("🔄 Article updated:", updated);
      // Broadcast event for UI (browser only)
      if (typeof window !== "undefined") {
        try {
          window.dispatchEvent(
            new CustomEvent("article:updated", { detail: updated })
          );
        } catch (e) {
          console.warn("⚠️ dispatch article:updated failed", e);
        }
      }
      return updated;
    } catch (error) {
      console.error("❌ updatePost error:", error?.message || error);
      throw error;
    }
  }

  /* ---------------------------
     PUBLISH / UNPUBLISH / FEATURE
     --------------------------- */

  // ✅ publishPost(id)
  // - Owner-only: sets status = 'published'
  async publishPost(id) {
    return this.updatePost(id, { status: "published" });
  }

  // ⚠️ unpublishPost(id)
  // - Owner-only: sets status = 'draft'
  async unpublishPost(id) {
    return this.updatePost(id, { status: "draft" });
  }

  // 🌟 toggleFeatured(id, value = true)
  // - Owner-only or admin: toggles featured flag (requires schema field 'featured' or use 'status')
  async toggleFeatured(id, value = true) {
    return this.updatePost(id, { featured: !!value });
  }

  /* ---------------------------
     DELETE (owner-only)
     --------------------------- */

  // 🗑️ deletePost(id)
  // - Only owner can delete. Appwrite will also enforce document write permission.
  async deletePost(id) {
    console.log("🗑️ deletePost:", id);

    try {
      const existing = await this.database.getDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        id
      );

      const currentUser = await this.getCurrentUser();
      const currentAuthorId = currentUser?.prefs?.authorId;
      if (currentAuthorId === undefined || currentAuthorId === null)
        throw new Error("Authentication required.");

      if (String(existing.authorId) !== String(currentAuthorId))
        throw new Error("You are not the owner of this article.");

      // Attempt to delete featured image first (ignore failures)
      if (existing?.featuredImage) {
        try {
          // Prefer stored publicId if present
          if (existing.featuredImagePublicId) {
            await deleteByPublicId(existing.featuredImagePublicId);
          } else if (
            typeof existing.featuredImage === "string" &&
            existing.featuredImage.startsWith("http")
          ) {
            const pubId = getPublicIdFromUrl(existing.featuredImage);
            if (pubId) await deleteByPublicId(pubId);
          } else {
            await this.deleteImage(existing.featuredImage);
          }
        } catch (e) {
          console.warn("⚠️ Unable to delete featured image:", e?.message || e);
        }
      }

      await this.database.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        id
      );

      console.log("✅ Article deleted");
      // Broadcast deletion event for UI (browser only)
      if (typeof window !== "undefined") {
        try {
          window.dispatchEvent(
            new CustomEvent("article:deleted", { detail: { id } })
          );
        } catch (e) {
          console.warn("⚠️ dispatch article:deleted failed", e);
        }
      }
      return true;
    } catch (error) {
      console.error("❌ deletePost error:", error?.message || error);
      throw error;
    }
  }

  /* ---------------------------
     IMAGE / FILES
     --------------------------- */

  // inside your Service class - replace the existing implementations

// Helper: try to make a file public (client-side attempt - may be restricted by bucket policy)
async makeFilePublic(fileId) {
  // NOTE: Changing file permissions after upload often requires server/admin privileges.
  // This client-side attempt will work only if your project/bucket allows it from client SDK.
  try {
    // If SDK supports updateFilePermissions or similar, call it here.
    // Many SDKs require server/admin key to change permissions for an existing file.
    if (typeof this.bucket.updateFile === "function") {
      // Some SDKs expose updateFile which accepts new permissions - try to set public read
      const perms = [
        Permission.read(Role.any()),
      ];
      await this.bucket.updateFile(config.appwriteBucketId, fileId, perms);
      console.log("[makeFilePublic] attempted updateFile with Permission/Role");
      return true;
    }
  } catch (err) {
    console.warn("[makeFilePublic] client-side permission update failed:", err?.message || err);
  }
  // Fallback: return false to indicate client couldn't change it.
  return false;
}

// 🪣 uploadImage(file)
// - Uploads a File object to the configured bucket and attempts to ensure public read.
// - Returns Appwrite file object (id, bucketId, etc.).
async uploadImage(file) {
  console.log("🪣 uploadImage (improved)");

  try {
    if (!file) throw new Error("No file provided.");

    const user = await this.getCurrentUser();
    if (!user) throw new Error("Authentication required to upload files.");

    // Preferred modern object-based permissions (SDK vX+)
    const objectPermissions = [
      Permission.read(Role.any()), // public read
      Permission.write(Role.user(String(user.$id || user.id))),
      Permission.update(Role.user(String(user.$id || user.id))),
      Permission.delete(Role.user(String(user.$id || user.id))),
    ];

    // Alternate simple string-permissions fallback for older SDKs
    const stringPermissions = ["role:all"];

    let uploaded;
    // Try object-based permissions first; if it fails, fall back to string permissions
    try {
      uploaded = await this.bucket.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file,
        objectPermissions
      );
      console.log("[uploadImage] uploaded using objectPermissions");
    } catch (errObj) {
      console.warn("[uploadImage] objectPermissions failed, trying stringPermissions:", errObj?.message || errObj);
      // fallback try
      uploaded = await this.bucket.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file,
        stringPermissions
      );
      console.log("[uploadImage] uploaded using stringPermissions");
    }

    console.log("📸 Image uploaded (response):", uploaded);

    // Try to fetch file meta to confirm permissions were set (may fail with certain SDKs)
    try {
      const meta = await this.bucket.getFile(config.appwriteBucketId, uploaded.$id || uploaded.id);
      console.log("📥 fetched file meta:", meta);
      // On success, meta may contain permission info ($permissions, permissions, or read)
    } catch (metaErr) {
      console.warn("⚠️ Unable to fetch file meta after upload (this may be normal in some SDKs):", metaErr?.message || metaErr);
    }

    // If uploaded but not public (you will see 403 on preview), you have two choices:
    // 1) Re-upload using server-side admin key to set perms (recommended for production)
    // 2) Use server to return a signed view URL (see server snippet earlier)
    return uploaded;
  } catch (error) {
    console.error("❌ uploadImage error:", error?.message || error);
    throw error;
  }
}

// 🗑️ deleteImage(fileId)
// - Deletes a file from Appwrite Storage bucket
async deleteImage(fileId) {
  try {
    if (!fileId) return false;
    await this.bucket.deleteFile(config.appwriteBucketId, fileId);
    return true;
  } catch (error) {
    console.warn("⚠️ deleteImage error:", error?.message || error);
    return false;
  }
}

// 🔗 getImagePreview(fileId)
// - Normalize SDK return (string or object), fallback to constructed preview URL.
// - NOTE: constructed preview will still 403 if file isn't public.
getImagePreview(fileId) {
  try {
    // SDK may return a string or an object { href }
    const maybe = this.bucket.getFilePreview(config.appwriteBucketId, fileId);
    // If maybe is a Promise (some SDKs), handle that
    if (maybe && typeof maybe.then === "function") {
      // return a promise resolving to a string
      return maybe.then((res) => {
        const url = res && typeof res === "object" && res.href ? res.href : String(res);
        console.log("[getImagePreview] async sdk returned ->", url);
        return url;
      }).catch((err) => {
        console.warn("[getImagePreview] async sdk failed:", err?.message || err);
        return this._fallbackPreviewUrl(fileId);
      });
    }

    const url = maybe && typeof maybe === "object" && maybe.href ? maybe.href : String(maybe);
    if (url && url !== "undefined") {
      console.log("[getImagePreview] sdk returned ->", url);
      return url;
    }
  } catch (err) {
    console.warn("[getImagePreview] sdk call error:", err?.message || err);
  }

  // Fallback: construct the preview URL (works only if file permissions are public)
  return this._fallbackPreviewUrl(fileId);
}

// Helper to construct fallback preview URL
_fallbackPreviewUrl(fileId) {
  const base = config.appwriteUrl.replace(/\/v1\/?$/, "");
  const fallback = `${base}/v1/storage/buckets/${config.appwriteBucketId}/files/${fileId}/preview?project=${config.appwriteProjectId}`;
  console.log("[getImagePreview] fallback ->", fallback);
  return fallback;
}

// 🔗 getFileViewUrl(fileId)
// - Normalize SDK return (string or object) and fallback to constructed view URL
getFileViewUrl(fileId) {
  try {
    const maybe = this.bucket.getFileView(config.appwriteBucketId, fileId);
    if (maybe && typeof maybe.then === "function") {
      return maybe.then((res) => {
        const url = res && typeof res === "object" && res.href ? res.href : String(res);
        console.log("[getFileViewUrl] async sdk returned ->", url);
        return url;
      }).catch((err) => {
        console.warn("[getFileViewUrl] async sdk failed:", err?.message || err);
        return this._fallbackViewUrl(fileId);
      });
    }

    const url = maybe && typeof maybe === "object" && maybe.href ? maybe.href : String(maybe);
    if (url && url !== "undefined") {
      console.log("[getFileViewUrl] sdk returned ->", url);
      return url;
    }
  } catch (err) {
    console.warn("[getFileViewUrl] sdk call error:", err?.message || err);
  }

  return this._fallbackViewUrl(fileId);
}

// Helper to construct fallback view URL
_fallbackViewUrl(fileId) {
  const base = config.appwriteUrl.replace(/\/v1\/?$/, "");
  return `${base}/v1/storage/buckets/${config.appwriteBucketId}/files/${fileId}/view?project=${config.appwriteProjectId}`;
}

  // 🔽 getFileDownloadUrl(fileId)
  // - Returns a direct download URL for the file (signed). This does not trigger the browser download.
  getFileDownloadUrl(fileId) {
    try {
      const url = this.bucket.getFileDownload(config.appwriteBucketId, fileId);
      return url && typeof url === "object" && url.href ? url.href : String(url);
    } catch (error) {
      console.error("❌ getFileDownloadUrl error:", error?.message || error);
      throw error;
    }
  }

  // 📥 downloadFile(fileId, filename)
  // - Downloads a file from Storage. In browser it triggers a file save using an object URL.
  // - Returns the raw data (ArrayBuffer/Blob) if used in non-browser environment.
  async downloadFile(fileId, filename = "download") {
    console.log("📥 downloadFile:", fileId);
    try {
      // Appwrite Storage getFileDownload returns the file binary/stream depending on environment.
      const result = await this.bucket.getFileDownload(
        config.appwriteBucketId,
        fileId
      );

      // Browser: result is a Blob or readable stream; try to trigger download
      if (typeof window !== "undefined") {
        try {
          // If result is a Response-like object with arrayBuffer
          if (result.arrayBuffer) {
            const buf = await result.arrayBuffer();
            const blob = new Blob([buf]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            return true;
          }

          // If SDK returned a blob directly
          if (result instanceof Blob) {
            const url = URL.createObjectURL(result);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            return true;
          }

          // Fallback: get a download URL and navigate
          const dlUrl = this.getFileDownloadUrl(fileId);
          // If it's a promise, await it
          const finalUrl =
            typeof dlUrl?.then === "function" ? await dlUrl : dlUrl;
          window.location.href = finalUrl;
          return true;
        } catch (err) {
          console.warn("⚠️ browser download fallback:", err);
          // continue to return raw result
        }
      }

      // Non-browser: return raw result (ArrayBuffer/stream)
      return result;
    } catch (error) {
      console.error("❌ downloadFile error:", error?.message || error);
      throw error;
    }
  }

  // 🖼️ downloadImage(fileId, filename)
  // - Convenience wrapper around downloadFile (same behavior)
  async downloadImage(fileId, filename = "image") {
    return this.downloadFile(fileId, filename);
  }

  // 📄 downloadPostAsJSON(id, filename)
  // - Fetches the post by id and triggers a JSON download with metadata ($createdAt, $updatedAt, etc.)
  async downloadPostAsJSON(id, filename = null) {
    console.log("📥 downloadPostAsJSON:", id);
    try {
      const post = await this.getPostById(id);
      if (!post) throw new Error("Post not found.");

      const dataStr = JSON.stringify(post, null, 2);
      const name =
        filename || `${post.slug || post.title || "post"}-${post.$id}.json`;

      // Browser: trigger download
      if (typeof window !== "undefined") {
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        return true;
      }

      // Non-browser: return data string
      return dataStr;
    } catch (error) {
      console.error("❌ downloadPostAsJSON error:", error?.message || error);
      throw error;
    }
  }

  // 📝 simpleHtmlToMarkdown(html)
  // - Very small converter for basic headings/paragraphs/links.
  // - Not a full converter; for complex HTML use a library.
  htmlToMarkdown(html = "") {
    if (!html) return "";
    // Replace headings
    let md = String(html);
    // remove line breaks to normalize
    md = md.replace(/\r\n/g, "\n");
    // basic tags -> markdown
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");
    md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
    md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
    md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
    md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");
    md = md.replace(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
    // strip remaining tags
    md = md.replace(/<[^>]+>/g, "");
    // unescape HTML entities basic
    md = md.replace(/&nbsp;/g, " ");
    md = md.replace(/&amp;/g, "&");
    md = md.replace(/&lt;/g, "<");
    md = md.replace(/&gt;/g, ">");
    return md.trim();
  }

  // 📥 downloadPostAsMarkdown(id, filename)
  // - Fetch post and attempt to convert content (HTML) to Markdown, then download.
  // - If content is plain text it downloads as-is.
  async downloadPostAsMarkdown(id, filename = null) {
    console.log("📥 downloadPostAsMarkdown:", id);
    try {
      const post = await this.getPostById(id);
      if (!post) throw new Error("Post not found.");

      // Make a simple markdown file with title and content
      const title = post.title || "Post";
      const slug = post.slug || post.$id;
      const mdFilename = filename || `${slug}-${post.$id}.md`;

      // If content looks like HTML (contains tags), try to convert; otherwise use raw
      const content = post.content || "";
      const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(content);
      const body = looksLikeHtml ? this.htmlToMarkdown(content) : content;

      const md = `# ${title}\n\n${body}\n\n---\n\nmeta:\n- authorId: ${post.authorId}\n- status: ${post.status}\n- created: ${post.$createdAt}\n- updated: ${post.$updatedAt}\n`;

      if (typeof window !== "undefined") {
        const blob = new Blob([md], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = mdFilename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        return true;
      }

      // Non-browser: return markdown string
      return md;
    } catch (error) {
      console.error(
        "❌ downloadPostAsMarkdown error:",
        error?.message || error
      );
      throw error;
    }
  }

  /* ---------------------------
     ACTIVE-ONLY PAGINATION (requested: status === 'active')
     --------------------------- */

  // 📦 getActivePostsPage(page = 1, perPage = 10, opts)
  // - Returns only posts with status === "active", paginated
  // - opts: { search, authorId, orderField, orderType }
  // - Returns: { page, perPage, total, totalPages, documents }
  async getActivePostsPage(
    page = 1,
    perPage = 10,
    {
      search = "",
      authorId = null,
      orderField = "$createdAt",
      orderType = "desc",
    } = {}
  ) {
    console.log("📚 getActivePostsPage:", { page, perPage, search, authorId });

    try {
      if (page < 1) page = 1;
      if (perPage < 1) perPage = 10;

      const offset = (page - 1) * perPage;
      const queries = [];

      // filter only active (Option A: status === "active")
      queries.push(Query.equal("status", "active"));

      // optional search on title
      if (search) queries.push(Query.search("title", search));

      // optional author filter
      if (authorId) queries.push(Query.equal("authorId", authorId));

      // pagination and sorting
      queries.push(Query.limit(perPage));
      queries.push(Query.offset(offset));
      if (orderType === "desc") queries.push(Query.orderDesc(orderField));
      else queries.push(Query.orderAsc(orderField));

      const res = await this.database.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        queries
      );

      const total = res.total ?? (res.documents ? res.documents.length : 0);
      const totalPages = Math.max(1, Math.ceil(total / perPage));

      return {
        page,
        perPage,
        total,
        totalPages,
        documents: res.documents || [],
      };
    } catch (error) {
      console.error("❌ getActivePostsPage error:", error?.message || error);
      throw error;
    }
  }

  /* ---------------------------
     PERMISSIONS / MIGRATION
     --------------------------- */

  // 🔁 migrateSetOwnerPermissions(batchSize = 100)
  // - Useful if you previously created documents without owner write permissions.
  // - This will iterate documents and set write perms to author (requires admin privileges or server key).
  // - Access: ADMIN / server-only (do not run from client).
  async migrateSetOwnerPermissions({ batchSize = 100 } = {}) {
    throw new Error(
      "migrateSetOwnerPermissions must run server-side with admin API key. Implement with server SDK."
    );
  }

  // 🔒 setDocumentPermissions(docId, authorId)
  // - Sets read/write for a single document. Requires server-side privileges to modify permissions on existing docs.
  // - Access: ADMIN / server-only
  async setDocumentPermissions(docId, authorId) {
    throw new Error(
      "setDocumentPermissions must be called from server (admin privileges required)."
    );
  }

  /* ---------------------------
     REALTIME / SUBSCRIPTIONS
     --------------------------- */

  // 🔔 subscribeToCollection(callback)
  // - Subscribe to realtime events for this collection.
  // - Access: PUBLIC (subscribe to events allowed by your project)
  // - Usage: const sub = dbService.subscribeToCollection((payload) => { console.log(payload); });
  //          sub.close(); // to stop
  subscribeToCollection(callback) {
    // NOTE: Appwrite realtime subscription uses client.subscribe([...topics], callback)
    // Example topic: `collections.{collectionId}.documents`
    const topic = `collections.${config.appwriteCollectionId}.documents`;
    console.log("🔔 Subscribing to topic:", topic);

    const unsubscribe = this.client.subscribe([topic], (response) => {
      // response will have event and payload depending on change
      try {
        callback(response);
      } catch (err) {
        console.error("❌ subscribe callback error:", err);
      }
    });

    // client.subscribe returns a subscription object; provide it back to caller to close
    return unsubscribe;
  }

  /* ---------------------------
     UTILS / UI HELPERS
     --------------------------- */

  // 👀 fetchAndCheckOwnership(id)
  // - Fetch post and return { post, isOwner }
  // - Access: PUBLIC (returns isOwner=false if unauthenticated)
  async fetchAndCheckOwnership(id) {
    const post = await this.getPostById(id);
    const user = await this.getCurrentUser();
    const userId = user?.$id || user?.id || null;
    const isOwner = userId && String(post.authorId) === String(userId);
    return { post, isOwner };
  }

  /* ---------------------------
     ADAPTER METHODS (compat with components)
     --------------------------- */

  // getPost: accepts id or slug; try by id then by slug
  async getPost(idOrSlug) {
    try {
      return await this.getPostById(idOrSlug);
    } catch (e) {
      const bySlug = await this.getPostBySlug(idOrSlug);
      if (bySlug) return bySlug;
      throw e;
    }
  }

  // uploadFile -> alias of uploadImage
  async uploadFile(file) {
    return this.uploadImage(file);
  }

  // deleteFile -> alias of deleteImage
  async deleteFile(fileId) {
    return this.deleteImage(fileId);
  }

  // getFilePreview -> alias of getImagePreview
  getFilePreview(fileId) {
    return this.getImagePreview(fileId);
  }
}

// 🟢 Export service instances (named + default for legacy imports)
export const dbService = new Service();
const appwriteService = dbService;
export default appwriteService;
