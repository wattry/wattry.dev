# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: **pnpm**. Use `pnpm install` to set up.

- `pnpm dev` — Vite dev server (`pnpm start` pins port 3000; env loaded from repo-root `.env`)
- `pnpm build` — production build (Vite `outDir: '../dist'` with `root: 'src'` → repo-root `dist/`)
- `npx tsc --noEmit` — type-check (strict config)

## Architecture

Single-page React 19 + MUI v9 site (personal portfolio + LinkedIn OAuth demo). TypeScript with very strict `tsconfig` (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noImplicitOverride`, etc.). No unit-test framework wired up.

**Vite quirks (`vite.config.ts`):**
- `root: 'src'` — `index.html` lives in `src/`, not repo root
- `envDir: '..'` — env vars are read from repo-root `.env`; client-exposed vars must be prefixed `VITE_*`
- Path alias `@/*` → `src/*`

**Composition (`src/App.tsx`):**
```
AuthProvider → NotificationProvider → ThemeProvider(theme) → CssBaseline
  Background, Header, Notification, Main, TerminalContextProvider(Terminal), Footer
```
Page content is surfaced through the interactive terminal (`components/Layout/Terminal.tsx`, `react-terminal`). Each command (`about`, `skills`, `work`, `promise`, …) is an entry in its `commands` record with a `handler` and a `help` element; the `defaultHandler` dispatches and handles `help`/`-h`. To add content, add a command there. `Main` only hosts the scroll-to-top button. Static assets (e.g. `static/space.mp4`, `static/work-gantt.svg`) are ES-imported; module declarations live in `src/react-app-env.d.ts`.

**Providers (`src/providers/`):**
- `AuthProvider` — LinkedIn 3-stage OAuth (redirect → code → token). Reads `VITE_LINKEDIN_*`, `VITE_REDIRECT_URL`, `VITE_API`, etc. from env.
- `idb.ts` — IndexedDB wrapper (`idb` package) used in place of `localStorage` for user data.
- `NotificationProvider` — global snackbar/notification context consumed by `Layout/Notification.tsx`.

**Styling:**
MUI v9 `styled()` API, co-located per component (the `tss-react`/`makeStyles` migration is complete — no `makeStyles` remains). Theme is `src/styles/theme.ts` (single dark theme).

## Repo conventions

- **No tests / no verification steps.** The user explicitly rejects test code and verification (`npx tsc`, `pnpm dev` smoke, Playwright runs) inside plans and implementations for this repo. Edit → commit. Do not add a vitest/jest setup or write new spec files unless asked.
- `plans/` holds implementation plans, `specs/` holds design specs, `src/work/` holds personal Mermaid/markdown work artifacts (dated, never overwritten).
- The `/checking` skill (`.claude/skills/checking/`) generates the anonymized work Gantt: `.mmd` in `src/work/` plus a rendered `src/static/work-gantt.svg` consumed by the terminal `work` command.
- Production assets historically built to `docs/` (for GitHub Pages); Vite now outputs to repo-root `dist/`. Confirm hosting target before changing build output.
