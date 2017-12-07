import {
  FETCH_PATIENTS_BY_STUDY,
  FETCH_PATIENTS_BY_STUDY_SUCCESS,
  FETCH_PATIENTS_BY_STUDY_ERROR,
  FETCH_SCHEDULES,
  FETCH_SCHEDULES_SUCCESS,
  FETCH_SCHEDULES_ERROR,
  SUBMIT_SCHEDULE,
  SUBMIT_SCHEDULE_SUCCESS,
  SUBMIT_SCHEDULE_ERROR,
  DELETE_SCHEDULE,
  DELETE_SCHEDULE_SUCCESS,
  DELETE_SCHEDULE_ERROR,
  SET_ACTIVE_SORT,
} from './constants';

export function fetchPatientsByStudy(studyId, siteId) {
  return {
    type: FETCH_PATIENTS_BY_STUDY,
    studyId,
    siteId,
  };
}
export function fetchPatientsByStudySucceeded(payload) {
  return {
    type: FETCH_PATIENTS_BY_STUDY_SUCCESS,
    payload,
  };
}
export function fetchPatientsByStudyFailed(payload) {
  return {
    type: FETCH_PATIENTS_BY_STUDY_ERROR,
    payload,
  };
}

export function fetchSchedules(data) {
  return {
    type: FETCH_SCHEDULES,
    data,
  };
}
export function fetchSchedulesSucceeded(payload) {
  return {
    type: FETCH_SCHEDULES_SUCCESS,
    payload,
  };
}
export function fetchSchedulesFailed(payload) {
  return {
    type: FETCH_SCHEDULES_ERROR,
    payload,
  };
}

export function submitSchedule(data) {
  return {
    type: SUBMIT_SCHEDULE,
    data,
  };
}
export function submitScheduleSucceeded(payload) {
  return {
    type: SUBMIT_SCHEDULE_SUCCESS,
    payload,
  };
}
export function submitScheduleFailed(payload) {
  return {
    type: SUBMIT_SCHEDULE_ERROR,
    payload,
  };
}

export function deleteSchedule(scheduleId, userId) {
  return {
    type: DELETE_SCHEDULE,
    scheduleId,
    userId,
  };
}
export function deleteScheduleSucceeded(payload) {
  return {
    type: DELETE_SCHEDULE_SUCCESS,
    payload,
  };
}
export function deleteScheduleFailed(payload) {
  return {
    type: DELETE_SCHEDULE_ERROR,
    payload,
  };
}

export function setActiveSort(sort, direction) {
  return {
    type: SET_ACTIVE_SORT,
    sort,
    direction,
  };
}
