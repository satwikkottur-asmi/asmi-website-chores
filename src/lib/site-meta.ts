// Canonical site metadata strings.
//
// Single source of truth for copy that appears in multiple places:
// - `index.html` → the static shell crawlers actually read
// - route-level `useDocumentMeta` → in-app title/description after hydration
//
// These previously drifted apart (mismatched descriptions, `—` vs `-`, casing),
// which is what this module exists to prevent. Update copy here, not at call sites.

export const SITE_DESCRIPTION =
  "AI for real-world chores. She calls, texts, emails and chases — she won't leave people alone until it's done.";

export const SITE_TITLE = "asmi - the most irritating assistant in the world";
