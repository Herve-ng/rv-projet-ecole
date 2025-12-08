import React, { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import ClassFilter from '@/components/common/ClassFilter';
import GroupedByClass from '@/components/common/GroupedByClass';
import { Clock, Plus, Eye, Grid, List, AlertCircle, CheckCircle } from 'lucide-react';
import { useFiltersStore, useUniqueClasses } from '@/store/filtersStore';
import { useFeesStore } from '@/store/feesStore';
import { useStudentsStore } from '@/store/studentsStore';

const PendingPayments = () => {
  const { selectedClass, searchTerm, viewMode, setSelectedClass, setSearchTerm, setViewMode } = useFiltersStore();
  const { studentFees, addPaymentToFee } = useFeesStore();
  const { students } = useStudentsStore();

  const [selectedFee, setSelectedFee] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('remaining'); // 'remaining', 'date', 'name'
  const [formData, setFormData] = useState({
    amount: '',
    method: 'Espèces',
    date: new Date().toISOString().split('T')[0],
  });

  // Obtenir les frais en attente (paiements partiels)
  const pendingFees = studentFees.filter(fee =>
    fee.status === 'En attente' && (fee.totalPaid || 0) > 0
  );

  // Enrichir avec les informations de l'élève
  const enrichedFees = pendingFees.map(fee => {
    const student = students.find(s => s.id === fee.studentId);
    return {
      ...fee,
      studentName: student ? `${student.firstName} ${student.lastName}` : 'Inconnu',
      studentClass: student?.class || 'N/A',
      remaining: fee.totalAmount - (fee.totalPaid || 0),
    };
  });

  // Obtenir les classes uniques
  const classes = useUniqueClasses(enrichedFees, (f) => f.studentClass);

  // Filtrer les frais
  const filteredFees = enrichedFees.filter((fee) => {
    const matchesClass = !selectedClass || fee.studentClass === selectedClass;
    const matchesSearch = !searchTerm ||
      fee.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  // Trier les frais
  const sortedFees = [...filteredFees].sort((a, b) => {
    switch (sortBy) {
      case 'remaining':
        return b.remaining - a.remaining;
      case 'date':
        return new Date(b.lastPaymentDate) - new Date(a.lastPaymentDate);
      case 'name':
        return a.studentName.localeCompare(b.studentName);
      default:
        return 0;
    }
  });

  const handleOpenPaymentModal = (fee) => {
    setSelectedFee(fee);
    setFormData({
      amount: '',
      method: 'Espèces',
      date: new Date().toISOString().split('T')[0],
    });
    setIsPaymentModalOpen(true);
  };

  const handleOpenDetailsModal = (fee) => {
    setSelectedFee(fee);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsPaymentModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedFee(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();

    const paymentAmount = parseFloat(formData.amount);
    const remaining = selectedFee.remaining;

    if (paymentAmount <= 0) {
      alert('Le montant doit être supérieur à 0');
      return;
    }

    if (paymentAmount > remaining) {
      const confirm = window.confirm(
        `Le montant saisi (${paymentAmount.toLocaleString()} FCFA) dépasse le montant restant (${remaining.toLocaleString()} FCFA). Voulez-vous continuer ?`
      );
      if (!confirm) return;
    }

    const newPayment = {
      id: Date.now(),
      amount: paymentAmount,
      method: formData.method,
      date: formData.date,
      timestamp: new Date().toISOString(),
    };

    // Ajouter le paiement au frais
    addPaymentToFee(selectedFee.studentId, selectedFee.type, newPayment);

    // Vérifier si le paiement est complet
    const newTotalPaid = (selectedFee.totalPaid || 0) + paymentAmount;
    if (newTotalPaid >= selectedFee.totalAmount) {
      alert(`✅ Paiement complété pour ${selectedFee.studentName}!\nLe montant total a été atteint.`);
    } else {
      alert(`Paiement enregistré. Reste à payer: ${(selectedFee.totalAmount - newTotalPaid).toLocaleString()} FCFA`);
    }

    handleCloseModals();
  };

  const renderFeeItem = (fee) => (
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center flex-1 space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
          <Clock className="w-6 h-6 text-yellow-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-4">
            <div>
              <div className="text-sm font-medium text-gray-900">
                {fee.studentName}
              </div>
              <div className="text-sm text-gray-500">{fee.type}</div>
            </div>
            <div className="hidden md:block">
              <div className="text-xs text-gray-500">Total à payer</div>
              <div className="text-sm font-semibold text-gray-900">
                {fee.totalAmount.toLocaleString()} FCFA
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-xs text-gray-500">Déjà payé</div>
              <div className="text-sm font-semibold text-green-600">
                {(fee.totalPaid || 0).toLocaleString()} FCFA
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="text-xs text-gray-500">Reste à payer</div>
              <div className="text-sm font-bold text-red-600">
                {fee.remaining.toLocaleString()} FCFA
              </div>
            </div>
            <div className="hidden xl:block">
              <div className="text-xs text-gray-500">Dernier paiement</div>
              <div className="text-sm text-gray-600">
                {new Date(fee.lastPaymentDate).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex space-x-2 ml-4">
        <Button
          variant="secondary"
          size="sm"
          icon={Eye}
          onClick={() => handleOpenDetailsModal(fee)}
        >
          Détails
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => handleOpenPaymentModal(fee)}
        >
          Compléter
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">En attente de paiement</p>
              <p className="text-2xl font-bold text-gray-800">{sortedFees.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total déjà perçu</p>
              <p className="text-2xl font-bold text-green-600">
                {sortedFees.reduce((sum, f) => sum + (f.totalPaid || 0), 0).toLocaleString()} FCFA
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Montant restant total</p>
              <p className="text-2xl font-bold text-red-600">
                {sortedFees.reduce((sum, f) => sum + f.remaining, 0).toLocaleString()} FCFA
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des paiements en attente */}
      <Card
        title={`Paiements en attente (${sortedFees.length})`}
        action={
          <div className="flex space-x-2 items-center">
            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="remaining">Trier par: Montant restant</option>
              <option value="date">Trier par: Date</option>
              <option value="name">Trier par: Nom</option>
            </select>

            {/* Toggle vue */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grouped')}
                className={`px-3 py-2 text-sm ${
                  viewMode === 'grouped'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title="Vue groupée par classe"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm border-l border-gray-300 ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title="Vue liste"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
      >
        {/* Filtres */}
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
            data={sortedFees}
            renderItem={renderFeeItem}
            getItemClass={(fee) => fee.studentClass}
            emptyMessage="Aucun paiement en attente"
          />
        ) : (
          <div className="space-y-2">
            {sortedFees.map((fee, index) => (
              <div key={index} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                {renderFeeItem(fee)}
              </div>
            ))}

            {sortedFees.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun paiement en attente</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Modal pour compléter un paiement */}
      {selectedFee && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={handleCloseModals}
          title={`Compléter le paiement - ${selectedFee.studentName}`}
          size="md"
        >
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Informations du frais</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-blue-700">Type:</span>
                <span className="ml-2 font-medium">{selectedFee.type}</span>
              </div>
              <div>
                <span className="text-blue-700">Classe:</span>
                <span className="ml-2 font-medium">{selectedFee.studentClass}</span>
              </div>
              <div>
                <span className="text-blue-700">Montant total:</span>
                <span className="ml-2 font-medium">{selectedFee.totalAmount.toLocaleString()} FCFA</span>
              </div>
              <div>
                <span className="text-blue-700">Déjà payé:</span>
                <span className="ml-2 font-medium text-green-600">{(selectedFee.totalPaid || 0).toLocaleString()} FCFA</span>
              </div>
              <div className="col-span-2">
                <span className="text-blue-700">Reste à payer:</span>
                <span className="ml-2 font-bold text-red-600">{selectedFee.remaining.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitPayment}>
            <Input
              label="Montant du paiement (FCFA)"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="1"
              step="1"
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Méthode de paiement
              </label>
              <select
                name="method"
                value={formData.method}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Espèces">Espèces</option>
                <option value="Virement">Virement bancaire</option>
                <option value="Mobile Money">Mobile Money</option>
                <option value="Chèque">Chèque</option>
              </select>
            </div>

            <Input
              label="Date du paiement"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="secondary" onClick={handleCloseModals} type="button">
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                Enregistrer le paiement
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal des détails */}
      {selectedFee && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseModals}
          title={`Détails des paiements - ${selectedFee.studentName}`}
          size="lg"
        >
          <div className="space-y-4">
            {/* Informations générales */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Informations générales</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Élève:</span>
                  <span className="font-medium">{selectedFee.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Classe:</span>
                  <span className="font-medium">{selectedFee.studentClass}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type de frais:</span>
                  <span className="font-medium">{selectedFee.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut:</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                    {selectedFee.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Résumé financier */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">Résumé financier</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Montant total:</span>
                  <span className="font-semibold">{selectedFee.totalAmount.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Total payé:</span>
                  <span className="font-semibold text-green-600">{(selectedFee.totalPaid || 0).toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between border-t border-blue-300 pt-2">
                  <span className="text-blue-900 font-medium">Reste à payer:</span>
                  <span className="font-bold text-red-600">{selectedFee.remaining.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            {/* Historique des paiements */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Historique des paiements</h4>
              <div className="space-y-2">
                {(selectedFee.payments || []).map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.amount.toLocaleString()} FCFA
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.method} • {new Date(payment.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="secondary" onClick={handleCloseModals}>
                Fermer
              </Button>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setIsPaymentModalOpen(true);
                }}
              >
                Ajouter un paiement
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PendingPayments;
