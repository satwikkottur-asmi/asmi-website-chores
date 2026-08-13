/** Static "asmi" avatar header used atop imessage-thread mockups. Memoized so parent state changes (scroll, phase) don't re-render it. */
import { memo } from "react";

export const ThreadHeader = memo(function ThreadHeader() {
  return (
    <div
      className="flex items-center gap-2 pb-3"
      style={{ borderBottom: "1px dashed var(--ink-line)" }}
    >
      <span
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-display"
        style={{ background: "var(--blue)", color: "#fff", fontSize: 14, fontWeight: 700 }}
      >
        a
      </span>
      <p className="font-display truncate" style={{ fontWeight: 700, fontSize: 15 }}>
        asmi
      </p>
      <span
        className="ml-auto shrink-0 font-mono"
        style={{ fontSize: "var(--t-mono)", color: "var(--ink-dim)" }}
      >
        imessage
      </span>
    </div>
  );
});
