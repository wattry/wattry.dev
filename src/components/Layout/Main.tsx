import React, { FC } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';

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

export default function Main(props: any): JSX.Element {
  const classes = useStyles();
  return (
    <>
      <div className={classes.main}>
        <Typography variant='h2'>Summary</Typography>
        <p className={classes.info}></p>
      </div>
      <div className={classes.main}>
        <Typography variant='h2'>Skills</Typography>
        <p className={classes.info}></p>
      </div>
      <div className={classes.main}>
        <Typography variant='h2'>Experience</Typography>
        <p className={classes.info}></p>
      </div>
      <div className={classes.main}>
        <Typography variant='h2'>Career</Typography>
        <p className={classes.info}></p>
      </div>
      <div className={classes.main}>
        <Typography variant='h3'>History</Typography>
        <p className={classes.info}></p>
      </div>
      <div className={classes.main}>
        <Typography variant='h3'>Early Career</Typography>
        <p className={classes.info}></p>
      </div>
      <div className={classes.main}>
        <Typography variant='h2'>Education</Typography>
        <p className={classes.info}></p>
      </div>
    </>
  );
}
