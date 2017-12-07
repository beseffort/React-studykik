import { createSelector } from 'reselect';
import { get } from 'lodash';

/**
 * Direct selector to the routing state domain
 */
const selectFormDomain = () => state => state.form;

/**
 * RenewStudyForm -> all values
 */
const selectRenewStudyFormValues = () => createSelector(
  selectFormDomain(),
  substate => get(substate, 'renewStudy.values', {})
);

/**
 * RenewStudyForm -> checking validation error
 */
const selectRenewStudyFormError = () => createSelector(
  selectFormDomain(),
  (substate) => {
    const errors = get(substate, 'renewStudy.syncErrors', {});
    return Object.keys(errors).length > 0;
  }
);

const selectRenewStudyFormExposureLevelValue = () => createSelector(
  selectFormDomain(),
  substate => get(substate, 'renewStudy.values.exposureLevel', null)
);

const selectRenewStudyFormCampaignLengthValue = () => createSelector(
  selectFormDomain(),
  substate => get(substate, 'renewStudy.values.campaignLength', null)
);

const selectRenewStudyFormCondenseToTwoWeeksValue = () => createSelector(
  selectFormDomain(),
  substate => get(substate, 'renewStudy.values.condenseToTwoWeeks', null)
);

const selectRenewStudyFormPatientMessagingSuiteValue = () => createSelector(
  selectFormDomain(),
  substate => get(substate, 'renewStudy.values.patientMessagingSuite', null)
);

const selectRenewStudyFormCallTrackingValue = () => createSelector(
  selectFormDomain(),
  substate => get(substate, 'renewStudy.values.callTracking', null)
);

const selectRenewStudyFormStartDateValue = () => createSelector(
  selectFormDomain(),
  substate => get(substate, 'renewStudy.values.startDate', null)
);

const selectRenewStudyFormNotesValue = () => createSelector(
  selectFormDomain(),
  substate => get(substate, 'renewStudy.values.notes', null)
);

export default selectFormDomain;
export {
  selectRenewStudyFormValues,
  selectRenewStudyFormError,
  selectRenewStudyFormExposureLevelValue,
  selectRenewStudyFormCampaignLengthValue,
  selectRenewStudyFormCondenseToTwoWeeksValue,
  selectRenewStudyFormPatientMessagingSuiteValue,
  selectRenewStudyFormCallTrackingValue,
  selectRenewStudyFormStartDateValue,
  selectRenewStudyFormNotesValue,
};
