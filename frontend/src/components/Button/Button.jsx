import React from 'react';

const Button = ({ children, onClick, disabled, type = 'button', className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`my-button ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
