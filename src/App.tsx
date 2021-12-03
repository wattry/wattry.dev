import React, { useState } from 'react';
import { ThemeProvider, Theme, makeStyles } from '@material-ui/core';

import './App.css';
import {
  AppBar,
  Main,
  Header,
  Footer,
  Background,
  Notification,
  CookiePolicy,
} from './components/layout';
import theme from './styles/theme';
import { AuthProvider, NotificationProvider, authProvider } from './providers';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

function App() {
  const [consented, setConsented] = useState(authProvider.checkCookieConsent());
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider theme={theme.dark}>
          <AppBar consented={consented} />
          <Background />
          <Header />
          <Notification />
          <Main />
          <CookiePolicy setConsented={setConsented} />
          <Footer />
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
