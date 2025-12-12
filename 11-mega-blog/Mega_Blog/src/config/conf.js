// 🌟 Appwrite Configuration File
// This file loads all Appwrite settings from Vite environment variables.
// Make sure you have these values set in your .env file! ⚙️

const config = {
  // 🌐 Appwrite API Endpoint
  // Example: https://cloud.appwrite.io/v1
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),

  // 🆔 Project ID
  // Found in Appwrite Dashboard → ⚙️ Settings → Project ID
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),

  // 🗄️ Database ID
  // Dashboard → Database → Select Database → 🔑 Database ID
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),

  // 📚 Table ID (formerly called Collection ID)
  // Dashboard → Database → Tables → Select Table → 🔑 Table ID
  // ⚠️ Appwrite SDK still uses "collectionId" naming!
  appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),

  // 🪣 Storage Bucket ID
  // Dashboard → Storage → Buckets → Select Bucket → 🔑 Bucket ID
  appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
};

// 📦 Export configuration so other files (services, components) can use it
export default config;
