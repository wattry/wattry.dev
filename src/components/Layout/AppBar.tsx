import React, { useEffect, useState, useContext } from 'react';
import { Toolbar, IconButton, Typography, Tooltip, Zoom, AppBar as DefaultAppBar } from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import idbPromise from '../../providers/idb';
import Drawer from './Drawer';
import { AuthContext } from '../../providers/AuthProvider';
import { NotificationContext } from '../../providers/NotificationProvider';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.default,
}));

const StyledAppBar = styled(DefaultAppBar)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.default,
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
}));

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
    <Root>
      <StyledAppBar id='top-anchor' position='relative'>
        <Toolbar>
          <MenuButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={handleClick}>
            <MenuIcon />
          </MenuButton>
          <Title variant='h6' noWrap>
            wattry
          </Title>
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
              href='https://linkedin.com/in/wattry'
              target='_blank'
              color='inherit'>
              <LinkedIn />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </StyledAppBar>
      <Drawer toggleDrawer={toggleDrawer} expanded={expanded} />
    </Root>
  );
}
