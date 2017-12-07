import expect from 'expect';
import { validatorFactory } from '../reduxForm';

const schema = {
  email: { presence: true, email: true },
  name: { presence: true },
};

const validator = validatorFactory(schema);

describe('utils/reduxForm', () => {
  describe('validator', () => {
    it('should be a function itself', () => {
      expect(validator).toBeA('function');
    });

    it('should return errors for invalid values', () => {
      const values = {
        email: 'test.user@example',
        name: '',
      };
      const errors = validator(values);
      expect(errors).toContainKeys(['email', 'name']);
      expect(errors.email).toEqual('Email is not a valid email');
      expect(errors.name).toEqual('Name can\'t be blank');
    });

    it('should return empty object (not undefined) for valid values', () => {
      const values = {
        email: 'test.user@example.com',
        name: 'Test User',
      };
      const errors = validator(values);
      expect(errors).toBeA('object');
      expect(Object.keys(errors).length).toEqual(0);
      expect(errors).toNotEqual(undefined);
    });
  });
});
