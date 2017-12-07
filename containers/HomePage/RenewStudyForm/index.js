import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Field, reduxForm, change } from 'redux-form';
import moment from 'moment';

import Input from 'components/Input';
import ReactSelect from 'components/Input/ReactSelect';
import DatePicker from 'components/Input/DatePicker';
import Toggle from 'components/Input/Toggle';
import {
  selectRenewStudyFormCampaignLengthValue,
} from './selectors';
import { selectStudyLevels } from 'containers/App/selectors';
import { selectSelectedIndicationLevelPrice } from 'containers/HomePage/selectors';
import { CAMPAIGN_LENGTH_LIST } from 'common/constants';
import formValidator from './validator';
import LoadingSpinner from 'components/LoadingSpinner';

const mapStateToProps = createStructuredSelector({
  studyLevels: selectStudyLevels(),
  selectedIndicationLevelPrice: selectSelectedIndicationLevelPrice(),
  campaignLength: selectRenewStudyFormCampaignLengthValue(),
});

@reduxForm({ form: 'renewStudy', validate: formValidator })
@connect(mapStateToProps, null)

class RenewStudyForm extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    studyLevels: PropTypes.array,
    selectedIndicationLevelPrice: PropTypes.object,
    campaignLength: PropTypes.number,
  };

  componentWillReceiveProps(newProps) {
    if (newProps.campaignLength !== this.props.campaignLength) {
      if (newProps.campaignLength !== 1) {
        this.props.dispatch(change('renewStudy', 'condenseToTwoWeeks', false));
      }
    }
  }

  render() {
    const { studyLevels, campaignLength, selectedIndicationLevelPrice } = this.props;

    return (
      <form className="form-renew-study">
        <div className="renew-study form-fields">
          <div className="field-row">
            <strong className="label required">
              <label>EXPOSURE LEVEL</label>
            </strong>
            <div className="field">
              <Field
                name="exposureLevel"
                className="with-loader-disabled-for-now"
                component={ReactSelect}
                placeholder="Select..."
                options={studyLevels}
                disabled={selectedIndicationLevelPrice.fetching}
              />
              {selectedIndicationLevelPrice.fetching &&
                (
                <span className="hide">
                  <LoadingSpinner showOnlyIcon size={20} />
                </span>
                )
              }
            </div>
          </div>
          <div className="field-row">
            <strong className="label required">
              <label>CAMPAIGN LENGTH</label>
            </strong>
            <div className="field">
              <Field
                name="campaignLength"
                component={ReactSelect}
                placeholder="Select..."
                options={CAMPAIGN_LENGTH_LIST}
              />
            </div>
          </div>
          {campaignLength === 1 &&
            (
            <div className="field-row">
              <strong className="label">
                <label>CONDENSE TO 2 WEEKS</label>
              </strong>
              <div className="field">
                <Field
                  name="condenseToTwoWeeks"
                  component={Toggle}
                />
              </div>
            </div>
            )
          }
          <div className="field-row">
            <strong className="label">
              <label>PATIENT MESSAGING SUITE: $247</label>
            </strong>
            <div className="field">
              <Field
                name="patientMessagingSuite"
                component={Toggle}
              />
            </div>
          </div>
          {false &&
            <div className="field-row">
              <strong className="label">
                <label>CALL TRACKING: $247</label>
              </strong>
              <div className="field">
                <Field
                  name="callTracking"
                  component={Toggle}
                />
              </div>
            </div>
          }
          <div className="field-row">
            <strong className="label required">
              <label>START DATE</label>
            </strong>
            <div className="field">
              <Field
                name="startDate"
                component={DatePicker}
                className="form-control datepicker-input"
                initialDate={moment(new Date())}
              />
            </div>
          </div>
          <div className="field-row">
            <strong className="label">
              <label>NOTES</label>
            </strong>
            <div className="field">
              <Field
                name="notes"
                component={Input}
                componentClass="textarea"
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default RenewStudyForm;
