import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default
  },
}));


export default function Footer(props: any): JSX.Element {
  const classes = useStyles(props);

  return (
    <footer className={classes.root}>
      <Typography color="textPrimary" >&copy; Ryan Wattrus</Typography>
    </footer>
  );
}



