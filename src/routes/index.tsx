import { Link } from "react-router-dom";
import { ChaseEngine } from "@/components/asmi/ChaseEngine";
import { ChoreGrid } from "@/components/asmi/ChoreGrid";
import { Cursor } from "@/components/asmi/Cursor";
import { GenerativeUI } from "@/components/asmi/GenerativeUI";
import { Hero } from "@/components/asmi/Hero";
import { LangCluster } from "@/components/asmi/LangCluster";
import { Nav } from "@/components/asmi/Nav";
import { Receipts } from "@/components/asmi/Receipts";
import { ScrollSection } from "@/components/asmi/Reveal";
import { ScrollProgress } from "@/components/asmi/ScrollProgress";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { SITE_DESCRIPTION, SITE_OG_TITLE, SITE_TITLE } from "@/lib/site-meta";
import asmiLogoUrl from "/assets/asmi-logo-black.png";

export default function Index() {
  useDocumentMeta(SITE_TITLE, [
    { name: "description", content: SITE_DESCRIPTION },
    { property: "og:title", content: SITE_OG_TITLE },
    { property: "og:description", content: SITE_DESCRIPTION },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]);

  return (
    <main className="landing-theme relative" style={{ overflowX: "clip" }}>
      <ScrollProgress />
      <Cursor />
      <Nav />
      <Hero />
      <Receipts />

      <ScrollSection>
        <GenerativeUI />
      </ScrollSection>
      <ScrollSection strength={18}>
        <ChaseEngine />
      </ScrollSection>
      <ScrollSection>
        <ChoreGrid />
      </ScrollSection>
      <ScrollSection>
        <LangCluster />
      </ScrollSection>

      <footer className="px-5 sm:px-8" style={{ background: "var(--paper-deep)" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 py-7">
          <Link to="/" aria-label="asmi home" className="shrink-0">
            <img src={asmiLogoUrl} alt="asmi" width={112} height={40} className="h-9 w-auto" />
          </Link>

          <div
            className="flex items-center gap-2 font-sans"
            style={{ color: "var(--ink-dim)", fontSize: 14 }}
          >
            <a href="mailto:support@asmiai.com" style={{ color: "inherit" }}>
              support@asmiai.com
            </a>
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
    </main>
  );
}
