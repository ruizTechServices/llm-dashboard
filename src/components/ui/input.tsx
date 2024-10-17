import React from 'react';

export const Input = ({ className = '', ...props }) => (
  <input className={`px-3 py-2 border border-gray-300 rounded-md ${className}`} {...props} />
);