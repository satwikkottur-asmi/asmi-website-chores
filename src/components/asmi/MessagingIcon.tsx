/**
 * iMessage/WhatsApp glyph — WhatsApp gets its brand-green rounded square
 * backdrop, iMessage renders its own bubble artwork directly.
 */
export function MessagingIcon({ app, size }: { app: "imessage" | "whatsapp"; size: number }) {
  if (app === "whatsapp") {
    return (
      <span
        className="flex items-center justify-center"
        style={{
          width: size,
          height: size,
          background: "var(--color-whatsapp)",
          borderRadius: size >= 56 ? "12px" : "8px",
        }}
      >
        <img
          src="/assets/logos/whatsapp.svg"
          alt="WhatsApp"
          style={{ width: "60%", height: "60%" }}
        />
      </span>
    );
  }

  return (
    <img src="/assets/logos/imessage.svg" alt="iMessage" style={{ width: size, height: size }} />
  );
}
