import axios from 'axios';
import { v4 as uuid } from 'uuid';

interface AuthResponse {
  authenticated: boolean;
  message: string;
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

export default {
  login: async (params?: { code: string; state: string }): Promise<AuthResponse> => {
    const { code, state } = params || {};

    if (!code && !state) {
      // Build up the linkedIn /authorization redirect.
      oAuthRedirect();
      return Promise.resolve({ authenticated: false, message: 'Redirecting to LinkedIn OAuth' });
    } else if (state && state !== localStorage.getItem(state)) {
      return Promise.reject({ authenticated: false, message: 'Failed XRSF check!' });
    }

    return axios('/login', {
      method: 'POST',
      data: {
        code,
        state,
      },
    })
      .then(({ data }) => {
        const { userData, expiryDate } = data || {};

        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('expires', expiryDate);
        window.history.replaceState({}, window.document.title, window.location.origin);

        return { authenticated: true, message: 'Login Successful' };
      })
      .catch((error) => {
        return { authenticated: false, message: 'Login Unsuccessful' };
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
}
