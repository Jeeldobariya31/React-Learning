import React, { useState } from "react";
import { useDispatch } from "react-redux";
import authService from "../../appWrite/auth";
import { logout } from "../../store/authSlice";
import { motion } from "framer-motion";

export default function LogoutBtn() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const logoutHandler = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await authService.logout();
      dispatch(logout());
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      onClick={logoutHandler}
      disabled={loading}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{
        y: -2,
        scale: 1.05,
        transition: { type: "spring", stiffness: 350, damping: 18 },
      }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative inline-flex items-center px-6 py-2 text-sm font-medium 
        text-blue-700 bg-white border border-blue-200 rounded-full 
        transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Animated underline on hover */}
      <span className="relative">
        {loading ? "Logging out..." : "Logout"}

        <motion.span
          className="absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600 rounded-full origin-center"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.25 }}
        />
      </span>
    </motion.button>
  );
}
