/*
 *
 * IrbAdCreationPage reducer
 *
 */

import {
  FETCH_IRB_PRODUCT_LIST_SUCCESS,
  FETCH_IRB_AD_CREATION_SUCCESS,
} from './constants';

const initialState = {
  productList: [],
  irbAdCreation: null,
};

function irbAdCreationPageReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_IRB_PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        productList: action.payload,
      };
    case FETCH_IRB_AD_CREATION_SUCCESS:
      return {
        ...state,
        irbAdCreation: action.payload,
      };
    default:
      return state;
  }
}

export default irbAdCreationPageReducer;
