import React, { useState } from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appWrite/config";

export default function PostCard({ $id, title, featuredImage, className = "" }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const src =
    typeof featuredImage === "string" && featuredImage.startsWith("http")
      ? featuredImage
      : featuredImage
      ? appwriteService.getFilePreview(featuredImage)
      : null;

  const altText = title ? title : "Post image";

  return (
    <Link
      to={`/post/${$id}`}
      aria-label={`Open post: ${title}`}
      className={`block ${className}`}
    >
      <article className="w-full bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* image area: square aspect ratio (keeps layout stable) */}
        <div className="relative w-full pb-[100%] bg-blue-50">
          {/* skeleton while loading */}
          {!loaded && !error && (
            <div className="absolute inset-0 flex items-center justify-center animate-pulse">
              <div className="w-3/5 h-3/5 rounded-md bg-white/60" />
            </div>
          )}

          {/* image */}
          {src ? (
            <img
              src={src}
              alt={altText}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => {
                setError(true);
                setLoaded(false);
              }}
              className={`absolute inset-0 w-full h-full m-0 object-contain transition-opacity duration-300 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundColor: "transparent" }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-blue-300">
              <div className="flex flex-col items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12l4-4 3 3 5-5 4 4z" />
                </svg>
                <span className="text-sm">No image</span>
              </div>
            </div>
          )}

          {/* error fallback badge */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500">
              <div className="flex flex-col items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 9v4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12A9 9 0 1112 3a9 9 0 019 9z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm">Image failed to load</span>
              </div>
            </div>
          )}
        </div>

        {/* title / content */}
        <div className="p-4">
          <h3 className="text-sm md:text-base font-semibold text-blue-900 line-clamp-2">
            {title}
          </h3>
        </div>
      </article>
    </Link>
  );
}
