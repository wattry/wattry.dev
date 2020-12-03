import React, { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { NotificationContext } from '../../providers/NotificationProvider';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function Notification() {
  const { close, state } = useContext(NotificationContext);
  const classes = useStyles();

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    close();
  };

  return (
    <div className={classes.root}>
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
    </div>
  );
}
