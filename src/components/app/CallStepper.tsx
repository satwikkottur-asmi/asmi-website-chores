import {
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MessageSquare,
  PauseCircle,
  Phone,
  PhoneOff,
  RotateCw,
  Voicemail,
} from "lucide-react";
import { motion } from "motion/react";
import type { Call } from "./useCanvases";

const STEPS: { key: Call["status"]; label: string }[] = [
  { key: "queued", label: "queued" },
  { key: "dialing", label: "dialing" },
  { key: "ringing", label: "ringing" },
  { key: "connected", label: "on call" },
  { key: "wrapping", label: "wrapping" },
];

const TERMINAL: Record<
  string,
  { label: string; tone: "good" | "bad" | "neutral"; Icon: typeof Phone }
> = {
  success: { label: "success", tone: "good", Icon: CheckCircle2 },
  voicemail: { label: "voicemail", tone: "neutral", Icon: Voicemail },
  failed: { label: "couldn't reach", tone: "bad", Icon: PhoneOff },
};

export function CallStepper({ call, compact = false }: { call: Call; compact?: boolean }) {
  const terminal = TERMINAL[call.status];
  const currentIdx = STEPS.findIndex((s) => s.key === call.status);

  if (terminal) {
    const tone = terminal.tone;
    const color =
      tone === "good"
        ? "var(--color-sage-deep)"
        : tone === "bad"
          ? "var(--color-destructive)"
          : "var(--color-ink-soft)";
    const bg =
      tone === "good"
        ? "var(--mint-faint)"
        : tone === "bad"
          ? "var(--destructive-wash)"
          : "var(--violet-wash)";
    const Icon = terminal.Icon;
    return (
      <div
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
        style={{ background: bg, color }}
      >
        <Icon size={12} strokeWidth={2} />
        <span className="label-mono" style={{ fontSize: 9.5, color }}>
          {terminal.label}
        </span>
        {call.durationSec ? (
          <span className="font-mono text-[10px] opacity-70">{fmt(call.durationSec)}</span>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${compact ? "" : "flex-wrap"}`}>
      {STEPS.map((s, i) => {
        const active = i === currentIdx;
        const passed = i < currentIdx;
        return (
          <div key={s.key} className="flex items-center gap-1.5">
            <motion.span
              animate={active ? { scale: [1, 1.12, 1] } : { scale: 1 }}
              transition={{ duration: 1.4, repeat: active ? Infinity : 0 }}
              className="grid place-items-center rounded-full"
              style={{
                width: active ? 22 : 16,
                height: active ? 22 : 16,
                background: active
                  ? "var(--gradient-brand)"
                  : passed
                    ? "var(--color-mint)"
                    : "var(--violet-faint)",
                color: "white",
                boxShadow: active ? "0 0 0 4px var(--violet-line)" : undefined,
              }}
            >
              {active ? (
                <Loader2 size={10} className="animate-spin" />
              ) : passed ? (
                <CheckCircle2 size={9} strokeWidth={2.5} />
              ) : (
                <span className="block h-1 w-1 rounded-full bg-current opacity-40" />
              )}
            </motion.span>
            {!compact && (
              <span
                className="label-mono"
                style={{
                  fontSize: 9,
                  color: active ? "var(--color-ink)" : "var(--color-ink-muted)",
                }}
              >
                {s.label}
              </span>
            )}
            {i < STEPS.length - 1 && (
              <span
                className="block h-px w-3"
                style={{ background: passed ? "var(--color-mint)" : "var(--violet-faint)" }}
              />
            )}
          </div>
        );
      })}
      {call.durationSec ? (
        <span
          className="ml-2 inline-flex items-center gap-1 font-mono text-[10px]"
          style={{ color: "var(--color-ink-soft)" }}
        >
          <Clock size={9} /> {fmt(call.durationSec)}
        </span>
      ) : null}
    </div>
  );
}

export function NextActionChip({ next }: { next: NonNullable<Call["nextAction"]> }) {
  const map = {
    callback: {
      Icon: RotateCw,
      label: `retry in ${next.kind === "callback" ? next.inMinutes : 0}m`,
    },
    message: { Icon: MessageSquare, label: "text sent" },
    email: { Icon: Mail, label: "email sent" },
    wait_user: { Icon: PauseCircle, label: "waiting on you" },
  } as const;
  const { Icon, label } = map[next.kind];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px]"
      style={{
        background: "var(--violet-faint)",
        color: "var(--violet-deep)",
        border: "1px solid var(--violet-line)",
      }}
    >
      <Icon size={10} strokeWidth={2} />
      {label}
    </span>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
