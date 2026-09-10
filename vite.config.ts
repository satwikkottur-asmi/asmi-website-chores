import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Origin used to build absolute social-preview URLs (og:url, og:image, twitter:image).
// - Absolute URLs are mandatory → crawlers don't resolve relative paths
// - Override per-deploy via SITE_URL (e.g. staging previews advertise their own origin)
// - No trailing slash → templates supply it
const SITE_URL = (process.env.SITE_URL ?? "https://www.asmiai.com").replace(/\/+$/, "");

// Substitutes %SITE_URL% in index.html at build/serve time.
// Vite's built-in %VAR% syntax only covers VITE_-prefixed vars from .env files,
// so a transform hook keeps this working off a plain SITE_URL env var.
function htmlSiteUrl(): Plugin {
  return {
    name: "html-site-url",
    transformIndexHtml: {
      order: "pre",
      handler: (html) => html.replaceAll("%SITE_URL%", SITE_URL),
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths(), htmlSiteUrl()],
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
});
