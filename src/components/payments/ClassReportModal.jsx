import React, { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { FileText, Calendar, Users } from 'lucide-react';

const ClassReportModal = ({ isOpen, onClose, onGenerate, payments }) => {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Extraire les classes uniques des paiements
  const uniqueClasses = [...new Set(payments.map(p => p.class))].sort();

  // Calculer les statistiques par classe
  const classStats = uniqueClasses.map(className => {
    const classPayments = payments.filter(p => p.class === className);
    const total = classPayments.reduce((sum, p) => sum + p.amount, 0);
    return {
      className,
      count: classPayments.length,
      total
    };
  });

  // Gérer le changement de période prédéfinie
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    const today = new Date();

    switch (period) {
      case 'today':
        setStartDate(today.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        setStartDate(weekAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        setStartDate(monthAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        break;
      case 'custom':
        // L'utilisateur définira les dates
        break;
      case 'all':
      default:
        setStartDate('');
        setEndDate('');
        break;
    }
  };

  // Filtrer les paiements selon les critères
  const getFilteredPayments = () => {
    let filtered = [...payments];

    // Filtre par classe
    if (selectedClass !== 'all') {
      filtered = filtered.filter(p => p.class === selectedClass);
    }

    // Filtre par période
    if (startDate && endDate) {
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return paymentDate >= start && paymentDate <= end;
      });
    }

    return filtered;
  };

  const handleGenerate = () => {
    const filteredPayments = getFilteredPayments();

    if (filteredPayments.length === 0) {
      alert('Aucun paiement trouvé pour les critères sélectionnés.');
      return;
    }

    const periodLabel = selectedPeriod === 'custom'
      ? `Du ${new Date(startDate).toLocaleDateString('fr-FR')} au ${new Date(endDate).toLocaleDateString('fr-FR')}`
      : selectedPeriod === 'today' ? "Aujourd'hui"
      : selectedPeriod === 'week' ? "7 derniers jours"
      : selectedPeriod === 'month' ? "30 derniers jours"
      : "Toute la période";

    onGenerate({
      className: selectedClass === 'all' ? 'Toutes les classes' : selectedClass,
      payments: filteredPayments,
      period: periodLabel
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Générer une liste récapitulative par classe"
      size="lg"
    >
      <div className="space-y-6">
        {/* Sélection de la classe */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 mr-2" />
            Sélectionner une classe
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">📚 Toutes les classes</option>
            {uniqueClasses.map(className => {
              const stats = classStats.find(s => s.className === className);
              return (
                <option key={className} value={className}>
                  {className} ({stats.count} paiements - {stats.total.toLocaleString()} FCFA)
                </option>
              );
            })}
          </select>
        </div>

        {/* Sélection de la période */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            Période
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <button
              onClick={() => handlePeriodChange('today')}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                selectedPeriod === 'today'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => handlePeriodChange('week')}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                selectedPeriod === 'week'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              7 derniers jours
            </button>
            <button
              onClick={() => handlePeriodChange('month')}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                selectedPeriod === 'month'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              30 derniers jours
            </button>
            <button
              onClick={() => handlePeriodChange('all')}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                selectedPeriod === 'all'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Tout
            </button>
          </div>

          {/* Période personnalisée */}
          <button
            onClick={() => handlePeriodChange('custom')}
            className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors mb-3 ${
              selectedPeriod === 'custom'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            📅 Période personnalisée
          </button>

          {selectedPeriod === 'custom' && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Date de début
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Aperçu des résultats */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <FileText className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-semibold text-blue-900">Aperçu du rapport</h4>
          </div>
          <div className="text-sm text-blue-800 space-y-1">
            <p>
              <span className="font-medium">Classe :</span>{' '}
              {selectedClass === 'all' ? 'Toutes les classes' : selectedClass}
            </p>
            <p>
              <span className="font-medium">Période :</span>{' '}
              {selectedPeriod === 'custom' && startDate && endDate
                ? `Du ${new Date(startDate).toLocaleDateString('fr-FR')} au ${new Date(endDate).toLocaleDateString('fr-FR')}`
                : selectedPeriod === 'today' ? "Aujourd'hui"
                : selectedPeriod === 'week' ? "7 derniers jours"
                : selectedPeriod === 'month' ? "30 derniers jours"
                : "Toute la période"}
            </p>
            <p>
              <span className="font-medium">Paiements trouvés :</span>{' '}
              {getFilteredPayments().length}
            </p>
            <p>
              <span className="font-medium">Montant total :</span>{' '}
              {getFilteredPayments().reduce((sum, p) => sum + p.amount, 0).toLocaleString()} FCFA
            </p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="primary"
            icon={FileText}
            onClick={handleGenerate}
            disabled={getFilteredPayments().length === 0}
          >
            Générer le PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ClassReportModal;
