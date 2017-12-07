import expect from 'expect';

import { selectHomePageDomain, selectPatientSignUps, selectPatientMessages, selectRewardsPoint } from '../selectors';

describe('HomePage/selectors', () => {
  describe('selectHomePageDomain', () => {
    const homePageDomainSelector = selectHomePageDomain;
    it('should select homePage state', () => {
      const homePageState = {
        patientSignUps: {
          today: 0,
          yesterday: 0,
        },
        patientMessages: {
          unreadTexts: 0,
          unreadEmails: 0,
        },
        rewardsPoint: 0,
      };
      const mockedState = {
        homePage: homePageState,
      };
      expect(homePageDomainSelector(mockedState)).toEqual(homePageState);
    });
  });

  describe('selectPatientSignUps', () => {
    const selectPatientSignUpsSelector = selectPatientSignUps;
    it('should select patientSignUps', () => {
      const mockedState = {
        homePage: {
          patientSignUps: {
            today: 0,
            yesterday: 0,
          },
        },
      };
      expect(selectPatientSignUpsSelector(mockedState)).toEqual({
        today: 0,
        yesterday: 0,
      });
    });
  });

  describe('selectPatientMessages', () => {
    const selectPatientMessagesSelector = selectPatientMessages;
    it('should select patientMessages', () => {
      const mockedState = {
        homePage: {
          patientMessages: {
            unreadTexts: 1,
            unreadEmails: 15,
          },
        },
      };
      expect(selectPatientMessagesSelector(mockedState)).toEqual({
        unreadTexts: 1,
        unreadEmails: 15,
      });
    });
  });

  describe('selectRewardsPoint', () => {
    const selectRewardsPointSelector = selectRewardsPoint;
    it('should select rewardsPoint', () => {
      const mockedState = {
        homePage: {
          rewardsPoint: 3,
        },
      };
      expect(selectRewardsPointSelector(mockedState)).toEqual(3);
    });
  });
});
