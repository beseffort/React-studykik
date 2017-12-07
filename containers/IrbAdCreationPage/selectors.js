import { createSelector } from 'reselect';

/**
 * Direct selector to the irbAdCreationPage state domain
 */
const selectIrbAdCreationPageDomain = () => state => state.IrbAdCreationPage;

/**
 * Other specific selectors
 */


/**
 * Default selector used by IrbAdCreationPage
 */

const selectIrbAdCreationPage = () => createSelector(
  selectIrbAdCreationPageDomain(),
  (substate) => substate
);

const selectIrbProductList = () => createSelector(
  selectIrbAdCreationPageDomain(),
  (substate) => substate.productList
);

const selectIrbAdCreationDetail = () => createSelector(
  selectIrbAdCreationPageDomain(),
  (substate) => substate.irbAdCreation,
);

export default selectIrbAdCreationPage;
export {
  selectIrbAdCreationPageDomain,
  selectIrbProductList,
  selectIrbAdCreationDetail,
};
