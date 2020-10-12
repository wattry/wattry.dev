import { createMuiTheme, Theme, responsiveFontSizes } from '@material-ui/core/styles';

const theme: UserTheme = {
  dark: responsiveFontSizes(
    createMuiTheme({
      palette: {
        type: 'dark',
      },
      typography: {
        fontFamily: "'Roboto','Helvetica Neue','Arial','sans-serif', 'Syncopate'",
        h1: {
          fontFamily: "'Syncopate'",
          color: 'white',
          textTransform: 'uppercase',
          letterSpacing: '1.5vw',
          lineHeight: '1.2'
        },
        h2: {
          fontFamily: "'Syncopate'",
          color: 'white',
          textTransform: 'uppercase',
        },
        h3: {
          fontFamily: "'Syncopate'",
          color: 'white',
          textTransform: 'uppercase',
        },
      },
    }),
  ),
};

export default theme;

export type UserTheme = {
  dark: Theme
}