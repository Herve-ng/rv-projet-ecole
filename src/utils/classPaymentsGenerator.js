import jsPDF from 'jspdf';

/**
 * Génère une liste récapitulative des paiements par classe en PDF
 * @param {Object} params - Paramètres de génération
 * @param {string} params.className - Nom de la classe
 * @param {Array} params.payments - Liste des paiements filtrés
 * @param {string} params.period - Période sélectionnée
 * @param {string} params.schoolYear - Année scolaire
 */
export const generateClassPaymentsList = ({ className, payments, period, schoolYear = '2024-2025' }) => {
  const doc = new jsPDF();

  // Couleurs
  const primaryColor = [14, 165, 233];
  const grayColor = [107, 114, 128];
  const darkColor = [17, 24, 39];
  const lightGray = [243, 244, 246];

  // Configuration
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - (2 * margin);

  // En-tête avec bannière
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 50, 'F');

  // Logo et nom de l'établissement
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('ÉCOLE MANAGER', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Système de Gestion Scolaire', pageWidth / 2, 28, { align: 'center' });

  doc.setFontSize(11);
  doc.text(`Année Scolaire ${schoolYear}`, pageWidth / 2, 38, { align: 'center' });

  // Titre du document
  let currentY = 65;
  doc.setTextColor(...darkColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('LISTE RÉCAPITULATIVE DES PAIEMENTS', pageWidth / 2, currentY, { align: 'center' });

  // Classe et période
  currentY += 12;
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text(`Classe : ${className}`, pageWidth / 2, currentY, { align: 'center' });

  currentY += 8;
  doc.setFontSize(11);
  doc.setTextColor(...grayColor);
  doc.text(`Période : ${period}`, pageWidth / 2, currentY, { align: 'center' });

  // Ligne de séparation
  currentY += 5;
  doc.setDrawColor(...grayColor);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  // Informations générales
  currentY += 10;
  doc.setFontSize(10);
  doc.setTextColor(...darkColor);
  doc.text(`Nombre d'élèves : ${payments.length}`, margin, currentY);
  doc.text(`Date d'édition : ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - margin, currentY, { align: 'right' });

  // En-tête du tableau
  currentY += 10;
  const tableStartY = currentY;

  // Colonnes du tableau
  const cols = {
    num: { x: margin, width: 15, label: 'N°' },
    student: { x: margin + 15, width: 55, label: 'Nom et Prénom' },
    type: { x: margin + 70, width: 45, label: 'Type de Frais' },
    amount: { x: margin + 115, width: 30, label: 'Montant' },
    date: { x: margin + 145, width: 30, label: 'Date' },
  };

  // Fond de l'en-tête
  doc.setFillColor(...primaryColor);
  doc.rect(margin, currentY, contentWidth, 10, 'F');

  // Texte de l'en-tête
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');

  Object.values(cols).forEach(col => {
    doc.text(col.label, col.x + 2, currentY + 7);
  });

  currentY += 10;

  // Lignes du tableau
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  let totalAmount = 0;
  let rowColor = true;

  payments.forEach((payment, index) => {
    // Vérifier si on doit ajouter une nouvelle page
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }

    // Alternance de couleur de fond
    if (rowColor) {
      doc.setFillColor(...lightGray);
      doc.rect(margin, currentY, contentWidth, 8, 'F');
    }
    rowColor = !rowColor;

    // Contenu de la ligne
    doc.setTextColor(...darkColor);

    // N°
    doc.text(String(index + 1), cols.num.x + 2, currentY + 5.5);

    // Nom et prénom
    const studentName = payment.studentName || 'N/A';
    doc.text(studentName, cols.student.x + 2, currentY + 5.5);

    // Type de frais
    const paymentType = payment.type || 'N/A';
    doc.text(paymentType, cols.type.x + 2, currentY + 5.5);

    // Montant
    const amount = payment.amount || 0;
    totalAmount += amount;
    doc.text(`${amount.toLocaleString()} F`, cols.amount.x + 2, currentY + 5.5);

    // Date
    const paymentDate = new Date(payment.date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    doc.text(paymentDate, cols.date.x + 2, currentY + 5.5);

    currentY += 8;
  });

  // Ligne de séparation avant total
  doc.setDrawColor(...grayColor);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  // Total
  currentY += 8;
  doc.setFillColor(220, 252, 231); // bg-green-100
  doc.rect(margin + 115, currentY - 6, contentWidth - 115, 10, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('TOTAL CLASSE :', margin + 70, currentY);

  doc.setTextColor(22, 163, 74); // text-green-600
  doc.setFontSize(12);
  doc.text(`${totalAmount.toLocaleString()} FCFA`, cols.amount.x + 2, currentY);

  // Statistiques supplémentaires
  currentY += 15;
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.setFont('helvetica', 'normal');

  const stats = getPaymentStats(payments);
  doc.text(`Moyenne par élève : ${stats.average.toLocaleString()} FCFA`, margin, currentY);
  currentY += 5;
  doc.text(`Nombre de types de frais : ${stats.uniqueTypes}`, margin, currentY);

  // Zone signature
  currentY += 20;
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  doc.setDrawColor(...grayColor);
  doc.setLineWidth(0.3);

  // Responsable financier
  doc.text('Le Responsable Financier', margin, currentY);
  doc.line(margin, currentY + 20, margin + 60, currentY + 20);
  doc.text('Date : ________________', margin, currentY + 25);

  // Directeur
  doc.text('Le Directeur', pageWidth - margin - 60, currentY);
  doc.line(pageWidth - margin - 60, currentY + 20, pageWidth - margin, currentY + 20);
  doc.text('Cachet et Signature', pageWidth - margin - 60, currentY + 25);

  // Pied de page
  const footerY = 285;
  doc.setDrawColor(...grayColor);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.setFont('helvetica', 'italic');
  doc.text('École Manager - Système de Gestion Scolaire', margin, footerY + 5);
  doc.text(`Page 1/${doc.getNumberOfPages()}`, pageWidth - margin, footerY + 5, { align: 'right' });

  // Télécharger le PDF
  const fileName = `liste_paiements_${className.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

/**
 * Calcule des statistiques sur les paiements
 */
const getPaymentStats = (payments) => {
  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const average = payments.length > 0 ? Math.round(total / payments.length) : 0;
  const uniqueTypes = new Set(payments.map(p => p.type)).size;

  return {
    total,
    average,
    uniqueTypes
  };
};

/**
 * Génère un rapport détaillé multi-classes
 * @param {Object} params - Paramètres
 * @param {Array} params.classesSummary - Résumé par classe
 * @param {string} params.period - Période
 * @param {string} params.schoolYear - Année scolaire
 */
export const generateMultiClassReport = ({ classesSummary, period, schoolYear = '2024-2025' }) => {
  const doc = new jsPDF();

  const primaryColor = [14, 165, 233];
  const grayColor = [107, 114, 128];
  const darkColor = [17, 24, 39];

  const pageWidth = 210;
  const margin = 20;

  // En-tête
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('RAPPORT GLOBAL DES PAIEMENTS', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Année Scolaire ${schoolYear}`, pageWidth / 2, 30, { align: 'center' });
  doc.text(`Période : ${period}`, pageWidth / 2, 37, { align: 'center' });

  let currentY = 60;

  // Résumé par classe
  classesSummary.forEach((classData, index) => {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`${classData.className}`, margin, currentY);

    currentY += 8;
    doc.setFontSize(10);
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre d'élèves : ${classData.studentCount}`, margin + 5, currentY);
    doc.text(`Total : ${classData.total.toLocaleString()} FCFA`, margin + 80, currentY);
    doc.text(`Moyenne : ${classData.average.toLocaleString()} FCFA`, margin + 140, currentY);

    currentY += 8;
  });

  // Total général
  const grandTotal = classesSummary.reduce((sum, c) => sum + c.total, 0);
  currentY += 10;

  doc.setFillColor(220, 252, 231);
  doc.rect(margin, currentY - 5, pageWidth - 2 * margin, 12, 'F');

  doc.setFontSize(14);
  doc.setTextColor(22, 163, 74);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL GÉNÉRAL :', margin + 5, currentY + 3);
  doc.text(`${grandTotal.toLocaleString()} FCFA`, pageWidth - margin - 5, currentY + 3, { align: 'right' });

  const fileName = `rapport_global_paiements_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
