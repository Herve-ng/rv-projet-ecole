import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import { Plus, Edit, Trash2, Search, GraduationCap, Archive } from 'lucide-react';
import { useTeachersStore } from '@/store/teachersStore';
import { teachersService } from '@/services/teachersService';
import { useArchiveStore } from '@/store/archiveStore';

const Teachers = () => {
  const { teachers, setTeachers, addTeacher, updateTeacher, deleteTeacher } = useTeachersStore();
  const { archiveTeacher } = useArchiveStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    qualification: '',
    dateOfHire: '',
    salary: '',
    address: '',
  });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const data = await teachersService.getAllTeachers();
      setTeachers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des enseignants:', error);
    }
  };

  const handleOpenModal = (teacher = null) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData(teacher);
    } else {
      setEditingTeacher(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        qualification: '',
        dateOfHire: '',
        salary: '',
        address: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
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
      if (editingTeacher) {
        const updated = await teachersService.updateTeacher(editingTeacher.id, formData);
        updateTeacher(editingTeacher.id, updated);
      } else {
        const created = await teachersService.createTeacher(formData);
        addTeacher(created);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de l\'enseignant');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      try {
        await teachersService.deleteTeacher(id);
        deleteTeacher(id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'enseignant');
      }
    }
  };

  const handleArchive = (teacher) => {
    const reason = prompt('Raison de l\'archivage (optionnel):');
    if (reason !== null) {
      archiveTeacher({ ...teacher, archivedReason: reason || 'Non spécifiée' });
      deleteTeacher(teacher.id);
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Gestion des Enseignants">
      <Card
        title={`Liste des enseignants (${filteredTeachers.length})`}
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => handleOpenModal()}
          >
            Ajouter un enseignant
          </Button>
        }
      >
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Rechercher un enseignant..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded-xl border-2 border-secondary-100">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-secondary-50 to-primary-50 border-b-2 border-secondary-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                  Enseignant
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                  Matière
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-700 uppercase tracking-wider">
                  Qualification
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
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gradient-to-r hover:from-secondary-50/30 hover:to-primary-50/30 transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3 shadow-md">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {teacher.firstName} {teacher.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {teacher.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.qualification}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Edit}
                        onClick={() => handleOpenModal(teacher)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Archive}
                        onClick={() => handleArchive(teacher)}
                      >
                        Archiver
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(teacher.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTeachers.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun enseignant trouvé</p>
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTeacher ? 'Modifier l\'enseignant' : 'Ajouter un enseignant'}
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
              label="Matière enseignée"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <Input
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
            />
            <Input
              label="Date d'embauche"
              type="date"
              name="dateOfHire"
              value={formData.dateOfHire}
              onChange={handleChange}
              required
            />
            <Input
              label="Salaire (FCFA)"
              type="number"
              name="salary"
              value={formData.salary}
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
              {editingTeacher ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Teachers;
