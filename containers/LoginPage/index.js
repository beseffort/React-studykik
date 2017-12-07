/**
 * Login Page
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import LoginForm from 'components/LoginForm';
import { loginRequest } from './actions';

import './styles.less';

export class LoginPage extends Component {

  static propTypes = {
    onSubmitForm: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.onSubmitForm = this.props.onSubmitForm.bind(this);
  }

  render() {
    return (
      <div className="login-page-wrapper">
        <Helmet title="Login - StudyKIK" />
        <div className="row">
          <div className="col-md-4 col-md-push-4">
            <div className="login-block">
              <div className="text-center">
                <h3>StudyKIK Login</h3>
              </div>
              <br />

              <LoginForm onSubmit={this.onSubmitForm} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmitForm: (values) => dispatch(loginRequest(values)),
  };
}

export default connect(null, mapDispatchToProps)(LoginPage);
