const upgradeStudyFields = ['level', 'patientMessagingSuite', 'callTracking', 'notes'];
export { upgradeStudyFields };

export default values => {
  const errors = {};

  if (!values.level && !values.patientMessagingSuite) {
    errors.level = 'You need to select either Upgrade Level or Patient Messaging Suite';
    errors.patientMessagingSuite = 'You need to select either Upgrade Level or Patient Messaging Suite';
  }
  return errors;
};
