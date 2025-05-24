import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Generating your study schedule...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 animate-fadeIn">
      <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin mb-4"></div>
      <p className="text-gray-600 text-center">{message}</p>
    </div>
  );
};

export default LoadingSpinner;