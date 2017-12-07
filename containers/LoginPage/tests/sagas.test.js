import expect from 'expect';
import { take, call, fork } from 'redux-saga/effects';
import loginSaga, { authorize } from '../../../common/sagas/login.saga';

import { fetchMeFromToken } from 'containers/App/actions';

import {
  LOGIN_REQUEST,
} from '../constants';

import request from 'utils/request';

describe('LoginPage/sagas', () => {
  describe('loginSaga', () => {
    const iterator = loginSaga();
    let actualYield;
    let expectedYield;

    it('should watch for LOGIN_REQUEST action', () => {
      actualYield = iterator.next().value;
      expectedYield = take(LOGIN_REQUEST);
      expect(actualYield).toEqual(expectedYield);
    });
  });

  describe('authorize', () => {
    let iterator;

    beforeEach(() => {
      const action = {
        payload: {
          email: 'willgraham@example.com',
          password: '123',
        },
        type: 'LoginPage/LOGIN_REQUEST',
      };
      iterator = authorize(action.payload);
      const requestURL = `${API_URL}/users/login`;
      const params = {
        method: 'POST',
        body: JSON.stringify(action.payload),
      };

      const actualYield = iterator.next().value;
      expect(actualYield).toEqual(call(request, requestURL, params));
    });

    it('should dispatch the fetchMeFromToken if it gets successful response', () => {
      const response = {};
      const actualYield = iterator.next(response).value;
      expect(actualYield).toEqual(fork(fetchMeFromToken()));
    });
  });
});
