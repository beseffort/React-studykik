import { getItem } from 'utils/localStorage';
import { forEach, map, remove, cloneDeep, findIndex, concat, sortBy, reverse } from 'lodash';

import {
  SET_AUTH_STATE,
  SET_USER_DATA,

  FETCH_SITES_SUCCESS,
  FETCH_INDICATIONS_SUCCESS,
  FETCH_SOURCES_SUCCESS,
  FETCH_LEVELS_SUCCESS,

  FETCH_COUPON,
  FETCH_COUPON_SUCCESS,
  FETCH_COUPON_ERROR,

  CLEAR_COUPON,

  FETCH_REWARDS,
  FETCH_REWARDS_SUCCESS,
  FETCH_REWARDS_ERROR,

  FETCH_CARDS,
  FETCH_CARDS_SUCCESS,
  FETCH_CARDS_ERROR,

  SAVE_CARD,
  SAVE_CARD_SUCCESS,
  SAVE_CARD_ERROR,

  DELETE_CARD,
  DELETE_CARD_SUCCESS,
  DELETE_CARD_ERROR,

  ADD_CREDITS,
  ADD_CREDITS_SUCCESS,
  ADD_CREDITS_ERROR,
  FETCH_EVENTS,

  FETCH_CLIENT_SITES,
  FETCH_CLIENT_SITES_SUCCESS,
  FETCH_CLIENT_SITES_ERROR,

  FETCH_SITE_PATIENTS,
  FETCH_SITE_PATIENTS_SUCCESS,
  FETCH_SITE_PATIENTS_ERROR,
  UPDATE_SITE_PATIENTS,

  FETCH_CLIENT_CREDITS,
  FETCH_CLIENT_CREDITS_SUCCESS,
  FETCH_CLIENT_CREDITS_ERROR,

  FETCH_PATIENT_MESSAGES,
  FETCH_PATIENT_MESSAGES_SUCCESS,
  FETCH_PATIENT_MESSAGES_ERROR,
  UPDATE_PATIENT_MESSAGES,

  SEARCH_SITE_PATIENTS,
  SEARCH_SITE_PATIENTS_SUCCESS,
  SEARCH_SITE_PATIENTS_ERROR,

  MARK_AS_READ_PATIENT_MESSAGES,


  FETCH_CLIENT_ROLES,
  FETCH_CLIENT_ROLES_SUCCESS,
  FETCH_CLIENT_ROLES_ERROR,

  FETCH_SITE,
  FETCH_SITE_SUCCESS,
  FETCH_SITE_ERROR,

  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR,

  CLEAR_SELECTED_SITE,
  CLEAR_SELECTED_USER,

  DELETE_USER,
  DELETE_USER_SUCCESS,
  DELETE_USER_ERROR,

  DELETE_CLIENT_ROLE,
  DELETE_CLIENT_ROLE_SUCCESS,
  DELETE_CLIENT_ROLE_ERROR,

  SAVE_SITE,
  SAVE_SITE_SUCCESS,
  SAVE_SITE_ERROR,

  SAVE_USER,
  SAVE_USER_SUCCESS,
  SAVE_USER_ERROR,
  GET_AVAIL_PHONE_NUMBERS_SUCCESS,

  GET_CREDITS_PRICE_SUCCESS,
} from './constants';

import {
  CHANGE_IMAGE_SUCCESS,
} from 'containers/ProfilePage/constants';

const initialState = {
  loggedIn: !!getItem('auth_token'),
  userData: null,
  pageEvents: null,
  baseData: {
    sites: [],
    indications: [],
    sources: [],
    levels: [],
    coupon: {
      details: null,
      fetching: false,
      error: null,
    },
    cards: {
      details: null,
      fetching: false,
      error: null,
    },
    savedCard: {
      details: null,
      saving: false,
      error: null,
    },
    deletedCard: {
      details: null,
      deleting: false,
      error: null,
    },
    addCredits: {
      details: null,
      adding: false,
      error: null,
    },
    clientSites: {
      details: [],
      fetching: false,
      error: null,
    },
    sitePatients: {
      details: [],
      fetching: false,
      error: null,
    },
    clientCredits: {
      details: {},
      fetching: false,
      error: null,
    },
    patientMessages: {
      details: [],
      fetching: false,
      error: null,
    },
    rewards: [],
    clientRoles: {
      details: [],
      fetching: false,
      error: null,
    },
    selectedSite: {
      details: null,
      fetching: false,
      error: null,
    },
    selectedUser: {
      details: null,
      fetching: false,
      error: null,
    },
    deletedUser: {
      details: null,
      deleting: false,
      error: null,
    },
    deletedClientRole: {
      details: null,
      deleting: false,
      error: null,
    },
    savedSite: {
      details: null,
      saving: false,
      error: null,
    },
    savedUser: {
      details: null,
      saving: false,
      error: null,
    },
    availPhoneNumbers: [],
    creditsPrice: {},
  },
};

export default function appReducer(state = initialState, action) {
  const { payload } = action;
  let foundIndex = -1;
  const cardsCollection = cloneDeep(state.baseData.cards.details);
  const clientSitesCollection = map(state.baseData.clientSites.details, cloneDeep);
  const clientRolesCollection = map(state.baseData.clientRoles.details, cloneDeep);
  let sitePatientsCollection = [];
  let patientMessagesCollection = [];
  let baseDataInnerState = null;
  let resultState = null;

  switch (action.type) {
    case SET_AUTH_STATE:
      resultState = {
        ...state,
        loggedIn: payload.newAuthState,
      };
      break;
    case SET_USER_DATA:
      resultState = {
        ...state,
        userData: payload.userData,
      };
      break;
    case CHANGE_IMAGE_SUCCESS:
      resultState = {
        ...state,
        userData: { ...state.userData, profileImageURL: payload.profileImageURL },
      };
      break;
    case FETCH_EVENTS:
      resultState = {
        ...state,
        pageEvents: payload,
      };
      break;
    case FETCH_SITES_SUCCESS:
      baseDataInnerState = {
        sites: payload,
      };
      break;
    case FETCH_INDICATIONS_SUCCESS:
      baseDataInnerState = {
        indications: payload,
      };
      break;
    case FETCH_SOURCES_SUCCESS:
      baseDataInnerState = {
        sources: payload,
      };
      break;
    case FETCH_LEVELS_SUCCESS:
      baseDataInnerState = {
        levels: payload,
      };
      break;
    case FETCH_COUPON:
      baseDataInnerState = {
        coupon: {
          details: null,
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_COUPON_SUCCESS:
      baseDataInnerState = {
        coupon: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_COUPON_ERROR:
      baseDataInnerState = {
        coupon: {
          details: null,
          fetching: false,
          error: payload,
        },
      };
      break;
    case CLEAR_COUPON:
      baseDataInnerState = {
        coupon: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_REWARDS:
      baseDataInnerState = {
        rewards: [],
      };
      break;
    case FETCH_REWARDS_SUCCESS:
      baseDataInnerState = {
        rewards: payload,
      };
      break;
    case FETCH_REWARDS_ERROR:
      baseDataInnerState = {
        rewards: [],
      };
      break;
    case FETCH_CARDS:
      baseDataInnerState = {
        cards: {
          details: null,
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_CARDS_SUCCESS:
      baseDataInnerState = {
        cards: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_CARDS_ERROR:
      baseDataInnerState = {
        cards: {
          details: null,
          fetching: false,
          error: payload,
        },
      };
      break;
    case SAVE_CARD:
      baseDataInnerState = {
        savedCard: {
          details: null,
          saving: true,
          error: null,
        },
      };
      break;
    case SAVE_CARD_SUCCESS:
      cardsCollection.data.push(payload);
      baseDataInnerState = {
        cards: {
          details: cardsCollection,
          fetching: false,
          error: null,
        },
        savedCard: {
          details: payload,
          saving: false,
          error: null,
        },
      };
      break;
    case SAVE_CARD_ERROR:
      baseDataInnerState = {
        savedCard: {
          details: null,
          saving: false,
          error: payload,
        },
      };
      break;
    case DELETE_CARD:
      baseDataInnerState = {
        deletedCard: {
          details: null,
          deleting: true,
          error: null,
        },
      };
      break;
    case DELETE_CARD_SUCCESS:
      remove(cardsCollection.data, { id: payload.id });
      baseDataInnerState = {
        cards: {
          details: cardsCollection,
          fetching: false,
          error: null,
        },
        deletedCard: {
          details: payload,
          deleting: false,
          error: null,
        },
      };
      break;
    case DELETE_CARD_ERROR:
      baseDataInnerState = {
        deletedCard: {
          details: null,
          deleting: false,
          error: payload,
        },
      };
      break;
    case ADD_CREDITS:
      baseDataInnerState = {
        addCredits: {
          details: null,
          adding: true,
          error: null,
        },
      };
      break;
    case ADD_CREDITS_SUCCESS:
      cardsCollection.data.push(payload);
      baseDataInnerState = {
        addCredits: {
          details: payload,
          adding: false,
          error: null,
        },
      };
      break;
    case ADD_CREDITS_ERROR:
      baseDataInnerState = {
        addCredits: {
          details: null,
          adding: false,
          error: payload,
        },
      };
      break;
    case FETCH_CLIENT_SITES:
      baseDataInnerState = {
        clientSites: {
          details: [],
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_CLIENT_SITES_SUCCESS:
      baseDataInnerState = {
        clientSites: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_CLIENT_SITES_ERROR:
      baseDataInnerState = {
        clientSites: {
          details: [],
          fetching: false,
          error: payload,
        },
      };
      break;
    case FETCH_SITE_PATIENTS:
      baseDataInnerState = {
        sitePatients: {
          details: [],
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_SITE_PATIENTS_SUCCESS:
      sitePatientsCollection = reverse(sortBy(payload, item => item.twtm_max_date_created));
      baseDataInnerState = {
        sitePatients: {
          details: sitePatientsCollection,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_SITE_PATIENTS_ERROR:
      baseDataInnerState = {
        sitePatients: {
          details: [],
          fetching: false,
          error: payload,
        },
      };
      break;
    case UPDATE_SITE_PATIENTS:
      sitePatientsCollection = map(state.baseData.sitePatients.details, item => {
        let patientData = null;
        patientData = item;
        if (patientData.id === action.newMessage.patient_id && patientData.study_id === action.newMessage.study_id) {
          const countUnread = patientData.count_unread;
          if (countUnread) {
            patientData.count_unread = parseInt(countUnread) + 1;
          } else {
            patientData.count_unread = 1;
          }
          patientData.twtm_max_date_created = action.newMessage.twilioTextMessage.dateCreated;
          patientData.last_message_body = action.newMessage.twilioTextMessage.body;
        }
        return patientData;
      });
      sitePatientsCollection = reverse(sortBy(sitePatientsCollection, item => item.twtm_max_date_created));
      baseDataInnerState = {
        sitePatients: {
          details: sitePatientsCollection,
          fetching: false,
          error: null,
        },
      };
      break;
    case MARK_AS_READ_PATIENT_MESSAGES:
      sitePatientsCollection = map(state.baseData.sitePatients.details, item => {
        let patientData = null;
        patientData = item;
        if (patientData.id === action.patientId && patientData.study_id === action.studyId) {
          patientData.count_unread = 0;
        }
        return patientData;
      });
      baseDataInnerState = {
        sitePatients: {
          details: sitePatientsCollection,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_CLIENT_CREDITS:
      baseDataInnerState = {
        clientCredits: {
          details: {},
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_CLIENT_CREDITS_SUCCESS:
      baseDataInnerState = {
        clientCredits: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_CLIENT_CREDITS_ERROR:
      baseDataInnerState = {
        clientCredits: {
          details: {},
          fetching: false,
          error: payload,
        },
      };
      break;
    case FETCH_PATIENT_MESSAGES:
      baseDataInnerState = {
        patientMessages: {
          details: [],
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_PATIENT_MESSAGES_SUCCESS:
      baseDataInnerState = {
        patientMessages: {
          details: payload,
          fetching: false,
          error: null,
        },
      };


      break;
    case FETCH_PATIENT_MESSAGES_ERROR:
      baseDataInnerState = {
        patientMessages: {
          details: [],
          fetching: false,
          error: payload,
        },
      };
      break;
    case UPDATE_PATIENT_MESSAGES:
      patientMessagesCollection = concat(state.baseData.patientMessages.details, action.newMessage);
      baseDataInnerState = {
        patientMessages: {
          details: patientMessagesCollection,
          fetching: false,
          error: null,
        },
      };
      baseDataInnerState = {
        patientMessages: {
          details: patientMessagesCollection,
          fetching: false,
          error: null,
        },
      };
      break;
    case SEARCH_SITE_PATIENTS:
      return state;
    case SEARCH_SITE_PATIENTS_SUCCESS:
      sitePatientsCollection = map(state.baseData.sitePatients.details, item => {
        let patientData = null;
        patientData = item;
        patientData.show = false;
        forEach(payload, dataItem => {
          if (dataItem.id === patientData.id && dataItem.study_id === patientData.study_id) {
            patientData.show = true;
          }
        });
        return patientData;
      });
      // return state;
      baseDataInnerState = {
        sitePatients: {
          details: sitePatientsCollection,
          fetching: false,
          error: null,
        },
      };
      break;
    case SEARCH_SITE_PATIENTS_ERROR:
      return state;
    case FETCH_CLIENT_ROLES:
      baseDataInnerState = {
        clientRoles: {
          details: [],
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_CLIENT_ROLES_SUCCESS:
      baseDataInnerState = {
        clientRoles: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_CLIENT_ROLES_ERROR:
      baseDataInnerState = {
        clientRoles: {
          details: [],
          fetching: false,
          error: payload,
        },
      };
      break;
    case FETCH_SITE:
      baseDataInnerState = {
        selectedSite: {
          details: null,
          id: action.id,
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_SITE_SUCCESS:
      baseDataInnerState = {
        selectedSite: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_SITE_ERROR:
      baseDataInnerState = {
        selectedSite: {
          details: null,
          fetching: false,
          error: payload,
        },
      };
      break;
    case FETCH_USER:
      baseDataInnerState = {
        selectedUser: {
          details: null,
          id: action.id,
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_USER_SUCCESS:
      baseDataInnerState = {
        selectedUser: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_USER_ERROR:
      baseDataInnerState = {
        selectedUser: {
          details: null,
          fetching: false,
          error: payload,
        },
      };
      break;
    case CLEAR_SELECTED_SITE:
      baseDataInnerState = {
        selectedSite: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case CLEAR_SELECTED_USER:
      baseDataInnerState = {
        selectedUser: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case DELETE_USER:
      baseDataInnerState = {
        deletedUser: {
          details: null,
          deleting: true,
          error: null,
        },
      };
      break;
    case DELETE_USER_SUCCESS:
      forEach(clientSitesCollection, item => {
        if (remove(item.users, { id: payload.id }).length > 0) {
          return false;
        }
        return true;
      });
      baseDataInnerState = {
        deletedUser: {
          details: payload,
          deleting: false,
          error: null,
        },
        clientSites: {
          details: clientSitesCollection,
          fetching: false,
          error: null,
        },
        selectedUser: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case DELETE_USER_ERROR:
      baseDataInnerState = {
        deletedUser: {
          details: null,
          deleting: false,
          error: payload,
        },
        selectedUser: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case DELETE_CLIENT_ROLE:
      baseDataInnerState = {
        deletedClientRole: {
          details: null,
          deleting: true,
          error: null,
        },
      };
      break;
    case DELETE_CLIENT_ROLE_SUCCESS:
      remove(clientRolesCollection, { id: payload.id });
      baseDataInnerState = {
        deletedClientRole: {
          details: payload,
          deleting: false,
          error: null,
        },
        clientRoles: {
          details: clientRolesCollection,
          fetching: false,
          error: null,
        },
        selectedUser: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case DELETE_CLIENT_ROLE_ERROR:
      baseDataInnerState = {
        deletedClientRole: {
          details: null,
          deleting: false,
          error: payload,
        },
        selectedUser: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case SAVE_SITE:
      baseDataInnerState = {
        savedSite: {
          details: null,
          saving: true,
          error: null,
        },
      };
      break;
    case SAVE_SITE_SUCCESS:
      foundIndex = findIndex(clientSitesCollection, { id: payload.id });
      if (!payload.users) {
        payload.users = [];
      }
      if (foundIndex < 0) {
        clientSitesCollection.push(payload);
      } else {
        clientSitesCollection[foundIndex] = payload;
      }
      baseDataInnerState = {
        savedSite: {
          details: payload,
          saving: false,
          error: null,
        },
        clientSites: {
          details: clientSitesCollection,
          fetching: false,
          error: null,
        },
        selectedSite: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case SAVE_SITE_ERROR:
      baseDataInnerState = {
        savedSite: {
          details: null,
          saving: false,
          error: payload,
        },
        selectedSite: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case SAVE_USER:
      baseDataInnerState = {
        savedUser: {
          details: null,
          saving: true,
          error: null,
        },
      };
      break;
    case SAVE_USER_SUCCESS:
      if (payload.userType === 'admin') {
        forEach(clientSitesCollection, item => {
          if (remove(item.users, { id: payload.userResultData.user.id }).length > 0) {
            return false;
          }
          return true;
        });
      } else if (payload.userType === 'nonAdmin') {
        forEach(clientSitesCollection, item => {
          foundIndex = findIndex(item.users, { id: payload.userResultData.user.id });
          if (foundIndex > -1) {
            if (item.id === payload.userResultData.siteId) {
              item.users[foundIndex] = payload.userResultData.user; // eslint-disable-line
            } else {
              item.users.splice(foundIndex, 1);
              foundIndex = -1;
            }
            return false;
          }
          return true;
        });
        if (foundIndex < 0) {
          foundIndex = findIndex(clientSitesCollection, { id: payload.userResultData.siteId });
          if (foundIndex > -1) {
            clientSitesCollection[foundIndex].users.push(payload.userResultData.user);
          }
        }
      }

      foundIndex = findIndex(clientRolesCollection, (item) => (item.user.id === payload.userResultData.user.id));
      if (payload.userType === 'admin') {
        if (foundIndex < 0) {
          clientRolesCollection.push(payload.userResultData);
        } else {
          clientRolesCollection[foundIndex] = payload.userResultData;
        }
      } else if (payload.userType === 'nonAdmin') {
        if (foundIndex > -1) {
          clientRolesCollection.splice(foundIndex, 1);
        }
      }

      baseDataInnerState = {
        savedUser: {
          details: payload,
          saving: false,
          error: null,
        },
        clientSites: {
          details: clientSitesCollection,
          fetching: false,
          error: null,
        },
        clientRoles: {
          details: clientRolesCollection,
          fetching: false,
          error: null,
        },
        selectedUser: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case SAVE_USER_ERROR:
      baseDataInnerState = {
        savedUser: {
          details: null,
          saving: false,
          error: payload,
        },
        selectedUser: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case GET_AVAIL_PHONE_NUMBERS_SUCCESS:
      baseDataInnerState = {
        availPhoneNumbers: map(payload.avail, (value) => ({ ...value, value: value.phoneNumber, label: value.friendlyName })),
      };
      break;
    case GET_CREDITS_PRICE_SUCCESS:
      baseDataInnerState = {
        creditsPrice: payload,
      };
      break;
    default:
      return state;
  }

  if (!resultState) {
    resultState = {
      ...state,
      baseData: {
        ...state.baseData,
        ...baseDataInnerState,
      },
    };
  }

  return resultState;
}
