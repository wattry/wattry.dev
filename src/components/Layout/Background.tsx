import React from 'react';
import space from '../../static/space.mp4';
import { ThemeProvider, Theme, makeStyles } from '@material-ui/core';
import propTypes from 'prop-types';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  video: {
    objectFit: 'cover',
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
  },
}));

export default function Background(props: any) {
  const { video } = useStyles();

  return (
    <div {...props}>
    <video className={video} autoPlay loop muted>
      <source src={space} type='video/mp4' />
      </video>
    </div>
  );
}

