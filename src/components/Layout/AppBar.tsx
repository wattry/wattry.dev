import React, { SyntheticEvent, useEffect, useState, useContext } from 'react';
import { createStyles, fade, makeStyles, Theme } from '@material-ui/core/styles';
import { Toolbar, IconButton, Typography, InputBase, Tooltip, Zoom } from '@material-ui/core';
import {
  GitHub,
  LinkedIn,
  AccountCircle,
  PowerSettingsNew,
  Menu as MenuIcon,
  Search as SearchIcon,
} from '@material-ui/icons';
import { AppBar as DefaultAppBar } from '@material-ui/core';

import idbPromise from '../../providers/idb';
import Drawer from './Drawer';
import { AuthContext } from '../../providers/AuthProvider';
import { NotificationContext } from '../../providers/NotificationProvider';

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
    // search: {
    //   position: 'relative',
    //   borderRadius: theme.shape.borderRadius,
    //   backgroundColor: fade(theme.palette.common.white, 0.15),
    //   '&:hover': {
    //     backgroundColor: fade(theme.palette.common.white, 0.25),
    //   },
    //   marginLeft: 0,
    //   width: '100%',
    //   [theme.breakpoints.up('sm')]: {
    //     marginLeft: theme.spacing(1),
    //     width: 'auto',
    //   },
    // },
    // searchIcon: {
    //   padding: theme.spacing(0, 2),
    //   height: '100%',
    //   position: 'absolute',
    //   pointerEvents: 'none',
    //   display: 'flex',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // },
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

interface UserData {
  first: string;
  last: string;
  displayImage: string;
}

interface AuthResponse {
  message: string;
  user_data?: any;
  error?: any;
}

const emptyUserData = {
  first: '',
  last: '',
  displayImage: '',
};

export default function AppBar(props: any): JSX.Element {
  const { consented }: { consented: boolean } = props;
  const { searchParams } = new URL(window.location.href);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const oAuthError = searchParams.get('error');

  const classes = useStyles();
  const authProvider = useContext(AuthContext);
  const { notify } = useContext(NotificationContext);
  const [error, setError] = useState<string | boolean>();
  const [userProfile, setUserProfile] = useState<UserData>(emptyUserData);
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
    if (oAuthError) {
      setError(oAuthError);
    }
  }, [error, oAuthError]);

  useEffect(() => {
    if (authProvider.checkAuth() && !userProfile.displayImage) {
      idbPromise.then(async (idb) => {
        const [first, last, displayImage] = await Promise.all([
          idb.get('user-data', 'first'),
          idb.get('user-data', 'last'),
          idb.get('user-data', 'displayImage'),
        ]);

        if (first && last && displayImage) {
          setUserProfile({
            first,
            last,
            displayImage,
          });
        }
      });
    }
  }, [authProvider, userProfile]);

  useEffect(() => {
    if (!authProvider.checkAuth() && !oAuthError && code && state) {
      authProvider
        .login({ code, state })
        .then(({ message, user_data }: AuthResponse) => {
          setUserProfile(user_data);
          notify('success', message);
        })
        .catch((error) => {
          setError(error);
          notify('error', `Login unsuccessful: ${error.message}`);
        });
    } else if (oAuthError) {
      notify('error', `Authentication error: ${oAuthError}`);
    }
  }, [error, authProvider, code, state, notify, oAuthError]);

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
      .then(({ message }: AuthResponse) => {
        setUserProfile(emptyUserData);
        notify('success', message);
      })
      .catch((error) => {
        notify('error', 'Logout Unsuccessful');
      });
  }

  function handleLogin() {
    authProvider.login().then(({ message }: AuthResponse) => {
      notify('info', message);
    });
  }

  return (
    <div className={classes.root}>
      <DefaultAppBar id='top-anchor' position='relative' className={classes.root}>
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
          {/* <div className={classes.search}>
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
          </div> */}
          <Tooltip
            title={<Typography variant='body1'>Open wattry's GitHub</Typography>}
            TransitionComponent={Zoom}>
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
          <Tooltip
            title={<Typography variant='body1'>Open wattry's LinkedIn page</Typography>}
            placement='left'
            TransitionComponent={Zoom}>
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
          {/* {!userProfile.displayImage ? (
            <Tooltip
              title={
                <Typography variant='body1'>
                  {consented
                    ? 'Use LinkedIn to request a resume'
                    : 'Cookies are declined please reload the page and accept to login.'}
                </Typography>
              }
              placement='left'
              TransitionComponent={Zoom}>
              <div>
                <IconButton
                  aria-label='Use LinkedIn to request a resume'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleLogin}
                  disabled={consented ? false : true}
                  color='inherit'>
                  <AccountCircle />
                </IconButton>
              </div>
            </Tooltip>
          ) : (
            <Tooltip
              placement='left'
              title={<Typography variant='body1'>Logout of LinkedIn</Typography>}
              TransitionComponent={Zoom}>
              <IconButton
                aria-label='Logout of LinkedIn'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                size='medium'
                style={{
                  background: `url(${userProfile.displayImage})`,
                  height: '4rem',
                  width: '4rem',
                }}
                onClick={handleLogout}
                color='inherit'>
                <PowerSettingsNew />
              </IconButton>
            </Tooltip>
          )} */}
        </Toolbar>
      </DefaultAppBar>
      <Drawer toggleDrawer={toggleDrawer} expanded={expanded} />
    </div>
  );
}
