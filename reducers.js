/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { default as textBlastModalReducer } from './containers/StudyPage/TextBlast/reducer';
import { default as patientsListReducer } from './containers/PatientDatabasePage/TextBlast/reducer';
import appReducer from './containers/App/reducer';
import globalNotificationsReducer from './containers/GlobalNotifications/reducer';

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
  return combineReducers({
    routing: routerReducer,
    form: formReducer.plugin({
      'StudyPage.TextBlastModal': textBlastModalReducer,
      'PatientDatabase.TextBlastModal': patientsListReducer,
    }),
    toastr: toastrReducer,
    globalNotifications: globalNotificationsReducer,
    global: appReducer,
    ...asyncReducers,
  });
}
