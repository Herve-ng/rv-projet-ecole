import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import ClassFilter from '@/components/common/ClassFilter';
import GroupedByClass from '@/components/common/GroupedByClass';
import { Plus, Edit, Trash2, Search, User, List, Grid, Archive } from 'lucide-react';
import { useStudentsStore } from '@/store/studentsStore';
import { studentsService } from '@/services/studentsService';
import { useFiltersStore, useUniqueClasses } from '@/store/filtersStore';
import { useArchiveStore } from '@/store/archiveStore';
import { useClassesStore } from '@/store/classesStore';

const Students = () => {
  const { students, setStudents, addStudent, updateStudent, deleteStudent } = useStudentsStore();
  const { selectedClass, searchTerm, viewMode, setSelectedClass, setSearchTerm, setViewMode } = useFiltersStore();
  const { archiveStudent } = useArchiveStore();
  const { classes: availableClasses } = useClassesStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    class: '',
    parentName: '',
    parentPhone: '',
  });

  // Charger les élèves au montage
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentsService.getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error('Erreur lors du chargement des élèves:', error);
    }
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData(student);
    } else {
      setEditingStudent(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        class: '',
        parentName: '',
        parentPhone: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingStudent) {
        // Mise à jour
        const updated = await studentsService.updateStudent(editingStudent.id, formData);
        updateStudent(editingStudent.id, updated);
      } else {
        // Création
        const created = await studentsService.createStudent(formData);
        addStudent(created);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de l\'élève');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
      try {
        await studentsService.deleteStudent(id);
        deleteStudent(id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'élève');
      }
    }
  };

  const handleArchive = (student) => {
    const reason = prompt('Raison de l\'archivage (optionnel):');
    if (reason !== null) {
      archiveStudent({ ...student, archivedReason: reason || 'Non spécifiée' });
      deleteStudent(student.id);
    }
  };

  // Obtenir les classes uniques
  const classes = useUniqueClasses(students, (s) => s.class);

  // Filtrer les élèves
  const filteredStudents = students.filter((student) => {
    const matchesClass = !selectedClass || student.class === selectedClass;
    const matchesSearch = !searchTerm ||
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  // Rendu d'un élève dans le mode groupé
  const renderStudentItem = (student) => (
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center flex-1">
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
          <User className="w-6 h-6 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-4">
            <div>
              <div className="text-sm font-medium text-gray-900">
                {student.firstName} {student.lastName}
              </div>
              <div className="text-sm text-gray-500">{student.parentName}</div>
            </div>
            <div className="hidden md:block">
              <div className="text-sm text-gray-500">{student.email}</div>
            </div>
            <div className="hidden lg:block">
              <div className="text-sm text-gray-500">{student.phone}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex space-x-2 ml-4">
        <Button
          variant="secondary"
          size="sm"
          icon={Edit}
          onClick={() => handleOpenModal(student)}
        >
          Modifier
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={Archive}
          onClick={() => handleArchive(student)}
        >
          Archiver
        </Button>
        <Button
          variant="danger"
          size="sm"
          icon={Trash2}
          onClick={() => handleDelete(student.id)}
        >
          Supprimer
        </Button>
      </div>
    </div>
  );

  return (
    <Layout title="Gestion des Élèves">
      <Card
        title={`Liste des élèves (${filteredStudents.length})`}
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
              variant="primary"
              icon={Plus}
              onClick={() => handleOpenModal()}
            >
              Ajouter un élève
            </Button>
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
            data={filteredStudents}
            renderItem={renderStudentItem}
            getItemClass={(student) => student.class}
            emptyMessage="Aucun élève trouvé"
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border-2 border-secondary-100">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-secondary-50 to-primary-50 border-b-2 border-secondary-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                    Élève
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                    Classe
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                    Téléphone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y-2 divide-secondary-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gradient-to-r hover:from-secondary-50/30 hover:to-primary-50/30 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{student.parentName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {student.class}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Edit}
                          onClick={() => handleOpenModal(student)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Archive}
                          onClick={() => handleArchive(student)}
                        >
                          Archiver
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDelete(student.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun élève trouvé</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Modal d'ajout/édition */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStudent ? 'Modifier l\'élève' : 'Ajouter un élève'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Prénom"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label="Nom"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Téléphone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              label="Date de naissance"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classe <span className="text-red-500">*</span>
              </label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Sélectionner une classe</option>
                {availableClasses.map((classItem) => (
                  <option key={classItem.id} value={classItem.name}>
                    {classItem.name} - {classItem.level}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Nom du parent/tuteur"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              required
            />
            <Input
              label="Téléphone du parent"
              type="tel"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            label="Adresse"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={handleCloseModal} type="button">
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {editingStudent ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Students;
