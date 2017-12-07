/* eslint-disable prefer-template, react/jsx-no-bind */

import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal } from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';

import { SchedulePatientModalType } from 'common/constants';

import ReactSelect from 'components/Input/ReactSelect';
import DatePicker from 'components/Input/DatePicker';
import Checkbox from 'components/Input/Checkbox';

import './styles.less';

function numberSequenceCreator(start, end) {
  return _.range(start, end).map(n => {
    if (n < 10) {
      return {
        label: '0' + n,
        value: n.toString(),
      };
    }
    return {
      label: n.toString(),
      value: n.toString(),
    };
  });
}

function getTimeComponents(strTime) {
  return {
    hour: (((moment(strTime).hour() + 11) % 12) + 1).toString(),
    minute: moment(strTime).minute().toString(),
    period: moment(strTime).hour() >= 12 ? 'PM' : 'AM',
  };
}

const hourOptions = numberSequenceCreator(1, 13);
const minuteOptions = numberSequenceCreator(0, 60);
const periodOptions = [
  { label: 'AM', value: 'AM' },
  { label: 'PM', value: 'PM' },
];

@reduxForm({ form: 'schedulePatient' })
export default class SchedulePatientModal extends Component {
  static propTypes = {
    siteLocationOptions: PropTypes.array.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    sites: PropTypes.array.isRequired,
    indications: PropTypes.array.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    modalType: PropTypes.string.isRequired,
    selectedCellInfo: PropTypes.object.isRequired,
    patientsByStudy: PropTypes.object.isRequired,
    schedules: PropTypes.array.isRequired,
    fetchPatientsByStudy: PropTypes.func.isRequired,
    fetchingSites: PropTypes.bool,
    fetchingPatientsByStudy: PropTypes.bool.isRequired,
    initialize: PropTypes.func.isRequired,
  }

  state = {
    siteLocation: null,
    protocol: null,
    patient: null,
    protocolOptions: [],
    patientOptions: [],
  }

  componentWillReceiveProps(nextProps) {
    const { siteLocationOptions, isAdmin } = this.props;

    if (this.props.modalType === SchedulePatientModalType.HIDDEN && nextProps.modalType !== SchedulePatientModalType.HIDDEN) {
      let initialValues = nextProps.selectedCellInfo.data ?
      {
        ...getTimeComponents(nextProps.selectedCellInfo.data.time),
        textReminder: true,
      } : { textReminder: true };
      console.log('******', initialValues);
      if (!isAdmin) {
        const site = siteLocationOptions[0];
        if (this.state.siteLocation === null && site) {  // prevent recursive render
          if (site) {
            this.handleSiteLocationChoose(site);
            initialValues = {
              ...initialValues,
              siteLocations: site,   // manually set siteLocation form value
            };
          }
        }
      }
      nextProps.initialize(initialValues);
    } else if (nextProps.modalType === SchedulePatientModalType.HIDDEN) {
      this.setState({
        siteLocation: null,
        protocol: null,
        patient: null,
        protocolOptions: [],
        patientOptions: [],
      });
    }

    if (!nextProps.fetchingPatientsByStudy && nextProps.patientsByStudy !== this.props.patientsByStudy) {
      const patientOptions = _.flatten(nextProps.patientsByStudy.data.map(pBS => pBS.patients.map(p => ({
        label: p.firstName + ' ' + p.lastName,
        value: p.id,
      }))));
      const availablePatientOptions = _.differenceWith(patientOptions, this.props.schedules, (po, schedule) => po.value === schedule.patient_id);

      this.setState({
        patientOptions: availablePatientOptions,
      });
    }
  }

  handleSiteLocationChoose(siteLocationOption) {
    if (siteLocationOption) {
      const selectedSite = this.props.sites.filter(s => s.id === siteLocationOption.siteId)[0];
      if (!selectedSite) {
        throw new Error('SiteLocation options are not properly populated.');
      }
      const protocolOptions = selectedSite.studies.map(study => ({
        label: study.protocolNumber,
        value: study.protocolNumber,
        indication: _.find(this.props.indications, { id: study.indication_id }).name,
        studyId: study.id,
        siteId: siteLocationOption.siteId,
      }));
      this.setState({
        siteLocation: siteLocationOption,
        protocol: null,
        patient: null,
        protocolOptions,
      });
    } else {
      this.setState({
        siteLocation: null,
        protocol: null,
        patient: null,
        protocolOptions: [],
        patientOptions: [],
      });
    }
  }

  handleProtocolChoose(protocolOption) {
    if (protocolOption) {
      this.props.fetchPatientsByStudy(protocolOption.studyId, protocolOption.siteId);
      this.setState({
        protocol: protocolOption,
        patient: null,
      });
    } else {
      this.setState({
        protocol: null,
        patient: null,
        patientOptions: [],
      });
    }
  }

  handlePatientChoose(patientOption) {
    if (patientOption) {
      this.setState({
        patient: patientOption,
      });
    } else {
      this.setState({
        patient: null,
      });
    }
  }

  render() {
    const {
      siteLocationOptions,
      isAdmin,
      handleCloseModal,
      handleDelete,
      handleSubmit,
      submitting,
      modalType,
      selectedCellInfo,
    } = this.props;

    const { protocolOptions, patientOptions } = this.state;

    return (
      <Modal show={modalType !== SchedulePatientModalType.HIDDEN} onHide={handleCloseModal}>
        {modalType === SchedulePatientModalType.CREATE &&
          <div id="add-scedule" className="lightbox lightbox-active fixed-popup">
            <div className="lightbox-holder">
              <div className="lightbox-frame">
                <div className="modal-content">
                  <div className="head">
                    <strong className="title">SCHEDULE PATIENT</strong>
                    <a className="lightbox-close close" onClick={handleCloseModal}><i className="icomoon-icon_close" /></a>
                  </div>
                  <div className="scroll-holder jcf--scrollable">
                    <form action="#" className="form-lightbox form-add-schedule show-on-select" data-validation-false="no-action" onSubmit={handleSubmit}>
                      <div className="field-row">
                        <strong className="label">* When</strong>
                        <div className="field">
                          <input type="text" className="form-control add-date scheduleTime" disabled value={selectedCellInfo.selectedDate && moment(selectedCellInfo.selectedDate).format('MM/DD/YY')} />
                        </div>
                      </div>

                      <div className="field-row">
                        <strong className="label required"><label htmlFor="patient-time">Time</label></strong>
                        <div className="field">
                          <div className="col-holder row">
                            <div className="col pull-left hours">
                              <Field
                                id="patient-time"
                                name="hour"
                                component={ReactSelect}
                                placeholder="Hours"
                                options={hourOptions}
                                className="visible-first-del min-height"
                                disabled={submitting}
                              />
                            </div>
                            <div className="col pull-left minutes">
                              <Field
                                id="minutes"
                                name="minute"
                                component={ReactSelect}
                                placeholder="Minutes"
                                options={minuteOptions}
                                className="visible-first-del min-height"
                                disabled={submitting}
                              />
                            </div>
                            <div className="col pull-left time-mode">
                              <Field
                                id="time-period"
                                name="period"
                                component={ReactSelect}
                                placeholder="AM/PM"
                                options={periodOptions}
                                className="visible-first"
                                disabled={submitting}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="field-row">
                        <strong className="label required"><label htmlFor="popup-site-location">Site Location</label></strong>
                        <div className="field site-location">
                          <Field
                            name="siteLocation"
                            component={ReactSelect}
                            placeholder="Select Site Location"
                            options={siteLocationOptions}
                            className="data-search"
                            disabled={submitting || this.props.fetchingSites || !isAdmin}
                            objectValue
                            onChange={this.handleSiteLocationChoose.bind(this)}
                            selectedValue={this.state.siteLocation}
                          />
                        </div>
                      </div>

                      <div className="field-row">
                        <strong className="label required"><label htmlFor="popup-protocol">protocol</label></strong>
                        <div className="field protocol">
                          <Field
                            id="popup-protocol"
                            name="protocol"
                            component={ReactSelect}
                            placeholder={this.state.siteLocation ? 'Select Protocol' : 'N/A'}
                            options={protocolOptions}
                            className="data-search"
                            disabled={submitting || !this.state.siteLocation}
                            objectValue
                            onChange={this.handleProtocolChoose.bind(this)}
                            selectedValue={this.state.protocol}
                          />
                        </div>
                      </div>

                      <div className="field-row patient-name">
                        <strong className="label required"><label htmlFor="patient">Patient</label></strong>
                        <div className="field">
                          <Field
                            id="patient"
                            name="patient"
                            component={ReactSelect}
                            placeholder={this.state.protocol ? 'Select Patient' : 'N/A'}
                            options={patientOptions}
                            className="data-search"
                            disabled={submitting || this.props.fetchingPatientsByStudy || !this.state.protocol}
                            objectValue
                            onChange={this.handlePatientChoose.bind(this)}
                            selectedValue={this.state.patient}
                          />
                        </div>
                      </div>

                      <div className="field-row">
                        <strong className="label">&nbsp;</strong>
                        <Field
                          id="text-reminder"
                          name="textReminder"
                          component={Checkbox}
                          type="checkbox"
                        />
                        <label className="text-reminder-label" htmlFor="text-reminder">Text Reminder</label>
                      </div>

                      <div className="text-right">
                        <input type="reset" className="btn btn-gray-outline hidden" value="reset" />
                        <input type="submit" className="btn btn-default" value="Submit" disabled={submitting} />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        {modalType === SchedulePatientModalType.UPDATE &&
          <div id="edit-schedule" className="lightbox lightbox-active fixed-popup">
            <div className="lightbox-holder">
              <div className="lightbox-frame">
                <div className="modal-content">
                  <div className="head">
                    <strong className="title">EDIT SCHEDULE</strong>
                    <a className="close lightbox-close" onClick={handleCloseModal}><i className="icomoon-icon_close" /></a>
                  </div>
                  <div className="scroll-holder">
                    <form action="#" className="form-lightbox form-edit-schedule" onSubmit={handleSubmit}>
                      <strong className="name">{`${selectedCellInfo.data.patient.firstName} ${selectedCellInfo.data.patient.lastName}`}</strong>
                      <span className="site-location">{selectedCellInfo.data.siteLocation}</span>
                      <span className="protocol">{selectedCellInfo.data.protocolNumber}</span>
                      <div className="field-row">
                        <strong className="label">* When</strong>
                        <div className="field append-calendar">
                          <Field
                            id="start-date"
                            name="date"
                            component={DatePicker}
                            className="form-control datepicker-input"
                            initialDate={moment(this.props.selectedCellInfo.data.time)}
                          />
                        </div>
                      </div>
                      <div className="field-row">
                        <strong className="label required"><label htmlFor="patient-time-edit">Time</label></strong>
                        <div className="field">
                          <div className="col-holder row">
                            <div className="col pull-left hours">
                              <Field
                                id="patient-time-edit"
                                name="hour"
                                component={ReactSelect}
                                placeholder="Hours"
                                options={hourOptions}
                                className="visible-first-del min-height"
                                disabled={submitting}
                              />
                            </div>
                            <div className="col pull-left minutes">
                              <Field
                                id="minutes2"
                                name="minute"
                                component={ReactSelect}
                                placeholder="Minutes"
                                options={minuteOptions}
                                className="visible-first-del min-height"
                                disabled={submitting}
                              />
                            </div>
                            <div className="col pull-left time-mode">
                              <Field
                                id="time-period2"
                                name="period"
                                component={ReactSelect}
                                placeholder="AM/PM"
                                options={periodOptions}
                                className="visible-first"
                                disabled={submitting}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="field-row">
                        <strong className="label">&nbsp;</strong>
                        <Field
                          id="text-reminder"
                          name="textReminder"
                          component={Checkbox}
                          type="checkbox"
                        />
                        <label className="text-reminder-label" htmlFor="text-reminder">Text Reminder</label>
                      </div>
                      <div className="btn-block text-right">
                        <input
                          type="button"
                          className="btn btn-gray-outline lightbox-opener"
                          disabled={submitting}
                          value={submitting ? 'deleting...' : 'delete'}
                          onClick={() => handleDelete(selectedCellInfo.data.id)}
                        />
                        <input
                          type="submit"
                          className="btn btn-default btn-update"
                          value={submitting ? 'updating...' : 'update'}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </Modal>
    );
  }
}
