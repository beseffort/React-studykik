import expect from 'expect';

import calendarPageReducer from '../reducer';
import { fetchSchedulesSucceeded, submitSchedule } from '../actions';

describe('CalendarPage/reducer', () => {
  let state;
  beforeEach(() => {
    state = {
      patientsByStudy: {
        isFetching: false,
        data: [],
        error: null,
      },
      schedules: {
        isFetching: false,
        isSubmitting: false,
        isDeleting: false,
        data: [],
        error: null,
      },
    };
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(calendarPageReducer(undefined, {})).toEqual(expectedResult);
  });

  it('should handle the fetchSchedulesSucceeded action correctly', () => {
    const response = [
      { id: 1, user_id: 4, patient_id: 3, siteLocation: 'Palmer Tech', indication: 'Birth Control', protocolNumber: 'AC-1' },
      { id: 2, user_id: 4, patient_id: 3, siteLocation: 'Palmer Tech', indication: 'Acne', protocolNumber: 'AC-2' },
    ];
    const expectedResult = {
      ...state,
      schedules: {
        isFetching: false,
        data: response,
        isSubmitting: false,
        isDeleting: false,
        error: null,
      },
    };
    expect(calendarPageReducer(state, fetchSchedulesSucceeded(response))).toEqual(expectedResult);
  });

  it('should handle the submitSchedule action correctly', () => {
    const payload = {};
    const expectedResult = {
      ...state,
      schedules: {
        isSubmitting: true,
        isFetching: false,
        isDeleting: false,
        data: [],
        error: null,
      },
    };
    expect(calendarPageReducer(state, submitSchedule(payload))).toEqual(expectedResult);
  });
});
