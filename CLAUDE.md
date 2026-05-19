# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **React + Vite** frontend web application built with:
- **Build tool**: Vite
- **Framework**: React Router v6
- **Styling**: Tailwind CSS with custom CSS variables
- **UI Components**: Radix UI (via shadcn/ui)
- **State management**: TanStack React Query
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

- `src/routes/` — React Router v6 route components
  - `__root.tsx` — Root layout with error boundaries
  - `index.tsx` — Home page
  - `privacy.tsx` — Privacy Policy page
  - `terms-and-conditions.tsx` — Terms and Conditions page
- `src/components/` — React components
  - `asmi/` — Domain-specific components (Nav, WaitlistForm, Act1Opening, Act2CallViz, etc.)
  - `ui/` — shadcn/ui reusable components (buttons, forms, dialogs, etc.)
- `src/hooks/` — Custom React hooks (e.g., use-mobile.tsx)
- `src/lib/` — Utilities and helpers
  - `utils.ts` — General utilities (classname merging, etc.)
- `src/main.tsx` — React Router setup and application entry point
- `src/styles.css` — Global Tailwind + CSS variables

## Key Architecture Notes

### React Router Setup
- **BrowserRouter**: Client-side routing via React Router v6
- **QueryClientProvider**: TanStack React Query is initialized in main.tsx
- **Route registration**: Routes are manually registered in `src/main.tsx`

### Configuration
- **Path aliases**: `@/*` maps to `src/*` (configured in tsconfig.json)
- **shadcn/ui config**: `components.json` defines the component style (new-york) and paths (@/components, @/ui, @/hooks, etc.)
- **Vite config**: Standard Vite setup with React plugin and Tailwind CSS integration

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

### Adding a new route
1. Create a new file in `src/routes/` (e.g., `src/routes/about.tsx`)
2. Register the route in `src/main.tsx` within the Routes component
3. The route will be available at its corresponding path (e.g., `/about`)

## Type Checking & Linting

- **TypeScript**: Strict mode enabled, target ES2022, moduleResolution: "Bundler"
- **ESLint**: Configured with TypeScript ESLint, React Hooks rules, Prettier integration
- **Prettier**: Auto-format on save (recommended)
- No unused variables/parameters warnings enabled (`noUnusedLocals: false`, `noUnusedParameters: false`)

## Deployment

- Frontend-only SPA (Single Page Application)
- Build artifacts go to `dist/` directory
- Static site hosting compatible (Netlify, Vercel, GitHub Pages, etc.)
