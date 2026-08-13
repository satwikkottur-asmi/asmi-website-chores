import { Check, Circle, GripVertical, Loader2 } from "lucide-react";
import type { ChecklistItem } from "./useCanvases";

export function Checklist({ items }: { items: ChecklistItem[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it) => {
        const Icon = it.status === "done" ? Check : it.status === "doing" ? Loader2 : Circle;
        const tone =
          it.status === "done"
            ? "var(--color-sage-deep)"
            : it.status === "doing"
              ? "var(--color-violet)"
              : "var(--color-ink-muted)";
        const bg =
          it.status === "done"
            ? "var(--mint-faint)"
            : it.status === "doing"
              ? "var(--violet-faint)"
              : "transparent";
        return (
          <li
            key={it.id}
            className="flex items-start gap-2.5 rounded-xl bg-white/55 px-3 py-2.5"
            style={{ border: "1px solid var(--violet-wash)" }}
          >
            <GripVertical
              size={12}
              strokeWidth={1.5}
              style={{ color: "var(--color-ink-muted)", marginTop: 4 }}
            />
            <span
              className="mt-0.5 grid h-5 w-5 place-items-center rounded-full"
              style={{
                background: bg,
                border: it.status === "todo" ? `1.5px dashed ${tone}` : "none",
                color: tone,
              }}
            >
              <Icon
                size={11}
                strokeWidth={2.4}
                className={it.status === "doing" ? "animate-spin" : ""}
              />
            </span>
            <div className="min-w-0 flex-1">
              <div
                className="text-[13.5px] font-medium"
                style={{
                  color: "var(--color-ink)",
                  textDecoration: it.status === "done" ? "line-through" : "none",
                  opacity: it.status === "done" ? 0.6 : 1,
                }}
              >
                {it.label}
              </div>
              {it.detail && (
                <div className="text-[11.5px]" style={{ color: "var(--color-ink-soft)" }}>
                  {it.detail}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
