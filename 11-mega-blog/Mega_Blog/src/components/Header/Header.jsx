import React, { useEffect, useRef, useState } from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // refs for each nav item and the list container
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  // hover index; when null we show activeIndex underline
  const [hoverIndex, setHoverIndex] = useState(null);

  const navItems = [
    { name: "Home", slug: "/", show: true },
    { name: "All Posts", slug: "/all-posts", show: true },
    { name: "Add Post", slug: "/add-post", show: authStatus },
    { name: "Login", slug: "/login", show: !authStatus },
    { name: "Signup", slug: "/signup", show: !authStatus },
  ];

  const visibleItems = navItems.filter((i) => i.show);
  const activeIndex = visibleItems.findIndex((i) => i.slug === location.pathname);

  // underline geometry state
  const [underline, setUnderline] = useState({ left: 0, width: 0, visible: false });

  // helper to measure target item and update underline
  const updateUnderlineForIndex = (index) => {
    const listEl = listRef.current;
    const target = itemRefs.current[index];
    if (!listEl || !target) {
      setUnderline((u) => ({ ...u, visible: false }));
      return;
    }
    const listRect = listEl.getBoundingClientRect();
    const itemRect = target.getBoundingClientRect();

    // compute left relative to list container
    const left = itemRect.left - listRect.left + itemRect.width * 0.5; // center point
    const width = Math.round(itemRect.width * 0.6); // 60% of item width
    // convert left to start position so underline centered under label:
    const leftPx = left - width / 2;

    setUnderline({ left: leftPx, width, visible: true });
  };

  // When hover changes, update underline
  useEffect(() => {
    if (hoverIndex !== null) {
      updateUnderlineForIndex(hoverIndex);
      return;
    }
    // not hovering -> show active if exists
    if (activeIndex >= 0) updateUnderlineForIndex(activeIndex);
    else setUnderline((u) => ({ ...u, visible: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverIndex, activeIndex, location.pathname]);

  // update on resize / font changes
  useEffect(() => {
    const onResize = () => {
      const idx = hoverIndex !== null ? hoverIndex : activeIndex;
      if (idx !== null && idx !== undefined && idx >= 0) updateUnderlineForIndex(idx);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [hoverIndex, activeIndex]);

  // keep itemRefs in sync
  itemRefs.current = [];
  const setItemRef = (el, idx) => {
    itemRefs.current[idx] = el;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-blue-100 shadow-sm">
      <Container>
        <nav className="flex items-center py-3">
          <div className="mr-4 flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-md hover:bg-blue-50 active:scale-95 transition"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <Link to="/" className="shrink-0">
              <Logo size={32} />
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex ml-auto items-center relative">
            <ul ref={listRef} className="flex items-center gap-2 relative">
              {visibleItems.map((item, idx) => {
                const isActive = location.pathname === item.slug;
                return (
                  <li key={item.slug} className="relative">
                    <button
                      ref={(el) => setItemRef(el, idx)}
                      onClick={() => navigate(item.slug)}
                      onMouseEnter={() => setHoverIndex(idx)}
                      onMouseLeave={() => setHoverIndex(null)}
                      className={`group relative inline-block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-blue-700 hover:text-blue-900 ${isActive ? "font-semibold" : "font-medium"} transform-gpu hover:-translate-y-[1px]`}
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <span className="inline-block transform-gpu transition-transform duration-200 group-hover:scale-x-105">
                        {item.name}
                      </span>
                    </button>
                  </li>
                );
              })}

              {/* absolute underline controlled by measured geometry */}
              <AnimatePresence>
                {underline.visible && (
                  <motion.span
                    key="underline"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0, left: underline.left }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{
                      position: "absolute",
                      bottom: -6,
                      height: 4,
                      width: underline.width,
                      borderRadius: 9999,
                      background: "rgb(37 99 235)", // blue-600
                      transform: "translateZ(0)",
                    }}
                  />
                )}
              </AnimatePresence>
            </ul>

            {/* Right side actions (logout) */}
            {authStatus && (
              <div className="ml-3">
                <LogoutBtn />
              </div>
            )}
          </div>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden origin-top animate-[dropdown_200ms_ease-out]">
            <ul className="flex flex-col gap-1 pb-3">
              {visibleItems.map((item) => (
                <li key={item.slug}>
                  <button
                    onClick={() => {
                      navigate(item.slug);
                      setOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 active:scale-[.99] transition"
                  >
                    {item.name}
                  </button>
                </li>
              ))}

              {authStatus && (
                <li className="px-2">
                  <LogoutBtn />
                </li>
              )}
            </ul>
          </div>
        )}
      </Container>
    </header>
  );
}
