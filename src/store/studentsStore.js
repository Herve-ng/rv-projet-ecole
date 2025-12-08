import { create } from 'zustand';

export const useStudentsStore = create((set) => ({
  students: [],
  loading: false,
  error: null,

  setStudents: (students) => set({ students }),

  addStudent: (student) =>
    set((state) => ({
      students: [...state.students, student],
    })),

  updateStudent: (id, updatedStudent) =>
    set((state) => ({
      students: state.students.map((student) =>
        student.id === id ? { ...student, ...updatedStudent } : student
      ),
    })),

  deleteStudent: (id) =>
    set((state) => ({
      students: state.students.filter((student) => student.id !== id),
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));
