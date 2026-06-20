import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'dark',
      // Transparent so CssBaseline doesn't paint an opaque body over the
      // fixed z-index:-1 background video. Fallback color is on the html canvas.
      background: {
        default: 'transparent',
      },
      primary: {
        main: '#F5E13C',
      },
      secondary: {
        main: '#2E6BFF',
      },
    },
    typography: {
      fontFamily: "'Space Grotesk', 'Inter', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
      h1: {
        fontFamily: "'Space Grotesk'",
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: '1.5vw',
        lineHeight: 1.2,
      },
      h2: {
        fontFamily: "'Space Grotesk'",
        color: 'white',
        textTransform: 'uppercase',
      },
      h3: {
        fontFamily: "'Space Grotesk'",
        color: 'white',
        textTransform: 'uppercase',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Space Grotesk';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: url(https://cdn.wattry.com/public/fonts/SpaceGrotesk-Regular.woff2) format('woff2');
          }
          @font-face {
            font-family: 'Space Grotesk';
            font-style: normal;
            font-display: swap;
            font-weight: 500;
            src: url(https://cdn.wattry.com/public/fonts/SpaceGrotesk-Medium.woff2) format('woff2');
          }
          @font-face {
            font-family: 'Space Grotesk';
            font-style: normal;
            font-display: swap;
            font-weight: 700;
            src: url(https://cdn.wattry.com/public/fonts/SpaceGrotesk-Bold.woff2) format('woff2');
          }
        `,
      },
    },
  }),
);

export default theme;
