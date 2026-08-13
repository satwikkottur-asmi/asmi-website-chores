import { CalendarDays, Check, Clock, X } from "lucide-react";
import type { SchedulingGrid } from "./useCanvases";

export function SchedulingView({ grid }: { grid: SchedulingGrid }) {
  return (
    <div
      className="overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl"
      style={{ border: "1px solid var(--violet-faint)" }}
    >
      <div
        className="flex items-center gap-2 border-b px-3 py-2.5"
        style={{ borderColor: "var(--violet-faint)" }}
      >
        <CalendarDays size={13} strokeWidth={1.8} style={{ color: "var(--color-violet)" }} />
        <span className="label-mono" style={{ color: "var(--color-ink-soft)", fontSize: 10 }}>
          slots · {grid.people.join(" · ")}
        </span>
      </div>
      <div
        className="grid items-center gap-2 border-b px-3 py-2"
        style={{
          gridTemplateColumns: `1fr repeat(${grid.people.length}, minmax(0, 0.6fr)) auto`,
          borderColor: "var(--violet-wash)",
        }}
      >
        <span className="label-mono" style={{ color: "var(--color-ink-muted)", fontSize: 9 }}>
          slot
        </span>
        {grid.people.map((p) => (
          <span
            key={p}
            className="label-mono text-center"
            style={{ color: "var(--color-ink-muted)", fontSize: 9 }}
          >
            {p}
          </span>
        ))}
        <span />
      </div>
      <div className="divide-y" style={{ borderColor: "var(--violet-wash)" }}>
        {grid.slots.map((s) => {
          const allOk = s.available.every(Boolean);
          return (
            <div
              key={s.id}
              className="grid items-center gap-2 px-3 py-2.5"
              style={{
                gridTemplateColumns: `1fr repeat(${grid.people.length}, minmax(0, 0.6fr)) auto`,
                background: s.chosen ? "var(--mint-wash)" : undefined,
              }}
            >
              <div
                className="flex items-center gap-1.5 text-[13px]"
                style={{ color: "var(--color-ink)" }}
              >
                <Clock size={11} strokeWidth={1.8} style={{ color: "var(--color-ink-soft)" }} />
                {s.label}
              </div>
              {s.available.map((ok, i) => (
                <div key={i} className="flex justify-center">
                  <span
                    className="grid h-5 w-5 place-items-center rounded-full"
                    style={{
                      background: ok ? "var(--mint-faint)" : "var(--destructive-wash)",
                      color: ok ? "var(--color-sage-deep)" : "var(--color-destructive)",
                    }}
                  >
                    {ok ? <Check size={11} strokeWidth={2.5} /> : <X size={11} strokeWidth={2.5} />}
                  </span>
                </div>
              ))}
              <div>
                {allOk && (
                  <span
                    className="label-mono rounded-full px-2 py-0.5"
                    style={{
                      background: s.chosen ? "var(--color-sage-deep)" : "var(--mint-faint)",
                      color: s.chosen ? "white" : "var(--color-sage-deep)",
                      fontSize: 8.5,
                    }}
                  >
                    {s.chosen ? "picked" : "all clear"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
