import React from 'react';
import { Field, reduxForm } from 'redux-form';
import Col from 'react-bootstrap/lib/Col';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import { Link } from 'react-router';

import Input from 'components/Input';
import loginFormValidator from './validator';

@reduxForm({
  form: 'login',
  validate: loginFormValidator,
})
export class LoginForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    handleSubmit: React.PropTypes.func.isRequired,
    submitting: React.PropTypes.bool.isRequired,
  };

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <form
        onSubmit={handleSubmit}
        className="form-horizontal"
      >
        <FormGroup>
          <Field
            name="email"
            type="text"
            component={Input}
            placeholder="Email"
            className="col-sm-12"
          />
        </FormGroup>

        <FormGroup>
          <Field
            name="password"
            type="password"
            component={Input}
            placeholder="Password"
            className="col-sm-12"
          />
        </FormGroup>

        <FormGroup>

          <Col sm={6}>
            <Link to="/reset-password">
              Forgot password ?
            </Link>
          </Col>
          <Col sm={6}>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-default pull-right submitBtn"
            >
              Log In
            </button>
          </Col>


        </FormGroup>
      </form>
    );
  }
}

export default LoginForm;
