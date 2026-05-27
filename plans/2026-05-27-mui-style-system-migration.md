# MUI Style System Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `tss-react/mui` `makeStyles` with MUI v9 `styled()` API across all 10 components, flatten theme, drop `tss-react` dependency.

**Architecture:** Co-located `styled()` per component (Approach A from spec). Each `useStyles` rule becomes a `styled(BaseComponent)(({theme}) => ({...}))` declaration above the function component. Theme flattens to single default export — no `dark` wrapper. `CssBaseline` already present in `App.tsx`.

**Tech Stack:** React 19, MUI v9 (`@mui/material` ^9.0.1), `@emotion/react`, `@emotion/styled`, Vite, Playwright, pnpm.

**Spec:** `specs/2026-05-27-mui-style-system-migration-design.md`

> **Execution amendment (2026-05-28):** User rejected all verification (tests, type-check, browser smoke, Playwright). Steps below that show `npx tsc --noEmit`, `pnpm dev`, `npx playwright test`, or browser checks are SKIPPED during execution. Each task collapses to: edit file(s) → commit. Task 1 (smoke test) is replaced with a minimal "delete stale `tests/example.spec.ts`" task. Task 14 (final verification) is dropped.

---

## File Structure

**Modify:**
- `src/styles/theme.ts` — flatten export
- `src/App.tsx` — `theme={theme}` (drop `.dark`)
- `src/components/Layout/AppBar.tsx`
- `src/components/Layout/Background.tsx`
- `src/components/Layout/Main.tsx`
- `src/components/Layout/CookiePolicy.tsx`
- `src/components/Layout/Footer.tsx`
- `src/components/Layout/Header.tsx`
- `src/components/Layout/Drawer.tsx`
- `src/components/Layout/Notification.tsx`
- `src/components/Content/History.tsx`
- `src/components/Content/SkillsTable.tsx`
- `package.json` — drop `tss-react`

**Create:**
- `tests/smoke.spec.ts` — Playwright smoke test for this app (replaces stale `example.spec.ts`)

**Delete:**
- `tests/example.spec.ts` — stale test from unrelated project (DNS portal)

---

### Task 1: Add Playwright smoke baseline

**Files:**
- Create: `tests/smoke.spec.ts`
- Delete: `tests/example.spec.ts`

Existing `example.spec.ts` targets `dev.portal.cloud.nis.vt.edu` (different project) and is useless for this app. Replace with smoke test that loads the Vite dev server and asserts the MUI app renders without console errors.

- [ ] **Step 1: Write the smoke test**

```ts
// tests/smoke.spec.ts
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.SMOKE_URL ?? 'http://localhost:5173';

test('app renders without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto(BASE_URL);

  await expect(page.locator('header')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Explore' })).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();

  expect(errors, `console errors: ${errors.join('\n')}`).toHaveLength(0);
});

test('drawer opens on menu click', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByRole('button', { name: 'open drawer' }).click();
  await expect(page.getByRole('presentation')).toBeVisible();
});
```

- [ ] **Step 2: Delete stale test**

Run: `rm tests/example.spec.ts`

- [ ] **Step 3: Start dev server in background**

Run: `pnpm dev &`
Wait ~3 seconds for Vite to bind to port 5173.

- [ ] **Step 4: Run smoke test (baseline pass)**

Run: `npx playwright test tests/smoke.spec.ts`
Expected: 2 passed (the app currently works — this is the baseline).
If it fails: stop. Either dev server didn't start or there's an existing bug. Diagnose before continuing.

- [ ] **Step 5: Stop dev server**

Run: `kill %1` (or use `lsof -ti:5173 | xargs kill`)

- [ ] **Step 6: Commit**

```bash
git add tests/smoke.spec.ts
git rm tests/example.spec.ts
git commit -m "test: replace stale e2e with app smoke test"
```

---

### Task 2: Flatten theme

**Files:**
- Modify: `src/styles/theme.ts`

- [ ] **Step 1: Rewrite theme file**

Replace entire contents of `src/styles/theme.ts` with:

```ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#303030',
      },
      secondary: {
        main: '#93cbd8',
      },
    },
    typography: {
      fontFamily: "'Roboto','Helvetica Neue','Arial','sans-serif', 'Syncopate'",
      h1: {
        fontFamily: "'Syncopate'",
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: '1.5vw',
        lineHeight: 1.2,
      },
      h2: {
        fontFamily: "'Syncopate'",
        color: 'white',
        textTransform: 'uppercase',
      },
      h3: {
        fontFamily: "'Syncopate'",
        color: 'white',
        textTransform: 'uppercase',
      },
    },
  }),
);

export default theme;
```

`UserTheme` type and `{ dark: ... }` wrapper are deleted.

- [ ] **Step 2: Update App.tsx ThemeProvider call**

In `src/App.tsx`, change:

```tsx
<ThemeProvider theme={theme.dark}>
```

to:

```tsx
<ThemeProvider theme={theme}>
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. If there are errors elsewhere in the file referencing `UserTheme`, search for them: `grep -rn "UserTheme\|theme\.dark" src/`. Update any callers (there should be none beyond `App.tsx`).

- [ ] **Step 4: Visual smoke**

Run: `pnpm dev &` then open `http://localhost:5173` in browser. Verify the page loads with dark theme, Syncopate font on headings, and looks identical to before. Kill dev server when done: `kill %1`.

- [ ] **Step 5: Commit**

```bash
git add src/styles/theme.ts src/App.tsx
git commit -m "refactor(theme): flatten to single default export"
```

---

### Task 3: Migrate Background.tsx

**Files:**
- Modify: `src/components/Layout/Background.tsx`

Simplest component. One style rule, no theme access.

- [ ] **Step 1: Rewrite file**

Replace entire contents of `src/components/Layout/Background.tsx` with:

```tsx
import { styled } from '@mui/material/styles';

import space from '../../static/space.mp4';

const Video = styled('video')({
  objectFit: 'cover',
  width: '100vw',
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
});

export default function Background(props: any) {
  return (
    <div {...props}>
      <Video autoPlay loop muted>
        <source src={space} type='video/mp4' />
      </Video>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Visual smoke**

Run: `pnpm dev &` then load `http://localhost:5173`. Verify the background video plays full-screen. Kill: `kill %1`.

- [ ] **Step 4: Commit**

```bash
git add src/components/Layout/Background.tsx
git commit -m "refactor(Background): migrate to MUI styled()"
```

---

### Task 4: Migrate Footer.tsx

**Files:**
- Modify: `src/components/Layout/Footer.tsx`

- [ ] **Step 1: Rewrite file**

Replace entire contents of `src/components/Layout/Footer.tsx` with:

```tsx
import { Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled('footer')(({ theme }) => ({
  position: 'relative',
  bottom: 0,
  left: 0,
  width: '100%',
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
}));

export default function Footer(): JSX.Element {
  return (
    <Root>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography color='textPrimary'>&copy; wattry</Typography>
        <Link
          style={{ marginLeft: '5rem' }}
          color='textPrimary'
          target='#'
          href='https://www.privacypolicies.com/live/f9b3ac4f-ad26-4312-8263-f0e238124610'>
          Privacy Policy
        </Link>
      </div>
    </Root>
  );
}
```

- [ ] **Step 2: Type-check + visual smoke + commit**

```bash
npx tsc --noEmit
pnpm dev &
# load http://localhost:5173, scroll to footer, verify dark bg + privacy link
kill %1
git add src/components/Layout/Footer.tsx
git commit -m "refactor(Footer): migrate to MUI styled()"
```

---

### Task 5: Migrate Header.tsx

**Files:**
- Modify: `src/components/Layout/Header.tsx`

The original `useStyles` defines an `h1` rule but JSX never references `classes.h1`. Drop the unused rule during migration.

- [ ] **Step 1: Rewrite file**

Replace entire contents of `src/components/Layout/Header.tsx` with:

```tsx
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled('header')(({ theme }) => ({
  position: 'relative',
  height: '80vh',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  marginBottom: theme.spacing(20),
}));

export default function Header(): JSX.Element {
  return (
    <Root>
      <Typography variant='h1'>Explore</Typography>
      <Typography variant='h3' component='h2'>
        wattry
      </Typography>
    </Root>
  );
}
```

- [ ] **Step 2: Type-check + visual smoke + commit**

```bash
npx tsc --noEmit
pnpm dev &
# load http://localhost:5173, verify "Explore" + "wattry" centered, large header
kill %1
git add src/components/Layout/Header.tsx
git commit -m "refactor(Header): migrate to MUI styled()"
```

---

### Task 6: Migrate Notification.tsx

**Files:**
- Modify: `src/components/Layout/Notification.tsx`

- [ ] **Step 1: Rewrite file**

Replace entire contents of `src/components/Layout/Notification.tsx` with:

```tsx
import React, { useContext, forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { styled } from '@mui/material/styles';

import { NotificationContext } from '../../providers/NotificationProvider';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert ref={ref} elevation={6} variant='filled' {...props} />;
});

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  '& > * + *': {
    marginTop: theme.spacing(2),
  },
}));

export default function Notification() {
  const { close, state } = useContext(NotificationContext);

  const handleClose = () => {
    close();
  };

  return (
    <Root>
      <Snackbar
        open={state.open}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        autoHideDuration={5000}
        onClose={handleClose}>
        <Alert onClose={handleClose} icon={false} severity={state.type}>
          {state.message}
        </Alert>
      </Snackbar>
    </Root>
  );
}
```

- [ ] **Step 2: Type-check + visual smoke + commit**

```bash
npx tsc --noEmit
pnpm dev &
# load http://localhost:5173, trigger any notification path (or skip — no visible diff at rest)
kill %1
git add src/components/Layout/Notification.tsx
git commit -m "refactor(Notification): migrate to MUI styled()"
```

---

### Task 7: Migrate Drawer.tsx

**Files:**
- Modify: `src/components/Layout/Drawer.tsx`

Original `useStyles` defines `list`, `fullList`, `zoom` rules that JSX never references. Only `nested` is used. Drop the dead rules.

- [ ] **Step 1: Rewrite file**

Replace entire contents of `src/components/Layout/Drawer.tsx` with:

```tsx
import React, { Fragment } from 'react';
import {
  ListItemButton,
  List,
  SwipeableDrawer,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, scroller } from 'react-scroll';

import menuItems from '../../menuItems';
import { Menu, SubMenu } from '../../interfaces/menu.interface';

const NestedListItemButton = styled(ListItemButton)(({ theme }) => ({
  paddingLeft: theme.spacing(5),
}));

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function Drawer({
  toggleDrawer,
  expanded,
}: {
  toggleDrawer: any;
  expanded: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
  };
}): JSX.Element {
  const handleKeypress =
    (anchor: Anchor, open: boolean, title: string) => (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        scroller.scrollTo(title, {
          duration: 1500,
          delay: 100,
          smooth: true,
        });
        toggleDrawer(anchor, open);
      }
    };

  const list = (anchor: Anchor): JSX.Element => (
    <List>
      {menuItems.map(({ title, icon, subMenus }: Menu, index) => (
        <Fragment key={index}>
          <Link to={title} smooth={true} duration={1000}>
            <ListItemButton
              onClick={toggleDrawer(anchor, false, title)}
              onKeyDown={handleKeypress(anchor, false, title)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItemButton>
          </Link>
          {subMenus ? (
            <List>
              {subMenus.map(({ title, icon }: SubMenu, index) => (
                <Fragment key={index}>
                  <Link to={title} smooth={true} duration={1000}>
                    <NestedListItemButton
                      onClick={toggleDrawer(anchor, false, title)}
                      onKeyDown={handleKeypress(anchor, false, title)}>
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={title} />
                    </NestedListItemButton>
                  </Link>
                </Fragment>
              ))}
            </List>
          ) : null}
        </Fragment>
      ))}
    </List>
  );

  return (
    <div>
      {(['left', 'right', 'top'] as Anchor[]).map((anchor) => (
        <React.Fragment key={anchor}>
          <SwipeableDrawer
            anchor={anchor}
            open={expanded[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}>
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Type-check + visual smoke + commit**

```bash
npx tsc --noEmit
pnpm dev &
# load http://localhost:5173, click the menu icon (top-left), verify drawer opens with nested items indented
kill %1
git add src/components/Layout/Drawer.tsx
git commit -m "refactor(Drawer): migrate to MUI styled()"
```

---

### Task 8: Migrate SkillsTable.tsx

**Files:**
- Modify: `src/components/Content/SkillsTable.tsx`

- [ ] **Step 1: Rewrite file**

Replace entire contents of `src/components/Content/SkillsTable.tsx` with:

```tsx
import { Fragment } from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const SkillPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(66, 66, 66, 0.5)',
  width: '100%',
  paddingTop: theme.spacing(1),
  paddingLeft: theme.spacing(1),
}));

export default function SkillsTable({ skills }: { skills: string[] }) {
  return (
    <Grid container spacing={1}>
      {skills.map((skill: string, index: number) => {
        return (
          <Fragment key={index}>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <SkillPaper elevation={3}>
                <Typography color='textPrimary' variant='body1'>
                  {skill}
                </Typography>
              </SkillPaper>
            </Grid>
          </Fragment>
        );
      })}
    </Grid>
  );
}
```

- [ ] **Step 2: Type-check + visual smoke + commit**

```bash
npx tsc --noEmit
pnpm dev &
# load http://localhost:5173, scroll to skills section, verify dark translucent paper boxes
kill %1
git add src/components/Content/SkillsTable.tsx
git commit -m "refactor(SkillsTable): migrate to MUI styled()"
```

---

### Task 9: Migrate History.tsx

**Files:**
- Modify: `src/components/Content/History.tsx`

Original `root` rule was empty `{}`. Drop it.

- [ ] **Step 1: Rewrite file**

Replace entire contents of `src/components/Content/History.tsx` with:

```tsx
import { Fragment } from 'react';
import { Typography } from '@mui/material';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';

import { History } from '../../interfaces/history.interface';

const Achievements = styled('div')(({ theme }) => ({
  '& h4': {
    marginBottom: theme.spacing(1),
  },
}));

const HistoryComponent = ({ history }: { history: History[] }): JSX.Element => {
  return (
    <Fragment>
      {history.map(
        (
          { employer, position, dates, description, summary, keyAchievements }: History,
          index: number,
        ) => {
          return (
            <Fragment key={index}>
              <Typography gutterBottom={false} color='textPrimary' variant='body1'>
                {employer}
              </Typography>
              <Typography gutterBottom={false} color='textPrimary' variant='body1'>
                {position}
              </Typography>
              <Typography gutterBottom={false} color='textPrimary' variant='body1'>
                {dates}
              </Typography>
              <Typography align='justify' color='textPrimary' variant='subtitle1'>
                {description}
              </Typography>
              <ul>
                {summary.map((paragraph: string, index: number) => (
                  <li key={index}>
                    <Typography align='justify' color='textPrimary' variant='body1'>
                      <ArrowForwardIos fontSize='small' />
                      {paragraph}
                    </Typography>
                  </li>
                ))}
              </ul>
              {keyAchievements ? (
                <Achievements>
                  <Typography color='textPrimary' variant='h5' component='h4'>
                    Key Achievements
                  </Typography>
                  {keyAchievements.map((paragraph: string, index) => {
                    return (
                      <div key={index}>
                        <Typography align='justify' color='textPrimary' variant='body1'>
                          <ArrowForwardIos fontSize='small' /> {paragraph}
                        </Typography>
                      </div>
                    );
                  })}
                </Achievements>
              ) : null}
            </Fragment>
          );
        },
      )}
    </Fragment>
  );
};

export default HistoryComponent;
```

- [ ] **Step 2: Type-check + visual smoke + commit**

```bash
npx tsc --noEmit
pnpm dev &
# load http://localhost:5173, scroll to history section, verify "Key Achievements" h4 has bottom margin
kill %1
git add src/components/Content/History.tsx
git commit -m "refactor(History): migrate to MUI styled()"
```

---

### Task 10: Migrate Main.tsx

**Files:**
- Modify: `src/components/Layout/Main.tsx`

Most complex layout file. 5 rules, used in two different inner components (`ScrollTop`, `Main`).

- [ ] **Step 1: Rewrite file**

Replace entire contents of `src/components/Layout/Main.tsx` with:

```tsx
import React from 'react';
import { Divider, Zoom, useScrollTrigger, Fab } from '@mui/material';
import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import menuItems from '../../menuItems';
import Section from '../content/Section';
import { Menu, SubMenu } from '../../interfaces/menu.interface';

const MainBox = styled('div')(({ theme }) => ({
  position: 'relative',
  background: 'rgba(0, 0, 0, 0.5)',
  paddingLeft: theme.spacing(2),
  display: 'flex',
}));

const Content = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
  width: '100%',
  '& h2': {
    marginBottom: theme.spacing(2),
  },
  '& svg': {
    marginRight: theme.spacing(1),
  },
}));

const SectionBox = styled('div')(({ theme }) => ({
  '& p': {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  '& li': {
    marginBottom: theme.spacing(2),
    listStyleType: 'none',
  },
}));

const SubMenuBox = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}));

const BackToTop = styled('div')(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

function ScrollTop(props: { children: any }) {
  const { children } = props;

  const trigger = useScrollTrigger({
    target: window,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = ((event.target as HTMLDivElement).ownerDocument || document).querySelector(
      '#top-anchor',
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <BackToTop onClick={handleClick} role='presentation' style={{ zIndex: 10000 }}>
        {children}
      </BackToTop>
    </Zoom>
  );
}

export default function Main(props: any): JSX.Element {
  return (
    <main>
      <MainBox>
        <Content>
          {menuItems.map(({ title, icon, content, component, subMenus }: Menu, index) => (
            <SectionBox key={index}>
              <Section title={title} icon={icon} content={content} component={component} />
              {subMenus?.map(
                ({ title, icon, content, component }: SubMenu, index: number, array: SubMenu[]) => (
                  <SubMenuBox key={index}>
                    <Section title={title} icon={icon} content={content} component={component} />
                    {index !== array.length - 1 ? <Divider component='li' /> : null}
                  </SubMenuBox>
                ),
              )}
              <Divider component='li' />
            </SectionBox>
          ))}
        </Content>
        <ScrollTop {...props}>
          <Fab color='default' size='large' aria-label='scroll back to top'>
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </MainBox>
    </main>
  );
}
```

- [ ] **Step 2: Type-check + visual smoke + commit**

```bash
npx tsc --noEmit
pnpm dev &
# load http://localhost:5173, scroll down to trigger back-to-top FAB (should appear bottom-right after 100px scroll)
# verify all section content rendered with correct spacing
kill %1
git add src/components/Layout/Main.tsx
git commit -m "refactor(Main): migrate to MUI styled()"
```

---

### Task 11: Migrate AppBar.tsx

**Files:**
- Modify: `src/components/Layout/AppBar.tsx`

`inputRoot` and `inputInput` rules are only referenced inside JSX commented out — drop them.

- [ ] **Step 1: Rewrite file**

Replace entire contents of `src/components/Layout/AppBar.tsx` with:

```tsx
import React, { useEffect, useState, useContext } from 'react';
import { Toolbar, IconButton, Typography, Tooltip, Zoom, AppBar as DefaultAppBar } from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import idbPromise from '../../providers/idb';
import Drawer from './Drawer';
import { AuthContext } from '../../providers/AuthProvider';
import { NotificationContext } from '../../providers/NotificationProvider';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.default,
}));

const StyledAppBar = styled(DefaultAppBar)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.default,
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
}));

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface UserData {
  first: string;
  last: string;
  displayImage: string;
}

interface AuthResponse {
  message: string;
  user_data?: any;
  error?: any;
}

const emptyUserData = {
  first: '',
  last: '',
  displayImage: '',
};

export default function AppBar(props: any): JSX.Element {
  const { consented }: { consented: boolean } = props;
  const { searchParams } = new URL(window.location.href);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const oAuthError = searchParams.get('error');

  const authProvider = useContext(AuthContext);
  const { notify } = useContext(NotificationContext);
  const [error, setError] = useState<string | boolean>();
  const [userProfile, setUserProfile] = useState<UserData>(emptyUserData);
  const [expanded, setExpanded] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean, title?: string) => (
    event: React.MouseEvent,
  ) => {
    setExpanded({ ...expanded, [anchor]: open });
  };

  useEffect(() => {
    if (oAuthError) {
      setError(oAuthError);
    }
  }, [error, oAuthError]);

  useEffect(() => {
    if (authProvider.checkAuth() && !userProfile.displayImage) {
      idbPromise.then(async (idb) => {
        const [first, last, displayImage] = await Promise.all([
          idb.get('user-data', 'first'),
          idb.get('user-data', 'last'),
          idb.get('user-data', 'displayImage'),
        ]);

        if (first && last && displayImage) {
          setUserProfile({
            first,
            last,
            displayImage,
          });
        }
      });
    }
  }, [authProvider, userProfile]);

  useEffect(() => {
    if (!authProvider.checkAuth() && !oAuthError && code && state) {
      authProvider
        .login({ code, state })
        .then(({ message, user_data }: AuthResponse) => {
          setUserProfile(user_data);
          notify('success', message);
        })
        .catch((error) => {
          setError(error);
          notify('error', `Login unsuccessful: ${error.message}`);
        });
    } else if (oAuthError) {
      notify('error', `Authentication error: ${oAuthError}`);
    }
  }, [error, authProvider, code, state, notify, oAuthError]);

  function handleClick(event: React.MouseEvent) {
    setExpanded((prev) => {
      return {
        ...prev,
        top: !prev.top,
      };
    });
  }

  function handleLogout() {
    authProvider
      .logout()
      .then(({ message }: AuthResponse) => {
        setUserProfile(emptyUserData);
        notify('success', message);
      })
      .catch((error) => {
        notify('error', 'Logout Unsuccessful');
      });
  }

  function handleLogin() {
    authProvider.login().then(({ message }: AuthResponse) => {
      notify('info', message);
    });
  }

  return (
    <Root>
      <StyledAppBar id='top-anchor' position='relative'>
        <Toolbar>
          <MenuButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={handleClick}>
            <MenuIcon />
          </MenuButton>
          <Title variant='h6' noWrap>
            wattry
          </Title>
          <Tooltip
            title={<Typography variant='body1'>Open wattry's GitHub</Typography>}
            TransitionComponent={Zoom}>
            <IconButton
              aria-label="Open wattry's GitHub"
              aria-controls='menu-appbar'
              aria-haspopup='true'
              href='https://github.com/wattry'
              target='_blank'
              color='inherit'>
              <GitHub />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={<Typography variant='body1'>Open wattry's LinkedIn page</Typography>}
            placement='left'
            TransitionComponent={Zoom}>
            <IconButton
              aria-label="Open wattry's LinkedIn page"
              aria-controls='menu-appbar'
              aria-haspopup='true'
              href='https://linkedin.com/in/wattry'
              target='_blank'
              color='inherit'>
              <LinkedIn />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </StyledAppBar>
      <Drawer toggleDrawer={toggleDrawer} expanded={expanded} />
    </Root>
  );
}
```

The commented-out user profile block from the original is preserved by removal — it referenced `consented` and `userProfile` flow that's still wired up; if the user wants it back later, restore from git history. Per spec (YAGNI), we leave it dropped.

- [ ] **Step 2: Type-check + visual smoke + commit**

```bash
npx tsc --noEmit
pnpm dev &
# load http://localhost:5173
# verify top bar with menu icon (left), "wattry" title, GitHub + LinkedIn icons (right)
# click menu icon → drawer opens
kill %1
git add src/components/Layout/AppBar.tsx
git commit -m "refactor(AppBar): migrate to MUI styled()"
```

---

### Task 12: Migrate CookiePolicy.tsx

**Files:**
- Modify: `src/components/Layout/CookiePolicy.tsx`

Dynamic style prop — use `shouldForwardProp` filter pattern from spec.

- [ ] **Step 1: Rewrite file**

Replace entire contents of `src/components/Layout/CookiePolicy.tsx` with:

```tsx
import { Button, ButtonProps, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import CookieConsent from 'react-cookie-consent';

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

const AcceptButton = (props: any) => {
  const { id, children, onClick, style } = props;

  return (
    <StyledAcceptButton
      variant='outlined'
      size='large'
      onClick={onClick}
      extraStyle={{ ...style, id }}>
      {children}
    </StyledAcceptButton>
  );
};

export default function CookiePolicy(props: any) {
  const { setConsented }: { setConsented: (consented: boolean) => void } = props;

  return (
    <CookieConsent
      {...props}
      buttonId='accept'
      location='bottom'
      buttonText='Accept'
      cookieName='consented'
      onAccept={() => setConsented(true)}
      enableDeclineButton
      declineButtonText='Decline'
      setDeclineCookie={false}
      declineButtonId='decline'
      flipButtons
      overlay
      overlayStyle={{
        backgroundColor: 'rgba(0,0,0,0.7)',
      }}
      sameSite='strict'
      ButtonComponent={AcceptButton}
      expires={365}>
      This website requires cookies to enhance the user experience and secure data requests. Cookies
      are only set if you consent login using LinkedIn and are deleted on logout. We do not store
      any data in browser until you consent.
      <ul>
        <li>
          <Link
            color='textSecondary'
            href='https://www.privacypolicies.com/live/fd63755a-6d7d-47ed-abc0-39b8929b6ecf'
            target='#'>
            Cookie Policy
          </Link>
        </li>
        <li>
          <Link
            color='textSecondary'
            target='#'
            href='https://www.privacypolicies.com/live/f9b3ac4f-ad26-4312-8263-f0e238124610'>
            Privacy Policy
          </Link>
        </li>
      </ul>
    </CookieConsent>
  );
}
```

- [ ] **Step 2: Type-check + visual smoke + commit**

To see the cookie banner, clear cookies for `localhost:5173` first.

```bash
npx tsc --noEmit
pnpm dev &
# in browser DevTools → Application → Cookies → clear `consented`, then reload
# verify cookie banner appears with overlay; Accept/Decline buttons styled (secondary dark bg)
# click Accept → banner closes, no console errors
kill %1
git add src/components/Layout/CookiePolicy.tsx
git commit -m "refactor(CookiePolicy): migrate to MUI styled()"
```

---

### Task 13: Remove tss-react dependency

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml` (regenerated)

- [ ] **Step 1: Guard — confirm no remaining references**

Run:

```bash
grep -rn "tss-react\|makeStyles\|useStyles\|from 'tss-react/mui'" src/
```

Expected: zero matches. If anything matches, stop and migrate the remaining file before proceeding.

- [ ] **Step 2: Remove dependency**

Run: `pnpm remove tss-react`

This updates both `package.json` and `pnpm-lock.yaml`.

- [ ] **Step 3: Verify install + types**

Run: `pnpm install && npx tsc --noEmit`
Expected: both succeed with no errors.

- [ ] **Step 4: Smoke test**

```bash
pnpm dev &
# wait for Vite, then run smoke spec
npx playwright test tests/smoke.spec.ts
kill %1
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: remove tss-react dependency"
```

---

### Task 14: Final verification

**Files:**
- (none modified)

- [ ] **Step 1: Full grep guard**

Run:

```bash
grep -rn "tss-react\|makeStyles\|useStyles\|classes\." src/
```

Expected: zero matches. (If `classes.` appears in a legitimate non-MUI context, inspect manually.)

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Production build**

Run: `pnpm build`
Expected: build succeeds. (`postbuild` will move `build/` → `docs/` and copy `CNAME`.)

- [ ] **Step 4: Smoke test against dev server**

```bash
pnpm dev &
npx playwright test tests/smoke.spec.ts
kill %1
```

Expected: 2 passed, zero console errors.

- [ ] **Step 5: Manual walkthrough**

```bash
pnpm dev &
```

Open `http://localhost:5173` and verify:
- Header "Explore / wattry" centered, large
- Background video plays full-screen behind content
- AppBar at top with menu icon + GitHub + LinkedIn
- Menu icon opens drawer with nested indented items
- Scroll down → all menu sections rendered, dividers between
- Scroll past ~100px → back-to-top FAB appears bottom-right
- Footer at bottom with copyright + privacy link
- Clear `consented` cookie + reload → cookie banner appears with styled Accept button

Kill server: `kill %1`.

- [ ] **Step 6: Final commit (only if anything left uncommitted)**

```bash
git status
# if dirty, investigate. If clean, this task ends here.
```

---

## Notes for the engineer

- **Vite dev server** binds to `http://localhost:5173` by default. The `pnpm start` script (CRA's `react-scripts start`) targets port 3000 and is NOT what this plan uses.
- **`pnpm build`** still runs CRA's `react-scripts build` and may be slow / produce warnings. That's pre-existing and out of scope.
- **`classes` prop on MUI components:** the original code uses `<Button classes={{ root: classes.root }}>` in CookiePolicy. The new `styled(Button)` wrapper replaces that pattern entirely; do not re-introduce a `classes` prop.
- **`shouldForwardProp`** is critical when a custom prop name isn't a valid DOM attribute. Without the filter, React warns and the prop leaks to the DOM.
- **No theme augmentation needed:** existing theme uses only built-in MUI keys (`palette`, `typography`). No `declare module '@mui/material/styles'` block required.
- **Frequent commits:** each migrated file is its own commit so any visual regression can be bisected fast.
