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
  })
};

export type UserTheme = {
  dark: Theme,
  light: Theme
}