import React, { useState } from 'react';
import { createStyles, fade, makeStyles, Theme } from '@material-ui/core';
import DefaultAppBar from '@material-ui/core/AppBar'
import {
  Toolbar,
  IconButton,
  Typography,
  InputBase
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Drawer from './Drawer';

const useStyles = makeStyles(( theme: Theme ) => {
  return createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  })
})

export default function AppBar(props: any): JSX.Element {
  const classes = useStyles();
  const [expanded, setExpanded] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  function handleClick(event: React.MouseEvent) {
    setExpanded(prev => {
      return {
        ...prev,
        top: !prev.top,
      };
    });
  }
    type Anchor = 'top' | 'left' | 'bottom' | 'right';

    const toggleDrawer = (anchor: Anchor, open: boolean, title?: string) => (
      event: React.MouseEvent,
    ) => {
      setExpanded({ ...expanded, [anchor]: open });
    };

  return (
    <div className={classes.root}>
      <DefaultAppBar position='relative' className={classes.root}>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='open drawer'
            onClick={handleClick}>
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant='h6' noWrap>
            wattry
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder='Search…'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        </Toolbar>
      </DefaultAppBar>
      <Drawer toggleDrawer={toggleDrawer} expanded={expanded} />
    </div>
  );
}