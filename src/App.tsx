import React from 'react';
import { ThemeProvider, Theme, makeStyles } from '@material-ui/core';
import './App.css';
import AppBar from './components/layout/AppBar';
import Main from './components/layout/Main';
import theme from './styles/theme';
import Header from './components/Header';
import Footer from './components/layout/Footer';
import Router from './Routes';
import Background from './components/layout/Background';

const useStyles = makeStyles((theme: Theme) => ({
  root: {}
}));

function App() {
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  return (
    <ThemeProvider theme={theme.dark}>
      <Router />
      <AppBar />
      <Background />
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
