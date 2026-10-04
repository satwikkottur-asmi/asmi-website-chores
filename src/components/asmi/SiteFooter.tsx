import { Link } from "react-router-dom";
import asmiLogoUrl from "/assets/asmi-logo-black.png";

export function SiteFooter() {
  return (
    <footer className="px-5 sm:px-8" style={{ background: "var(--paper-deep)" }}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 py-7">
        <Link to="/" aria-label="asmi home" className="shrink-0">
          <img src={asmiLogoUrl} alt="asmi" width={112} height={40} className="h-9 w-auto" />
        </Link>

        <div
          className="flex flex-wrap items-center gap-2 font-sans"
          style={{ color: "var(--ink-dim)", fontSize: 14 }}
        >
          <a href="mailto:support@asmiai.com" style={{ color: "inherit" }}>
            support@asmiai.com
          </a>
          <span aria-hidden>·</span>
          <Link to="/pricing" style={{ color: "inherit" }}>
            Pricing
          </Link>
          <span aria-hidden>·</span>
          <Link to="/docs/mcp" style={{ color: "inherit" }}>
            MCP
          </Link>
          <span aria-hidden>·</span>
          <Link to="/terms-and-conditions" style={{ color: "inherit" }}>
            Terms
          </Link>
          <span aria-hidden>·</span>
          <Link to="/privacy" style={{ color: "inherit" }}>
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
