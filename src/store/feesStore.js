import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Store pour gérer les frais scolaires et les paiements partiels
 * Un "fee" représente le montant total dû par un élève pour un type de frais donné
 * Les paiements partiels sont enregistrés dans un tableau
 */
export const useFeesStore = create(
  persist(
    (set, get) => ({
      // Liste des frais scolaires (ce que chaque élève doit payer)
      studentFees: [],

      // Définir les frais scolaires pour tous les étudiants
      setStudentFees: (fees) => set({ studentFees: fees }),

      // Ajouter ou mettre à jour un frais scolaire pour un étudiant
      setStudentFee: (fee) => set((state) => {
        const existingIndex = state.studentFees.findIndex(
          f => f.studentId === fee.studentId && f.type === fee.type
        );

        if (existingIndex >= 0) {
          const updated = [...state.studentFees];
          updated[existingIndex] = fee;
          return { studentFees: updated };
        } else {
          return { studentFees: [...state.studentFees, fee] };
        }
      }),

      // Ajouter un paiement partiel à un frais scolaire
      addPaymentToFee: (studentId, feeType, payment) => set((state) => {
        const updatedFees = state.studentFees.map(fee => {
          if (fee.studentId === studentId && fee.type === feeType) {
            return {
              ...fee,
              payments: [...(fee.payments || []), payment],
              totalPaid: (fee.totalPaid || 0) + payment.amount,
              lastPaymentDate: payment.date,
              status: ((fee.totalPaid || 0) + payment.amount) >= fee.totalAmount ? 'Payé' : 'En attente'
            };
          }
          return fee;
        });

        return { studentFees: updatedFees };
      }),

      // Obtenir tous les frais en attente (avec paiement partiel)
      getPendingFees: () => {
        return get().studentFees.filter(fee =>
          fee.status === 'En attente' && (fee.totalPaid || 0) > 0
        );
      },

      // Obtenir tous les frais payés
      getPaidFees: () => {
        return get().studentFees.filter(fee => fee.status === 'Payé');
      },

      // Obtenir les frais d'un étudiant spécifique
      getStudentFees: (studentId) => {
        return get().studentFees.filter(fee => fee.studentId === studentId);
      },

      // Obtenir le montant restant pour un frais
      getRemainingAmount: (studentId, feeType) => {
        const fee = get().studentFees.find(
          f => f.studentId === studentId && f.type === feeType
        );
        if (!fee) return 0;
        return fee.totalAmount - (fee.totalPaid || 0);
      },

      // Supprimer un frais
      deleteFee: (feeId) => set((state) => ({
        studentFees: state.studentFees.filter(f => f.id !== feeId)
      })),
    }),
    {
      name: 'fees-storage',
    }
  )
);
