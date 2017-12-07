import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { actions as toastrActions } from 'react-redux-toastr';
import { reset } from 'redux-form';
import _, { get } from 'lodash';

import request from 'utils/request';

import {
  formSubmitted,
  formSubmissionError,
  fetchIrbProductListSuccess,
  fetchIrbProductListError,
  fetchIrbAdCreationSuccess,
  fetchIrbAdCreationError,
} from 'containers/IrbAdCreationPage/actions';

import {
  SUBMIT_FORM,
  FETCH_IRB_PRODUCT_LIST,
  FETCH_IRB_AD_CREATION,
} from 'containers/IrbAdCreationPage/constants';

export function* submitFormWatcher() {
  while (true) {
    // listen for the SUBMIT_FORM action dispatched on form submit
    // cartValues
    const { cartValues, formValues } = yield take(SUBMIT_FORM);

    try {
      const requestURL = `${API_URL}/irbAdCreations`;
      const data = new FormData();
      _.forEach(formValues, (value, index) => {
        if (index === 'file') {
          data.append(index, value[0]);
        } else {
          data.append(index, value);
        }
      });
      data.append('cartValues', JSON.stringify(cartValues));
      const params = {
        method: 'POST',
        body: data,
        useDefaultContentType: true,
      };
      const response = yield call(request, requestURL, params);

      yield put(toastrActions.success('IRB Ad Form', 'The request has been submitted successfully'));
      yield put(formSubmitted(response));

      // Clear the form values
      yield put(reset('irbAdCreation'));
    } catch (err) {
      const errorMessage = get(err, 'message', 'Something went wrong while submitting your request');
      yield put(toastrActions.error('', errorMessage));
      yield put(formSubmissionError(err));
    }
  }
}

export function* fetchIrbProductListWatcher() {
  while (true) {
    yield take(FETCH_IRB_PRODUCT_LIST);

    try {
      const requestURL = `${API_URL}/irbAdProductList`;
      const response = yield call(request, requestURL);

      yield put(fetchIrbProductListSuccess(response));
    } catch (err) {
      const errorMessage = get(err, 'message', 'Can not fetch IrbAd Product List');
      yield put(toastrActions.error('', errorMessage));
      yield put(fetchIrbProductListError(err));
    }
  }
}

export function* fetchIrbAdCreationWatcher() {
  while (true) {
    const { id } = yield take(FETCH_IRB_AD_CREATION);

    try {
      const requestURL = `${API_URL}/irbAdCreations/${id}`;
      const response = yield call(request, requestURL);

      yield put(fetchIrbAdCreationSuccess(response));
    } catch (err) {
      const errorMessage = get(err, 'message', 'Something went wrong while fetching the irb ad creation');
      yield put(toastrActions.error('', errorMessage));
      yield put(fetchIrbAdCreationError(err));
    }
  }
}

export function* irbAdCreationPageSaga() {
  const watcherA = yield fork(submitFormWatcher);
  const watcherB = yield fork(fetchIrbProductListWatcher);
  const watcherC = yield fork(fetchIrbAdCreationWatcher);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcherA);
  yield cancel(watcherB);
  yield cancel(watcherC);
}

// All sagas to be loaded
export default [
  irbAdCreationPageSaga,
];
