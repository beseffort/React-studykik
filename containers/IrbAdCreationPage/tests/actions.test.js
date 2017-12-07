import expect from 'expect';

import {
  submitForm,
  formSubmitted,
  formSubmissionError,
} from '../actions';

import {
  SUBMIT_FORM,
  SUBMIT_FORM_SUCCESS,
  SUBMIT_FORM_ERROR,
} from '../constants';

describe('IrbAdCreationPage actions', () => {
  describe('actions for form submission', () => {
    describe('submitForm Action', () => {
      it('should return the correct type with form values', () => {
        const cartValues = {};
        const formValues = {};

        const expected = {
          type: SUBMIT_FORM,
          cartValues: {},
          formValues: {},
        };
        expect(submitForm(cartValues, formValues)).toEqual(expected);
      });
    });

    describe('formSubmitted Action', () => {
      it('should return the correct type and the resopnse', () => {
        const response = {};
        const expected = {
          type: SUBMIT_FORM_SUCCESS,
          payload: response,
        };
        expect(formSubmitted(response)).toEqual(expected);
      });
    });

    describe('formSubmissionError Action', () => {
      it('should return the correct type and the error', () => {
        const error = { status: '', message: '' };
        const expected = {
          type: SUBMIT_FORM_ERROR,
          payload: error,
        };
        expect(formSubmissionError(error)).toEqual(expected);
      });
    });
  });
});
