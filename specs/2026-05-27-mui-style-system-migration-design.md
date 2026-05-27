# MUI Style System Migration

**Date:** 2026-05-27
**Status:** Draft — pending user review
**Reference:** https://mui.com/material-ui/customization/how-to-customize/

## Problem

Project styles authored via `tss-react/mui`'s `makeStyles()` hook across 10 components. Pattern is legacy (carried over from MUI v4 `@material-ui/styles`). MUI v9 (`@mui/material` ^9.0.1) recommends `styled()` API (emotion-based) for component-level customization and theme `components.styleOverrides` for cross-cutting defaults.

Current theme also wraps single `Theme` in `{ dark }` object with unused `UserTheme` shape, requiring `theme.dark` at the `ThemeProvider` call site.

## Goals

1. Replace `tss-react` `makeStyles` with MUI `styled()` API in all components.
2. Flatten theme to single default export; drop `UserTheme` wrapper.
3. Remove `tss-react` from `package.json` dependencies.
4. Add `<CssBaseline />` at app root.
5. No visual regressions (verified via Playwright e2e + manual smoke).

## Non-goals

- No light-mode toggle (only dark in use today).
- No new design tokens / palette redesign.
- No conversion of CRA `react-scripts` scripts to Vite (separate cleanup).
- No new component features.

## Architecture

### Theme (`src/styles/theme.ts`)

Flatten to single default export. No `components.styleOverrides` block in v1 — all styles stay co-located in components per Approach A. Add later only if duplication emerges.

```ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#303030' },
      secondary: { main: '#93cbd8' },
    },
    typography: {
      fontFamily: "'Roboto','Helvetica Neue','Arial','sans-serif','Syncopate'",
      h1: { fontFamily: "'Syncopate'", color: 'white', textTransform: 'uppercase', letterSpacing: '1.5vw', lineHeight: 1.2 },
      h2: { fontFamily: "'Syncopate'", color: 'white', textTransform: 'uppercase' },
      h3: { fontFamily: "'Syncopate'", color: 'white', textTransform: 'uppercase' },
    },
  }),
);

export default theme;
```

Delete `UserTheme` type.

### App root (`src/App.tsx`)

```tsx
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';

<ThemeProvider theme={theme}>
  <CssBaseline />
  {/* rest */}
</ThemeProvider>
```

Replace existing `theme={theme.dark}` with `theme={theme}`.

### Component migration pattern

For each file currently using `tss-react/mui`:

1. Remove `import { makeStyles } from 'tss-react/mui';`.
2. Add `import { styled } from '@mui/material/styles';`.
3. For each rule in `useStyles()`, declare a `styled` component above the function component:

```tsx
const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.default,
}));
```

4. Replace `<element className={classes.X}>` with `<StyledX>`. When the styled target is a MUI component (e.g. `AppBar`, `Button`), wrap directly: `styled(AppBar)(...)`.
5. Delete `const useStyles = ...` declaration and the `const { classes } = useStyles();` call.

### Dynamic style props (`CookiePolicy.tsx`)

Current pattern uses `makeStyles<{ style: Record<string, any> }>()((theme, { style }) => ({...}))` to inject a runtime style object into a Button.

Replacement: prop-driven `styled` with `shouldForwardProp` filter to prevent the custom prop leaking to the DOM.

```tsx
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

type AcceptButtonProps = ButtonProps & { extraStyle?: React.CSSProperties };

const StyledAcceptButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'extraStyle',
})<AcceptButtonProps>(({ theme, extraStyle }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: theme.palette.text.primary,
  marginTop: '1rem',
  marginRight: '2rem',
  ...extraStyle,
}));
```

`AcceptButton` wrapper passes `extraStyle={style}` to `StyledAcceptButton`.

### Files to migrate

| File | Style rules | Notes |
|------|-------------|-------|
| `src/components/Layout/AppBar.tsx` | 5 (root, menuButton, title, inputRoot, inputInput) | `inputRoot`/`inputInput` only referenced in commented JSX — drop. |
| `src/components/Layout/Background.tsx` | 1 (video) | Trivial. |
| `src/components/Layout/Main.tsx` | 5 (backToTop, main, content, section, subMenu) | Two `useStyles()` calls in file. |
| `src/components/Layout/CookiePolicy.tsx` | 1 (root, dynamic) | `shouldForwardProp` pattern (see above). |
| `src/components/Layout/Footer.tsx` | 1 (root) | Trivial. |
| `src/components/Layout/Header.tsx` | 1 (root) | Trivial. |
| `src/components/Layout/Drawer.tsx` | 1 (nested) | Trivial. |
| `src/components/Content/History.tsx` | 1 (achievements) | Trivial. |
| `src/components/Layout/Notification.tsx` | 1 (root) | Trivial. |
| `src/components/Content/SkillsTable.tsx` | 1 (root) | Trivial. |

### Package changes

Remove `"tss-react": "^4.9.21"` from `package.json` dependencies. Keep `@emotion/react` and `@emotion/styled` (MUI peer deps required by `styled()` engine).

Run `pnpm install` after edit to update lockfile.

## Verification

1. **Baseline:** before any code changes, run `npx playwright test` on master and record pass/fail state.
2. **Per-component:** after each file migration, `pnpm dev` and visually check the affected component.
3. **Post-migration:** re-run `npx playwright test`; results must match baseline.
4. **Build:** `pnpm build` must succeed (CRA `react-scripts build` still in scripts).
5. **TypeScript:** no new TS errors when running `tsc --noEmit` (if not part of build).
6. **Grep guards:** zero hits for `tss-react`, `makeStyles`, `useStyles` in `src/` after migration.

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Visual drift on styled components | Playwright baseline diff + manual smoke per route |
| Theme typing regressions | No theme augmentation needed — existing theme uses only built-in MUI keys |
| Forgotten `classes` reference | Final grep for `classes\.` in `src/` |
| Build break from removed `tss-react` | Lockfile rebuild + `pnpm build` gate |
| CRA `react-scripts` may not love new emotion deps | Already on emotion via MUI v9; no new deps added |

## Out-of-scope follow-ups

- CRA → Vite full migration (project has both, scripts still on CRA).
- Light-mode toggle.
- Custom theme tokens / palette redesign.

## Open questions

None at design time.
