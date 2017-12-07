/**
 *
 * Radio for react-select
 *
 */

import React, { PropTypes } from 'react';
import classNames from 'classnames';

function RadioButton({ input, className, children, onChange }) {
  return (
    <div className={classNames(className)}>
      <span className={`jcf-radio ${input.checked ? 'parent-active input-checked-parent jcf-checked' : ' parent-active jcf-unchecked'}`}>
        <span
          onClick={() => {
            input.onChange(!input.checked);
            if (onChange) {
              onChange(!input.checked);
            }
          }}
        />
        <input
          {...input}
          checked={input.checked}
          type="radio"
          value={input.value}
        />
        {children}
      </span>
    </div>
  );
}

RadioButton.propTypes = {
  input: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.any,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

export default RadioButton;
