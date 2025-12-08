import api from './api';

export const paymentsService = {
  // Récupérer tous les paiements
  getAllPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  // Récupérer un paiement par ID
  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // Créer un nouveau paiement
  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  // Récupérer l'historique des paiements d'un élève
  getStudentPayments: async (studentId) => {
    const response = await api.get(`/payments/student/${studentId}`);
    return response.data;
  },

  // Générer un reçu de paiement
  generateReceipt: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}/receipt`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Marquer un paiement comme confirmé
  confirmPayment: async (id) => {
    const response = await api.put(`/payments/${id}/confirm`);
    return response.data;
  },
};
