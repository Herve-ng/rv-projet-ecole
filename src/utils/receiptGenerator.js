import jsPDF from 'jspdf';

/**
 * Génère un reçu de paiement en PDF
 * @param {Object} payment - Données du paiement
 * @param {string} payment.id - ID du paiement
 * @param {string} payment.studentName - Nom de l'élève
 * @param {string} payment.class - Classe de l'élève
 * @param {number} payment.amount - Montant payé
 * @param {string} payment.date - Date du paiement
 * @param {string} payment.type - Type de paiement
 * @param {string} payment.method - Méthode de paiement
 */
export const generateReceiptPDF = (payment) => {
  // Créer un nouveau document PDF (format A4)
  const doc = new jsPDF();

  // Couleurs
  const primaryColor = [14, 165, 233]; // primary-600
  const grayColor = [107, 114, 128];
  const darkColor = [17, 24, 39];

  // En-tête avec logo et titre
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');

  // Titre
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ÉCOLE MANAGER', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Système de Gestion Scolaire', 105, 28, { align: 'center' });

  // Titre du document
  doc.setTextColor(...darkColor);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('REÇU DE PAIEMENT', 105, 55, { align: 'center' });

  // Ligne de séparation
  doc.setDrawColor(...grayColor);
  doc.setLineWidth(0.5);
  doc.line(20, 62, 190, 62);

  // Informations du reçu
  doc.setFontSize(11);
  doc.setTextColor(...grayColor);
  doc.setFont('helvetica', 'normal');

  const startY = 75;
  const lineHeight = 8;

  // Numéro de reçu et date
  doc.text(`Numéro de reçu: #${payment.id}`, 20, startY);
  doc.text(`Date: ${new Date(payment.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })}`, 140, startY);

  // Section Informations de l'élève
  let currentY = startY + 15;

  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS DE L\'ÉLÈVE', 20, currentY);

  currentY += 10;
  doc.setFontSize(11);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'normal');

  doc.text('Nom complet:', 20, currentY);
  doc.setFont('helvetica', 'bold');
  doc.text(payment.studentName, 60, currentY);

  currentY += lineHeight;
  doc.setFont('helvetica', 'normal');
  doc.text('Classe:', 20, currentY);
  doc.setFont('helvetica', 'bold');
  doc.text(payment.class, 60, currentY);

  // Section Détails du paiement
  currentY += 20;

  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('DÉTAILS DU PAIEMENT', 20, currentY);

  currentY += 10;
  doc.setFontSize(11);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'normal');

  doc.text('Type de paiement:', 20, currentY);
  doc.setFont('helvetica', 'bold');
  doc.text(payment.type, 70, currentY);

  currentY += lineHeight;
  doc.setFont('helvetica', 'normal');
  doc.text('Méthode de paiement:', 20, currentY);
  doc.setFont('helvetica', 'bold');
  doc.text(payment.method, 70, currentY);

  // Cadre pour le montant
  currentY += 15;
  doc.setFillColor(240, 249, 255); // bg-blue-50
  doc.roundedRect(20, currentY, 170, 25, 3, 3, 'F');

  doc.setFontSize(12);
  doc.setTextColor(...grayColor);
  doc.setFont('helvetica', 'normal');
  doc.text('MONTANT PAYÉ', 105, currentY + 8, { align: 'center' });

  doc.setFontSize(20);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`${payment.amount.toLocaleString()} FCFA`, 105, currentY + 18, { align: 'center' });

  // Statut
  currentY += 35;
  doc.setFillColor(220, 252, 231); // bg-green-100
  doc.roundedRect(70, currentY, 70, 12, 3, 3, 'F');

  doc.setFontSize(11);
  doc.setTextColor(22, 163, 74); // text-green-600
  doc.setFont('helvetica', 'bold');
  doc.text('✓ PAIEMENT VALIDÉ', 105, currentY + 8, { align: 'center' });

  // Mentions légales
  currentY += 30;
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.setFont('helvetica', 'italic');

  const legalText = 'Ce reçu atteste du paiement effectué et fait foi de transaction.';
  doc.text(legalText, 105, currentY, { align: 'center' });

  currentY += 5;
  doc.text('Merci pour votre confiance.', 105, currentY, { align: 'center' });

  // Pied de page
  doc.setDrawColor(...grayColor);
  doc.setLineWidth(0.3);
  doc.line(20, 270, 190, 270);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('École Manager - Système de Gestion Scolaire', 20, 280);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 190, 280, { align: 'right' });

  // Signature/Cachet simulé
  const signatureY = 230;
  doc.setFontSize(10);
  doc.setTextColor(...darkColor);
  doc.text('Signature et cachet', 140, signatureY);

  // Cadre pour signature
  doc.setDrawColor(...grayColor);
  doc.rect(140, signatureY + 5, 45, 20);

  // Télécharger le PDF
  const fileName = `recu_${payment.studentName.replace(/\s+/g, '_')}_${payment.id}.pdf`;
  doc.save(fileName);
};

/**
 * Prévisualiser le reçu (ouvre dans un nouvel onglet)
 */
export const previewReceiptPDF = (payment) => {
  const doc = new jsPDF();
  // ... (même code que generateReceiptPDF)

  // Ouvrir dans un nouvel onglet au lieu de télécharger
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};
