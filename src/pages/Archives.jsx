import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import {
  Archive,
  Users,
  GraduationCap,
  CreditCard,
  RotateCcw,
  Trash2,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useArchiveStore } from '@/store/archiveStore';
import { useStudentsStore } from '@/store/studentsStore';
import { useTeachersStore } from '@/store/teachersStore';

const Archives = () => {
  const {
    archivedStudents,
    archivedTeachers,
    archivedPayments,
    restoreStudent,
    restoreTeacher,
    deleteFromArchive,
    getArchiveStats,
  } = useArchiveStore();

  const { addStudent } = useStudentsStore();
  const { addTeacher } = useTeachersStore();

  const [activeTab, setActiveTab] = useState('students');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = getArchiveStats();

  const tabs = [
    { id: 'students', label: 'Élèves', icon: Users, count: stats.totalStudents },
    { id: 'teachers', label: 'Enseignants', icon: GraduationCap, count: stats.totalTeachers },
    { id: 'payments', label: 'Paiements', icon: CreditCard, count: stats.totalPayments },
  ];

  const handleRestore = (item, type) => {
    if (window.confirm(`Voulez-vous restaurer cet élément ?`)) {
      if (type === 'student') {
        const { archivedAt, archivedReason, ...studentData } = item;
        addStudent(studentData);
        restoreStudent(item.id);
      } else if (type === 'teacher') {
        const { archivedAt, archivedReason, ...teacherData } = item;
        addTeacher(teacherData);
        restoreTeacher(item.id);
      }
    }
  };

  const handleDelete = (id, type) => {
    if (
      window.confirm(
        'Êtes-vous sûr de vouloir supprimer définitivement cet élément ? Cette action est irréversible.'
      )
    ) {
      deleteFromArchive(type, id);
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout title="Archives">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Élèves archivés</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Enseignants archivés</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalTeachers}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Paiements archivés</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalPayments}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Onglets */}
      <Card>
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            {archivedStudents.length > 0 ? (
              archivedStudents.map((student) => (
                <div
                  key={student.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4 min-w-0 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Classe: {student.class} • Matricule: {student.matricule}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            <span>Archivé le {formatDate(student.archivedAt)}</span>
                          </div>
                          {student.archivedReason && (
                            <div className="flex items-center">
                              <AlertCircle className="w-3.5 h-3.5 mr-1" />
                              <span>Raison: {student.archivedReason}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={FileText}
                        onClick={() => handleViewDetails(student)}
                      >
                        Détails
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={RotateCcw}
                        onClick={() => handleRestore(student, 'student')}
                      >
                        Restaurer
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(student.id, 'student')}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun élève archivé</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="space-y-4">
            {archivedTeachers.length > 0 ? (
              archivedTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4 min-w-0 flex-1">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {teacher.firstName} {teacher.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {teacher.subject} • {teacher.email}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            <span>Archivé le {formatDate(teacher.archivedAt)}</span>
                          </div>
                          {teacher.archivedReason && (
                            <div className="flex items-center">
                              <AlertCircle className="w-3.5 h-3.5 mr-1" />
                              <span>Raison: {teacher.archivedReason}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={FileText}
                        onClick={() => handleViewDetails(teacher)}
                      >
                        Détails
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={RotateCcw}
                        onClick={() => handleRestore(teacher, 'teacher')}
                      >
                        Restaurer
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(teacher.id, 'teacher')}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun enseignant archivé</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-4">
            {archivedPayments.length > 0 ? (
              archivedPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4 min-w-0 flex-1">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {payment.amount.toLocaleString()} FCFA
                        </h3>
                        <p className="text-sm text-gray-600">
                          {payment.studentName} • {payment.feeType}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            <span>Archivé le {formatDate(payment.archivedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={FileText}
                        onClick={() => handleViewDetails(payment)}
                      >
                        Détails
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(payment.id, 'payment')}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun paiement archivé</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Modal de détails */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        title="Détails de l'élément archivé"
        size="md"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Élément archivé</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Archivé le {formatDate(selectedItem.archivedAt)}
                  </p>
                  {selectedItem.archivedReason && (
                    <p className="text-xs text-yellow-700 mt-1">
                      Raison: {selectedItem.archivedReason}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(selectedItem)
                .filter(
                  ([key]) =>
                    !['id', 'archivedAt', 'archivedReason', 'password'].includes(key)
                )
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-sm text-gray-900 text-right">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Archives;
