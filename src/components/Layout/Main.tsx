import React, { FC } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core';
import {
  Container,
  Paper
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      position: 'relative',
      height: '100vh',
      justifyContent: 'center',
      background: 'rgba(black, 0.66)',
      '& > *': {
        margin: theme.spacing(1),
        width: theme.spacing(300),
        height: theme.spacing(16),
      },
    },

  }),
);

export default function Main(): JSX.Element {
  const classes = useStyles();
  return (
    <Container maxWidth='lg' className={classes.root}>
      <Paper variant='outlined' elevation={3}>
        My name is Ryan and this is an awesome page to view my skills
      </Paper>
    </Container>
  );
}