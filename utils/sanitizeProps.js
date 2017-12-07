// sanitize props from redux form field props
export default function sanitizeProps(prop) {
  const newSanitizedProp = Object.assign({}, prop);
  delete newSanitizedProp.initialValue;
  delete newSanitizedProp.autofill;
  delete newSanitizedProp.onUpdate;
  delete newSanitizedProp.valid;
  delete newSanitizedProp.invalid;
  delete newSanitizedProp.dirty;
  delete newSanitizedProp.pristine;
  delete newSanitizedProp.active;
  delete newSanitizedProp.touched;
  delete newSanitizedProp.visited;
  delete newSanitizedProp.autofilled;
  delete newSanitizedProp.error;
  return newSanitizedProp;
}
