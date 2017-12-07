import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_REQUEST,
} from './constants';

export function loginRequest(payload) {
  return {
    type: LOGIN_REQUEST,
    payload,
  };
}

export function loginSuccess(token) {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      token,
    },
  };
}

export function loginError(payload) {
  return {
    type: LOGIN_ERROR,
    payload,
  };
}

export function logout() {
  return {
    type: LOGOUT_REQUEST,
  };
}
