import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, ArrowRight } from "lucide-react";
import appwriteService from "../appWrite";

/**
 * PostCard
 * --------------------------------------------------
 * - Modern blog card UI
 * - Uses SLUG for routing
 * - Image + title + author
 * - Icons & hover effects
 * - Appwrite FREE plan safe
 */
export default function PostCard({
  slug,
  title,
  featuredImage,
  authorName,
  className = "",
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imageSrc = featuredImage
    ? appwriteService.getImageUrl(featuredImage)
    : null;

  return (
    <Link
      to={`/post/${slug}`}
      aria-label={`Read post: ${title}`}
      className={`group block ${className}`}
    >
      <article className="bg-white rounded-2xl overflow-hidden border border-blue-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* ================= IMAGE ================= */}
        <div className="relative aspect-[4/3] bg-blue-50 overflow-hidden">
          {/* Skeleton */}
          {!loaded && !error && imageSrc && (
            <div className="absolute inset-0 animate-pulse bg-blue-100" />
          )}

          {/* Image */}
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={title || "Post image"}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => {
                setError(true);
                setLoaded(false);
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500
                ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
                group-hover:scale-110`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-blue-300 text-sm">
              No image
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

          {/* Author badge */}
          <div className="absolute left-3 bottom-3 flex items-center gap-1 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-blue-700 shadow">
            <User size={14} />
            {authorName || "Author"}
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-4">
          <h3 className="text-base md:text-lg font-bold text-blue-900 leading-snug line-clamp-2 mb-2">
            {title}
          </h3>

          <div className="flex items-center gap-1 text-sm text-blue-600 group-hover:text-blue-800">
            Read full article
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </div>
        </div>
      </article>
    </Link>
  );
}
