import React from 'react';

export const Slider = ({ className = '', ...props }) => (
  <input type="range" className={`w-full ${className}`} {...props} />
);