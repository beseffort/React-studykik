/**
*
* ListNewStudyForm
*
*/

import React, { PropTypes } from 'react';
import Input from 'components/Input';
import Toggle from 'components/Input/Toggle';
import DatePicker from 'components/Input/DatePicker';
import formValidator from './validator';
import ReactSelect from 'components/Input/ReactSelect';
import { Field, FieldArray, reduxForm, change } from 'redux-form';
import _ from 'lodash';
import moment from 'moment';
import CenteredModal from '../../components/CenteredModal/index';
import Modal from 'react-bootstrap/lib/Modal';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import RenderLeads from 'components/RenderLeads';
import RenderEmailsList from './RenderEmailsList';
import EditSiteForm from '../../components/EditSiteForm/index';
import { selectCurrentUserClientId } from 'containers/App/selectors';
import {
  selectCallTracking,
  selectLeadsCount,
} from './selectors';

import { CAMPAIGN_LENGTH_LIST } from 'common/constants';

import {
  showSiteLocationModal,
  hideSiteLocationModal,
} from 'containers/ListNewStudyPage/actions';

const mapStateToProps = createStructuredSelector({
  callTracking: selectCallTracking(),
  leadsCount: selectLeadsCount(),
  currentUserClientId: selectCurrentUserClientId(),
});

@reduxForm({ form: 'listNewStudy', validate: formValidator })
@connect(mapStateToProps)
class ListNewStudyForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    siteLocations: PropTypes.array,
    indications: PropTypes.array,
    studyLevels: PropTypes.array,
    listNewStudyState: PropTypes.object,
    callTracking: PropTypes.bool,
    leadsCount: PropTypes.number,
    fullSiteLocations: PropTypes.array,
    formValues: PropTypes.object,
    saveSite: PropTypes.func,
    currentUserClientId: PropTypes.number,
    availPhoneNumbers: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.handleSiteLocationChoose = this.handleSiteLocationChoose.bind(this);
    this.closeAddSiteModal = this.closeAddSiteModal.bind(this);
    this.addSite = this.addSite.bind(this);
  }

  componentWillReceiveProps(newProps) {
    // If leads are all removed, set `callTracking` value to false
    if (newProps.leadsCount === 0 && this.props.leadsCount === 1) {
      this.props.dispatch(change('listNewStudy', 'callTracking', false));
    }
  }

  closeAddSiteModal() {
    this.props.dispatch(hideSiteLocationModal());
  }

  handleSiteLocationChoose(e) {
    if (e === 'add-new-location') {
      this.props.dispatch(showSiteLocationModal());
    } else {
      this.props.dispatch(change('listNewStudy', 'siteLocation', e));

      const fullSiteLocation = _.find(this.props.fullSiteLocations, (o) => (o.id === e));
      if (fullSiteLocation) {
        this.props.dispatch(change('listNewStudy', 'emailNotifications', fullSiteLocation.users));
      }
    }
  }

  addSite(siteData) {
    const { currentUserClientId } = this.props;

    this.props.saveSite(currentUserClientId, null, siteData);
  }

  render() {
    const { siteLocations, indications, studyLevels, callTracking, formValues } = this.props;

    if (!_.find(siteLocations, (o) => (o.id === 'add-new-location'))) {
      siteLocations.push({
        id: 'add-new-location',
        name: 'Add New Location',
      });
    }

    return (
      <div className="form-study">
        <div className="form-fields">
          <div className="field-row">
            <strong className="label required"><label>Site Location</label></strong>
            <Field
              name="siteLocation"
              component={ReactSelect}
              placeholder="Select Site Location"
              options={siteLocations}
              className="field"
              onChange={this.handleSiteLocationChoose}
            />
          </div>

          {(() => {
            if (this.props.formValues.siteLocation) {
              return (
                <div className="field-row label-top">
                  <strong className="label"><label>EMAIL NOTIFICATIONS</label></strong>
                  <div className="field">
                    <div className="emails-list-holder">
                      <FieldArray
                        name="emailNotifications"
                        component={RenderEmailsList}
                        formValues={formValues}
                        listNewStudyState={this.props.listNewStudyState}
                        dispatch={this.props.dispatch}
                      />
                    </div>

                  </div>
                </div>
              );
            }
            return false;
          })()}

          <div className="field-row">
            <strong className="label required"><label>RECRUITMENT PHONE</label></strong>
            <Field
              name="recruitmentPhone"
              component={Input}
              type="text"
              className="field"
            />
          </div>

          <div className="field-row">
            <strong className="label required"><label>Indication</label></strong>
            <Field
              name="indication_id"
              component={ReactSelect}
              placeholder="Select Indication"
              options={indications}
              className="field"
            />
          </div>

          <div className="field-row">
            <strong className="label"><label htmlFor="clinicaltrialGovLink">UPLOAD STUDY AD</label></strong>
            <div className="field">
              <label htmlFor="study_file" data-text="Browse" data-hover-text="Attach File" className="btn btn-gray upload-btn" />
              <Field
                id="study_file"
                name="file"
                component={Input}
                type="file"
              />
            </div>
          </div>

          <div className="field-row">
            <strong className="label required"><label>PROTOCOL</label></strong>
            <Field
              name="protocolNumber"
              component={Input}
              type="text"
              className="field"
            />
          </div>

          <div className="field-row">
            <strong className="label required"><label>SPONSOR NAME</label></strong>
            <Field
              name="sponsorName"
              component={Input}
              type="text"
              className="field"
            />
          </div>

          <div className="field-row">
            <strong className="label"><label>Sponsor Email</label></strong>
            <Field
              name="sponsorEmail"
              component={Input}
              type="email"
              className="field"
            />
          </div>

          <div className="field-row">
            <strong className="label"><label>CRO Name</label></strong>
            <Field
              name="croContactName"
              component={Input}
              type="text"
              className="field"
            />
          </div>

          <div className="field-row">
            <strong className="label"><label>CRO Email</label></strong>
            <Field
              name="croContactEmail"
              component={Input}
              type="email"
              className="field"
            />
          </div>

          <div className="field-row">
            <strong className="label"><label>IRB Name</label></strong>
            <Field
              name="irbName"
              component={Input}
              type="text"
              className="field"
            />
          </div>

          <div className="field-row">
            <strong className="label"><label>IRB Email</label></strong>
            <Field
              name="irbEmail"
              component={Input}
              type="email"
              className="field"
            />
          </div>

          <div className="field-row">
            <strong className="label required"><label>Exposure Level</label></strong>
            <Field
              name="exposureLevel"
              component={ReactSelect}
              placeholder="Select Exposure Level"
              options={studyLevels}
              className="field"
            />
          </div>

          <div className="field-row">
            <strong className="label required"><label>Campaign Length</label></strong>
            <Field
              name="campaignLength"
              component={ReactSelect}
              placeholder="Select Campaign Length"
              options={CAMPAIGN_LENGTH_LIST}
              className="field top-positioned"
            />
          </div>

          {(() => {
            if (this.props.formValues.campaignLength === 1) {
              return (
                <div className="field-row">
                  <strong className="label"><label>CONDENSE TO 2 WEEKS</label></strong>
                  <Field
                    name="condenseTwoWeeks"
                    component={Toggle}
                    className="field"
                  />
                </div>
              );
            }
            return false;
          })()}

          <div className="field-row">
            <strong className="label"><label>Patient messaging <br />
            Suite: $247</label></strong>
            <Field
              name="addPatientMessagingSuite"
              component={Toggle}
              className="field"
            />
          </div>

          {false &&
            <div className="tracking-source">
              <div className="field-row">
                <strong className="label"><label>CALL TRACKING: $247</label></strong>
                <Field
                  name="callTracking"
                  component={Toggle}
                  className="field"
                />
              </div>
            </div>
          }

          {callTracking &&
            <FieldArray name="leadSource" component={RenderLeads} availPhoneNumbers={this.props.availPhoneNumbers} />
          }

          <div className="field-row">
            <strong className="label required"><label>Start Date</label></strong>
            <Field
              id="start-date"
              name="startDate"
              component={DatePicker}
              className="form-control field datepicker-input"
              initialDate={moment()}
            />
          </div>

          <div className="field-row textarea">
            <strong className="label"><label htmlFor="notes">NOTES</label></strong>
            <div className="field">
              <Field
                name="description"
                component={Input}
                componentClass="textarea"
              />
            </div>
          </div>


        </div>

        <Modal dialogComponentClass={CenteredModal} show={this.props.listNewStudyState.showAddSiteLocationModal} onHide={this.closeAddSiteModal}>
          <Modal.Header>
            <Modal.Title>ADD SITE LOCATION</Modal.Title>
            <a className="lightbox-close close" onClick={this.closeAddSiteModal}>
              <i className="icomoon-icon_close" />
            </a>
          </Modal.Header>
          <Modal.Body>
            <div className="container-fluid">
              <EditSiteForm onSubmit={this.addSite} />
            </div>
          </Modal.Body>
        </Modal>

      </div>

    );
  }
}

export default ListNewStudyForm;
