import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import { Plus, Edit, Trash2, BookOpen, Users } from 'lucide-react';

const Classes = () => {
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: 'Terminale A',
      level: 'Terminale',
      section: 'Littéraire',
      teacher: 'Dr. Pierre Ndiaye',
      studentCount: 32,
      capacity: 40,
      room: 'Salle 101',
    },
    {
      id: 2,
      name: '1ère S',
      level: '1ère',
      section: 'Scientifique',
      teacher: 'Mme. Fatou Diop',
      studentCount: 28,
      capacity: 35,
      room: 'Salle 205',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    section: '',
    teacher: '',
    capacity: '',
    room: '',
  });

  const handleOpenModal = (classItem = null) => {
    if (classItem) {
      setEditingClass(classItem);
      setFormData(classItem);
    } else {
      setEditingClass(null);
      setFormData({
        name: '',
        level: '',
        section: '',
        teacher: '',
        capacity: '',
        room: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingClass) {
      setClasses(
        classes.map((c) =>
          c.id === editingClass.id ? { ...formData, id: c.id, studentCount: c.studentCount } : c
        )
      );
    } else {
      setClasses([
        ...classes,
        {
          ...formData,
          id: Date.now(),
          studentCount: 0,
        },
      ]);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      setClasses(classes.filter((c) => c.id !== id));
    }
  };

  return (
    <Layout title="Gestion des Classes">
      <Card
        title={`Liste des classes (${classes.length})`}
        action={
          <Button variant="primary" icon={Plus} onClick={() => handleOpenModal()}>
            Ajouter une classe
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => {
            const occupancyRate = (classItem.studentCount / classItem.capacity) * 100;

            return (
              <div
                key={classItem.id}
                className="bg-gradient-to-br from-primary-50 to-white border border-primary-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{classItem.name}</h3>
                      <p className="text-sm text-gray-500">{classItem.section}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    <span>{classItem.teacher}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>
                      {classItem.studentCount}/{classItem.capacity} élèves
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>{classItem.room}</span>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Taux d'occupation</span>
                    <span>{occupancyRate.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        occupancyRate >= 90
                          ? 'bg-red-500'
                          : occupancyRate >= 70
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Edit}
                    onClick={() => handleOpenModal(classItem)}
                    className="flex-1"
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDelete(classItem.id)}
                    className="flex-1"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {classes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune classe trouvée</p>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingClass ? 'Modifier la classe' : 'Ajouter une classe'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Nom de la classe"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Terminale A"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Niveau"
              name="level"
              value={formData.level}
              onChange={handleChange}
              placeholder="Ex: Terminale"
              required
            />
            <Input
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="Ex: Littéraire"
              required
            />
          </div>
          <Input
            label="Enseignant principal"
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            placeholder="Nom de l'enseignant"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Capacité maximale"
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Ex: 40"
              required
            />
            <Input
              label="Salle"
              name="room"
              value={formData.room}
              onChange={handleChange}
              placeholder="Ex: Salle 101"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={handleCloseModal} type="button">
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {editingClass ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Classes;
