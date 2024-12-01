import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { ProfessionalFamily, Study } from '../../types/masterRecords';
import StudyForm from './StudyForm';

interface FamilyFormProps {
  onSubmit: (data: Omit<ProfessionalFamily, 'id'>) => void;
  onClose: () => void;
  initialData?: ProfessionalFamily;
}

const FamilyForm: React.FC<FamilyFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState<Omit<ProfessionalFamily, 'id'>>({
    code: initialData?.code || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    studies: initialData?.studies || [],
  });

  const [showStudyForm, setShowStudyForm] = useState(false);
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);

  const handleAddStudy = (studyData: Omit<Study, 'id'>) => {
    const newStudy = {
      ...studyData,
      id: Date.now().toString(),
      groups: [],
    };

    setFormData(prev => ({
      ...prev,
      studies: [...prev.studies, newStudy],
    }));
    setShowStudyForm(false);
  };

  const handleEditStudy = (study: Study) => {
    setEditingStudy(study);
    setShowStudyForm(true);
  };

  const handleUpdateStudy = (studyData: Omit<Study, 'id'>) => {
    if (!editingStudy) return;

    setFormData(prev => ({
      ...prev,
      studies: prev.studies.map(study =>
        study.id === editingStudy.id
          ? { ...studyData, id: study.id, groups: study.groups }
          : study
      ),
    }));
    setShowStudyForm(false);
    setEditingStudy(null);
  };

  const handleDeleteStudy = (studyId: string) => {
    setFormData(prev => ({
      ...prev,
      studies: prev.studies.filter(study => study.id !== studyId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getLevelName = (level: Study['level']) => {
    switch (level) {
      case 'basic': return 'Básico';
      case 'medium': return 'Medio';
      case 'higher': return 'Superior';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">
            {initialData ? 'Editar' : 'Nueva'} Familia Profesional
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                required
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Estudios</h3>
              <button
                type="button"
                onClick={() => {
                  setEditingStudy(null);
                  setShowStudyForm(true);
                }}
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Estudio</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.studies.map((study) => (
                <div
                  key={study.id}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{study.name}</div>
                      <div className="text-sm text-gray-500">
                        {study.code} - {getLevelName(study.level)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEditStudy(study)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStudy(study.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {study.groups.length > 0 && (
                    <div className="mt-2 pl-4 border-l-2 border-gray-200">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Grupos ({study.groups.length})
                      </div>
                      <div className="space-y-1">
                        {study.groups.map(group => (
                          <div key={group.id} className="text-sm text-gray-600">
                            {group.name} ({group.code})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {formData.studies.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay estudios añadidos
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {initialData ? 'Guardar Cambios' : 'Crear Familia'}
            </button>
          </div>
        </form>

        {showStudyForm && (
          <StudyForm
            onSubmit={editingStudy ? handleUpdateStudy : handleAddStudy}
            onClose={() => {
              setShowStudyForm(false);
              setEditingStudy(null);
            }}
            initialData={editingStudy}
          />
        )}
      </div>
    </div>
  );
};

export default FamilyForm;