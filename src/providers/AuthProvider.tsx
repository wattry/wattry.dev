import React, { createContext } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

import idbPromise from './idb';
export interface AuthResponse {
  authenticated: boolean;
  message: string;
  data?: any,
  error?: any
}

export interface UserData {
  first: string,
  last: string,
  displayImage: string
}

export interface LoginParams{
  code: string;
  state: string;
}

function oAuthRedirect(): void {
  const {
    REACT_APP_HOST,
    REACT_APP_REDIRECT_URL,
    REACT_APP_LINKEDIN_SCOPES,
    REACT_APP_LINKEDIN_URL,
    REACT_APP_RESPONSE_TYPE,
    REACT_APP_CLIENT_ID,
  } = process.env;

  if (process.env.NODE_ENV === 'development') {
    console.log(
      'REACT_APP_HOST',
      REACT_APP_HOST !== undefined,
      'REACT_APP_REDIRECT_URL',
      REACT_APP_REDIRECT_URL !== undefined,
      'REACT_APP_LINKEDIN_SCOPES',
      REACT_APP_LINKEDIN_SCOPES !== undefined,
      'REACT_APP_LINKEDIN_URL',
      REACT_APP_LINKEDIN_URL !== undefined,
      'REACT_APP_RESPONSE_TYPE',
      REACT_APP_RESPONSE_TYPE !== undefined,
      'REACT_APP_CLIENT_ID',
      REACT_APP_CLIENT_ID !== undefined,
    );
  }

  if (
    !REACT_APP_HOST ||
    !REACT_APP_REDIRECT_URL ||
    !REACT_APP_LINKEDIN_SCOPES ||
    !REACT_APP_RESPONSE_TYPE ||
    !REACT_APP_CLIENT_ID ||
    !REACT_APP_LINKEDIN_URL
  ) {
    throw new Error('oAuth configured incorrectly');
  }

  const oAuthParams = {
    response_type: REACT_APP_RESPONSE_TYPE,
    client_id: REACT_APP_CLIENT_ID,
    redirect_uri: `${REACT_APP_REDIRECT_URL}`,
    scope: REACT_APP_LINKEDIN_SCOPES,
    state: uuid(),
  };

  localStorage.setItem(oAuthParams.state, oAuthParams.state);

  const encoded = encodeURI(
    Object.entries(oAuthParams)
      .map((param: string[]) => {
        return param.join('=');
      })
      .join('&'),
  );

  window.location.replace(`${REACT_APP_LINKEDIN_URL}/oauth/v2/authorization?${encoded}`);
}

const authProvider = {
  login: async (params?: LoginParams): Promise<AuthResponse> => {
    const { code, state } = params || {};

    if (!code && !state) {
      // Build up the linkedIn /authorization redirect.
      oAuthRedirect();
      return Promise.resolve({ authenticated: false, message: 'Redirecting to LinkedIn OAuth' });
    } else if (state && !localStorage.getItem(state)) {
      return Promise.reject({ authenticated: false, message: 'Failed XRSF check! Your request may have been compromised' });
    }

    return axios('/login', {
      method: 'POST',
      data: {
        code,
        state,
      },
    })
      .then(async ({ data }) => {
        const { userData, expiryDate } = data || {};
        cleanup();

        const idb = await idbPromise;
        const promises = Object.entries(userData).map(([key, value]) => idb.put('user-info', value, key));
        
        promises.push(idb.put('user-info', expiryDate, 'expiryDate'));        
        return { authenticated: true, message: 'Login Successful', data: { ...userData } };
      })
      .catch((error) => {
        cleanup();
        return { authenticated: false, error, message: 'Login Unsuccessful' };
      });
  },
  logout: async (params?: any): Promise<AuthResponse> => {
    return axios('/logout', {
      withCredentials: true,
      method: 'DELETE',
    })
      .then((data) => {
        cleanup();
        return { authenticated: false, message: 'Logout Successful' };
      })
      .catch((error) => {
        return { authenticated: false, message: 'Logout Unsuccessful' };
      });
  },
};

function cleanup() {
  localStorage.clear();
  window.history.replaceState({}, window.document.title, window.location.origin);
  idbPromise.then((idb) => idb.clear('user-info'));
}

export const AuthContext = createContext(authProvider)

function AuthProvider({ children }: { children: any }) {
  return (
    <AuthContext.Provider value={authProvider}>
      {children}
    </AuthContext.Provider>
  )
}


export default AuthProvider;