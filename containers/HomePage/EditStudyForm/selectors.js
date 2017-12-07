import { createSelector } from 'reselect';
import { get } from 'lodash';

/**
 * Direct selector to the routing state domain
 */
const selectFormDomain = () => state => state.form;

/**
 * EditStudyForm -> all values
 */
const selectEditStudyFormValues = () => createSelector(
  selectFormDomain(),
  substate => get(substate, 'editStudy.values', {})
);

/**
 * EditStudyForm -> checking validation error
 */
const selectEditStudyFormError = () => createSelector(
  selectFormDomain(),
  (substate) => {
    const errors = get(substate, 'editStudy.syncErrors', {});
    return Object.keys(errors).length > 0;
  }
);

const selectEditStudyFormRecruitmentPhoneValue = () => createSelector(
  selectFormDomain(),
  substate => get(substate, 'editStudy.values.recruitmentPhone', null)
);

const selectEditStudyFormStudyAdValue = () => createSelector(
  selectFormDomain(),
  substate => get(substate, 'editStudy.values.studyAd', null)
);

export default selectFormDomain;
export {
  selectEditStudyFormValues,
  selectEditStudyFormError,
  selectEditStudyFormRecruitmentPhoneValue,
  selectEditStudyFormStudyAdValue,
};
