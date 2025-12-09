import React from 'react';

const Card = ({ title, children, className = '', icon: Icon, action }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-secondary-100 hover:shadow-2xl transition-all duration-300 ${className}`}>
      {(title || Icon || action) && (
        <div className="px-6 py-4 border-b-2 border-gradient-to-r from-primary-100 to-secondary-100 bg-gradient-to-r from-secondary-50 to-primary-50 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center space-x-2">
            {Icon && (
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-md">
                <Icon className="w-5 h-5 text-white" />
              </div>
            )}
            {title && <h3 className="text-lg font-bold bg-gradient-to-r from-secondary-700 to-primary-600 bg-clip-text text-transparent">{title}</h3>}
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
