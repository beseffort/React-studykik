import expect from 'expect';

import { selectCalendarPageDomain, selectSchedules } from '../selectors';

describe('CalendarPage/selectors', () => {
  describe('selectCalendarPageDomain', () => {
    const calendarPageDomainSelector = selectCalendarPageDomain;
    it('should select calendarPage state', () => {
      const calendarPageState = {
        patientsByStudy: [],
        schedules: [],
      };
      const mockedState = {
        calendarPage: calendarPageState,
      };
      expect(calendarPageDomainSelector(mockedState)).toEqual(calendarPageState);
    });
  });

  describe('selectSchedules', () => {
    const selectSchedulesSelector = selectSchedules;
    it('should select schedules', () => {
      const mockedState = {
        calendarPage: {
          schedules: {},
        },
      };
      expect(selectSchedulesSelector(mockedState)).toEqual({});
    });
  });
});
