import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './App.css';
import {
  AppBar,
  Main,
  Header,
  Footer,
  Background,
  Notification,
  CookiePolicy,
} from './components/Layout';
import theme from './styles/theme';
import { AuthProvider, NotificationProvider, authProvider } from './providers';

function App() {
  const [consented, setConsented] = useState(authProvider.checkCookieConsent());

  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
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
