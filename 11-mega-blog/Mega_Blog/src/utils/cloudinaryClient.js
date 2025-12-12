// Browser-safe Cloudinary client utilities (unsigned upload + admin delete)
// NOTE: Using API secret in the browser is insecure. You have provided VITE_* secrets,
// so this implements deletion as requested. Consider moving deletion to a server.

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; // must be created as unsigned
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

// Helper: derive public_id from a secure_url
export function getPublicIdFromUrl(url) {
  try {
    if (!url || typeof url !== "string") return null;
    // Handles URLs like:
    //  - /image/upload/v123/folder/name.jpg
    //  - /image/upload/c_fill,w_500/v123/folder/name.jpg
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx === -1) return null;

    // Find version segment index after 'upload' (e.g., v1234567890)
    let startIdx = uploadIdx + 1;
    for (let i = uploadIdx + 1; i < parts.length; i++) {
      if (/^v\d+$/i.test(parts[i])) {
        startIdx = i + 1; // start after version
        break;
      }
    }

    const after = parts.slice(startIdx);
    const joined = after.join("/");
    if (!joined) return null;
    // strip extension
    const withoutExt = joined.replace(/\.[^/.]+$/, "");
    return withoutExt || null;
  } catch {
    return null;
  }
}

// Try unsigned upload. Returns { secure_url, public_id } on success
export async function uploadImageUnsigned(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary env missing: VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET");
  }
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(url, { method: "POST", body: form });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return { secure_url: data.secure_url, public_id: data.public_id };
}

// Admin delete by public_id (requires API Key/Secret). Returns true if deleted.
export async function deleteByPublicId(publicId) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error("Cloudinary admin env missing: VITE_CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET");
  }
  if (!publicId) return false;

  // Cloudinary Admin API uses DELETE via POST to: /resources/image/upload
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/upload`;
  const params = new URLSearchParams();
  params.append("public_ids[]", publicId);

  const basic = btoa(`${API_KEY}:${API_SECRET}`);
  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary delete failed: ${res.status} ${text}`);
  }
  return true;
}

// Guard helpers
export function isCloudinaryUrl(value) {
  return typeof value === "string" && /res\.cloudinary\.com\//.test(value);
}
