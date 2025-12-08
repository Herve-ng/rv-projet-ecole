import { create } from 'zustand';

export const useTeachersStore = create((set) => ({
  teachers: [],
  loading: false,
  error: null,

  setTeachers: (teachers) => set({ teachers }),

  addTeacher: (teacher) =>
    set((state) => ({
      teachers: [...state.teachers, teacher],
    })),

  updateTeacher: (id, updatedTeacher) =>
    set((state) => ({
      teachers: state.teachers.map((teacher) =>
        teacher.id === id ? { ...teacher, ...updatedTeacher } : teacher
      ),
    })),

  deleteTeacher: (id) =>
    set((state) => ({
      teachers: state.teachers.filter((teacher) => teacher.id !== id),
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));
