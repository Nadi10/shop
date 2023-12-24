import { Middleware } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { logout, setLoggedIn } from './app/auth/store/authSlice';

const getAccessTokenFromLocalStorage = () => localStorage.getItem('accessToken');

const checkTokenMiddleware: Middleware = (store) => (next) => async (action: any) => {
  const { type } = action;

  if (type !== 'APP_LOADED' && type !== 'CHECK_TOKEN') {
    if (type === 'LOGIN_SUCCESS') {
      store.dispatch(setLoggedIn(true));
    }

    if (type === 'LOGIN_FAILURE') {
      store.dispatch(logout());
    }

    return next(action);
  }

  const token = getAccessTokenFromLocalStorage();

  if (!token) return next(action);

  try {
    const decodedToken: any = jwtDecode(token);
    const currentTimestamp = Math.floor(new Date().getTime() / 1000);

    if (decodedToken.exp > currentTimestamp) {
      store.dispatch(setLoggedIn(true));
    } else {
      const refresh_token = localStorage.getItem('refreshToken');
      const userId = localStorage.getItem('userId');

      if (!refresh_token) {
        store.dispatch(logout());
        return next(action);
      }

      const response = await axios.post('/api/auth/refresh-token', {
        token: refresh_token,
        userId: userId,
      });

      const { accessToken, refreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      store.dispatch(setLoggedIn(true));
    }
  } catch (error) {
    store.dispatch(logout());
  }

  return next(action);
};

export default checkTokenMiddleware;
