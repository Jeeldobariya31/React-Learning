import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaInstagram, FaEnvelope, FaGithub } from "react-icons/fa";

/* ⭐ Corner sparkles (BLUE THEME) */
const CornerSparkles = ({ color = "text-blue-300", className = "" }) => {
  return (
    <div
      className={`absolute -top-2 -right-2 pointer-events-none ${className}`}
    >
      <motion.div
        className={`${color} text-xl absolute`}
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        ✦
      </motion.div>

      <motion.div
        className={`${color} text-lg absolute top-5 right-3`}
        animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.7, 1.1, 0.7] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        ✧
      </motion.div>

      <motion.div
        className={`${color} text-sm absolute top-2 right-7`}
        animate={{ opacity: [0.1, 0.6, 0.1], scale: [0.7, 1, 0.7] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      >
        ✦
      </motion.div>
    </div>
  );
};

export default function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 py-12 space-y-10 relative"
    >
      {/* 🔵 Blue background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
        <div className="absolute -top-16 -left-10 w-44 h-44 bg-blue-300 blur-3xl rounded-full" />
        <div className="absolute -bottom-16 -right-10 w-52 h-52 bg-blue-400 blur-3xl rounded-full" />
      </div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-extrabold text-blue-900 text-center"
      >
        Contact Me
      </motion.h1>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        className="relative bg-white border border-blue-100 shadow-lg rounded-2xl p-8 sm:p-10 flex flex-col items-center space-y-6 overflow-hidden"
      >
        <CornerSparkles />

        <h2 className="text-2xl font-semibold text-blue-900">Jeel Dobariya</h2>

        <p className="text-blue-600 text-center max-w-lg">
          Open to collaboration, discussions, and project ideas. Reach out using
          any platform below.
        </p>

        {/* Social Links */}
        <div className="grid sm:grid-cols-2 gap-6 w-full mt-4">
          {/* LinkedIn */}
          <motion.a
            href="https://www.linkedin.com/in/jeel-dobariya-067041322"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.03, y: -3 }}
            className="relative p-4 border border-blue-100 rounded-xl flex items-center gap-4 bg-white hover:bg-blue-50 transition"
          >
            <CornerSparkles color="text-blue-400" />
            <FaLinkedin className="text-blue-600 text-3xl" />
            <div>
              <p className="font-semibold text-blue-900">LinkedIn</p>
              <p className="text-sm text-blue-500">Professional profile</p>
            </div>
          </motion.a>

          {/* Instagram */}
          <motion.a
            href="https://instagram.com/jeel_dobariya__"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.03, y: -3 }}
            className="relative p-4 border border-blue-100 rounded-xl flex items-center gap-4 bg-white hover:bg-blue-50 transition"
          >
            <CornerSparkles color="text-blue-300" />
            <FaInstagram className="text-pink-600 text-3xl" />
            <div>
              <p className="font-semibold text-blue-900">Instagram</p>
              <p className="text-sm text-blue-500">Daily updates</p>
            </div>
          </motion.a>

          {/* GitHub */}
          <motion.a
            href="https://github.com/jeeldobariya31"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.03, y: -3 }}
            className="relative p-4 border border-blue-100 rounded-xl flex items-center gap-4 bg-white hover:bg-blue-50 transition"
          >
            <CornerSparkles color="text-blue-400" />
            <FaGithub className="text-blue-800 text-3xl" />
            <div>
              <p className="font-semibold text-blue-900">GitHub</p>
              <p className="text-sm text-blue-500">@jeeldobariya31</p>
            </div>
          </motion.a>

          {/* Email */}
          <motion.a
            href="mailto:techsphere.devs@gmail.com"
            whileHover={{ scale: 1.03, y: -3 }}
            className="relative p-4 border border-blue-100 rounded-xl flex items-center gap-4 bg-white hover:bg-blue-50 transition"
          >
            <CornerSparkles color="text-blue-300" />
            <FaEnvelope className="text-blue-600 text-3xl" />
            <div>
              <p className="font-semibold text-blue-900">Email</p>
              <p className="text-sm text-blue-500">techsphere.devs@gmail.com</p>
            </div>
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
}
