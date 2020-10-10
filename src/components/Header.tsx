import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core';
import {
  Container,
  Paper
} from '@material-ui/core';
import classes from '*.module.css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      height: '100%',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heading: {
      fontFamily: 'Syncopate',
      color: 'white',
      textTransform: 'uppercase',
      letterSpacing: '1vw',
      lineHeight: '1.2',
      fontSize: '3vw',
      textAlign: 'center'
    },
    name: {
      display: 'block',
      fontSize: '10vw',
      letterSpacing: '-1.3vw'
    }
  }),
);

export default function Header(props: any): JSX.Element {
  const classes = useStyles();

  return (
    <header className={classes.root}>
      <h1 className={classes.heading}>
        Explore
        <span className={classes.name}>Ryan Wattrus</span>
      </h1>
    </header>
  );
}