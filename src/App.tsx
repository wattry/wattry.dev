import React from 'react';
import { ThemeProvider, Theme, makeStyles } from '@material-ui/core';
import './App.css';
import AppBar from './components/Layout/AppBar';
import Main from './components/Layout/Main';
import theme from './styles/theme';
import space from './static/space.mp4';
import Header from './components/Header';
import Footer from './components/Layout/Footer';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  video: {
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
  const { video } = useStyles();

  return (
    <ThemeProvider theme={theme.dark}>
      <AppBar />
      <video className={video} autoPlay loop muted>
        <source src={space} type='video/mp4' />
      </video>
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
