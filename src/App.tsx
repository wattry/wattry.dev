import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './App.css';
import {
  AppBar,
  Main,
  Header,
  Footer,
  Background,
  Notification
} from './components/Layout';
import theme from './styles/theme';
import { AuthProvider, NotificationProvider, authProvider } from './providers';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar />
          <Background />
          <Header />
          <Notification />
          <Main />
          <Footer />
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
