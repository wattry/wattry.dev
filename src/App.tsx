import React from 'react';
import { ThemeProvider, useMediaQuery, Theme, makeStyles } from '@material-ui/core';
import './App.css';
import AppBar from './components/Layout/AppBar';
import Main from './components/Layout/Main';
import theme from './styles/theme';
import space from './static/space.mp4';
import Header from './components/Header';

const useStyles = makeStyles(theme => ({
  root: {},
  background: {
    objectFit: 'cover',
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
  },
}));

function App() {
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { background } = useStyles();
  const userTheme: Theme = true ? theme.dark : theme.light;

  return (
    <ThemeProvider theme={userTheme}>
      <AppBar />
      <video className={background} autoPlay loop muted>
        <source src={space} type='video/mp4' />
      </video>
      <Header />
      <Main />
    </ThemeProvider>
  );
}

export default App;
