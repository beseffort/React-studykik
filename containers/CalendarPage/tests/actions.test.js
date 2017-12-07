import expect from 'expect';

import {
  fetchPatientsByStudy,
  fetchPatientsByStudySucceeded,
  fetchPatientsByStudyFailed,
  fetchSchedules,
  submitSchedule,
  deleteSchedule,
} from '../actions';

import {
  FETCH_PATIENTS_BY_STUDY,
  FETCH_PATIENTS_BY_STUDY_SUCCESS,
  FETCH_PATIENTS_BY_STUDY_ERROR,
  FETCH_SCHEDULES,
  SUBMIT_SCHEDULE,
  DELETE_SCHEDULE,
} from '../constants';

describe('CalendarPage/actions', () => {
  describe('actions for fetching patients by study', () => {
    describe('fetchPatientsByStudy', () => {
      it('should dispatch action with correct type and payload', () => {
        const studyId = 1;
        const searchParams = {};
        const expected = {
          type: FETCH_PATIENTS_BY_STUDY,
          studyId,
          searchParams,
        };
        expect(fetchPatientsByStudy(studyId, searchParams)).toEqual(expected);
      });
    });

    describe('fetchPatientsByStudySucceeded', () => {
      it('should return the correct type and the response', () => {
        const response = {};
        const expected = {
          type: FETCH_PATIENTS_BY_STUDY_SUCCESS,
          payload: response,
        };
        expect(fetchPatientsByStudySucceeded(response)).toEqual(expected);
      });
    });

    describe('fetchPatientsByStudyFailed', () => {
      it('should return the correct type and the error', () => {
        const error = { status: '', message: '' };
        const expected = {
          type: FETCH_PATIENTS_BY_STUDY_ERROR,
          payload: error,
        };
        expect(fetchPatientsByStudyFailed(error)).toEqual(expected);
      });
    });
  });

  describe('fetchSchedules action', () => {
    it('should dispatch action with correct type and payload', () => {
      const data = { userId: 1 };
      const expected = {
        type: FETCH_SCHEDULES,
        data,
      };
      expect(fetchSchedules(data)).toEqual(expected);
    });
  });

  describe('submitSchedule action', () => {
    it('should dispatch action with correct type and payload', () => {
      const data = {
        userId: 1,
        patientId: 2,
        siteLocation: 'Wayne Enterprises',
        indication: 'Acne',
        protocolNumber: 'AC-1',
        time: new Date(),
      };
      const expected = {
        type: SUBMIT_SCHEDULE,
        data,
      };
      expect(submitSchedule(data)).toEqual(expected);
    });
  });

  describe('deleteSchedule action', () => {
    it('should dispatch action with correct type and payload', () => {
      const scheduleId = 1;
      const userId = 2;
      const expected = {
        type: DELETE_SCHEDULE,
        scheduleId,
        userId,
      };
      expect(deleteSchedule(scheduleId, userId)).toEqual(expected);
    });
  });
});
