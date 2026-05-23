import { motion } from "motion/react";

interface Props {
  size?: "md" | "lg";
  className?: string;
}

export function ProductHuntLinks({ size = "md", className = "" }: Props) {
  const iconSize = size === "lg" ? 64 : 48;
  const gap = size === "lg" ? "gap-8" : "gap-6";

  return (
    <div className={`w-full max-w-md mx-auto flex flex-col items-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className={`flex justify-center items-center ${gap}`}
      >
        {/* iMessage Link */}
        <motion.a
          href="https://asmi-ai.link/PH"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex items-center justify-center hover:opacity-80 transition-opacity"
          title="Open in iMessage"
        >
          <img src="/assets/logos/imessage.svg" alt="iMessage" style={{ width: iconSize, height: iconSize }} />
        </motion.a>

        {/* WhatsApp Link */}
        <motion.a
          href="https://asmi-ai.link/PH-2"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex items-center justify-center hover:opacity-80 transition-opacity"
          style={{
            width: iconSize,
            height: iconSize,
            background: "#25D366",
            borderRadius: "12px",
          }}
          title="Open in WhatsApp"
        >
          <img src="/assets/logos/whatsapp.svg" alt="WhatsApp" style={{ width: "60%", height: "60%" }} />
        </motion.a>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
        className="mt-6 font-serif italic text-center"
        style={{
          color: "var(--color-stone-dim)",
          fontSize: size === "lg" ? 16 : 14,
        }}
      >
        Choose your preferred way to chat with asmi
      </motion.p>
    </div>
  );
}
