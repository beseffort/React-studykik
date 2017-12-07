import { createSelector } from 'reselect';

const selectCalendarPageDomain = (state) => state.calendarPage;

const selectPatientsByStudy = createSelector(
  selectCalendarPageDomain,
  (substate) => substate.patientsByStudy,
);

const selectSchedules = createSelector(
  selectCalendarPageDomain,
  (substate) => substate.schedules,
);

const selectPaginationOptions = createSelector(
  selectCalendarPageDomain,
  (substate) => substate.paginationOptions,
);

export {
  selectCalendarPageDomain,
  selectPatientsByStudy,
  selectSchedules,
  selectPaginationOptions,
};
