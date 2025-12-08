import React, { useState } from 'react';
import { ChevronDown, ChevronRight, GraduationCap, Users } from 'lucide-react';

/**
 * Composant pour afficher des données groupées par classe
 * Avec accordéon pour expand/collapse
 */
const GroupedByClass = ({
  data = [],
  renderItem,
  getItemClass,
  emptyMessage = "Aucune donnée disponible",
  defaultExpanded = true
}) => {
  // Grouper les données par classe
  const groupedData = data.reduce((acc, item) => {
    const className = getItemClass(item);
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(item);
    return acc;
  }, {});

  // Trier les classes par nom
  const sortedClasses = Object.keys(groupedData).sort();

  // État d'expansion pour chaque classe
  const [expandedClasses, setExpandedClasses] = useState(
    defaultExpanded
      ? Object.fromEntries(sortedClasses.map(c => [c, true]))
      : {}
  );

  const toggleClass = (className) => {
    setExpandedClasses(prev => ({
      ...prev,
      [className]: !prev[className]
    }));
  };

  const expandAll = () => {
    setExpandedClasses(
      Object.fromEntries(sortedClasses.map(c => [c, true]))
    );
  };

  const collapseAll = () => {
    setExpandedClasses({});
  };

  if (sortedClasses.length === 0) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Boutons Expand/Collapse All */}
      {sortedClasses.length > 1 && (
        <div className="flex justify-end space-x-2 mb-4">
          <button
            onClick={expandAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Tout développer
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={collapseAll}
            className="text-sm text-gray-600 hover:text-gray-700 font-medium"
          >
            Tout réduire
          </button>
        </div>
      )}

      {/* Groupes de classes */}
      {sortedClasses.map((className) => {
        const items = groupedData[className];
        const isExpanded = expandedClasses[className];

        return (
          <div key={className} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* En-tête de la classe */}
            <button
              onClick={() => toggleClass(className)}
              className="w-full px-6 py-4 bg-gradient-to-r from-primary-50 to-white hover:from-primary-100 hover:to-primary-50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-primary-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-primary-600" />
                )}
                <GraduationCap className="w-6 h-6 text-primary-600" />
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900">{className}</h3>
                  <p className="text-sm text-gray-500">
                    {items.length} {items.length > 1 ? 'élèves' : 'élève'}
                  </p>
                </div>
              </div>

              {/* Badge avec nombre */}
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-sm font-semibold">
                  {items.length}
                </span>
              </div>
            </button>

            {/* Contenu de la classe */}
            {isExpanded && (
              <div className="bg-white">
                <div className="divide-y divide-gray-100">
                  {items.map((item, index) => (
                    <div key={index} className="hover:bg-gray-50 transition-colors">
                      {renderItem(item, index)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Résumé global */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">Total</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {sortedClasses.length} {sortedClasses.length > 1 ? 'classes' : 'classe'}
            </p>
            <p className="text-lg font-bold text-gray-900">
              {data.length} {data.length > 1 ? 'élèves' : 'élève'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupedByClass;
