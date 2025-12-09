import { create } from 'zustand';

const predefinedClasses = [
  { id: 1, name: 'CI', level: 'Primaire', section: 'Général', capacity: 40 },
  { id: 2, name: 'CP', level: 'Primaire', section: 'Général', capacity: 40 },
  { id: 3, name: 'CE1', level: 'Primaire', section: 'Général', capacity: 40 },
  { id: 4, name: 'CE2', level: 'Primaire', section: 'Général', capacity: 40 },
  { id: 5, name: 'CM1', level: 'Primaire', section: 'Général', capacity: 40 },
  { id: 6, name: 'CM2', level: 'Primaire', section: 'Général', capacity: 40 },
  { id: 7, name: '6ème', level: 'Collège', section: 'Général', capacity: 45 },
  { id: 8, name: '5ème', level: 'Collège', section: 'Général', capacity: 45 },
  { id: 9, name: '4ème', level: 'Collège', section: 'Général', capacity: 45 },
  { id: 10, name: '3ème', level: 'Collège', section: 'Général', capacity: 45 },
  { id: 11, name: 'Seconde', level: 'Lycée', section: 'Général', capacity: 40 },
  { id: 12, name: 'Première L', level: 'Lycée', section: 'Littéraire', capacity: 35 },
  { id: 13, name: 'Première S', level: 'Lycée', section: 'Scientifique', capacity: 35 },
  { id: 14, name: 'Terminale L', level: 'Lycée', section: 'Littéraire', capacity: 35 },
  { id: 15, name: 'Terminale S', level: 'Lycée', section: 'Scientifique', capacity: 35 },
];

export const useClassesStore = create((set) => ({
  classes: predefinedClasses,

  addClass: (newClass) => {
    set((state) => ({
      classes: [...state.classes, { ...newClass, id: Date.now() }],
    }));
  },

  updateClass: (id, updatedClass) => {
    set((state) => ({
      classes: state.classes.map((c) => (c.id === id ? { ...c, ...updatedClass } : c)),
    }));
  },

  deleteClass: (id) => {
    set((state) => ({
      classes: state.classes.filter((c) => c.id !== id),
    }));
  },

  getClassByName: (className) => {
    const state = useClassesStore.getState();
    return state.classes.find(c => c.name === className);
  },

  getAllClasses: () => {
    const state = useClassesStore.getState();
    return state.classes;
  },
}));
