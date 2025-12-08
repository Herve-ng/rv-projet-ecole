import api from './api';
import { mockTeachers } from '@/data/mockData';

const DEV_MODE = true;
let teachers = [...mockTeachers];

export const teachersService = {
  // Récupérer tous les enseignants
  getAllTeachers: async () => {
    if (DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return teachers;
    }

    const response = await api.get('/teachers');
    return response.data;
  },

  // Récupérer un enseignant par ID
  getTeacherById: async (id) => {
    if (DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return teachers.find(t => t.id === id);
    }

    const response = await api.get(`/teachers/${id}`);
    return response.data;
  },

  // Créer un nouvel enseignant
  createTeacher: async (teacherData) => {
    if (DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const newTeacher = {
        ...teacherData,
        id: Date.now()
      };
      teachers.push(newTeacher);
      return newTeacher;
    }

    const response = await api.post('/teachers', teacherData);
    return response.data;
  },

  // Mettre à jour un enseignant
  updateTeacher: async (id, teacherData) => {
    if (DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = teachers.findIndex(t => t.id === id);
      if (index !== -1) {
        teachers[index] = { ...teachers[index], ...teacherData };
        return teachers[index];
      }
      throw new Error('Enseignant non trouvé');
    }

    const response = await api.put(`/teachers/${id}`, teacherData);
    return response.data;
  },

  // Supprimer un enseignant
  deleteTeacher: async (id) => {
    if (DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      teachers = teachers.filter(t => t.id !== id);
      return { success: true };
    }

    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  },
};
