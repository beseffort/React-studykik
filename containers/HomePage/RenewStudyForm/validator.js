import { validatorFactory } from 'utils/reduxForm';

const schema = {
  exposureLevel: { presence: true },
  campaignLength: { presence: true },
  condenseToTwoWeeks: { presence: false },
  patientMessagingSuite: { presence: false },
  callTracking: { presence: false },
  startDate: { presence: false },
  notes: { presence: false },
};

export default validatorFactory(schema);
