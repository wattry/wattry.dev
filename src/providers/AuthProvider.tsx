import React, { createContext } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

import idbPromise from './idb';
export interface AuthResponse {
  message: string;
  user_data?: any;
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
    VITE_HOST,
    VITE_REDIRECT_URL,
    VITE_LINKEDIN_SCOPES,
    VITE_LINKEDIN_URL,
    VITE_RESPONSE_TYPE,
    VITE_CLIENT_ID,
    VITE_API
  } = process.env;

  if (
    process.env.NODE_ENV === 'development' &&
    (!VITE_HOST ||
      !VITE_REDIRECT_URL ||
      !VITE_LINKEDIN_SCOPES ||
      !VITE_RESPONSE_TYPE ||
      !VITE_CLIENT_ID ||
      !VITE_LINKEDIN_URL ||
      !VITE_API)
  ) {
    console.log(
      'VITE_HOST',
      VITE_HOST !== undefined,
      'VITE_REDIRECT_URL',
      VITE_REDIRECT_URL !== undefined,
      'VITE_LINKEDIN_SCOPES',
      VITE_LINKEDIN_SCOPES !== undefined,
      'VITE_LINKEDIN_URL',
      VITE_LINKEDIN_URL !== undefined,
      'VITE_RESPONSE_TYPE',
      VITE_RESPONSE_TYPE !== undefined,
      'VITE_CLIENT_ID',
      VITE_CLIENT_ID !== undefined,
      'VITE_API',
      VITE_API !== undefined,
    );
  }

  if (
    !VITE_HOST ||
    !VITE_REDIRECT_URL ||
    !VITE_LINKEDIN_SCOPES ||
    !VITE_RESPONSE_TYPE ||
    !VITE_CLIENT_ID ||
    !VITE_LINKEDIN_URL
  ) {
    throw new Error('oAuth configured incorrectly');
  }

  const oAuthParams = {
    response_type: VITE_RESPONSE_TYPE,
    client_id: VITE_CLIENT_ID,
    redirect_uri: `${VITE_REDIRECT_URL}`,
    scope: VITE_LINKEDIN_SCOPES,
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

  window.location.replace(`${VITE_LINKEDIN_URL}/oauth/v2/authorization?${encoded}`);
}

const { post } = axios.create({
  baseURL: import.meta.env.VITE_API,
  withCredentials: true,
  timeout: 30000
});

export const authProvider = {
  login: async (params?: LoginParams): Promise<AuthResponse> => {
    const { code, state } = params || {};

    if (!code && !state) {
      // Build up the linkedIn /authorization redirect.
      oAuthRedirect();
      return Promise.resolve({ authenticated: false, message: 'Redirecting to LinkedIn OAuth' });
    } else if (state && !localStorage.getItem(state)) {
      return Promise.reject({ authenticated: false, message: 'Failed XRSF check! Your request may have been compromised' });
    }
    
    cleanup();

    return post('/login', {
      code,
      state,
    }).then(async ({ data: user_data }) => {
      const idb = await idbPromise;

      Object.entries(user_data).map(([key, value]) =>
        idb.put('user-data', value, key),
      );
      
      return { message: 'Login Successful', user_data };
    });
  },
  logout: async (params?: any): Promise<AuthResponse> => {
    return post(
      '/logout').then(() => {
        cleanup();
        return { message: 'Logout Successful' };
      });
  },
  checkAuth: (params?: any): boolean => {
    return document.cookie.includes('authenticated=true');
  },
  checkCookieConsent: (params?: any): boolean => {
    return document.cookie.includes('consented=true');
  }
};

function cleanup() {
  localStorage.clear();
  window.history.replaceState({}, window.document.title, window.location.origin);
  idbPromise.then((idb) => idb.clear('user-data'));
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