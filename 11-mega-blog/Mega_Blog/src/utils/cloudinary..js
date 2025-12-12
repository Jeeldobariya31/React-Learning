/**
 * @file utils/cloudinary.js
 * -----------------------------------------------------------------------------
 * Utility module for handling file uploads and deletions on Cloudinary.
 * -----------------------------------------------------------------------------
 * This module provides two main functions:
 *  1️⃣ uploadOnCloudinary(localFilePath)  → Uploads a local file to Cloudinary.
 *  2️⃣ deleteOnCloudinary(publicId)       → Deletes a file from Cloudinary by its public ID.
 *
 * It automatically cleans up temporary local files after uploads (success or failure).
 * -----------------------------------------------------------------------------
 */

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

/* -----------------------------------------------------------------------------
 * 1. Cloudinary Configuration
 * -----------------------------------------------------------------------------
 * Cloudinary SDK requires authentication credentials.
 * Make sure your `.env` file includes:
 *
 *   CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   CLOUDINARY_API_KEY=your_api_key
 *   CLOUDINARY_API_SECRET=your_api_secret
 * -----------------------------------------------------------------------------
 */
// Prefer Vite env in browser/SSR, fallback to Node process.env
const ENV = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : process.env;

cloudinary.config({
  cloud_name: ENV.VITE_CLOUDINARY_CLOUD_NAME || ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.VITE_CLOUDINARY_API_KEY || ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.VITE_CLOUDINARY_API_SECRET || ENV.CLOUDINARY_API_SECRET,
});

/* -----------------------------------------------------------------------------
 * 2. Upload Function
 * -----------------------------------------------------------------------------
 */
/**
 * Uploads a file from the local filesystem to Cloudinary.
 *
 * @param {string} localFilePath - The path to the file stored temporarily on your server.
 * @returns {Promise<object|null>} - Returns the Cloudinary upload response object on success, or `null` on failure.
 *
 * Example response structure:
 * {
 *   asset_id: 'xxxxxxxx',
 *   public_id: 'uploads/abc123',
 *   format: 'jpg',
 *   resource_type: 'image',
 *   secure_url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/uploads/abc123.jpg',
 *   ...
 * }
 */
const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Check if a valid file path is provided
    if (!localFilePath) {
      console.warn("⚠️ No file path provided for Cloudinary upload.");
      return null;
    }

    // Upload the file to Cloudinary (auto-detects type: image/video/pdf/etc.)
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(
      "✅ File uploaded to Cloudinary successfully:",
      response.secure_url
    );

    // Clean up local temp file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    console.error("❌ Error uploading file to Cloudinary:", error.message);

    // Remove the local temp file to free up space if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null; // Return null to indicate upload failure
  }
};

/* -----------------------------------------------------------------------------
 * 3. Delete Function
 * -----------------------------------------------------------------------------
 */
/**
 * Deletes a file from Cloudinary using its public ID.
 *
 * @param {string} publicId - The unique Cloudinary public ID of the file.
 * @returns {Promise<object|null>} - Returns the Cloudinary deletion response, or `null` if deletion fails.
 *
 * Example usage:
 *   await deleteOnCloudinary('uploads/abc123');
 */
const deleteOnCloudinary = async (publicId) => {
  try {
    // Validate input
    if (!publicId) {
      console.warn("⚠️ No publicId provided for Cloudinary deletion.");
      return null;
    }

    // Attempt to delete the file from Cloudinary
    const response = await cloudinary.uploader.destroy(publicId);

    console.log("🗑️ File deleted from Cloudinary successfully:", response);
    return response;
  } catch (error) {
    console.error("❌ Error deleting file from Cloudinary:", error.message);
    return null;
  }
};

/* -----------------------------------------------------------------------------
 * 4. Exports
 * -----------------------------------------------------------------------------
 */
export { uploadOnCloudinary, deleteOnCloudinary };
