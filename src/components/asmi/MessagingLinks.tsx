import { motion } from "motion/react";
import { EASE_OUT } from "@/lib/theme";
import { MessagingIcon } from "./MessagingIcon";

const IMESSAGE_URL = "https://asmi-ai.link/PH";
const WHATSAPP_URL = "https://asmi-ai.link/PH-2";

/** Compact nav-bar variant: icon + small caption label, no wrapper card. */
export function NavMessagingLinks({ iconSize = 40 }: { iconSize?: number }) {
  return (
    <div className="flex items-center gap-4">
      <MessagingLink href={IMESSAGE_URL} title="Open in iMessage" label="iMessage">
        <MessagingIcon app="imessage" size={iconSize} />
      </MessagingLink>
      <MessagingLink href={WHATSAPP_URL} title="Open in WhatsApp" label="WhatsApp">
        <MessagingIcon app="whatsapp" size={iconSize} />
      </MessagingLink>
    </div>
  );
}

/** Larger promotional variant with a caption line beneath both icons. */
export function ProductHuntLinks({
  size = "md",
  className = "",
}: {
  size?: "md" | "lg";
  className?: string;
}) {
  const iconSize = size === "lg" ? 64 : 48;
  const gap = size === "lg" ? "gap-8" : "gap-6";

  return (
    <div className={`w-full max-w-md mx-auto flex flex-col items-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className={`flex justify-center items-center ${gap}`}
      >
        <IconLink href={IMESSAGE_URL} title="Open in iMessage">
          <MessagingIcon app="imessage" size={iconSize} />
        </IconLink>
        <IconLink href={WHATSAPP_URL} title="Open in WhatsApp">
          <MessagingIcon app="whatsapp" size={iconSize} />
        </IconLink>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT }}
        className="mt-6 font-serif italic text-center"
        style={{ color: "var(--color-stone-dim)", fontSize: size === "lg" ? 16 : 14 }}
      >
        Choose your preferred way to chat with asmi
      </motion.p>
    </div>
  );
}

function IconLink({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="flex items-center justify-center hover:opacity-80 transition-opacity"
      title={title}
    >
      {children}
    </motion.a>
  );
}

function MessagingLink({
  href,
  title,
  label,
  children,
}: {
  href: string;
  title: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
      className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
      title={title}
    >
      {children}
      <span className="label-mono" style={{ fontSize: 9, color: "var(--color-stone)" }}>
        {label}
      </span>
    </motion.a>
  );
}
