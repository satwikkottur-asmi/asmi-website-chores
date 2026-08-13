import { DollarSign, Sparkles, Star } from "lucide-react";
import type { Quote } from "./useCanvases";

export function QuotesTable({ quotes }: { quotes: Quote[] }) {
  // mark cheapest with the sparkle ribbon
  const numericPrice = (p: string) => parseFloat(p.replace(/[^\d.]/g, "")) || Infinity;
  const cheapestId = quotes
    .filter((q) => q.price && q.price !== "-")
    .sort((a, b) => numericPrice(a.price) - numericPrice(b.price))[0]?.id;

  return (
    <div
      className="overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl"
      style={{ border: "1px solid var(--violet-faint)" }}
    >
      <div
        className="label-mono grid gap-2 border-b px-3 py-2"
        style={{
          gridTemplateColumns: "1.6fr 0.6fr 0.9fr 0.9fr 0.5fr",
          color: "var(--color-ink-muted)",
          fontSize: 9,
          borderColor: "var(--violet-faint)",
        }}
      >
        <span>vendor</span>
        <span className="inline-flex items-center gap-1">
          <Star size={9} /> rating
        </span>
        <span className="inline-flex items-center gap-1">
          <DollarSign size={9} /> price
        </span>
        <span>start</span>
        <span>status</span>
      </div>
      <div className="divide-y" style={{ borderColor: "var(--violet-wash)" }}>
        {quotes.map((q) => (
          <div
            key={q.id}
            className="grid items-center gap-2 px-3 py-2.5"
            style={{ gridTemplateColumns: "1.6fr 0.6fr 0.9fr 0.9fr 0.5fr" }}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-[13px]" style={{ color: "var(--color-ink)" }}>
                  {q.vendor}
                </span>
                {q.id === cheapestId && (
                  <Sparkles size={10} strokeWidth={2} style={{ color: "var(--color-magenta)" }} />
                )}
              </div>
              {q.note && (
                <div className="truncate text-[10.5px]" style={{ color: "var(--color-ink-soft)" }}>
                  {q.note}
                </div>
              )}
            </div>
            <div
              className="flex items-center gap-1 text-[11.5px]"
              style={{ color: "var(--color-ink-soft)" }}
            >
              {q.rating ? (
                <>
                  <Star
                    size={10}
                    className="fill-current"
                    style={{ color: "var(--color-magenta)" }}
                  />
                  {q.rating}
                </>
              ) : (
                "-"
              )}
            </div>
            <div className="font-mono text-[11.5px]" style={{ color: "var(--violet-deep)" }}>
              {q.price}
            </div>
            <div className="text-[11.5px]" style={{ color: "var(--color-ink-soft)" }}>
              {q.availability}
            </div>
            <div>
              <span
                className="label-mono rounded-full px-1.5 py-0.5"
                style={{
                  fontSize: 8.5,
                  background:
                    q.status === "received"
                      ? "var(--mint-faint)"
                      : q.status === "declined"
                        ? "var(--destructive-wash)"
                        : "var(--violet-wash)",
                  color:
                    q.status === "received"
                      ? "var(--color-sage-deep)"
                      : q.status === "declined"
                        ? "var(--color-destructive)"
                        : "var(--color-ink-soft)",
                }}
              >
                {q.status === "received" ? "in" : q.status === "declined" ? "no" : "…"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
