import { AnimatePresence, motion } from "motion/react";
import { useState, FormEvent } from "react";

interface Props {
  size?: "md" | "lg";
  className?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WaitlistForm({ size = "md", className = "" }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handle = async (e: FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!EMAIL_RE.test(v) || v.length > 255) {
      setError("Please enter a valid email.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("https://prospective.asmiai.com/prospective/waitlist/join/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: v }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to join waitlist. Please try again.");
        setIsLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  const pad = size === "lg" ? "py-4 px-5" : "py-3 px-4";
  const btnPad = size === "lg" ? "px-6 py-4" : "px-5 py-3";

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {submitted ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex items-center gap-3 justify-center"
          >
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
              className="flex items-center justify-center rounded-full"
              style={{
                width: 32,
                height: 32,
                background: "rgba(44,37,32,0.06)",
                border: "1px solid rgba(44,37,32,0.08)",
              }}
              aria-hidden
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <motion.path
                  d="M2.5 7.5 L5.8 10.5 L11.5 4"
                  stroke="var(--color-espresso)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
                />
              </svg>
            </motion.span>
            <motion.span
              className="font-serif italic"
              style={{
                color: "var(--color-espresso)",
                fontSize: size === "lg" ? "1.15rem" : "1.05rem",
                background: "linear-gradient(180deg, transparent 62%, rgba(126,173,194,0.32) 62%, rgba(126,173,194,0.32) 92%, transparent 92%)",
                padding: "0 4px",
              }}
              initial={{ backgroundSize: "0% 100%" }}
              animate={{ backgroundSize: "100% 100%" }}
              transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            >
              You're on the list. We'll be in touch.
            </motion.span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            onSubmit={handle}
            className="flex flex-col sm:flex-row items-stretch gap-2 w-full"
            noValidate
          >
            <input
              type="email"
              required
              maxLength={255}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="your@email.com"
              aria-label="Email address"
              className={`flex-1 rounded-full bg-transparent font-sans text-base outline-none transition ${pad}`}
              style={{
                border: "1px solid rgba(44,37,32,0.18)",
                color: "var(--color-espresso)",
              }}
              onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(44,37,32,0.45)")}
              onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(44,37,32,0.18)")}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`btn-pill justify-center ${btnPad} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{ padding: undefined }}
            >
              {isLoading ? "Joining..." : "Join waitlist →"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-center font-sans"
            style={{ color: "var(--color-terracotta-deep)", fontSize: 13 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
