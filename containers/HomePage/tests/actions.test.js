import expect from 'expect';

import {
  fetchPatientSignUps,
  fetchPatientMessages,
  fetchRewardsPoint,
  fetchPatientSignUpsSucceeded,
} from '../actions';

import {
  FETCH_PATIENT_SIGN_UPS,
  FETCH_PATIENT_MESSAGES,
  FETCH_REWARDS_POINT,
  FETCH_PATIENT_SIGN_UPS_SUCCEESS,
} from '../constants';

describe('HomePage/actions', () => {
  describe('fetchPatientSignUps', () => {
    it('should dispatch action with correct type and payload', () => {
      const currentUser = {};
      const expected = {
        type: FETCH_PATIENT_SIGN_UPS,
        currentUser,
      };
      expect(fetchPatientSignUps(currentUser)).toEqual(expected);
    });
  });

  describe('fetchPatientMessages', () => {
    it('should dispatch action with correct type and payload', () => {
      const currentUser = {};
      const expected = {
        type: FETCH_PATIENT_MESSAGES,
        currentUser,
      };
      expect(fetchPatientMessages(currentUser)).toEqual(expected);
    });
  });

  describe('fetchRewardsPoint', () => {
    it('should dispatch action with correct type and payload', () => {
      const currentUser = {};
      const expected = {
        type: FETCH_REWARDS_POINT,
        currentUser,
      };
      expect(fetchRewardsPoint(currentUser)).toEqual(expected);
    });
  });

  describe('fetchPatientSignUpsSucceeded action', () => {
    it('should return correct type and payload', () => {
      const payload = {};
      const expected = {
        type: FETCH_PATIENT_SIGN_UPS_SUCCEESS,
        payload,
      };
      expect(fetchPatientSignUpsSucceeded(payload)).toEqual(expected);
    });
  });
});
