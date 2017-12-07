import expect from 'expect';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import React from 'react';

import configureStore from 'store';
import { CalendarPage } from 'containers/CalendarPage';
import FilterBar from 'containers/CalendarPage/components/FilterBar';
import CalendarWidget from 'containers/CalendarPage/components/CalendarWidget';
import SchedulePatientModal from 'containers/CalendarPage/components/SchedulePatientModal';

describe('CalendarPage/index component', () => {
  let setup;

  beforeEach(() => {
    setup = () => {
      const props = {
        currentUser: { id: 4, username: 'raypalmer' },
        sites: [{ id: 1, name: 'Palmer Tech', client_id: 1, studies: [{ id: 1, protocolNumber: 'AC-1', type: 'Acne' }] }, { id: 2, name: 'Wayne Enterprises', client_id: 1, studies: [] }],
        indications: [{ id: 1, name: 'Abnormal bleeding' }, { id: 2, name: 'Acne' }, { id: 3, name: 'Birth Control' }],
        patientsByStudy: { isFetching: false },
        schedules: { isFetching: false, data: [] },
        fetchSites: expect.createSpy(),
        fetchIndications: expect.createSpy(),
        fetchPatientsByStudy: expect.createSpy(),
        fetchSchedules: expect.createSpy(),
        submitSchedule: expect.createSpy(),
        deleteSchedule: expect.createSpy(),
      };

      const shallowWrapper = shallow(<CalendarPage {...props} />);

      return {
        props,
        shallowWrapper,
      };
    };
  });

  it('should render the FilterBar, CalendarWidget, SchedulePatientModal', () => {
    const { shallowWrapper } = setup();

    expect(shallowWrapper.find(FilterBar)).to.have.length(1);
    expect(shallowWrapper.find(CalendarWidget)).to.have.length(1);
    expect(shallowWrapper.find(SchedulePatientModal)).to.have.length(1);
  });

  it('should pass correct props to the Filter component', () => {
    const { shallowWrapper, props } = setup();

    const compProps = shallowWrapper.find('FilterBar').props();
    expect(compProps).toContain({ sites: props.sites });
    expect(compProps).toContain({ indications: props.indications });
    expect(compProps).toContain({ schedules: props.schedules.data });
    expect(compProps).toContain({ fetchingSites: props.sites.isFetching });
    expect(compProps.updateFilter).toBeA('function');
  });

  it('should call some actions on load', () => {
    const { props } = setup();
    const mountWrapper = mount( // eslint-disable-line
      <Provider store={configureStore({})}>
        <CalendarPage {...props} />
      </Provider>
    );

    expect(props.fetchSites).toHaveBeenCalled();
    expect(props.fetchIndications).toHaveBeenCalled();
    expect(props.fetchSchedules).toHaveBeenCalled();
  });
});
