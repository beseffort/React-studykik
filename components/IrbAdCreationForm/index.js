/**
*
* IrbAdCreationForm
*
*/

import React, { PropTypes } from 'react';
import ReactSelect from 'components/Input/ReactSelect';
import { Field, reduxForm } from 'redux-form';
import formValidator from './validator';
import Input from 'components/Input';
import './styles.less';

@reduxForm({ form: 'irbAdCreation', validate: formValidator })
class IrbAdCreationForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    siteLocations: PropTypes.array,
    indications: PropTypes.array,
    handleSubmit: React.PropTypes.func.isRequired,
  };

  render() {
    const { siteLocations, indications, handleSubmit } = this.props;

    return (
      <form className="form-study" onSubmit={handleSubmit}>
        <div className="form-fields">
          <div className="field-row">
            <strong className="label required"><label htmlFor="site-location">SITE LOCATION</label></strong>
            <div className="field">
              <Field
                name="siteLocation"
                component={ReactSelect}
                placeholder="Select Site Location"
                options={siteLocations}
              />
            </div>
          </div>

          <div className="field-row">
            <strong className="label required"><label htmlFor="indication">INDICATION</label></strong>
            <div className="field">
              <Field
                name="indication_id"
                component={ReactSelect}
                placeholder="Select Indication"
                options={indications}
              />
            </div>
          </div>

          <div className="field-row">
            <strong className="label"><label htmlFor="name">IRB NAME</label></strong>
            <div className="field">
              <Field
                name="irbName"
                component={Input}
              />
            </div>
          </div>

          <div className="field-row">
            <strong className="label"><label htmlFor="email">IRB EMAIL</label></strong>
            <div className="field">
              <Field
                name="irbEmail"
                component={Input}
              />
            </div>
          </div>

          <div className="field-row">
            <strong className="label"><label htmlFor="compensationAmount">COMPENSATION AMOUNT</label></strong>
            <div className="field">
              <Field
                name="compensationAmount"
                component={Input}
              />
            </div>
          </div>

          <div className="field-row">
            <strong className="label"><label htmlFor="clinicaltrialGovLink">CLINICALTRIALS.GOV LINK</label></strong>
            <div className="field">
              <Field
                name="clinicaltrialGovLink"
                component={Input}
              />
            </div>
          </div>

          <div className="field-row">
            <strong className="label"><label htmlFor="clinicaltrialGovLink">UPLOAD BLINDED PROTOCOL</label></strong>
            <div className="field">
              <label htmlFor="irb_file" data-text="Browse" data-hover-text="Attach File" className="btn btn-gray upload-btn"></label>
              <Field
                id="irb_file"
                name="file"
                component={Input}
                type="file"
              />
            </div>
          </div>

          <div className="field-row textarea">
            <strong className="label"><label htmlFor="notes">NOTES</label></strong>
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

export default IrbAdCreationForm;

