import { AnimatePresence, motion } from "motion/react";
import { Fragment, useEffect, useState } from "react";
import { withAlpha } from "@/lib/theme";
import { NavMessagingLinks } from "./MessagingLinks";

const NAV_LINKS = [
  { href: "#how", label: "How" },
  { href: "#stories", label: "Stories" },
  { href: "#languages", label: "Languages" },
];

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
            background: withAlpha("linen", 0.78),
            backdropFilter: "blur(14px)",
            borderBottom: `1px solid ${withAlpha("espresso", 0.05)}`,
          }}
        >
          <div
            className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between"
            style={{ minHeight: 56 }}
          >
            <a
              href="#"
              className="font-serif italic text-xl"
              style={{ color: "var(--color-espresso)" }}
            >
              asmi
            </a>
            <div
              className="hidden md:flex items-center gap-8 font-sans text-[0.9rem]"
              style={{ color: "var(--color-stone)" }}
            >
              {NAV_LINKS.map((link, i) => (
                <Fragment key={link.href}>
                  {i > 0 && <span style={{ color: "var(--color-stone-dim)" }}>·</span>}
                  <NavLink href={link.href}>{link.label}</NavLink>
                </Fragment>
              ))}
            </div>
            <NavMessagingLinks />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="transition-colors"
      style={{ color: "var(--color-stone)" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-espresso)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-stone)")}
    >
      {children}
    </a>
  );
}
