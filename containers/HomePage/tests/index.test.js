import expect from 'expect';
import { shallow } from 'enzyme';
// import { Provider } from 'react-redux';
import React from 'react';

// import configureStore from 'store';
import { HomePage } from '../index';
import Dashboard from '../Dashboard';

describe('HomePage/index component', () => {
  let setup;

  beforeEach(() => {
    setup = () => {
      const props = {
      };

      const shallowWrapper = shallow(<HomePage {...props} />);

      return {
        props,
        shallowWrapper,
      };
    };
  });

  it('should render Dashboard', () => {
    const { shallowWrapper } = setup();

    expect(shallowWrapper.find(Dashboard)).to.have.length(1);
  });
});
