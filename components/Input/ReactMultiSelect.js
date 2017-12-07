/**
 *
 * Input for react-select
 *
 */

import React, { PropTypes } from 'react';
import ReactSuperSelect from 'react-super-select';
import classNames from 'classnames';

function ReactMultiSelect({
  input,
  placeholder,
  className,
  onChange,
  meta: { touched, error, active },
  ...rest,
}) {
  const hasError = touched && error && !active;
  const errorClass = hasError ? 'has-error' : '';


  let inputComponent = (
    <ReactSuperSelect
      onChange={(event) => {
        input.onChange(event);
        if (onChange) {
          onChange(event);
        }
      }}
      placeholder={placeholder}
      {...rest}
    />
  );

  return (
    <div className={classNames([className, errorClass].join(' '))}>
      {inputComponent}
    </div>
  );
}

ReactMultiSelect.propTypes = {
  input: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  meta: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default ReactMultiSelect;
