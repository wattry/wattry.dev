import React, { FC } from 'react';
import { createStyles, Theme, makeStyles, Typography } from '@material-ui/core';
import {
  Container,
  Paper
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      position: 'relative',
      background: 'rgba(0, 0, 0, 0.4)',
      color: 'white',
      padding: theme.spacing(2),
    },
    info: {
      maxWidth: '600px',
      margin: '1rem auto',
    },
  }),
);

export default function Main(): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.main} >
      <p className={classes.info}>
        This is a great little space,
         what is the point of this little thing
      </p>
    </div>
  );
}