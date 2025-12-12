import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="border-t border-blue-100 bg-white/80 backdrop-blur">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-7xl px-4 py-8"
      >
        {/* Navigation / social links (optional) */}
        {/*
        <div className="flex justify-center gap-6 mb-4">
          {["Home", "All Posts", "About", "Contact"].map((txt, idx) => (
            <motion.a
              key={idx}
              href="#"
              whileHover={{ scale: 1.06, y: -1 }}
              className="text-blue-700 hover:text-blue-900 text-sm font-medium transition"
            >
              {txt}
            </motion.a>
          ))}
        </div>
        */}

        {/* Divider */}
        <div className="w-full h-[1px] bg-blue-100 mb-4" />

        {/* Copyright */}
        <p className="text-center text-sm text-blue-700">
          © {new Date().getFullYear()} Mega Blog. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
