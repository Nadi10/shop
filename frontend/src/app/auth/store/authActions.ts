
import { Action } from '@reduxjs/toolkit';

export const loginSuccess = (): Action => ({
  type: 'LOGIN_SUCCESS',
});

export const loginFailure = (error: any): Action => ({
  type: 'LOGIN_FAILURE',
});
