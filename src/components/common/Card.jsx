import React from 'react';

const Card = ({ title, children, className = '', icon: Icon, action }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {(title || Icon || action) && (
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            {Icon && <Icon className="w-5 h-5 text-primary-600 mr-2" />}
            {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
