import api from './api';
import { mockUsers } from '@/data/mockData';

// Mode de développement - utilise des données fictives
const DEV_MODE = true;

export const authService = {
  // Connexion
  login: async (email, password) => {
    if (DEV_MODE) {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));

      // Vérifier les identifiants
      const user = mockUsers.find(u => u.email === email && u.password === password);

      if (!user) {
        throw {
          response: {
            data: {
              message: 'Email ou mot de passe incorrect'
            }
          }
        };
      }

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        token: 'mock-jwt-token-' + user.id
      };
    }

    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Déconnexion
  logout: async () => {
    if (DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }

    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Récupérer le profil utilisateur
  getProfile: async () => {
    if (DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockUsers[0];
    }

    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Changer le mot de passe
  changePassword: async (oldPassword, newPassword) => {
    if (DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'Mot de passe modifié avec succès' };
    }

    const response = await api.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};
