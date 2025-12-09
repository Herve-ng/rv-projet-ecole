import { create } from 'zustand';

export const useArchiveStore = create((set, get) => ({
  archivedStudents: [],
  archivedTeachers: [],
  archivedPayments: [],

  // Archiver un élève
  archiveStudent: (student) => {
    set((state) => ({
      archivedStudents: [
        ...state.archivedStudents,
        {
          ...student,
          archivedAt: new Date().toISOString(),
          archivedReason: student.archivedReason || 'Non spécifiée',
        },
      ],
    }));
  },

  // Restaurer un élève
  restoreStudent: (studentId) => {
    set((state) => ({
      archivedStudents: state.archivedStudents.filter((s) => s.id !== studentId),
    }));
  },

  // Archiver un enseignant
  archiveTeacher: (teacher) => {
    set((state) => ({
      archivedTeachers: [
        ...state.archivedTeachers,
        {
          ...teacher,
          archivedAt: new Date().toISOString(),
          archivedReason: teacher.archivedReason || 'Non spécifiée',
        },
      ],
    }));
  },

  // Restaurer un enseignant
  restoreTeacher: (teacherId) => {
    set((state) => ({
      archivedTeachers: state.archivedTeachers.filter((t) => t.id !== teacherId),
    }));
  },

  // Archiver un paiement
  archivePayment: (payment) => {
    set((state) => ({
      archivedPayments: [
        ...state.archivedPayments,
        {
          ...payment,
          archivedAt: new Date().toISOString(),
        },
      ],
    }));
  },

  // Supprimer définitivement de l'archive
  deleteFromArchive: (type, id) => {
    if (type === 'student') {
      set((state) => ({
        archivedStudents: state.archivedStudents.filter((s) => s.id !== id),
      }));
    } else if (type === 'teacher') {
      set((state) => ({
        archivedTeachers: state.archivedTeachers.filter((t) => t.id !== id),
      }));
    } else if (type === 'payment') {
      set((state) => ({
        archivedPayments: state.archivedPayments.filter((p) => p.id !== id),
      }));
    }
  },

  // Statistiques des archives
  getArchiveStats: () => {
    const state = get();
    return {
      totalStudents: state.archivedStudents.length,
      totalTeachers: state.archivedTeachers.length,
      totalPayments: state.archivedPayments.length,
    };
  },
}));
