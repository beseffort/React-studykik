import { LoginPage } from 'containers/LoginPage';
import { LoginForm } from 'components/LoginForm';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'store';

import chaiEnzyme from 'chai-enzyme';
import expect from 'expect';
import chai from 'chai';
chai.use(chaiEnzyme());
const chaiExpect = chai.expect;

describe('<LoginPage />', () => {
  let setup;

  beforeEach(() => {
    setup = () => {
      const pageProps = {
        onSubmitForm: expect.createSpy(),
      };
      const formProps = {
        handleSubmit: expect.createSpy(),
        submitting: false,
      };

      const pageShallowWrapper = shallow(<LoginPage {...pageProps} />);

      return {
        pageProps,
        formProps,
        pageShallowWrapper,
      };
    };
  });

  it('Login page should loading.', () => {
    const { pageShallowWrapper } = setup();
    chaiExpect(pageShallowWrapper.find('.login-page-wrapper')).to.have.length(1);
  });

  it('Login page should render the LoginForm', () => {
    const { pageShallowWrapper } = setup();
    chaiExpect(pageShallowWrapper.find(LoginForm)).to.have.length(1);
  });

  it('Login form submit when button is clicked.', () => {
    const { formProps } = setup();
    const mountWrapper = mount( // eslint-disable-line
      <Provider store={configureStore({})}>
        <LoginForm {...formProps} />
      </Provider>
    );

    mountWrapper.find('button.submitBtn').simulate('click');
    expect(formProps.handleSubmit).toHaveBeenCalled();
  });
});
