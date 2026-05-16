import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/asmi/Nav";
import { Act1Opening } from "@/components/asmi/Act1Opening";
import { Act2CallViz } from "@/components/asmi/Act2CallViz";
import { Act3ThreeMoments } from "@/components/asmi/Act3Moments";
import { Act4Cloud } from "@/components/asmi/Act4Cloud";
import { Act5 } from "@/components/asmi/Act5";
import { Act6Close } from "@/components/asmi/Act6Close";
import { OrganicDivider } from "@/components/asmi/Atmosphere";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Asmi — AI that handles your personal chores in the physical world" },
      { name: "description", content: "Asmi makes real phone calls — plumbers, prescriptions, family check-ins. You text. Asmi handles it." },
      { property: "og:title", content: "Asmi — The screen era is over." },
      { property: "og:description", content: "AI that handles your personal chores in the physical world." },
    ],
  }),
});

function Index() {
  return (
    <main className="relative">
      <Nav />
      <Act1Opening />
      <Act2CallViz />
      <Act3ThreeMoments />
      <OrganicDivider />
      <Act4Cloud />
      <Act5 />
      <Act6Close />
      <footer className="px-6 py-12 text-center label-mono" style={{ color: "var(--color-stone-dim)" }}>
        asmi · 2026 · made for the physical world
      </footer>
    </main>
  );
}
