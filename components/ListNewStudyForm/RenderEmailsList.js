/**
 *
 * ListNewStudyForm
 *
 */

import React, { PropTypes } from 'react';
import { Field, change } from 'redux-form';
import { Modal } from 'react-bootstrap';
import AddEmailNotificationForm from 'components/AddEmailNotificationForm';
import Checkbox from 'components/Input/Checkbox';
import _ from 'lodash';

import {
  showAddEmailModal,
  hideAddEmailModal,
} from 'containers/ListNewStudyPage/actions';

class RenderEmailsList extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    formValues: PropTypes.object.isRequired,
    listNewStudyState: PropTypes.object.isRequired,
    fields: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.addEmailNotificationClick = this.addEmailNotificationClick.bind(this);
    this.addEmailNotificationSubmit = this.addEmailNotificationSubmit.bind(this);
    this.closeAddEmailModal = this.closeAddEmailModal.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.selectEmail = this.selectEmail.bind(this);
  }

  addEmailNotificationClick() {
    this.props.dispatch(showAddEmailModal());
  }

  addEmailNotificationSubmit(values) {
    this.props.fields.push(values);
    this.props.dispatch(hideAddEmailModal());
    this.props.dispatch(change('listNewStudy', 'checkAllInput', false));
  }

  closeAddEmailModal() {
    this.props.dispatch(hideAddEmailModal());
  }

  selectAll(e) {
    if (this.props.formValues.emailNotifications) {
      _.forEach(this.props.formValues.emailNotifications, (value, index) => {
        this.props.dispatch(change('listNewStudy', `emailNotifications[${index}].isChecked`, e.target.checked));
      });
    }
  }

  selectEmail(e) {
    if (this.props.formValues.checkAllInput && !e.target.checked) {
      this.props.dispatch(change('listNewStudy', 'checkAllInput', false));
    } else if (!this.props.formValues.checkAllInput && e.target.checked) {
      const checkedArr = _.filter(this.props.formValues.emailNotifications, (o) => o.isChecked);
      if ((checkedArr.length + 1) === this.props.formValues.emailNotifications.length) {
        this.props.dispatch(change('listNewStudy', 'checkAllInput', true));
      }
    }
  }

  render() {
    const { fields, formValues } = this.props;
    return (
      <div>
        <div className={fields.length === 0 ? 'heading-area-no-border' : 'heading-area'}>
          <Field
            name="checkAllInput"
            component={Checkbox}
            type="checkbox"
            className="field-active"
            onChange={this.selectAll}
          />
          <strong className="email">RECEIVE EMAIL NOTIFICATION</strong>
        </div>

        <ul className="list-unstyled list-emails">
          {
            fields.map((email, index) =>
              <li key={index}>
                <Field
                  name={`${email}.isChecked`}
                  component={Checkbox}
                  type="checkbox"
                  className="field-active"
                  onChange={this.selectEmail}
                />
                <span className="first-name">{formValues.emailNotifications[index].firstName} </span>
                <span className="last-name">{formValues.emailNotifications[index].lastName} </span>
              </li>
            )
          }
        </ul>
        <div className="btn-holder">
          <a className="add-new-email lightbox-opener" onClick={this.addEmailNotificationClick}>Add Email Notification</a>
        </div>

        <Modal className="custom-modal" show={this.props.listNewStudyState.showAddEmailModal} onHide={this.closeAddEmailModal}>
          <Modal.Header>
            <Modal.Title>ADD EMAIL NOTIFICATION</Modal.Title>
            <a className="lightbox-close close" onClick={this.closeAddEmailModal}>
              <i className="icomoon-icon_close" />
            </a>
          </Modal.Header>
          <Modal.Body>
            <AddEmailNotificationForm onSubmit={this.addEmailNotificationSubmit} />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default RenderEmailsList;
