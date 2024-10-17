import React from 'react';

export const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white shadow-md rounded-lg ${className}`} {...props}>{children}</div>
);

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`px-4 py-5 border-b border-gray-200 ${className}`} {...props}>{children}</div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg leading-6 font-medium text-gray-900 ${className}`} {...props}>{children}</h3>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`px-4 py-5 ${className}`} {...props}>{children}</div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`px-4 py-4 border-t border-gray-200 ${className}`} {...props}>{children}</div>
);