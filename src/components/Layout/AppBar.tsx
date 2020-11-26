import React, { SyntheticEvent, useEffect, useState } from 'react';
import { createStyles, fade, makeStyles, Theme } from '@material-ui/core/styles';
import { Toolbar, IconButton, Typography, InputBase, Tooltip, Zoom } from '@material-ui/core';
import {
  GitHub,
  LinkedIn,
  Twitter,
  AccountCircle,
  PowerSettingsNew,
  Menu as MenuIcon,
  Search as SearchIcon,
} from '@material-ui/icons';
import { AppBar as DefaultAppBar } from '@material-ui/core';
import { useCookies } from 'react-cookie';

import Drawer from './Drawer';
import authProvider from '../../providers/authProvider';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
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
  });
});

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface AuthResponse {
  authenticated: boolean;
  message: string;
}

export default function AppBar(props: any): JSX.Element {
  const classes = useStyles();
  const { searchParams } = new URL(window.location.href);
  const [code] = useState(searchParams.get('code'));
  const [state] = useState(searchParams.get('state'));
  const [error, setError] = useState(searchParams.get('error'));
  const [cookies] = useCookies();
  const [userProfile, setUserProfile] = useState({
    first: '',
    last: '',
    displayImage: '',
  });
  const [expanded, setExpanded] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean, title?: string) => (
    event: React.MouseEvent,
  ) => {
    setExpanded({ ...expanded, [anchor]: open });
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userProfile.displayImage && userData.displayImage) {

      setUserProfile(userData);
    }
  }, [userProfile]);

  useEffect(() => {
    if (code && state) {
      authProvider
        .login({ code, state })
        .then(({ authenticated, message }: AuthResponse) => {
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          setUserProfile(userData);
        })
        .catch(({ authenticated, message }: AuthResponse) => {
          setError(message);
        });
    }
  }, [code, state, error]);

  function handleClick(event: React.MouseEvent) {
    setExpanded((prev) => {
      return {
        ...prev,
        top: !prev.top,
      };
    });
  }

  function handleLogout() {
    authProvider
      .logout()
      .then(({ authenticated, message }: AuthResponse) => {
        console.log('success', message, authenticated);
        setUserProfile({
          first: '',
          last: '',
          displayImage: '',
        });
      })
      .catch(({ authenticated, message }: AuthResponse) => {
        console.log('error', message, authenticated);
      });
  }

  function handleLogin() {
    authProvider.login().then(({ authenticated, message }: AuthResponse) => {
      console.log(authenticated, message);
    });
  }

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
          <Tooltip title="Open wattry's GitHub" TransitionComponent={Zoom}>
            <IconButton
              aria-label="Open wattry's GitHub"
              aria-controls='menu-appbar'
              aria-haspopup='true'
              href='https://github.com/wattry'
              target='_blank'
              color='inherit'>
              <GitHub />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open wattry's(@TheITGuyRy) Twitter" TransitionComponent={Zoom}>
            <IconButton
              aria-label="Open wattry's(@TheITGuyRy) Twitter"
              aria-controls='menu-appbar'
              aria-haspopup='true'
              href='https://twitter.com/TheITGuyRy'
              target='_blank'
              color='inherit'>
              <Twitter />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open wattry's LinkedIn page" TransitionComponent={Zoom}>
            <IconButton
              aria-label="Open wattry's LinkedIn page"
              aria-controls='menu-appbar'
              aria-haspopup='true'
              href='https://www.linkedin.com/in/ryan-wattrus'
              target='_blank'
              color='inherit'>
              <LinkedIn />
            </IconButton>
          </Tooltip>
          {!userProfile.displayImage ? (
            <Tooltip
              title='Use LinkedIn to request a resume'
              placement='left'
              TransitionComponent={Zoom}>
              <IconButton
                aria-label='Use LinkedIn to request a resume'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleLogin}
                color='inherit'>
                <AccountCircle />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip placement='left' title='Logout of LinkedIn' TransitionComponent={Zoom}>
              <IconButton
                aria-label='Logout of LinkedIn'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                size='medium'
                style={{ background: `url(${userProfile.displayImage})` }}
                onClick={handleLogout}
                color='inherit'>
                <PowerSettingsNew />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </DefaultAppBar>
      <Drawer toggleDrawer={toggleDrawer} expanded={expanded} />
    </div>
  );
}
