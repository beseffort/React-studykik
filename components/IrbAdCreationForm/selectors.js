import { createSelector } from 'reselect';
import { get } from 'lodash';

/**
 * Direct selector to the routing state domain
 */
const selectFormDomain = () => state => state.form;

/**
 * IrbAdCreationForm -> all values
 */
const selectIrbAdCreationFormValues = () => createSelector(
  selectFormDomain(),
  (substate) => get(substate, 'irbAdCreation.values', {})
);

/**
 * IrbAdCreationForm -> checking validation error
 */
const selectIrbAdCreationFormError = () => createSelector(
  selectFormDomain(),
  (substate) => {
    const errors = get(substate, 'irbAdCreation.syncErrors', {});
    return Object.keys(errors).length > 0;
  }
);


export default selectFormDomain;
export {
  selectIrbAdCreationFormValues,
  selectIrbAdCreationFormError,
};
