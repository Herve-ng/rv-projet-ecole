import api from './api';
import { mockStudents } from '@/data/mockData';

const DEV_MODE = true;
let students = [...mockStudents];

export const studentsService = {
  // Récupérer tous les élèves
  getAllStudents: async () => {
    if (DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return students;
    }

    const response = await api.get('/students');
    return response.data;
  },

  // Récupérer un élève par ID
  getStudentById: async (id) => {
    if (DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return students.find(s => s.id === id);
    }

    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  // Créer un nouvel élève
  createStudent: async (studentData) => {
    if (DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const newStudent = {
        ...studentData,
        id: Date.now()
      };
      students.push(newStudent);
      return newStudent;
    }

    const response = await api.post('/students', studentData);
    return response.data;
  },

  // Mettre à jour un élève
  updateStudent: async (id, studentData) => {
    if (DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = students.findIndex(s => s.id === id);
      if (index !== -1) {
        students[index] = { ...students[index], ...studentData };
        return students[index];
      }
      throw new Error('Élève non trouvé');
    }

    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },

  // Supprimer un élève
  deleteStudent: async (id) => {
    if (DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      students = students.filter(s => s.id !== id);
      return { success: true };
    }

    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  // Rechercher des élèves
  searchStudents: async (query) => {
    if (DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return students.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(query.toLowerCase())
      );
    }

    const response = await api.get(`/students/search?q=${query}`);
    return response.data;
  },
};
