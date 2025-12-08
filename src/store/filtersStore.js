import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Store global pour gérer les filtres dans toute l'application
 * Persiste les préférences de filtrage de l'utilisateur
 */
export const useFiltersStore = create(
  persist(
    (set) => ({
      // Filtres actifs
      selectedClass: '',
      searchTerm: '',
      viewMode: 'grouped', // 'grouped' ou 'list'

      // Actions
      setSelectedClass: (className) => set({ selectedClass: className }),

      setSearchTerm: (term) => set({ searchTerm: term }),

      setViewMode: (mode) => set({ viewMode: mode }),

      resetFilters: () => set({
        selectedClass: '',
        searchTerm: '',
      }),

      // Helpers pour filtrage
      applyFilters: (data, getItemClass, getItemName) => {
        const state = useFiltersStore.getState();
        let filtered = [...data];

        // Filtre par classe
        if (state.selectedClass) {
          filtered = filtered.filter(item =>
            getItemClass(item) === state.selectedClass
          );
        }

        // Filtre par recherche
        if (state.searchTerm) {
          const term = state.searchTerm.toLowerCase();
          filtered = filtered.filter(item =>
            getItemName(item).toLowerCase().includes(term)
          );
        }

        return filtered;
      },
    }),
    {
      name: 'filters-storage',
      partialize: (state) => ({
        viewMode: state.viewMode,
      }),
    }
  )
);

/**
 * Hook personnalisé pour obtenir les classes uniques
 */
export const useUniqueClasses = (data, getItemClass) => {
  if (!data || data.length === 0) return [];

  const classesMap = data.reduce((acc, item) => {
    const className = getItemClass(item);
    if (!acc[className]) {
      acc[className] = { name: className, count: 0 };
    }
    acc[className].count++;
    return acc;
  }, {});

  return Object.values(classesMap).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};
