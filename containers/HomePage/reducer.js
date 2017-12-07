/* eslint-disable comma-dangle, no-case-declarations */
import { forEach, map } from 'lodash';

import {
  FETCH_PATIENT_SIGN_UPS_SUCCEESS,
  FETCH_PATIENT_MESSAGES_SUCCEESS,
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

import {
  RECEIVE_NOTIFICATION,
} from 'containers/GlobalNotifications/constants';

const initialState = {
  patientSignUps: {
    today: 0,
    yesterday: 0,
  },
  patientMessages: {
    unreadTexts: 0,
    unreadEmails: 0,
  },
  rewardsPoint: 0,
  studies: {
    details: [],
    fetching: false,
    error: null,
  },
  selectedIndicationLevelPrice: {
    details: null,
    fetching: false,
    error: null,
  },
  renewedStudy: {
    details: null,
    submitting: false,
    error: null,
  },
  upgradedStudy: {
    details: null,
    submitting: false,
    error: null,
  },
  editedStudy: {
    details: null,
    submitting: false,
    error: null,
  },
  paginationOptions: {
    activeSort: null,
    activeDirection: null,
  },
};

export default function homePageReducer(state = initialState, action) {
  const { payload } = action;
  let newState;
  let entity;
  let entitiesCollection;
  let startDateStr = '';
  let endDateStr = '';

  switch (action.type) {
    case FETCH_PATIENT_SIGN_UPS_SUCCEESS:
      return {
        ...state,
        patientSignUps: {
          today: payload.today,
          yesterday: payload.yesterday,
        },
      };
    case FETCH_PATIENT_MESSAGES_SUCCEESS:
      return {
        ...state,
        patientMessages: {
          unreadTexts: payload.unreadTexts,
          unreadEmails: payload.unreadEmails,
        },
      };
    case FETCH_REWARDS_POINT_SUCCEESS:
      return {
        ...state,
        rewardsPoint: action.payload.rewardPoints,
      };
    case RECEIVE_NOTIFICATION:
      newState = state;
      switch (action.payload.event) {
        case 'create-patient':
          newState = {
            ...state,
            patientSignUps: {
              today: newState.patientSignUps.today + 1,
              yesterday: newState.patientSignUps.yesterday,
            },
          };
          break;
        case 'twilio-message':
          newState = {
            ...state,
            patientMessages: {
              unreadTexts: newState.patientMessages.unreadTexts + 1,
              unreadEmails: newState.patientMessages.unreadEmails,
            },
          };
          break;
        case 'create-reward':
          newState = {
            ...state,
            rewardsPoint: newState.rewardsPoint + action.payload.event_params.points
          };
          break;
        default:
          break;
      }
      return newState;
    case FETCH_STUDIES:
      return {
        ...state,
        studies: {
          details: [],
          fetching: true,
          error: null,
        },
      };
    case FETCH_STUDIES_SUCCESS:
      entitiesCollection = [];

      forEach(payload, (studyIterator, index) => {
        entity = {
          studyId: studyIterator.id,
          indication: studyIterator.indication,
          location: '',
          sponsor: '',
          protocol: studyIterator.protocolNumber,
          patientMessagingSuite: (studyIterator.patientMessagingSuite) ? 'On' : 'Off',
          status: studyIterator.status,
          callTracking: studyIterator.callTracking,
          siteUsers: null,
          startDate: '',
          endDate: '',
          orderNumber: (index + 1),
        };
        if (studyIterator.sponsors && studyIterator.sponsors.length > 0) {
          const sponsorContacts = map(studyIterator.sponsors, sponsorContactIterator => sponsorContactIterator.name);
          const sponsorContactsStr = sponsorContacts.join(', ');
          entity.sponsor = sponsorContactsStr;
        }
        if (!studyIterator.sites || studyIterator.sites.length === 0) {
          entitiesCollection.push(entity);
          return true;
        }
        forEach(studyIterator.sites, (siteIterator) => {
          startDateStr = '';
          endDateStr = '';
          if (siteIterator.campaigns && siteIterator.campaigns.length > 0) {
            startDateStr = new Date(siteIterator.campaigns[0].dateFrom).toLocaleDateString();
            endDateStr = new Date(siteIterator.campaigns[0].dateTo).toLocaleDateString();
          }
          entity = {
            ...entity,
            location: siteIterator.location,
            status: siteIterator.status,
            campaign: siteIterator.campaigns[0],
            siteUsers: siteIterator.users,
            startDate: startDateStr,
            endDate: endDateStr,
          };
          entitiesCollection.push(entity);
        });
        return true;
      });
      return {
        ...state,
        studies: {
          details: entitiesCollection,
          fetching: false,
          error: null,
        },
      };
    case FETCH_STUDIES_ERROR:
      return {
        ...state,
        studies: {
          details: [],
          fetching: false,
          error: payload,
        },
      };
    case FETCH_INDICATION_LEVEL_PRICE:
      return {
        ...state,
        selectedIndicationLevelPrice: {
          details: null,
          fetching: true,
          error: null,
        },
      };
    case FETCH_INDICATION_LEVEL_PRICE_SUCCESS:
      return {
        ...state,
        selectedIndicationLevelPrice: {
          details: payload.price,
          fetching: false,
          error: null,
        },
      };
    case FETCH_INDICATION_LEVEL_PRICE_ERROR:
      return {
        ...state,
        selectedIndicationLevelPrice: {
          details: null,
          fetching: false,
          error: payload,
        },
      };
    case CLEAR_INDICATION_LEVEL_PRICE:
      return {
        ...state,
        selectedIndicationLevelPrice: {
          details: null,
          fetching: false,
          error: null,
        },
      };
    case RENEW_STUDY:
      return {
        ...state,
        renewedStudy: {
          details: null,
          submitting: true,
          error: null,
        },
      };
    case RENEW_STUDY_SUCCESS:
      return {
        ...state,
        renewedStudy: {
          details: payload,
          submitting: false,
          error: null,
        },
      };
    case RENEW_STUDY_ERROR:
      return {
        ...state,
        renewedStudy: {
          details: null,
          submitting: false,
          error: payload,
        },
      };
    case UPGRADE_STUDY:
      return {
        ...state,
        upgradedStudy: {
          details: null,
          submitting: true,
          error: null,
        },
      };
    case UPGRADE_STUDY_SUCCESS:
      return {
        ...state,
        upgradedStudy: {
          details: payload,
          submitting: false,
          error: null,
        },
      };
    case UPGRADE_STUDY_ERROR:
      return {
        ...state,
        upgradedStudy: {
          details: null,
          submitting: false,
          error: payload,
        },
      };
    case EDIT_STUDY:
      return {
        ...state,
        editedStudy: {
          details: null,
          submitting: true,
          error: null,
        },
      };
    case EDIT_STUDY_SUCCESS:
      return {
        ...state,
        editedStudy: {
          details: payload,
          submitting: false,
          error: null,
        },
      };
    case EDIT_STUDY_ERROR:
      return {
        ...state,
        editedStudy: {
          details: null,
          submitting: false,
          error: payload,
        },
      };
    case SET_ACTIVE_SORT:
      return {
        ...state,
        paginationOptions: {
          activeSort: action.sort,
          activeDirection: action.direction,
        },
      };
    case SORT_SUCCESS:
      return {
        ...state,
        studies: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
    default:
      return state;
  }
}
