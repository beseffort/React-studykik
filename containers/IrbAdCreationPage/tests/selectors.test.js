// import { selectIrbAdCreationPageDomain } from '../selectors';
import expect from 'expect';

import { selectIrbAdCreationPageDomain } from '../selectors';

describe('selectIrbAdCreationPageDomain', () => {
  describe('selectIrbAdCreationPageDomain', () => {
    const irbAdPageDomainSelector = selectIrbAdCreationPageDomain();
    it('should select IrbAdCreation page state', () => {
      const state = {};
      const mockedState = {
        irbAdCreationPage: state,
      };
      expect(irbAdPageDomainSelector(mockedState)).toEqual(state);
    });
  });
});
