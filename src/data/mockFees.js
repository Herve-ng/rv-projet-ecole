/**
 * Données fictives pour les frais scolaires et paiements partiels
 */

// Importer les étudiants fictifs pour obtenir les IDs
import { mockStudents } from './mockData';

// Générer des frais scolaires pour les étudiants
export const mockStudentFees = [
  // Frais en attente avec paiements partiels
  {
    id: 1,
    studentId: 1, // Jean Dupont
    type: 'Frais de scolarité',
    totalAmount: 50000,
    totalPaid: 20000,
    status: 'En attente',
    lastPaymentDate: '2024-11-15',
    payments: [
      {
        id: 1,
        amount: 10000,
        method: 'Espèces',
        date: '2024-10-01',
        timestamp: '2024-10-01T10:00:00Z'
      },
      {
        id: 2,
        amount: 10000,
        method: 'Mobile Money',
        date: '2024-11-15',
        timestamp: '2024-11-15T14:30:00Z'
      }
    ]
  },
  {
    id: 2,
    studentId: 2, // Marie Martin
    type: 'Frais de scolarité',
    totalAmount: 50000,
    totalPaid: 35000,
    status: 'En attente',
    lastPaymentDate: '2024-11-20',
    payments: [
      {
        id: 1,
        amount: 25000,
        method: 'Virement',
        date: '2024-10-05',
        timestamp: '2024-10-05T09:00:00Z'
      },
      {
        id: 2,
        amount: 10000,
        method: 'Espèces',
        date: '2024-11-20',
        timestamp: '2024-11-20T11:15:00Z'
      }
    ]
  },
  {
    id: 3,
    studentId: 4, // Amadou Diallo
    type: 'Frais d\'examen',
    totalAmount: 30000,
    totalPaid: 15000,
    status: 'En attente',
    lastPaymentDate: '2024-11-10',
    payments: [
      {
        id: 1,
        amount: 15000,
        method: 'Mobile Money',
        date: '2024-11-10',
        timestamp: '2024-11-10T16:45:00Z'
      }
    ]
  },
  {
    id: 4,
    studentId: 5, // Fatou Sow
    type: 'Frais de scolarité',
    totalAmount: 50000,
    totalPaid: 10000,
    status: 'En attente',
    lastPaymentDate: '2024-10-15',
    payments: [
      {
        id: 1,
        amount: 10000,
        method: 'Espèces',
        date: '2024-10-15',
        timestamp: '2024-10-15T13:20:00Z'
      }
    ]
  },

  // Frais complètement payés
  {
    id: 5,
    studentId: 3, // Pierre Dubois
    type: 'Frais de scolarité',
    totalAmount: 50000,
    totalPaid: 50000,
    status: 'Payé',
    lastPaymentDate: '2024-11-01',
    payments: [
      {
        id: 1,
        amount: 30000,
        method: 'Virement',
        date: '2024-09-01',
        timestamp: '2024-09-01T10:00:00Z'
      },
      {
        id: 2,
        amount: 20000,
        method: 'Espèces',
        date: '2024-11-01',
        timestamp: '2024-11-01T15:00:00Z'
      }
    ]
  },

  // Frais non commencés (aucun paiement)
  {
    id: 6,
    studentId: 1, // Jean Dupont
    type: 'Fournitures scolaires',
    totalAmount: 15000,
    totalPaid: 0,
    status: 'Non payé',
    lastPaymentDate: null,
    payments: []
  },
  {
    id: 7,
    studentId: 4, // Amadou Diallo
    type: 'Frais de scolarité',
    totalAmount: 50000,
    totalPaid: 45000,
    status: 'En attente',
    lastPaymentDate: '2024-12-01',
    payments: [
      {
        id: 1,
        amount: 25000,
        method: 'Espèces',
        date: '2024-10-01',
        timestamp: '2024-10-01T09:00:00Z'
      },
      {
        id: 2,
        amount: 20000,
        method: 'Mobile Money',
        date: '2024-12-01',
        timestamp: '2024-12-01T14:30:00Z'
      }
    ]
  }
];
