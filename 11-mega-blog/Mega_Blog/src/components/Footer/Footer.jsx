import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-blue-100 bg-white/80 backdrop-blur">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-7xl px-4 py-8"
      >
        {/* =======================
            TOP ROW
        ======================== */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          {/* Brand */}
          <span className="text-sm font-semibold text-blue-900">Blogzilla</span>

          {/* Links */}
          <div className="flex gap-6 text-sm">
            <motion.div whileHover={{ y: -1 }}>
              <Link
                to="/terms"
                className="text-blue-700 hover:text-blue-900 transition"
              >
                Terms
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -1 }}>
              <Link
                to="/privacy"
                className="text-blue-700 hover:text-blue-900 transition"
              >
                Privacy
              </Link>
            </motion.div>

            {/* ✅ NEW CONTACT LINK */}
            <motion.div whileHover={{ y: -1 }}>
              <Link
                to="/contact"
                className="text-blue-700 hover:text-blue-900 transition"
              >
                Contact
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-blue-100 mb-4" />

        {/* Copyright */}
        <p className="text-center text-sm text-blue-700">
          © {new Date().getFullYear()} Blogzilla. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
