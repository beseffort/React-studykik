/*
 *
 * IrbAdCreationPage actions
 *
 */

import {
  SUBMIT_FORM,
  SUBMIT_FORM_SUCCESS,
  SUBMIT_FORM_ERROR,
  FETCH_IRB_PRODUCT_LIST,
  FETCH_IRB_PRODUCT_LIST_SUCCESS,
  FETCH_IRB_PRODUCT_LIST_ERROR,
  FETCH_IRB_AD_CREATION,
  FETCH_IRB_AD_CREATION_SUCCESS,
  FETCH_IRB_AD_CREATION_ERROR,
} from 'containers/IrbAdCreationPage/constants';

export function submitForm(cartValues, formValues) {
  return {
    type: SUBMIT_FORM,
    cartValues,
    formValues,
  };
}

export function formSubmitted(payload) {
  return {
    type: SUBMIT_FORM_SUCCESS,
    payload,
  };
}

export function formSubmissionError(payload) {
  return {
    type: SUBMIT_FORM_ERROR,
    payload,
  };
}

export function fetchIrbProductList() {
  return {
    type: FETCH_IRB_PRODUCT_LIST,
  };
}

export function fetchIrbProductListSuccess(payload) {
  return {
    type: FETCH_IRB_PRODUCT_LIST_SUCCESS,
    payload,
  };
}

export function fetchIrbProductListError(payload) {
  return {
    type: FETCH_IRB_PRODUCT_LIST_ERROR,
    payload,
  };
}

export function fetchIrbAdCreation(id) {
  return {
    type: FETCH_IRB_AD_CREATION,
    id,
  };
}

export function fetchIrbAdCreationSuccess(payload) {
  return {
    type: FETCH_IRB_AD_CREATION_SUCCESS,
    payload,
  };
}

export function fetchIrbAdCreationError(payload) {
  return {
    type: FETCH_IRB_AD_CREATION_ERROR,
    payload,
  };
}
