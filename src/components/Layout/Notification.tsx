import React, { useContext, forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { styled } from '@mui/material/styles';

import { NotificationContext } from '../../providers/NotificationProvider';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert ref={ref} elevation={6} variant='filled' {...props} />;
});

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  '& > * + *': {
    marginTop: theme.spacing(2),
  },
}));

export default function Notification() {
  const { close, state } = useContext(NotificationContext);

  const handleClose = () => {
    close();
  };

  return (
    <Root>
      <Snackbar
        open={state.open}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        autoHideDuration={5000}
        onClose={handleClose}>
        <Alert onClose={handleClose} icon={false} severity={state.type}>
          {state.message}
        </Alert>
      </Snackbar>
    </Root>
  );
}
