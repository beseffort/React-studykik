/**
 * Test  sagas
 */

import expect from 'expect';
import { take, put, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
  submitFormWatcher,
  irbAdCreationPageSaga,
} from '../sagas';

import {
  formSubmitted,
  formSubmissionError,
} from 'containers/IrbAdCreationPage/actions';

import {
  SUBMIT_FORM,
} from 'containers/IrbAdCreationPage/constants';

describe('IrbAdCreationPage Saga', () => {
  describe('submitFormWatcher Saga', () => {
    let iterator;
    let actualYield;
    const cartValues = {};
    const formValues = {};
    const values = { cartValues, formValues };

    beforeEach(() => {
      iterator = submitFormWatcher();

      actualYield = iterator.next().value;
      expect(actualYield).toEqual(take(SUBMIT_FORM));

      actualYield = iterator.next(values).value; // optionally passing a value
    });

    it('should dispatch the formSubmitted action if it gets successful response', () => {
      const response = values;
      actualYield = iterator.next(response).value;
      actualYield = iterator.next().value; // skip react-redux-toastr actions
      expect(actualYield).toEqual(put(formSubmitted(response)));
    });

    it('should call the formSubmissionError action if the response errors', () => {
      const error = { message: 'Something went wrong!' };
      actualYield = iterator.throw(error).value;
      actualYield = iterator.next().value; // skip react-redux-toastr actions
      expect(actualYield).toEqual(put(formSubmissionError(error)));
    });
  });

  describe('irbAdCreationPageSaga', () => {
    const mainSaga = irbAdCreationPageSaga();

    let forkDescriptorA;

    it('should asyncronously fork submit form watcher saga', () => {
      forkDescriptorA = mainSaga.next();
      expect(forkDescriptorA.value).toEqual(fork(submitFormWatcher));
    });

    it('should yield until LOCATION_CHANGE action', () => {
      const takeDescriptor = mainSaga.next();
      expect(takeDescriptor.value).toEqual(take(LOCATION_CHANGE));
    });

    it('should finally cancel() the forked submitFormWatcher saga',
      function* referFormSagaCancellable() {
        // reuse open fork for more integrated approach
        const actualYield = mainSaga.next(put(LOCATION_CHANGE)).value;
        expect(actualYield).toEqual(cancel(forkDescriptorA));
      }
    );
  });
});
