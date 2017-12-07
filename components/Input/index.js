/**
*
* Input
*
*/

/**
 * Input element for redux-form
 *
 * Not only supports <input> (text, email, password)
 * But also <select> and <textarea>
 */
import React, { PropTypes } from 'react';
import { FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap';
import classNames from 'classnames';

function Input({
  input,
  name,
  type,
  id,
  placeholder,
  componentClass,
  className,
  tooltipDisabled,
  onBlur,
  onChange,
  required,
  meta: { touched, error, active },
  maxLength,
  children,
  isDisabled,
  min,
  max,
  step,
  defaultValue,
}) {
  const hasError = touched && error && !active;
  const errorClass = hasError ? 'has-error' : '';
  const tooltip = (
    <Tooltip
      id={`${name}-tooltip`}
      className="tooltip-error"
    >
      {error}
    </Tooltip>
  );
  let inputComponent = (
    <FormControl
      {...input}
      type={type}
      id={id}
      disabled={isDisabled}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue}
      componentClass={componentClass} // Default value is `input`
      onChange={(event) => {
        input.onChange(event);
        if (onChange) {
          onChange(event);
        }
      }}
      onBlur={(event) => {
        input.onBlur(event);
        if (onBlur) {
          onBlur(event);
        }
      }}
    >
      {children}
    </FormControl>
  );

  if (hasError && !tooltipDisabled) {
    inputComponent = (
      <OverlayTrigger
        placement="right"
        overlay={tooltip}
      >
        {inputComponent}
      </OverlayTrigger>
    );
  }

  return (
    <div className={classNames(className, errorClass)}>
      {inputComponent}
    </div>
  );
}

Input.propTypes = {
  componentClass: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.array,
  isDisabled: PropTypes.bool,
  id: PropTypes.string,
  input: PropTypes.object.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  maxLength: PropTypes.string,
  meta: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  tooltipDisabled: PropTypes.bool,
  type: PropTypes.string,
  min: PropTypes.string,
  max: PropTypes.string,
  step: PropTypes.string,
  defaultValue: PropTypes.string,
};

export default Input;
