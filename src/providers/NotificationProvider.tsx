import React, { createContext, useState } from 'react';
import { AlertProps } from '@material-ui/lab/Alert';

interface NotifyProps {
  open?: boolean;
  message: string;
  type: AlertProps['severity'];
}

export const initialState: NotifyProps = {
  open: false,
  message: '',
  type: undefined,
};


export const NotificationContext = createContext({
  notify: (type: AlertProps['severity'], message: string) => {},
  close: () => {},
  state: initialState,
});

function NotificationProvider({ children }: { children: any }) {
  const [state, setState] = useState<NotifyProps>(initialState);
  
  function notify(type: AlertProps['severity'], message: string) {
    if (!state.open) {
      setState({ open: true, type, message });
    }
  }

  function close() {
    setState(({ type, message}: { type: AlertProps['severity'], message: string }) => ({ type, message, open: false }));
  }

  return <NotificationContext.Provider value={{ notify, close, state }}>{children}</NotificationContext.Provider>;
}

export default NotificationProvider;
