import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} transform transition-all border-2 border-secondary-100`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-8 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full"></div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-secondary-700 to-primary-600 bg-clip-text text-transparent">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-2 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
