import { useEffect } from "react";
import { Link } from "react-router-dom";

interface TermsSectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

const TermsSection = ({ number, title, children }: TermsSectionProps) => {
  return (
    <section className="mb-10 pb-8" style={{ borderBottom: "1px solid var(--color-border)" }}>
      <p
        className="label-mono mb-3"
        style={{ color: "var(--color-stone-dim)" }}
      >
        {number}
      </p>
      <h2
        className="font-serif mb-4"
        style={{
          color: "var(--color-espresso-strong)",
          fontSize: "1.75rem",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
};

const TermsAndConditions = () => {
  useEffect(() => {
    document.title = "Terms and Conditions | asmi";
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "var(--color-background)", color: "var(--color-foreground)" }}
    >
      {/* Navigation */}
      <nav className="px-5 sm:px-8 py-6">
        <Link
          to="/"
          className="font-serif italic"
          style={{ color: "var(--color-stone-dim)", fontSize: 14 }}
        >
          ← back to asmi
        </Link>
      </nav>

      <main className="flex flex-col items-center flex-1 px-5 sm:px-8 pb-16" style={{ color: "var(--color-ink)", fontSize: "1.05rem", lineHeight: 1.7 }}>
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1
              className="font-serif italic"
              style={{
                color: "var(--color-espresso-strong)",
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              }}
            >
              asmi
            </h1>
            <p
              className="font-serif"
              style={{
                color: "var(--color-espresso-strong)",
                fontSize: "1.75rem",
                marginTop: "0.5rem",
              }}
            >
              Terms and Conditions
            </p>
          </div>

          <div
            className="mb-8 pb-6 text-center"
            style={{
              borderBottom: "1px solid var(--color-border)",
              fontSize: "0.95rem",
            }}
          >
            <p style={{ color: "var(--color-stone-dim)" }}>Effective: May 2026</p>
            <p
              className="label-mono mt-2"
              style={{ color: "var(--color-stone-dim)" }}
            >
              Humint Labs, Inc. (incorporated in Delaware)
            </p>
            <p style={{ color: "var(--color-stone-dim)", marginTop: "0.25rem", fontSize: "0.9rem" }}>
              710 Lakeway Drive, Suite 200, Sunnyvale, CA 94085
            </p>
          </div>

          {/* Intro */}
          <p className="mb-10">
            These terms and conditions govern your use of Asmi and outline the rights and responsibilities
            of both you and Humint Labs, Inc. By using Asmi, you agree to these terms.
          </p>

          <div style={{ borderTop: "1px solid var(--color-border)", marginBottom: "2rem" }} />

          {/* Sections */}
          <TermsSection number="01 - SMS Terms & Conditions" title="SMS terms & conditions">
            <p className="mb-4">
              By using Asmi, you consent to receive SMS messages related to your interactions and requests.
              These messages may include summaries of calls, confirmations, and responses to actions you
              initiate.
            </p>
            <p className="mb-4">
              Message frequency varies based on your usage. Message and data rates may apply depending on
              your mobile carrier plan.
            </p>
            <p className="mb-4">
              You can opt out of receiving SMS messages at any time by replying <span className="font-mono">STOP</span>. For
              assistance, reply <span className="font-mono">HELP</span> or contact support at{" "}
              <a
                href="mailto:support@asmiai.com"
                style={{
                  fontWeight: "bold",
                  color: "var(--color-espresso-strong)",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                support@asmiai.com
              </a>
              .
            </p>
            <p>
              SMS messages are sent only after user-initiated actions or explicit consent during interactions.
              No marketing or promotional messages are sent.
            </p>
          </TermsSection>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditions;
