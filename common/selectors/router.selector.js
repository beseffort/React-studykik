import { createSelector } from 'reselect';
import { get } from 'lodash';

/**
 * Direct selector to the routing state domain
 */
function selectRoutingDomain(state) {
  return state.routing;
}

/**
 * Other specific selectors
 */
export const selectNextPathname = createSelector(
  selectRoutingDomain,
  substate => {
    let nextPathname = false;

    if (get(substate, 'locationBeforeTransitions.state.nextPathname')) {
      nextPathname = substate.locationBeforeTransitions.state.nextPathname;
    }

    return nextPathname;
  }
);

export const selectCurrentPath = createSelector(
  selectRoutingDomain,
  substate => (get(substate, 'locationBeforeTransitions.pathname'))
);

export const selectRouting = createSelector(
  selectRoutingDomain,
  substate => substate
);
