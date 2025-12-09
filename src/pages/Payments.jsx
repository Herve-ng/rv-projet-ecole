import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import ClassFilter from '@/components/common/ClassFilter';
import GroupedByClass from '@/components/common/GroupedByClass';
import PendingPayments from '@/components/payments/PendingPayments';
import { Plus, Download, Eye, CreditCard, CheckCircle, Clock, XCircle, FileText, List, Grid } from 'lucide-react';
import { generateReceiptPDF } from '@/utils/receiptGenerator';
import { generateClassPaymentsList } from '@/utils/classPaymentsGenerator';
import ClassReportModal from '@/components/payments/ClassReportModal';
import { useFiltersStore, useUniqueClasses } from '@/store/filtersStore';
import { useInitializeData } from '@/hooks/useInitializeData';

const Payments = () => {
  // Initialiser les données au montage du composant
  useInitializeData();

  const { selectedClass, searchTerm, viewMode, setSelectedClass, setSearchTerm, setViewMode } = useFiltersStore();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'paid'
  const [payments, setPayments] = useState([
    {
      id: 1,
      studentName: 'Jean Dupont',
      class: 'Terminale A',
      amount: 25000,
      date: '2024-12-01',
      type: 'Frais de scolarité',
      status: 'Payé',
      method: 'Espèces',
    },
    {
      id: 2,
      studentName: 'Marie Martin',
      class: 'Terminale A',
      amount: 25000,
      date: '2024-12-03',
      type: 'Frais de scolarité',
      status: 'Payé',
      method: 'Virement',
    },
    {
      id: 3,
      studentName: 'Pierre Dubois',
      class: 'Terminale A',
      amount: 25000,
      date: '2024-12-02',
      type: 'Frais de scolarité',
      status: 'Payé',
      method: 'Mobile Money',
    },
    {
      id: 4,
      studentName: 'Amadou Diallo',
      class: '1ère S',
      amount: 25000,
      date: '2024-12-04',
      type: 'Frais de scolarité',
      status: 'Payé',
      method: 'Espèces',
    },
    {
      id: 5,
      studentName: 'Fatou Sow',
      class: '1ère S',
      amount: 20000,
      date: '2024-12-05',
      type: 'Frais d\'examen',
      status: 'Payé',
      method: 'Virement',
    },
    {
      id: 6,
      studentName: 'Moussa Kane',
      class: '2nde C',
      amount: 25000,
      date: '2024-12-06',
      type: 'Frais de scolarité',
      status: 'Payé',
      method: 'Espèces',
    },
    {
      id: 7,
      studentName: 'Aissatou Ba',
      class: '2nde C',
      amount: 15000,
      date: '2024-12-07',
      type: 'Fournitures scolaires',
      status: 'Payé',
      method: 'Mobile Money',
    },
    {
      id: 8,
      studentName: 'Ibrahima Sarr',
      class: 'Terminale A',
      amount: 10000,
      date: '2024-12-08',
      type: 'Transport',
      status: 'Payé',
      method: 'Espèces',
    },
    {
      id: 9,
      studentName: 'Sophie Laurent',
      class: '1ère S',
      amount: 25000,
      date: '2024-12-15',
      type: 'Frais de scolarité',
      status: 'En attente',
      method: '-',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingPayment, setViewingPayment] = useState(null);
  const [isClassReportModalOpen, setIsClassReportModalOpen] = useState(false);
  const [showPrintOptions, setShowPrintOptions] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '',
    class: '',
    amount: '',
    type: 'Frais de scolarité',
    method: 'Espèces',
    date: new Date().toISOString().split('T')[0],
  });

  const [filter, setFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('current'); // 'current', 'all'

  const handleOpenModal = () => {
    setFormData({
      studentName: '',
      class: '',
      amount: '',
      type: 'Frais de scolarité',
      method: 'Espèces',
      date: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPayment = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
      status: 'Payé',
    };

    setPayments([newPayment, ...payments]);
    handleCloseModal();

    // Afficher les options d'impression après création
    setShowPrintOptions(newPayment);
  };

  const generateReceipt = (payment) => {
    // Génère et télécharge le reçu PDF individuel
    generateReceiptPDF(payment);
  };

  const handleGenerateClassReport = (params) => {
    // Génère la liste récapitulative par classe
    generateClassPaymentsList(params);
  };

  const viewPaymentDetails = (payment) => {
    setViewingPayment(payment);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Payé':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'En attente':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Annulé':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Payé': 'bg-green-100 text-green-800',
      'En attente': 'bg-yellow-100 text-yellow-800',
      'Annulé': 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>
        {status}
      </span>
    );
  };

  // Obtenir les classes uniques
  const classes = useUniqueClasses(payments, (p) => p.class);

  // Filtrer les paiements par statut, classe, recherche et mois
  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = filter === 'all' || payment.status === filter;
    const matchesClass = !selectedClass || payment.class === selectedClass;
    const matchesSearch = !searchTerm ||
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtrer par mois
    let matchesMonth = true;
    if (monthFilter === 'current') {
      const paymentDate = new Date(payment.date);
      const currentDate = new Date();
      matchesMonth = paymentDate.getMonth() === currentDate.getMonth() &&
                     paymentDate.getFullYear() === currentDate.getFullYear();
    }

    return matchesStatus && matchesClass && matchesSearch && matchesMonth;
  });

  // Calculer les statistiques pour le mois en cours
  const currentMonthPayments = payments.filter((payment) => {
    const paymentDate = new Date(payment.date);
    const currentDate = new Date();
    return paymentDate.getMonth() === currentDate.getMonth() &&
           paymentDate.getFullYear() === currentDate.getFullYear();
  });

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const currentMonthTotal = currentMonthPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const currentMonthCount = currentMonthPayments.length;

  return (
    <Layout title="Gestion des Paiements">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg border border-secondary-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 font-semibold uppercase tracking-wide">Total des paiements</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{totalAmount.toLocaleString()} FCFA</p>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-xl shadow-md">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-secondary-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 font-semibold uppercase tracking-wide">Paiements du mois</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-secondary-700 to-primary-600 bg-clip-text text-transparent">{currentMonthCount}</p>
              <p className="text-xs text-gray-500 mt-1">{currentMonthTotal.toLocaleString()} FCFA</p>
            </div>
            <div className="bg-gradient-to-br from-secondary-400 to-secondary-600 p-3 rounded-xl shadow-md">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-secondary-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 font-semibold uppercase tracking-wide">En attente</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent">
                {payments.filter((p) => p.status === 'En attente').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-xl shadow-md">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Onglets de navigation */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-secondary-100 mb-6 overflow-hidden">
        <div className="flex border-b-2 border-secondary-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'all'
                ? 'border-b-4 border-primary-600 text-primary-600 bg-gradient-to-b from-primary-50 to-transparent'
                : 'text-gray-600 hover:text-primary-600 hover:bg-secondary-50/50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Tous les paiements</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 border-l-2 border-secondary-200 ${
              activeTab === 'pending'
                ? 'border-b-4 border-yellow-600 text-yellow-700 bg-gradient-to-b from-yellow-50 to-transparent'
                : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50/50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>En attente (Avances)</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 border-l-2 border-secondary-200 ${
              activeTab === 'paid'
                ? 'border-b-4 border-green-600 text-green-700 bg-gradient-to-b from-green-50 to-transparent'
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50/50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Payés (Complets)</span>
            </div>
          </button>
        </div>
      </div>

      {/* Affichage conditionnel selon l'onglet */}
      {activeTab === 'pending' ? (
        <PendingPayments />
      ) : (
        <Card
          title={`Historique des paiements (${filteredPayments.length})`}
        action={
          <div className="flex space-x-2">
            {/* Boutons de vue */}
            <div className="flex border-2 border-secondary-300 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setViewMode('grouped')}
                className={`px-3 py-2 text-sm transition-all duration-200 ${
                  viewMode === 'grouped'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-secondary-50'
                }`}
                title="Vue groupée par classe"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm border-l-2 border-secondary-300 transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-secondary-50'
                }`}
                title="Vue liste"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button
              variant="outline"
              icon={FileText}
              onClick={() => setIsClassReportModalOpen(true)}
              size="md"
            >
              Liste par classe
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleOpenModal}>
              Nouveau paiement
            </Button>
          </div>
        }
      >
        {/* Filtres de statut et période */}
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Tous
            </Button>
            <Button
              variant={filter === 'Payé' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('Payé')}
            >
              Payés
            </Button>
            <Button
              variant={filter === 'En attente' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('En attente')}
            >
              En attente
            </Button>
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            <span className="text-sm font-semibold text-secondary-700">Période:</span>
            <div className="flex border-2 border-secondary-300 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setMonthFilter('current')}
                className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  monthFilter === 'current'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-secondary-50'
                }`}
              >
                Mois en cours
              </button>
              <button
                onClick={() => setMonthFilter('all')}
                className={`px-4 py-1.5 text-sm font-medium border-l-2 border-secondary-300 transition-all duration-200 ${
                  monthFilter === 'all'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-secondary-50'
                }`}
              >
                Tous les mois
              </button>
            </div>
          </div>
        </div>

        {/* Filtre par classe et recherche */}
        <div className="mb-6">
          <ClassFilter
            classes={classes}
            selectedClass={selectedClass}
            onClassChange={setSelectedClass}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Rechercher un élève par nom..."
          />
        </div>

        {/* Affichage groupé ou liste */}
        {viewMode === 'grouped' ? (
          <GroupedByClass
            data={filteredPayments}
            renderItem={(payment) => (
              <div className="px-6 py-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-secondary-50/30 hover:to-primary-50/30 transition-all duration-200 rounded-lg">
                <div className="flex items-center flex-1 space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center shadow-md">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.studentName}
                        </div>
                        <div className="text-sm text-gray-500">{payment.type}</div>
                      </div>
                      <div className="hidden md:block">
                        <div className="text-sm font-semibold text-gray-900">
                          {payment.amount.toLocaleString()} FCFA
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(payment.date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div className="hidden lg:block">
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => viewPaymentDetails(payment)}
                    className="text-secondary-600 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-all duration-200"
                    title="Voir les détails"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {payment.status === 'Payé' && (
                    <button
                      onClick={() => generateReceipt(payment)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 rounded-lg transition-all duration-200"
                      title="Télécharger le reçu"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            )}
            getItemClass={(payment) => payment.class}
            emptyMessage="Aucun paiement trouvé"
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border-2 border-secondary-100">
            <table className="w-full">
            <thead className="bg-gradient-to-r from-secondary-50 to-primary-50 border-b-2 border-secondary-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                  Élève
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                  Classe
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y-2 divide-secondary-100">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gradient-to-r hover:from-secondary-50/30 hover:to-primary-50/30 transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{payment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {payment.amount.toLocaleString()} FCFA
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewPaymentDetails(payment)}
                        className="text-secondary-600 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-all duration-200"
                        title="Voir les détails"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {payment.status === 'Payé' && (
                        <button
                          onClick={() => generateReceipt(payment)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 rounded-lg transition-all duration-200"
                          title="Télécharger le reçu"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun paiement trouvé</p>
              </div>
            )}
          </div>
        )}
        </Card>
      )}

      {/* Modal nouveau paiement */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Enregistrer un paiement"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Nom de l'élève"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
          />
          <Input
            label="Classe"
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de paiement
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Frais de scolarité">Frais de scolarité</option>
              <option value="Frais d'inscription">Frais d'inscription</option>
              <option value="Frais d'examen">Frais d'examen</option>
              <option value="Fournitures scolaires">Fournitures scolaires</option>
              <option value="Autres">Autres</option>
            </select>
          </div>
          <Input
            label="Montant (FCFA)"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Méthode de paiement
            </label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Espèces">Espèces</option>
              <option value="Virement">Virement bancaire</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Chèque">Chèque</option>
            </select>
          </div>
          <Input
            label="Date de paiement"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={handleCloseModal} type="button">
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal détails du paiement */}
      {viewingPayment && (
        <Modal
          isOpen={!!viewingPayment}
          onClose={() => setViewingPayment(null)}
          title="Détails du paiement"
          size="md"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">ID de transaction</span>
              <span className="font-semibold">#{viewingPayment.id}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Élève</span>
              <span className="font-semibold">{viewingPayment.studentName}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Classe</span>
              <span className="font-semibold">{viewingPayment.class}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Type</span>
              <span className="font-semibold">{viewingPayment.type}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Montant</span>
              <span className="font-semibold text-lg text-primary-600">
                {viewingPayment.amount.toLocaleString()} FCFA
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Méthode</span>
              <span className="font-semibold">{viewingPayment.method}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Date</span>
              <span className="font-semibold">
                {new Date(viewingPayment.date).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Statut</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon(viewingPayment.status)}
                {getStatusBadge(viewingPayment.status)}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="primary"
              className="w-full"
              icon={Download}
              onClick={() => generateReceipt(viewingPayment)}
            >
              Télécharger le reçu
            </Button>
          </div>
        </Modal>
      )}

      {/* Modal de liste récapitulative par classe */}
      <ClassReportModal
        isOpen={isClassReportModalOpen}
        onClose={() => setIsClassReportModalOpen(false)}
        onGenerate={handleGenerateClassReport}
        payments={payments.filter(p => p.status === 'Payé')}
      />

      {/* Modal d'options d'impression après création de paiement */}
      {showPrintOptions && (
        <Modal
          isOpen={!!showPrintOptions}
          onClose={() => setShowPrintOptions(null)}
          title="Options d'impression"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600 text-center mb-6">
              Le paiement a été enregistré avec succès!<br />
              Choisissez une option d'impression :
            </p>

            <div className="grid grid-cols-1 gap-4">
              {/* Option 1: Reçu individuel */}
              <button
                onClick={() => {
                  generateReceipt(showPrintOptions);
                  setShowPrintOptions(null);
                }}
                className="p-6 border-2 border-primary-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all text-left group"
              >
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors">
                    <FileText className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      Reçu individuel
                    </h3>
                    <p className="text-sm text-gray-600">
                      Imprimer uniquement le reçu de cet élève avec tous les détails
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      📄 PDF • 1 page • Prêt à imprimer
                    </div>
                  </div>
                </div>
              </button>

              {/* Option 2: Liste par classe */}
              <button
                onClick={() => {
                  setShowPrintOptions(null);
                  setIsClassReportModalOpen(true);
                }}
                className="p-6 border-2 border-green-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition-all text-left group"
              >
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                    <List className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      Liste récapitulative par classe
                    </h3>
                    <p className="text-sm text-gray-600">
                      Générer une liste groupée de tous les paiements de la classe
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      📊 PDF • Tableau complet • Avec totaux
                    </div>
                  </div>
                </div>
              </button>

              {/* Option 3: Les deux */}
              <button
                onClick={() => {
                  generateReceipt(showPrintOptions);
                  setTimeout(() => {
                    setShowPrintOptions(null);
                    setIsClassReportModalOpen(true);
                  }, 500);
                }}
                className="p-6 border-2 border-purple-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-all text-left group"
              >
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Download className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      Imprimer les deux
                    </h3>
                    <p className="text-sm text-gray-600">
                      Générer le reçu individuel et la liste récapitulative
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      📑 2 fichiers PDF • Complet
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShowPrintOptions(null)}
              >
                Fermer (imprimer plus tard)
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default Payments;
