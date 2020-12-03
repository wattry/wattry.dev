import React from 'react';
import { Typography, Link } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
  },
}));

export default function Footer(props: any): JSX.Element {
  const classes = useStyles(props);

  return (
    <footer className={classes.root}>
      <div>
        <span>
          <Typography color='textPrimary'>&copy; Ryan Wattrus</Typography>
          <Link
            color='textPrimary'
            target='#'
            href='https://www.privacypolicies.com/live/f9b3ac4f-ad26-4312-8263-f0e238124610'>
            Privacy Policy
          </Link>
        </span>
      </div>
    </footer>
  );
}
