import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { TerminalContextProvider } from 'react-terminal';

import './App.css';
import {
  Main,
  Header,
  Footer,
  Background,
  Notification
} from './components/Layout';
import theme from './styles/theme';
import { AuthProvider, NotificationProvider } from './providers';
import Terminal from './components/Layout/Terminal';


function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Background />
          <Header />
          <Notification />
          <Main />
          <TerminalContextProvider>
            <Terminal />
          </TerminalContextProvider>
          <Footer />
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
