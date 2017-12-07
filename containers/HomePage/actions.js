import {
  FETCH_PATIENT_SIGN_UPS,
  FETCH_PATIENT_SIGN_UPS_SUCCEESS,
  FETCH_PATIENT_MESSAGES,
  FETCH_PATIENT_MESSAGES_SUCCEESS,
  FETCH_REWARDS_POINT,
  FETCH_REWARDS_POINT_SUCCEESS,
  FETCH_STUDIES,
  FETCH_STUDIES_SUCCESS,
  FETCH_STUDIES_ERROR,
  FETCH_INDICATION_LEVEL_PRICE,
  FETCH_INDICATION_LEVEL_PRICE_SUCCESS,
  FETCH_INDICATION_LEVEL_PRICE_ERROR,
  CLEAR_INDICATION_LEVEL_PRICE,
  RENEW_STUDY,
  RENEW_STUDY_SUCCESS,
  RENEW_STUDY_ERROR,
  UPGRADE_STUDY,
  UPGRADE_STUDY_SUCCESS,
  UPGRADE_STUDY_ERROR,
  EDIT_STUDY,
  EDIT_STUDY_SUCCESS,
  EDIT_STUDY_ERROR,
  SET_ACTIVE_SORT,
  SORT_SUCCESS,
} from './constants';

export function fetchPatientSignUps(currentUser) {
  return {
    type: FETCH_PATIENT_SIGN_UPS,
    currentUser,
  };
}

export function fetchPatientSignUpsSucceeded(payload) {
  return {
    type: FETCH_PATIENT_SIGN_UPS_SUCCEESS,
    payload,
  };
}

export function fetchPatientMessages(currentUser) {
  return {
    type: FETCH_PATIENT_MESSAGES,
    currentUser,
  };
}

export function fetchPatientMessagesSucceeded(payload) {
  return {
    type: FETCH_PATIENT_MESSAGES_SUCCEESS,
    payload,
  };
}

export function fetchRewardsPoint(currentUser) {
  return {
    type: FETCH_REWARDS_POINT,
    currentUser,
  };
}

export function fetchRewardsPointSucceeded(payload) {
  return {
    type: FETCH_REWARDS_POINT_SUCCEESS,
    payload,
  };
}

export function fetchStudies(searchParams = null) {
  return {
    type: FETCH_STUDIES,
    searchParams,
  };
}

export function studiesFetched(payload) {
  return {
    type: FETCH_STUDIES_SUCCESS,
    payload,
  };
}

export function studiesFetchingError(payload) {
  return {
    type: FETCH_STUDIES_ERROR,
    payload,
  };
}

export function fetchIndicationLevelPrice(levelId, indicationId) {
  return {
    type: FETCH_INDICATION_LEVEL_PRICE,
    levelId,
    indicationId,
  };
}

export function indicationLevelPriceFetched(payload) {
  return {
    type: FETCH_INDICATION_LEVEL_PRICE_SUCCESS,
    payload,
  };
}

export function indicationLevelPriceFetchingError(payload) {
  return {
    type: FETCH_INDICATION_LEVEL_PRICE_ERROR,
    payload,
  };
}

export function clearIndicationLevelPrice() {
  return {
    type: CLEAR_INDICATION_LEVEL_PRICE,
  };
}

export function renewStudy(studyId, cartValues, formValues) {
  return {
    type: RENEW_STUDY,
    studyId,
    cartValues,
    formValues,
  };
}

export function studyRenewed(payload) {
  return {
    type: RENEW_STUDY_SUCCESS,
    payload,
  };
}

export function studyRenewingError(payload) {
  return {
    type: RENEW_STUDY_ERROR,
    payload,
  };
}

export function upgradeStudy(studyId, cartValues, formValues) {
  return {
    type: UPGRADE_STUDY,
    studyId,
    cartValues,
    formValues,
  };
}

export function studyUpgraded(payload) {
  return {
    type: UPGRADE_STUDY_SUCCESS,
    payload,
  };
}

export function studyUpgradingError(payload) {
  return {
    type: UPGRADE_STUDY_ERROR,
    payload,
  };
}

export function editStudy(studyId, formValues) {
  return {
    type: EDIT_STUDY,
    studyId,
    formValues,
  };
}

export function studyEdited(payload) {
  return {
    type: EDIT_STUDY_SUCCESS,
    payload,
  };
}

export function studyEditingError(payload) {
  return {
    type: EDIT_STUDY_ERROR,
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

export function sortSuccess(payload) {
  return {
    type: SORT_SUCCESS,
    payload,
  };
}
