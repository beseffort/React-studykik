import { createSelector } from 'reselect';
import { get } from 'lodash';

/**
 * Direct selector to the routing state domain
 */
const selectFormDomain = () => state => state.form;

/**
 * SearchStudiesForm -> all values
 */
const selectSearchStudiesFormValues = () => createSelector(
  selectFormDomain(),
  substate => get(substate, 'searchStudies.values', {})
);

/**
 * SearchStudiesForm -> checking validation error
 */
const selectSearchStudiesFormError = () => createSelector(
  selectFormDomain(),
  (substate) => {
    const errors = get(substate, 'searchStudies.syncErrors', {});
    return Object.keys(errors).length > 0;
  }
);

export default selectFormDomain;
export {
  selectSearchStudiesFormValues,
  selectSearchStudiesFormError,
};
