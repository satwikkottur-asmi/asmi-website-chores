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
import { SiteFooter } from "@/components/asmi/SiteFooter";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { SITE_DESCRIPTION, SITE_OG_TITLE, SITE_TITLE } from "@/lib/site-meta";

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

      <SiteFooter />
    </main>
  );
}
