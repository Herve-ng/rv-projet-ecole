import React from 'react';
import { GraduationCap, Search, X } from 'lucide-react';

/**
 * Composant de filtre par classe et recherche
 * Utilisable dans toutes les pages de l'application
 */
const ClassFilter = ({
  classes = [],
  selectedClass,
  onClassChange,
  searchTerm,
  onSearchChange,
  showSearch = true,
  placeholder = "Rechercher un élève...",
  className = ""
}) => {
  // Compter les éléments par classe si disponible
  const getClassCount = (className) => {
    const classData = classes.find(c => c.name === className);
    return classData?.count || 0;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Sélecteur de classe */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <GraduationCap className="w-4 h-4 mr-2 text-primary-600" />
          Filtrer par classe
        </label>
        <div className="relative">
          <select
            value={selectedClass}
            onChange={(e) => onClassChange(e.target.value)}
            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
          >
            <option value="">📚 Toutes les classes</option>
            {classes.map((classItem) => (
              <option key={classItem.name} value={classItem.name}>
                {classItem.name}
                {classItem.count !== undefined && ` (${classItem.count})`}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Tags des classes actives */}
        {selectedClass && (
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
              <GraduationCap className="w-4 h-4 mr-1" />
              {selectedClass}
              <button
                onClick={() => onClassChange('')}
                className="ml-2 hover:bg-primary-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Barre de recherche */}
      {showSearch && (
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Search className="w-4 h-4 mr-2 text-primary-600" />
            Rechercher
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Info des filtres actifs */}
      {(selectedClass || searchTerm) && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Filtres actifs :</span>
                {selectedClass && <span> Classe "{selectedClass}"</span>}
                {selectedClass && searchTerm && <span> •</span>}
                {searchTerm && <span> Recherche "{searchTerm}"</span>}
              </p>
            </div>
            <button
              onClick={() => {
                onClassChange('');
                onSearchChange('');
              }}
              className="flex-shrink-0 ml-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassFilter;
