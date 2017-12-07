
// /* eslint-disable no-constant-condition, consistent-return */

import { takeLatest } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { actions as toastrActions } from 'react-redux-toastr';
import { get } from 'lodash';

import { getItem, removeItem } from 'utils/localStorage';
import request from 'utils/request';

import {
  fetchPatientsByStudySucceeded,
  fetchPatientsByStudyFailed,
  fetchSchedulesSucceeded,
  fetchSchedulesFailed,
  submitScheduleSucceeded,
  submitScheduleFailed,
  deleteScheduleSucceeded,
  deleteScheduleFailed,
} from './actions';

import {
  FETCH_PATIENTS_BY_STUDY,
  FETCH_SCHEDULES,
  SUBMIT_SCHEDULE,
  DELETE_SCHEDULE,
} from './constants';

// Bootstrap sagas
export default [
  calendarPageSaga,
];

export function* fetchPatientsByStudyWatcher() {
  yield* takeLatest(FETCH_PATIENTS_BY_STUDY, fetchPatientsByStudyWorker);
}

export function* fetchPatientsByStudyWorker(action) {
  const authToken = getItem('auth_token');
  const { studyId, siteId } = action;

  try {
    const requestURL = `${API_URL}/studies/${studyId}/patients?access_token=${authToken}&siteId=${siteId}`;
    const response = yield call(request, requestURL, {
      method: 'GET',
    });

    yield put(fetchPatientsByStudySucceeded(response));
  } catch (err) {
    // if returns forbidden we remove the token from local storage
    if (err.status === 401) {
      removeItem('auth_token');
    }
    const errorMessage = get(err, 'message', 'Something went wrong while fetching patients for selected study');
    yield put(fetchPatientsByStudyFailed(err));
    yield put(toastrActions.error('', errorMessage));
  }
}

export function* fetchSchedulesWatcher() {
  yield* takeLatest(FETCH_SCHEDULES, fetchSchedulesWorker);
}

export function* fetchSchedulesWorker(action) {
  try {
    const requestURL = `${API_URL}/callReminders/getSchedules`;
    const params = {
      query: action.data,
    };
    const response = yield call(request, requestURL, params);

    yield put(fetchSchedulesSucceeded(response));
  } catch (err) {
    const errorMessage = get(err, 'message', 'Something went wrong while fetching schedules');
    yield put(toastrActions.error('', errorMessage));
    yield put(fetchSchedulesFailed(err));
  }
}

export function* submitSchedulesWatcher() {
  yield* takeLatest(SUBMIT_SCHEDULE, submitSchedulesWorker);
}

export function* submitSchedulesWorker(action) {
  try {
    const requestURL = `${API_URL}/callReminders/upsertSchedule`;
    const params = {
      method: 'POST',
      body: JSON.stringify(action.data),
    };
    const response = yield call(request, requestURL, params);

    yield put(submitScheduleSucceeded(response));
  } catch (err) {
    const errorMessage = get(err, 'message', 'Something went wrong while submitting a schedule');
    yield put(toastrActions.error('', errorMessage));
    yield put(submitScheduleFailed(err));
  }
}

export function* deleteSchedulesWatcher() {
  yield* takeLatest(DELETE_SCHEDULE, deleteSchedulesWorker);
}

export function* deleteSchedulesWorker(action) {
  try {
    const requestURL = `${API_URL}/callReminders/${action.scheduleId}/deleteSchedule`;
    const params = {
      method: 'DELETE',
      body: JSON.stringify({ userId: action.userId }),
    };
    const response = yield call(request, requestURL, params);

    yield put(deleteScheduleSucceeded(response));
  } catch (err) {
    const errorMessage = get(err, 'message', 'Something went wrong while deleting a schedule');
    yield put(toastrActions.error('', errorMessage));
    yield put(deleteScheduleFailed(err));
  }
}

export function* calendarPageSaga() {
  const watcherA = yield fork(fetchPatientsByStudyWatcher);
  const watcherB = yield fork(fetchSchedulesWatcher);
  const watcherC = yield fork(submitSchedulesWatcher);
  const watcherD = yield fork(deleteSchedulesWatcher);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);

  yield cancel(watcherA);
  yield cancel(watcherB);
  yield cancel(watcherC);
  yield cancel(watcherD);
}
