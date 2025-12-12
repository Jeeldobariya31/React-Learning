import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Popup({
  title = "Error",
  message = "",
  open,
  onClose,
}) {
  // Close on Escape key
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="alertdialog"
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 border border-blue-100"
            initial={{ opacity: 0, scale: 0.85, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                ⚠️
              </div>

              {/* Title + Message */}
              <div>
                <h3 className="font-semibold text-blue-900 text-lg mb-1">
                  {title}
                </h3>
                <p className="text-sm text-blue-700 whitespace-pre-wrap leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-[.97] transition"
              >
                OK
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
