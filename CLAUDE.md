# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **TanStack Start + React** full-stack web application built with:
- **Build tool**: Vite with @lovable.dev/vite-tanstack-config
- **Framework**: TanStack Start (React Router with SSR)
- **Styling**: Tailwind CSS with shadcn/ui components
- **UI Components**: Radix UI (via shadcn/ui)
- **State management**: TanStack React Query
- **Hosting**: Cloudflare (see wrangler.jsonc)
- **Package manager**: Bun (bun.lock, bunfig.toml present)

The codebase is a branded website/demo with multiple "acts" (Act1Opening, Act2CallViz, etc.) featuring interactive scenes, animations, and atmospheric effects.

## Development Commands

```bash
# Install dependencies
bun install

# Start development server (Vite dev mode with SSR)
bun run dev

# Build for production
bun run build

# Build in development mode (useful for debugging production issues)
bun run build:dev

# Preview production build locally
bun run preview

# Lint code
bun run lint

# Format code (Prettier)
bun run format
```

## Project Structure

- `src/routes/` — TanStack Router route definitions (file-based routing)
  - `__root.tsx` — Root layout with QueryClientProvider and global error handling
  - `index.tsx` — Home page
  - Routes are automatically generated into `routeTree.gen.ts` (do not edit manually)
- `src/components/` — React components
  - `asmi/` — Domain-specific components (Nav, WaitlistForm, Act1Opening, Act2CallViz, etc.)
  - `ui/` — shadcn/ui reusable components (buttons, forms, dialogs, etc.)
- `src/hooks/` — Custom React hooks (e.g., use-mobile.tsx)
- `src/lib/` — Utilities and helpers
  - `utils.ts` — General utilities (classname merging, etc.)
  - `error-page.ts`, `error-capture.ts` — Error handling
- `src/server.ts` — SSR server entry point (wrapped with error handling)
- `src/router.tsx` — Router factory function with React Query setup
- `src/styles.css` — Global Tailwind + CSS variables

## Key Architecture Notes

### TanStack Start Setup
- **File-based routing**: Routes are automatically discovered from `src/routes/`. The router tree is auto-generated; do not manually edit `routeTree.gen.ts`.
- **Server context**: The app passes `{ queryClient }` via router context, making React Query available throughout the app.
- **SSR-aware**: Use `.server.ts` suffix (not `server-only` package) for server-only code.

### Configuration
- **Path aliases**: `@/*` maps to `src/*` (configured in tsconfig.json and components.json)
- **shadcn/ui config**: `components.json` defines the component style (new-york) and paths (@/components, @/ui, @/hooks, etc.)
- **Vite config**: Uses @lovable.dev's preset which auto-includes tanstackStart, viteReact, tailwindcss, tsConfigPaths, and cloudflare plugin. Do not manually re-add these or the build will break.

### Styling & UI
- **Tailwind CSS** with shadcn/ui components (Radix UI underneath)
- CSS variables for theming (baseColor: slate)
- Custom animation library: `tw-animate-css`, `motion`, `gsap` for interactive scenes

### State Management
- **React Query**: TanStack React Query for server state (client uses `QueryClient` from router context)
- **Forms**: React Hook Form + Zod for validation (WaitlistForm example)

## Common Tasks

### Adding a new page/route
1. Create a file in `src/routes/` (e.g., `src/routes/about.tsx`)
2. The route tree will auto-generate; restart dev server if needed
3. Use `<Link to="/about">` in components to navigate

### Adding a new UI component
1. Use `npx shadcn-ui@latest add <component>` (if available in shadcn registry)
2. Or copy from shadcn's component library and place in `src/components/ui/`
3. Import via `@/components/ui/<component>`

### Creating server-side functions
1. Create `.server.ts` files in routes or `src/lib/`
2. Import using `import { action } from './file.server'`
3. Do NOT use `server-only` package; TanStack Start handles server/client boundaries differently

## Type Checking & Linting

- **TypeScript**: Strict mode enabled, target ES2022, moduleResolution: "Bundler"
- **ESLint**: Configured with TypeScript ESLint, React Hooks rules, Prettier integration
- **Prettier**: Auto-format on save (recommended)
- No unused variables/parameters warnings enabled (`noUnusedLocals: false`, `noUnusedParameters: false`)

## Deployment

- Targets **Cloudflare** (see wrangler.jsonc and @cloudflare/vite-plugin in config)
- Build artifacts go to `dist/` directory
- Server entry point redirected to `src/server.ts` via vite.config.ts
