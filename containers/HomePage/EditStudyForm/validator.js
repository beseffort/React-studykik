import { validatorFactory } from 'utils/reduxForm';

const schema = {
  recruitmentPhone: { presence: true },
  studyAd: { presence: true },
};

export default validatorFactory(schema);
