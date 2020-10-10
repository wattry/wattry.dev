import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      height: '100vh',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing(10)
    }   
  }),
);

export default function Header(props: any): JSX.Element {
  const classes = useStyles(props);

  return (
    <header className={classes.root}>
      <Typography variant='h1'>
        Explore
          <Typography variant='h3'>
            Ryan Wattrus
          </Typography>
      </Typography>
    </header>
  );
}
