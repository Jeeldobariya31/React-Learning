import React from "react";
import { motion } from "framer-motion";

/**
 * Animated Brand Logo: Blogzilla 🦖
 * - Smooth entrance animation
 * - Subtle idle bounce
 * - Gradient shine animation
 * - Modern blue/green theme
 */
export default function Logo({ size = 40, showText = true }) {
  return (
    <motion.div
      className="flex items-center gap-2 select-none cursor-pointer"
      aria-label="Blogzilla Logo"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Icon */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        className="drop-shadow-md"
        animate={{ rotate: [0, -5, 5, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      >
        <defs>
          {/* Animated gradient */}
          <linearGradient id="blogzillaGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6">
              <animate
                attributeName="stop-color"
                values="#3b82f6; #22c55e; #3b82f6"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#22c55e">
              <animate
                attributeName="stop-color"
                values="#22c55e; #3b82f6; #22c55e"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>

        {/* background rounded box */}
        <rect
          x="6"
          y="6"
          width="52"
          height="52"
          rx="14"
          fill="#ffffff"
          stroke="#d1d5db"
          strokeWidth="2"
        />

        {/* Dino body (animated gradient) */}
        <path
          d="M22 44c6 2 14 2 20 0 2-1 3-3 2-5l-2-6 2-3c1-2 0-4-2-5l-6-3-3-4c-1-2-4-2-5 0l-3 4-6 3c-2 1-3 3-2 5l2 3-2 6c-1 2 0 4 2 5Z"
          fill="url(#blogzillaGradient)"
        />

        {/* Eye */}
        <circle cx="32" cy="26" r="2" fill="#0f172a" />

        {/* Mouth */}
        <path
          d="M27 34c3 2 7 2 10 0"
          stroke="#0f172a"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </motion.svg>

      {/* Brand Text */}
      {showText && (
        <motion.span
          className="text-xl md:text-2xl font-extrabold tracking-wide text-blue-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Blogzilla
        </motion.span>
      )}
    </motion.div>
  );
}
