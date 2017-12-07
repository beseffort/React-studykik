import expect from 'expect';

import homePageReducer from '../reducer';
import { fetchPatientSignUpsSucceeded, fetchPatientMessagesSucceeded } from '../actions';

describe('HomePage/reducer', () => {
  let state;
  beforeEach(() => {
    state = {
      patientSignUps: {
        today: 0,
        yesterday: 0,
      },
      patientMessages: {
        unreadTexts: 0,
        unreadEmails: 0,
      },
      rewardsPoint: 0,
    };
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(homePageReducer(undefined, {})).toEqual(expectedResult);
  });

  it('should handle the fetchPatientSignUpsSucceeded action correctly', () => {
    const response = { today: 1, yesterday: 2 };
    const expectedResult = {
      ...state,
      patientSignUps: {
        today: 1,
        yesterday: 2,
      },
    };
    expect(homePageReducer(state, fetchPatientSignUpsSucceeded(response))).toEqual(expectedResult);
  });

  it('should handle the fetchPatientMessagesSucceeded action correctly', () => {
    const response = { unreadTexts: 1, unreadEmails: 2 };
    const expectedResult = {
      ...state,
      patientMessages: {
        unreadTexts: 1,
        unreadEmails: 2,
      },
    };
    expect(homePageReducer(state, fetchPatientMessagesSucceeded(response))).toEqual(expectedResult);
  });
});
