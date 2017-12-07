/**
 * Test  sagas
 */

import expect from 'expect';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
  fetchPatientsByStudyWatcher,
  fetchPatientsByStudyWorker,
  fetchSchedulesWatcher,
  fetchSchedulesWorker,
  submitSchedulesWatcher,
  deleteSchedulesWatcher,
  calendarPageSaga,
} from '../sagas';

import {
  fetchPatientsByStudySucceeded,
  fetchPatientsByStudyFailed,
} from '../actions';

import {
  FETCH_PATIENTS_BY_STUDY,
  FETCH_SCHEDULES,
} from '../constants';

import request from 'utils/request';

describe('CalendarPage/sagas', () => {
  describe('fetchPatientsByStudyWatcher Saga', () => {
    const iterator = fetchPatientsByStudyWatcher();
    let actualYield;
    let expectedYield;

    it('should watch for FETCH_PATIENTS_BY_STUDY action', () => {
      actualYield = iterator.next().value;
      expectedYield = take(FETCH_PATIENTS_BY_STUDY);
      expect(actualYield).toEqual(expectedYield);
    });

    it('should invoke fetchPatientsByStudyWorker saga on actions', () => {
      // @ref http://yelouafi.github.io/redux-saga/docs/advanced/Concurrency.html
      actualYield = iterator.next(put(FETCH_PATIENTS_BY_STUDY)).value;
      expectedYield = fork(fetchPatientsByStudyWorker, put(FETCH_PATIENTS_BY_STUDY));
      expect(actualYield).toEqual(expectedYield);

      // @ref https://jsfiddle.net/npbee/Lqreq12b/2/
      // actualYield = iterator.next().value;
      // expectedYield = take(FETCH_COMPANY_TYPES);
      // expect(actualYield).toEqual(expectedYield);
    });
  });

  describe('fetchPatientsByStudyWorker Saga', () => {
    let iterator;

    beforeEach(() => {
      const action = { studyId: 1, searchParams: {} };
      iterator = fetchPatientsByStudyWorker(action);

      const requestURL = `${API_URL}/studies/${action.studyId}/patient-categories`;
      const params = {
        method: 'GET',
        query: action.searchParams,
      };
      const actualYield = iterator.next().value;
      expect(actualYield).toEqual(call(request, requestURL, params));
    });

    it('should dispatch the fetchPatientsByStudySucceeded action if it gets successful response', () => {
      const response = [];
      const actualYield = iterator.next(response).value;
      expect(actualYield).toEqual(put(fetchPatientsByStudySucceeded(response)));
    });

    it('should call the fetchPatientsByStudyFailed action if the response errors', () => {
      const error = { message: 'Something went wrong!' };
      const actualYield = iterator.throw(error).value;
      expect(actualYield).toEqual(put(fetchPatientsByStudyFailed(error)));
    });
  });

  describe('fetchSchedulesWatcher Saga', () => {
    const iterator = fetchSchedulesWatcher();
    let actualYield;
    let expectedYield;

    it('should watch for FETCH_SCHEDULES action', () => {
      actualYield = iterator.next().value;
      expectedYield = take(FETCH_SCHEDULES);
      expect(actualYield).toEqual(expectedYield);
    });

    it('should invoke fetchSchedulesWorker saga on actions', () => {
      // @ref http://yelouafi.github.io/redux-saga/docs/advanced/Concurrency.html
      actualYield = iterator.next(put(FETCH_SCHEDULES)).value;
      expectedYield = fork(fetchSchedulesWorker, put(FETCH_SCHEDULES));
      expect(actualYield).toEqual(expectedYield);

      // @ref https://jsfiddle.net/npbee/Lqreq12b/2/
      // actualYield = iterator.next().value;
      // expectedYield = take(FETCH_COMPANY_TYPES);
      // expect(actualYield).toEqual(expectedYield);
    });
  });

  describe('calendarPageSaga', () => {
    const mainSaga = calendarPageSaga();

    let forkDescriptorA;
    let forkDescriptorB;
    let forkDescriptorC;
    let forkDescriptorD;

    it('should asyncronously fork 4 watchers saga', () => {
      forkDescriptorA = mainSaga.next();
      expect(forkDescriptorA.value).toEqual(fork(fetchPatientsByStudyWatcher));
      forkDescriptorB = mainSaga.next();
      expect(forkDescriptorB.value).toEqual(fork(fetchSchedulesWatcher));
      forkDescriptorC = mainSaga.next();
      expect(forkDescriptorC.value).toEqual(fork(submitSchedulesWatcher));
      forkDescriptorD = mainSaga.next();
      expect(forkDescriptorD.value).toEqual(fork(deleteSchedulesWatcher));
    });

    it('should yield until LOCATION_CHANGE action', () => {
      const takeDescriptor = mainSaga.next();
      expect(takeDescriptor.value).toEqual(take(LOCATION_CHANGE));
    });

    it('should finally cancel() the forked sagas', function* forkedSagasCancellable() {
      // reuse open fork for more integrated approach
      let actualYield = mainSaga.next().value;
      expect(actualYield).toEqual(cancel(forkDescriptorA.value));
      actualYield = mainSaga.next().value;
      expect(actualYield).toEqual(cancel(forkDescriptorB.value));
      actualYield = mainSaga.next().value;
      expect(actualYield).toEqual(cancel(forkDescriptorC.value));
      actualYield = mainSaga.next().value;
      expect(actualYield).toEqual(cancel(forkDescriptorD.value));
    });
  });
});
