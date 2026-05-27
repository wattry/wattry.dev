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
      fontFamily: "'Inter', 'Roboto','Helvetica Neue','Arial','sans-serif'",
      h1: {
        fontFamily: "'Inter'",
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: '1.5vw',
        lineHeight: 1.2,
      },
      h2: {
        fontFamily: "'Inter'",
        color: 'white',
        textTransform: 'uppercase',
      },
      h3: {
        fontFamily: "'Inter'",
        color: 'white',
        textTransform: 'uppercase',
      },
    },
  }),
);

export default theme;
