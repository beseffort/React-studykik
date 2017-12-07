import { fork } from 'redux-saga/effects';

import baseDataSaga from './baseData.saga';
import fetchMeSaga from './fetchMe.saga';
import loginSaga, { logoutSaga, resetPassword, setNewPassword, confirmPasswordChange } from './login.saga';
import { GlobalNotificationsSaga } from './socket.saga';

// All sagas to be loaded
// @ref: https://github.com/mxstbr/react-boilerplate/issues/537
// exporting array of individual sagas doesn't work
// middleware run only accepts one saga
export default function* globalSagas() {
  yield fork(baseDataSaga);

  yield fork(fetchMeSaga);

  yield fork(loginSaga);
  yield fork(resetPassword);
  yield fork(setNewPassword);
  yield fork(confirmPasswordChange);

  yield fork(logoutSaga);

  yield fork(GlobalNotificationsSaga);
}
