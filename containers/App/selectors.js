import { createSelector } from 'reselect';
import { get, map, pick, filter, findIndex } from 'lodash';

/**
 * Direct selector to the app state domain
 */
const selectGlobal = () => state => state.global;

const selectAuthState = () => createSelector(
  selectGlobal(),
  (substate) => substate.loggedIn
);

const selectCurrentUser = () => createSelector(
  selectGlobal(),
  (substate) => substate.userData
);

const selectEvents = () => createSelector(
  selectGlobal(),
  (substate) => substate.pageEvents
);

const selectCurrentUserClientId = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'userData.roleForClient.client.id', null)
);

const selectCurrentUserStripeCustomerId = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'userData.roleForClient.client.stripeCustomerId', null)
);

// ///////////////////////////////////////////
// base data used across pages
// ///////////////////////////////////////////
const selectSites = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.sites', [])
);

// get user's sites based on siteId and ClientId
const selectUserSites = () => createSelector(
  selectGlobal(),
  (substate) => {
    const currentUser = get(substate, 'userData');
    const siteId = currentUser.site_id;
    let sites = get(substate, 'baseData.sites', []);
    if (siteId) {
      sites = filter(sites, e => e.id === siteId);
    } else {
      const clientId = get(substate, 'userData.roleForClient.client.id', null);
      if (clientId) {
        sites = get(substate, 'baseData.clientSites', {});
      }
    }
    return sites;
  }
);

// get user's site locations based on siteId and ClientId
const selectUserSiteLocations = () => createSelector(
  selectGlobal(),
  (substate) => {
    const currentUser = get(substate, 'userData');
    const siteId = currentUser.site_id;
    const sites = get(substate, 'baseData.sites', []);
    let userSites = [];
    if (siteId) {
      userSites = filter(sites, e => e.id === siteId);
    } else {
      const clientId = get(substate, 'userData.roleForClient.client.id', null);
      if (clientId) {
        userSites = get(substate, 'baseData.clientSites.details', {});
      }
    }
    return map(userSites, e => pick(e, ['id', 'name']));
  }
);

// Deccorated site locations
const selectSiteLocations = () => createSelector(
  selectGlobal(),
  (substate) => {
    const sites = get(substate, 'baseData.sites', []);
    return map(sites, e => pick(e, ['id', 'name']));
  }
);

const selectIndications = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.indications', [])
);

const selectSources = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.sources', [])
);

const selectLevels = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.levels', [])
);

// Decorated study levels
const selectStudyLevels = () => createSelector(
  selectGlobal(),
  (substate) => {
    const levels = get(substate, 'baseData.levels', []);
    return map(levels, e => (
      {
        id: e.id,
        label: `${e.name}`,
        type: e.name,
        stripeProductId: e.stripe_product_id,
      }
    ));
  }
);

const selectCoupon = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.coupon', {})
);

const selectRewards = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.rewards', [])
);

const selectCards = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.cards', {})
);

const selectSavedCard = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.savedCard', {})
);

const selectDeletedCard = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.deletedCard', {})
);

const selectAddCredits = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.addCredits', {})
);

// sites and users
const selectClientSites = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.clientSites', {})
);

const selectSitePatients = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.sitePatients', {})
);

const selectClientCredits = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.clientCredits', {})
);

const selectPatientMessages = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.patientMessages', {})
);

const selectClientRoles = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.clientRoles', {})
);

const selectSelectedSite = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.selectedSite', {})
);

const selectSelectedSiteDetailsForForm = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.selectedSite.details', {})
);

const selectSelectedUser = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.selectedUser', {})
);

const selectSelectedUserDetailsForForm = () => createSelector(
  selectGlobal(),
  (substate) => {
    const selectedUserInput = {};
    const selectedUserDetails = get(substate, 'baseData.selectedUser.details', {});
    const clientSitesDetails = get(substate, 'baseData.clientSites.details', []);

    if (selectedUserDetails) {
      selectedUserInput.firstName = selectedUserDetails.firstName;
      selectedUserInput.lastName = selectedUserDetails.lastName;
      selectedUserInput.email = selectedUserDetails.email;

      if (!selectedUserDetails.roleForClient) {
        const foundSiteIndex = findIndex(clientSitesDetails, (siteIterator) => (findIndex(siteIterator.users, { id: selectedUserDetails.id }) > -1));
        if (foundSiteIndex > -1) {
          selectedUserInput.site = clientSitesDetails[foundSiteIndex].id.toString();
        } else {
          selectedUserInput.site = null;
        }
      } else {
        selectedUserInput.site = '0';
        selectedUserInput.purchase = selectedUserDetails.roleForClient.purchase;
        selectedUserInput.reward = selectedUserDetails.roleForClient.reward;
      }
    }

    return selectedUserInput;
  }
);

const selectDeletedUser = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.deletedUser', {})
);

const selectDeletedClientRole = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.deletedClientRole', {})
);

const selectSavedSite = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.savedSite', {})
);

const selectSavedUser = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.savedUser', {})
);

const selectAvailPhoneNumbers = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.availPhoneNumbers', [])
);

const selectCreditsPrice = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.creditsPrice', {})
);
// end

const selectLocationState = () => state => state.routing.locationBeforeTransitions;

export {
  selectGlobal,
  selectAuthState,
  selectEvents,
  selectCurrentUser,
  selectCurrentUserClientId,
  selectCurrentUserStripeCustomerId,

  selectSites,
  selectSiteLocations,
  selectUserSites,
  selectUserSiteLocations,
  selectIndications,
  selectSources,
  selectLevels,
  selectStudyLevels,
  selectCoupon,
  selectRewards,
  selectCards,
  selectSavedCard,
  selectDeletedCard,
  selectAddCredits,

  selectClientSites,
  selectSitePatients,
  selectClientCredits,
  selectPatientMessages,
  selectClientRoles,
  selectSelectedSite,
  selectSelectedSiteDetailsForForm,
  selectSelectedUser,
  selectSelectedUserDetailsForForm,
  selectDeletedUser,
  selectDeletedClientRole,
  selectSavedSite,
  selectSavedUser,
  selectAvailPhoneNumbers,

  selectLocationState,
  selectCreditsPrice,
};
