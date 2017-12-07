/**
 * Test  sagas
 */

import expect from 'expect';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
  fetchPatientSignUpsWatcher,
  fetchPatientSignUpsWorker,
  fetchPatientMessagesWatcher,
  fetchPatientMessagesWorker,
  fetchRewardsPointWatcher,
  homePageSaga,
} from '../sagas';

import {
  fetchPatientSignUpsSucceeded,
} from '../actions';

import {
  FETCH_PATIENT_SIGN_UPS,
  FETCH_PATIENT_MESSAGES,
} from '../constants';

import request from 'utils/request';

describe('HomePage/sagas', () => {
  describe('fetchPatientSignUpsWatcher Saga', () => {
    const iterator = fetchPatientSignUpsWatcher();
    let actualYield;
    let expectedYield;

    it('should watch for FETCH_PATIENT_SIGN_UPS action', () => {
      actualYield = iterator.next().value;
      expectedYield = take(FETCH_PATIENT_SIGN_UPS);
      expect(actualYield).toEqual(expectedYield);
    });

    it('should invoke fetchPatientSignUpsWorker saga on actions', () => {
      // @ref http://yelouafi.github.io/redux-saga/docs/advanced/Concurrency.html
      actualYield = iterator.next(put(FETCH_PATIENT_SIGN_UPS)).value;
      expectedYield = fork(fetchPatientSignUpsWorker, put(FETCH_PATIENT_SIGN_UPS));
      expect(actualYield).toEqual(expectedYield);

      // @ref https://jsfiddle.net/npbee/Lqreq12b/2/
      // actualYield = iterator.next().value;
      // expectedYield = take(FETCH_COMPANY_TYPES);
      // expect(actualYield).toEqual(expectedYield);
    });
  });

  describe('fetchPatientSignUpsWorker Saga', () => {
    let iterator;

    beforeEach(() => {
      const action = { currentUser: { roleForClient: { client_id: 3 } } };
      iterator = fetchPatientSignUpsWorker(action);

      const requestURL = `${API_URL}/clients/${action.currentUser.roleForClient.client_id}/patientSignUps`;
      const params = {
        method: 'GET',
        query: {
          timezoneOffset: -new Date().getTimezoneOffset() / 60,
        },
      };

      const actualYield = iterator.next().value;
      expect(actualYield).toEqual(call(request, requestURL, params));
    });

    it('should dispatch the fetchPatientSignUpsSucceeded action if it gets successful response', () => {
      const response = [];
      const actualYield = iterator.next(response).value;
      expect(actualYield).toEqual(put(fetchPatientSignUpsSucceeded(response)));
    });
  });

  describe('fetchPatientMessagesWatcher Saga', () => {
    const iterator = fetchPatientMessagesWatcher();
    let actualYield;
    let expectedYield;

    it('should watch for FETCH_PATIENT_MESSAGES action', () => {
      actualYield = iterator.next().value;
      expectedYield = take(FETCH_PATIENT_MESSAGES);
      expect(actualYield).toEqual(expectedYield);
    });

    it('should invoke fetchPatientMessagesWorker saga on actions', () => {
      // @ref http://yelouafi.github.io/redux-saga/docs/advanced/Concurrency.html
      actualYield = iterator.next(put(FETCH_PATIENT_MESSAGES)).value;
      expectedYield = fork(fetchPatientMessagesWorker, put(FETCH_PATIENT_MESSAGES));
      expect(actualYield).toEqual(expectedYield);

      // @ref https://jsfiddle.net/npbee/Lqreq12b/2/
      // actualYield = iterator.next().value;
      // expectedYield = take(FETCH_COMPANY_TYPES);
      // expect(actualYield).toEqual(expectedYield);
    });
  });

  describe('homePageSaga', () => {
    const mainSaga = homePageSaga();

    let forkDescriptorA;
    let forkDescriptorB;
    let forkDescriptorC;

    it('should asyncronously fork 3 watchers saga', () => {
      forkDescriptorA = mainSaga.next();
      expect(forkDescriptorA.value).toEqual(fork(fetchPatientSignUpsWatcher));
      forkDescriptorB = mainSaga.next();
      expect(forkDescriptorB.value).toEqual(fork(fetchPatientMessagesWatcher));
      forkDescriptorC = mainSaga.next();
      expect(forkDescriptorC.value).toEqual(fork(fetchRewardsPointWatcher));
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
    });
  });
});
