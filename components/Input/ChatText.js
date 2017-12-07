/**
 *
 * Radio for react-select
 *
 */

import React, { PropTypes } from 'react';
import classNames from 'classnames';

function ChatText({ input, name, className, placeholder, maxLength, disabled }) {
  return (
    <div className="chat-text">
      <textarea
        {...input}
        name={name}
        className={classNames(className)}
        placeholder={placeholder}
        value={input.value}
        maxLength={maxLength}
        disabled={disabled}
      />
      <span className="remaining-counter">
        {parseInt(maxLength) - input.value.length}
      </span>
    </div>
  );
}

ChatText.propTypes = {
  input: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.string,
  disabled: PropTypes.string,
};

export default ChatText;
