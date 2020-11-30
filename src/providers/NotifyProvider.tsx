import React, { createContext, useState } from 'react';
import { AlertProps } from '@material-ui/lab/Alert';

interface NotifyProps {
  open?: boolean;
  message: string;
  type: AlertProps['severity'];
}

export const notifyInitialState: NotifyProps = {
  open: false,
  message: '',
  type: undefined,
};


export const NotifyContext = createContext({
  notify: (type: AlertProps['severity'], message: string) => {},
  close: () => {},
  state: notifyInitialState,
});

function NotificationProvider({ children }: { children: any }) {
  const [state, setState] = useState<NotifyProps>(notifyInitialState);
  
  function notify(type: AlertProps['severity'], message: string) {
    if (!state.open) {
      setState({ open: true, type, message });
    }
  }

  function close() {
    setState(({ type, message}: { type: AlertProps['severity'], message: string }) => ({ type, message, open: false }));
  }

  return <NotifyContext.Provider value={{ notify, close, state }}>{children}</NotifyContext.Provider>;
}

export default NotificationProvider;
