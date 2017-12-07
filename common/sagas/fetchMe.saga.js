/*
 *  saga to load auth user details from the just token
 */
import { take, call, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import request from 'utils/request';
import { getItem, removeItem } from 'utils/localStorage';
import { FETCH_ME_FROM_TOKEN } from 'containers/App/constants';
import { setAuthState, setUserData } from 'containers/App/actions';
import { selectCurrentPath } from 'common/selectors/router.selector';


export default function* fetchMeSaga() {
  while (true) {
    yield take(FETCH_ME_FROM_TOKEN);
    yield call(fetchMeFromToken);
  }
}


export function* fetchMeFromToken() {
  const userId = getItem('user_id');
  const authToken = getItem('auth_token');

  if (!authToken) {
    return;
  }

  try {
    const requestURL = `${API_URL}/users/${userId}/get-full-user-info?access_token=${authToken}`;
    const response = yield call(request, requestURL);

    yield put(setUserData(response));

    // If the user landed on `/login` as the first route, redirect him
    const currentPath = yield select(selectCurrentPath);
    const pathsToRedirect = ['/', '/login'];
    if (pathsToRedirect.indexOf(currentPath) > -1) {
      yield put(push('/'));
    }
  } catch (e) {
    yield put(setAuthState(false));
    yield put(setUserData(null));

    // if returns forbidden we remove the token from local storage
    if (e.status === 401) {
      removeItem('auth_token');
    }
    yield put(push('/login'));
  }
}
