import { validatorFactory } from 'utils/reduxForm';

const schema = {
  email: { presence: true, email: true },
  password: { presence: true },
};

export default validatorFactory(schema);
