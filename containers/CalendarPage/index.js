/* eslint-disable no-unused-vars */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CalendarWidget from './components/CalendarWidget';
import SchedulePatientModal from './components/SchedulePatientModal';
import FilterBar from './components/FilterBar';
import AllEventsModal from './components/AllEventsModal';

import moment from 'moment';
import _ from 'lodash';
import Helmet from 'react-helmet';

import {
  fetchSites,
  fetchIndications,
} from 'containers/App/actions';
import {
  selectCurrentUser,
  selectSites,
  selectIndications,
} from 'containers/App/selectors';

import {
  fetchPatientsByStudy,
  fetchSchedules,
  submitSchedule,
  deleteSchedule,
  setActiveSort,
} from './actions';
import { selectSchedules, selectPatientsByStudy, selectPaginationOptions } from './selectors';

import { SchedulePatientModalType } from 'common/constants';

const getFilteredSchedules = (schedules, filter) =>
  schedules.filter(s =>
    `${s.patient.firstName} ${s.patient.lastName}`.toLowerCase().indexOf(filter.patientName.toLowerCase()) > -1 &&
      (!filter.siteLocation || filter.siteLocation === 'All' || s.siteLocation === filter.siteLocation) &&
      (!filter.indication || filter.indication === 'All' || s.indication === filter.indication) &&
      (!filter.protocol || filter.protocol === 'All' || s.protocolNumber === filter.protocol)
  );

export class CalendarPage extends React.Component {
  static propTypes = {
    currentUser: PropTypes.any,
    sites: PropTypes.array.isRequired,
    indications: PropTypes.array.isRequired,
    patientsByStudy: PropTypes.object.isRequired,
    schedules: PropTypes.object.isRequired,
    fetchSites: PropTypes.func.isRequired,
    fetchIndications: PropTypes.func.isRequired,
    fetchPatientsByStudy: PropTypes.func.isRequired,
    fetchSchedules: PropTypes.func.isRequired,
    submitSchedule: PropTypes.func.isRequired,
    deleteSchedule: PropTypes.func.isRequired,
    paginationOptions: PropTypes.object,
    setActiveSort: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.selectedCellInfo = {};
    this.updateFilter = ::this.updateFilter;
    this.handleCloseModal = this.handleModalVisibility.bind(this, SchedulePatientModalType.HIDDEN);
    this.sortBy = this.sortBy.bind(this);
  }

  state = {
    filter: {
      patientName: '',
      siteLocation: null,
      indication: null,
      protocol: null,
    },
    modalType: SchedulePatientModalType.HIDDEN,
    showAll: {
      visible: false,
      date: null,
      events: [],
    },
    allModalDeferred: false,
    filteredSchedules: [],
  }

  componentDidMount() {
    const { currentUser } = this.props;

    this.props.fetchSites();
    this.props.fetchIndications();
    this.props.fetchSchedules({ userId: currentUser.id });
  }

  componentWillReceiveProps(nextProps) {
    this.filterSchedules(nextProps.schedules.data, this.state.filter);
  }

  setAllModalDeferred = (allModalDeferred) => {
    this.setState({
      allModalDeferred,
    });
  }

  filterSchedules(schedules, filter) {
    this.setState({
      filteredSchedules: getFilteredSchedules(schedules, filter),
    });
  }

  handleModalVisibility = (modalType, data) => {
    if (modalType !== SchedulePatientModalType.HIDDEN) {
      this.selectedCellInfo = data;
    } else if (this.state.allModalDeferred) {
      this.handleShowAll(true);
      this.setState({
        allModalDeferred: false,
      });
    }

    this.setState({
      modalType,
    });
  }

  handleShowAll = (visible, events, date) => {
    this.setState({
      showAll: {
        visible,
        events: events || this.state.showAll.events,
        date: date || this.state.showAll.date,
      },
    });
  }

  handleSubmit = (data) => {
    let submitData;

    if (data.siteLocation && data.protocol) { // CREATE
      submitData = {
        siteLocation: data.siteLocation.label,
        indication: data.protocol.indication,
        protocolNumber: data.protocol.label,
        patientId: data.patient.value,
        userId: this.props.currentUser.id,
        time: moment(this.selectedCellInfo.selectedDate).add(data.period === 'AM' ?
          data.hour % 12 :
          (data.hour % 12) + 12, 'hours').add(data.minute, 'minutes').utc().format(),
        textReminder: data.textReminder,
      };
    } else { // UPDATE
      let updatedDate;
      if (data.date) {
        updatedDate = data.date.startOf('day');
      } else {  // React Datepicker doesn't submit its initial value
        updatedDate = moment(new Date(this.selectedCellInfo.data.time)).startOf('day');
      }
      submitData = {
        id: this.selectedCellInfo.data.id,
        time: updatedDate.add(data.period === 'AM' ?
          data.hour % 12 :
          (data.hour % 12) + 12, 'hours').add(data.minute, 'minutes').utc().format(),
        userId: this.props.currentUser.id,
      };
    }

    this.setState({
      modalType: SchedulePatientModalType.HIDDEN,
      allModalDeferred: false,
    });
    this.props.submitSchedule(submitData);
  }

  handleDelete = (scheduleId) => {
    this.setState({
      modalType: SchedulePatientModalType.HIDDEN,
      allModalDeferred: false,
    });

    this.props.deleteSchedule(scheduleId, this.props.currentUser.id);
  }

  navigateToToday = () => {
    this.calendarWidget.bigCalendar.refs.inner.navigateToToday();
  }

  updateFilter(field, newValue) {
    const newFilter = {
      ...this.state.filter,
      [field]: newValue,
    };

    this.setState({
      filter: newFilter,
    });

    this.filterSchedules(this.props.schedules.data, newFilter);
  }

  sortBy(ev) {
    ev.preventDefault();
    let sort = ev.currentTarget.dataset.sort;
    let direction = 'up';
    const defaultSort = 'orderNumber';

    if (ev.currentTarget.className && ev.currentTarget.className.indexOf('up') !== -1) {
      direction = 'down';
    } else if (ev.currentTarget.className && ev.currentTarget.className.indexOf('down') !== -1) {
      direction = null;
      sort = null;
    }
    console.log(sort, direction);
    this.props.setActiveSort(sort, direction);
  }

  render() {
    const { currentUser, sites, indications, patientsByStudy, schedules } = this.props;
    const { showAll } = this.state;
    const fetchingSites = sites.isFetching;
    const fetchingPatientsByStudy = patientsByStudy.isFetching;
    const isAdmin = !currentUser || !currentUser.site_id;

    let siteLocationOptions = [];
    if (isAdmin) {
      siteLocationOptions = sites.map(s => ({
        label: s.name,
        value: s.name,
        siteId: s.id,
      }));
    } else {
      const site = _.find(sites, { id: currentUser.site_id });

      if (site) {     // if site is fetched
        siteLocationOptions = [{
          label: site.name,
          value: site.name,
          siteId: site.id,
        }];
      }
    }

    return (
      <div className="container-fluid">
        <Helmet title="Calendar - StudyKIK" />
        <section className="calendar-section">
          <h2 className="main-heading">CALENDAR</h2>
          <div className="btn-block"><a className="btn btn-primary" onClick={this.navigateToToday}>Today</a></div>
          <FilterBar
            siteLocationOptions={siteLocationOptions}
            isAdmin={isAdmin}
            sites={sites}
            indications={indications}
            schedules={schedules.data}
            fetchingSites={fetchingSites}
            filter={this.state.filter}
            updateFilter={this.updateFilter}
          />
          <CalendarWidget
            schedules={this.state.filteredSchedules}
            handleOpenModal={this.handleModalVisibility}
            handleShowAll={this.handleShowAll}
            ref={(c) => { this.calendarWidget = c; }}
          />
          <SchedulePatientModal
            siteLocationOptions={siteLocationOptions}
            isAdmin={isAdmin}
            sites={sites}
            indications={indications}
            onSubmit={this.handleSubmit}
            handleCloseModal={this.handleCloseModal}
            handleDelete={this.handleDelete}
            submitting={false}
            selectedCellInfo={this.selectedCellInfo}
            modalType={this.state.modalType}
            patientsByStudy={patientsByStudy}
            schedules={schedules.data}
            fetchingSites={fetchingSites}
            fetchingPatientsByStudy={fetchingPatientsByStudy}
            fetchPatientsByStudy={this.props.fetchPatientsByStudy}
          />
          <AllEventsModal
            visible={showAll.visible}
            date={showAll.date}
            events={showAll.events}
            handleCloseModal={() => this.handleShowAll(false)}
            handleEdit={this.handleModalVisibility}
            setAllModalDeferred={this.setAllModalDeferred}
            sortBy={this.sortBy}
            paginationOptions={this.props.paginationOptions}
          />
        </section>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser(),
  sites: selectSites(),
  indications: selectIndications(),
  schedules: selectSchedules,
  patientsByStudy: selectPatientsByStudy,
  paginationOptions: selectPaginationOptions,
});

const mapDispatchToProps = {
  fetchSites,
  fetchIndications,
  fetchPatientsByStudy,
  fetchSchedules,
  submitSchedule,
  deleteSchedule,
  setActiveSort,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarPage);
