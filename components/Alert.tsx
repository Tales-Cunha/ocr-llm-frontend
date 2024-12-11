
import React from 'react';
import { FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

interface AlertProps {
  message: string;
  type: 'success' | 'error';
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  return (
    <div className={`alert ${type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`}>
      <div>
        {type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Alert;