// Canonical site metadata strings.
//
// Single source of truth for copy that appears in multiple places:
// - `index.html` → the static shell crawlers actually read
// - route-level `useDocumentMeta` → in-app title/description after hydration
//
// These previously drifted apart (mismatched descriptions, `—` vs `-`, casing),
// which is what this module exists to prevent. Update copy here, not at call sites.

export const SITE_DESCRIPTION =
  "she calls, texts, emails and chases - until your thing is actually done. cancel the gym, fight the charge, book the dentist.";

// <title>/document.title — distinct from SITE_OG_TITLE (og:title, twitter:title)
export const SITE_TITLE = "asmi - the most irritating assistant in the world";

// og:title / twitter:title — kept separate from SITE_TITLE (the <title> tag)
export const SITE_OG_TITLE = "AI for real-world chores";
