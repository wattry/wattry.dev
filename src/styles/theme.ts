import { createMuiTheme, Theme } from '@material-ui/core/styles';

export default {
  dark: createMuiTheme({
    palette: {
      type: 'dark',
    },
  }),
  light: createMuiTheme({
    palette: {
      type: 'light',
    },
  }),
  typography: {
    fontFamily: [
      '-apple-system',
      'Syncopate',
      'sans-serif',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
};

export type UserTheme = {
  dark: Theme,
  light: Theme
}