import { useEffect } from 'react';
import { useStudentsStore } from '@/store/studentsStore';
import { useFeesStore } from '@/store/feesStore';
import { studentsService } from '@/services/studentsService';
import { mockStudentFees } from '@/data/mockFees';

/**
 * Hook personnalisé pour initialiser les données au démarrage de l'application
 */
export const useInitializeData = () => {
  const { setStudents } = useStudentsStore();
  const { studentFees, setStudentFees } = useFeesStore();

  useEffect(() => {
    // Charger les étudiants
    const loadStudents = async () => {
      try {
        const data = await studentsService.getAllStudents();
        setStudents(data);
      } catch (error) {
        console.error('Erreur lors du chargement des élèves:', error);
      }
    };

    // Charger les frais scolaires (en mode DEV, on utilise les données mockées)
    const loadFees = () => {
      if (studentFees.length === 0) {
        // Initialiser seulement si vide (première fois)
        setStudentFees(mockStudentFees);
      }
    };

    loadStudents();
    loadFees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Exécuter une seule fois au montage
};
