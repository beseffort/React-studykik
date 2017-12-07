import expect from 'expect';
import irbAdCreationPageReducer from '../reducer';

describe('irbAdCreationPageReducer', () => {
  it('returns the initial state', () => {
    expect(irbAdCreationPageReducer(undefined, {})).toEqual({});
  });
});
