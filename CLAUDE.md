# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: **pnpm**. Use `pnpm install` to set up.

- `pnpm dev` — Vite dev server on port 3000 (env loaded from repo-root `.env`)
- `npx playwright test` — run Playwright E2E in `tests/`
- `npx playwright test tests/smoke.spec.ts` — single spec
- `npx tsc --noEmit` — type-check (strict config)

The `package.json` `start` / `build` / `test` scripts still reference `react-scripts` but are stale — the project is on Vite. Use `pnpm dev` for development; production build is `npx vite build` (Vite writes to `src/dist` per `vite.config.ts`).

## Architecture

Single-page React 19 + MUI v9 site (personal portfolio + LinkedIn OAuth demo). TypeScript with very strict `tsconfig` (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noImplicitOverride`, etc.). No unit-test framework wired up.

**Vite quirks (`vite.config.ts`):**
- `root: 'src'` — `index.html` lives in `src/`, not repo root
- `envDir: '..'` — env vars are read from repo-root `.env`; client-exposed vars must be prefixed `VITE_*`
- Path alias `@/*` → `src/*`

**Composition (`src/App.tsx`):**
```
AuthProvider → NotificationProvider → ThemeProvider(theme) → CssBaseline
  AppBar, Background, Header, Notification, Main, CookiePolicy, Footer
```
`Main` does not contain page content directly — it iterates `src/menuItems.tsx`, rendering each entry through `components/Content/Section.tsx`. To add or edit a portfolio section, edit `menuItems.tsx`; the layout picks it up automatically.

**Providers (`src/providers/`):**
- `AuthProvider` — LinkedIn 3-stage OAuth (redirect → code → token). Reads `VITE_LINKEDIN_*`, `VITE_REDIRECT_URL`, `VITE_API`, etc. from env.
- `idb.ts` — IndexedDB wrapper (`idb` package) used in place of `localStorage` for user data.
- `NotificationProvider` — global snackbar/notification context consumed by `Layout/Notification.tsx`.

**Styling — migration in progress (`refactor/mui-styled-migration`):**
The codebase is moving from `tss-react/mui`'s `makeStyles` to MUI v9's `styled()` API, co-located per component. Spec: `specs/2026-05-27-mui-style-system-migration-design.md`. Plan: `plans/2026-05-27-mui-style-system-migration.md`. New components should use `styled()`, not `makeStyles`. Theme is `src/styles/theme.ts` (single dark theme, no `.dark` wrapper).

## Repo conventions

- **No tests / no verification steps.** The user explicitly rejects test code and verification (`npx tsc`, `pnpm dev` smoke, Playwright runs) inside plans and implementations for this repo. Edit → commit. Do not add a vitest/jest setup or write new spec files unless asked.
- `plans/` holds implementation plans, `specs/` holds design specs, `src/work/` holds personal Mermaid/markdown work artifacts.
- Production assets historically built to `docs/` (for GitHub Pages); Vite now outputs to `src/dist/`. `CNAME` was deleted in recent commit — confirm hosting target before changing build output.
