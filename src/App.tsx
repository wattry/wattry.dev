import React from 'react';
import { ThemeProvider, useMediaQuery, Theme } from '@material-ui/core';
import './App.css';
import AppBar from './components/AppBar'
import Main from './components/Main'
import theme  from './styles/theme'

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  console.log(prefersDarkMode)
  const userTheme: Theme = true ? theme.dark : theme.light;

  return (
    <ThemeProvider theme={userTheme}>
      <AppBar />
      <Main />
    </ThemeProvider>
  );
}

export default App;
