import { createMuiTheme, Theme } from '@material-ui/core/styles';

export default {
  dark: createMuiTheme({
    palette: {
      type: 'dark',
    },
    typography: {
      fontFamily: "'Roboto','Helvetica Neue','Arial','sans-serif', 'Syncopate'",
      h1: {
        fontFamily: "'Syncopate'",
        color: 'white',
        textTransform: 'uppercase'
      },
    },
  }),
};

export type UserTheme = {
  dark: Theme
}