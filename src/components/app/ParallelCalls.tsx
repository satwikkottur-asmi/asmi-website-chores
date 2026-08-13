import { Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { CallStepper, NextActionChip } from "./CallStepper";
import { CallWave } from "./Sparkle";
import type { Call } from "./useCanvases";

export function ParallelCalls({ calls, parallel }: { calls: Call[]; parallel?: boolean }) {
  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {calls.map((call) => {
          const isLive =
            call.status === "connected" || call.status === "ringing" || call.status === "dialing";
          return (
            <motion.div
              key={call.id}
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="soft-row px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-xl"
                    style={{
                      background: isLive ? "var(--violet-faint)" : "var(--ink-wash)",
                      color: isLive ? "var(--color-violet)" : "var(--color-ink-soft)",
                    }}
                  >
                    {isLive ? (
                      <CallWave color="var(--color-violet)" size={14} />
                    ) : (
                      <Phone size={14} strokeWidth={1.8} />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div
                      className="text-[15px] font-medium leading-tight"
                      style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}
                    >
                      {call.person}
                    </div>
                    {call.role && (
                      <div
                        className="font-mono text-[10.5px]"
                        style={{ color: "var(--color-ink-soft)" }}
                      >
                        {call.role}
                      </div>
                    )}
                  </div>
                </div>
                <CallStepper call={call} compact />
              </div>
              {(call.result || call.nextAction) && (
                <div
                  className="mt-2 flex flex-wrap items-center gap-2 pt-2"
                  style={{ borderTop: "1px solid var(--ink-wash)" }}
                >
                  {call.result && (
                    <span className="text-[12.5px]" style={{ color: "var(--color-ink-soft)" }}>
                      → {call.result}
                    </span>
                  )}
                  {call.nextAction && <NextActionChip next={call.nextAction} />}
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
      {parallel && calls.length > 1 && (
        <p className="chip-mono px-1" style={{ opacity: 0.7 }}>
          {calls.length} in parallel
        </p>
      )}
    </div>
  );
}
