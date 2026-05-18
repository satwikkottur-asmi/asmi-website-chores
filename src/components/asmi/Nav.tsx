import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Nav() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 right-0 z-50"
          style={{
            background: "rgba(246, 241, 235, 0.78)",
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid rgba(44,37,32,0.05)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between" style={{ minHeight: 56 }}>
            <a href="#" className="font-serif italic text-xl" style={{ color: "var(--color-espresso)" }}>
              asmi
            </a>
            <div className="hidden md:flex items-center gap-8 font-sans text-[0.9rem]" style={{ color: "#6B6560" }}>
              <a href="#how" className="transition-colors" style={{ color: "#6B6560" }}
                 onMouseEnter={(e)=>e.currentTarget.style.color="#2C2520"}
                 onMouseLeave={(e)=>e.currentTarget.style.color="#6B6560"}>How</a>
              <span style={{ color: "var(--color-stone-dim)" }}>·</span>
              <a href="#stories" className="transition-colors" style={{ color: "#6B6560" }}
                 onMouseEnter={(e)=>e.currentTarget.style.color="#2C2520"}
                 onMouseLeave={(e)=>e.currentTarget.style.color="#6B6560"}>Stories</a>
              <span style={{ color: "var(--color-stone-dim)" }}>·</span>
              <a href="#languages" className="transition-colors" style={{ color: "#6B6560" }}
                 onMouseEnter={(e)=>e.currentTarget.style.color="#2C2520"}
                 onMouseLeave={(e)=>e.currentTarget.style.color="#6B6560"}>Languages</a>
            </div>
            <a href="#start" className="btn-pill" style={{ padding: "0.55rem 1.1rem", fontSize: "0.82rem" }}>
              <span className="hidden sm:inline">Join waitlist</span>
              <span className="sm:hidden">Waitlist</span>
            </a>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
