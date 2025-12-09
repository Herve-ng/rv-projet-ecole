import React, { useMemo, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import { BookOpen, Users, School, Plus, Edit, Trash2, MoveVertical } from 'lucide-react';
import { useClassesStore } from '@/store/classesStore';
import { useStudentsStore } from '@/store/studentsStore';

const Classes = () => {
  const { classes, addClass, updateClass, deleteClass } = useClassesStore();
  const { students } = useStudentsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [movingClass, setMovingClass] = useState(null);
  const [newLevel, setNewLevel] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    section: '',
    capacity: '',
  });

  const availableLevels = ['Primaire', 'Collège', 'Lycée'];

  // Calculer le nombre d'élèves par classe
  const classesWithStudents = useMemo(() => {
    return classes.map((classItem) => {
      const studentsInClass = students.filter((s) => s.class === classItem.name);
      return {
        ...classItem,
        studentCount: studentsInClass.length,
      };
    });
  }, [classes, students]);

  // Grouper les classes par niveau
  const groupedClasses = useMemo(() => {
    const groups = {};
    classesWithStudents.forEach((classItem) => {
      if (!groups[classItem.level]) {
        groups[classItem.level] = [];
      }
      groups[classItem.level].push(classItem);
    });
    return groups;
  }, [classesWithStudents]);

  const handleOpenModal = (classItem = null) => {
    if (classItem) {
      setEditingClass(classItem);
      setFormData({
        name: classItem.name,
        level: classItem.level,
        section: classItem.section,
        capacity: classItem.capacity,
      });
    } else {
      setEditingClass(null);
      setFormData({
        name: '',
        level: '',
        section: '',
        capacity: '',
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
      updateClass(editingClass.id, formData);
    } else {
      addClass(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id, className) => {
    // Vérifier si des élèves sont dans cette classe
    const studentsInClass = students.filter((s) => s.class === className);
    if (studentsInClass.length > 0) {
      alert(
        `Impossible de supprimer cette classe. ${studentsInClass.length} élève(s) sont inscrits dans cette classe.`
      );
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      deleteClass(id);
    }
  };

  const handleOpenMoveModal = (classItem) => {
    setMovingClass(classItem);
    setNewLevel(classItem.level);
    setIsMoveModalOpen(true);
  };

  const handleCloseMoveModal = () => {
    setIsMoveModalOpen(false);
    setMovingClass(null);
    setNewLevel('');
  };

  const handleMoveClass = () => {
    if (movingClass && newLevel && newLevel !== movingClass.level) {
      updateClass(movingClass.id, { ...movingClass, level: newLevel });
      handleCloseMoveModal();
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
        {Object.entries(groupedClasses).map(([level, levelClasses]) => (
          <div key={level} className="mb-8 last:mb-0">
            <div className="flex items-center mb-4">
              <School className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">{level}</h2>
              <span className="ml-3 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                {levelClasses.length} classe{levelClasses.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {levelClasses.map((classItem) => {
                const occupancyRate = classItem.capacity > 0
                  ? (classItem.studentCount / classItem.capacity) * 100
                  : 0;

                return (
                  <div
                    key={classItem.id}
                    className="bg-gradient-to-br from-primary-50 to-white border border-primary-200 rounded-lg p-5 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-gray-800 truncate">
                            {classItem.name}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">{classItem.section}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-1.5 flex-shrink-0" />
                          <span className="text-xs">Élèves</span>
                        </div>
                        <span className="font-semibold text-gray-800">
                          {classItem.studentCount}/{classItem.capacity}
                        </span>
                      </div>

                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Taux d'occupation</span>
                          <span className="font-semibold">{occupancyRate.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              occupancyRate >= 90
                                ? 'bg-red-500'
                                : occupancyRate >= 70
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-200">
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
                            variant="secondary"
                            size="sm"
                            icon={MoveVertical}
                            onClick={() => handleOpenMoveModal(classItem)}
                            className="flex-1"
                          >
                            Déplacer
                          </Button>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDelete(classItem.id, classItem.name)}
                          className="w-full"
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {classes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune classe trouvée</p>
          </div>
        )}
      </Card>

      {/* Modal d'ajout/édition */}
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
              placeholder="Ex: Lycée"
              required
            />
            <Input
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="Ex: Scientifique"
              required
            />
          </div>
          <Input
            label="Capacité maximale"
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Ex: 40"
            required
          />

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

      {/* Modal de déplacement */}
      <Modal
        isOpen={isMoveModalOpen}
        onClose={handleCloseMoveModal}
        title="Déplacer la classe"
        size="md"
      >
        {movingClass && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <School className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-900">
                  Classe: {movingClass.name}
                </h3>
              </div>
              <p className="text-sm text-blue-700">
                Niveau actuel: <span className="font-semibold">{movingClass.level}</span>
              </p>
              <p className="text-sm text-blue-700">
                Section: {movingClass.section}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau niveau <span className="text-red-500">*</span>
              </label>
              <select
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {availableLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {newLevel !== movingClass.level && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Attention:</strong> La classe sera déplacée de{' '}
                  <span className="font-semibold">{movingClass.level}</span> vers{' '}
                  <span className="font-semibold">{newLevel}</span>.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={handleCloseMoveModal} type="button">
                Annuler
              </Button>
              <Button
                variant="primary"
                onClick={handleMoveClass}
                disabled={!newLevel || newLevel === movingClass.level}
              >
                Déplacer la classe
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Classes;
