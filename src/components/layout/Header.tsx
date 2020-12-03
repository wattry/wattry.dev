import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      height: '80vh',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      marginBottom: theme.spacing(20),
    },
    h1: {
      letterSpacing: '3vw',
      lineHeight: '1.2',
    },
  }),
);

export default function Header(props: any): JSX.Element {
  const classes = useStyles(props);

  return (
    <header className={classes.root}>
      <Typography variant='h1'>
        Explore
      </Typography>
      <Typography variant='h3' component="h2" >
        Ryan Wattrus
      </Typography>
    </header>
  );
}
