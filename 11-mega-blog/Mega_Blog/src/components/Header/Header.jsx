import React, { useEffect, useRef, useState } from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

/* ✨ Sparkles component (subtle, blue theme) */
const Sparkles = () => (
  <div className="absolute -top-2 -right-2 pointer-events-none">
    <motion.span
      className="absolute text-blue-300 text-sm"
      animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      ✦
    </motion.span>
    <motion.span
      className="absolute text-blue-200 text-xs right-3 top-3"
      animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.8, 1.1, 0.8] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    >
      ✧
    </motion.span>
  </div>
);

export default function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  /* underline refs */
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const [hoverIndex, setHoverIndex] = useState(null);

  const navItems = [
    { name: "Home", slug: "/", show: true },
    { name: "All Posts", slug: "/all-posts", show: true },
    { name: "Add Post", slug: "/add-post", show: authStatus },
    { name: "Login", slug: "/login", show: !authStatus },
    { name: "Signup", slug: "/signup", show: !authStatus },
  ];

  const visibleItems = navItems.filter((i) => i.show);
  const activeIndex = visibleItems.findIndex(
    (i) => i.slug === location.pathname
  );

  const [underline, setUnderline] = useState({
    left: 0,
    width: 0,
    visible: false,
  });

  const updateUnderlineForIndex = (index) => {
    const listEl = listRef.current;
    const target = itemRefs.current[index];
    if (!listEl || !target) return;

    const listRect = listEl.getBoundingClientRect();
    const itemRect = target.getBoundingClientRect();

    const width = Math.round(itemRect.width * 0.6);
    const left = itemRect.left - listRect.left + itemRect.width / 2 - width / 2;

    setUnderline({ left, width, visible: true });
  };

  useEffect(() => {
    if (hoverIndex !== null) updateUnderlineForIndex(hoverIndex);
    else if (activeIndex >= 0) updateUnderlineForIndex(activeIndex);
  }, [hoverIndex, activeIndex, location.pathname]);

  itemRefs.current = [];
  const setItemRef = (el, idx) => (itemRefs.current[idx] = el);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-blue-100 shadow-sm">
      <Container>
        <nav className="flex items-center py-3 relative">
          {/* Logo */}
          <Link to="/" className="relative mr-6">
            <Logo size={32} />
            <Sparkles />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex ml-auto items-center relative">
            <ul ref={listRef} className="flex items-center gap-2 relative">
              {visibleItems.map((item, idx) => (
                <li key={item.slug}>
                  <button
                    ref={(el) => setItemRef(el, idx)}
                    onClick={() => navigate(item.slug)}
                    onMouseEnter={() => setHoverIndex(idx)}
                    onMouseLeave={() => setHoverIndex(null)}
                    className="px-4 py-2 text-sm font-medium text-blue-700 hover:text-blue-900 transition"
                  >
                    {item.name}
                  </button>
                </li>
              ))}

              {/* underline */}
              <AnimatePresence>
                {underline.visible && (
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      left: underline.left,
                      width: underline.width,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute -bottom-2 h-1 rounded-full bg-blue-600"
                  />
                )}
              </AnimatePresence>
            </ul>

            {/* MORE DROPDOWN */}
            <div className="relative ml-3">
              <button
                onClick={() => setMoreOpen((v) => !v)}
                className="px-3 py-2 text-sm text-blue-700 hover:text-blue-900"
              >
                More ▾
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-blue-100 rounded-xl shadow-lg overflow-hidden"
                  >
                    <Link
                      to="/contact"
                      className="flex gap-2 px-4 py-2 hover:bg-blue-50"
                    >
                      📬 Contact
                    </Link>
                    <Link
                      to="/terms"
                      className="flex gap-2 px-4 py-2 hover:bg-blue-50"
                    >
                      📄 Terms
                    </Link>
                    <Link
                      to="/privacy"
                      className="flex gap-2 px-4 py-2 hover:bg-blue-50"
                    >
                      🔒 Privacy
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {authStatus && <LogoutBtn />}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="ml-auto md:hidden p-2"
          >
            ☰
          </button>
        </nav>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t">
            <ul className="py-3 space-y-2">
              {visibleItems.map((item) => (
                <li key={item.slug}>
                  <Link
                    to={item.slug}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <Link to="/contact" className="block px-4 py-2">
                📬 Contact
              </Link>
              <Link to="/terms" className="block px-4 py-2">
                📄 Terms
              </Link>
              <Link to="/privacy" className="block px-4 py-2">
                🔒 Privacy
              </Link>
            </ul>
          </div>
        )}
      </Container>
    </header>
  );
}
