import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import type { Action } from '../../types/action';
import { useAuthStore } from '../../stores/authStore';
import BasicInfo from './form/BasicInfo';
import Participants from './form/Participants';
import Attachments from './form/Attachments';
import Departments from './form/Departments';
import Families from './form/Families';
import Objectives from './form/Objectives';

interface ActionFormProps {
  onSubmit: (data: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
  initialData?: Action | null;
}

const steps = [
  { id: 'basic', title: 'Información Básica', description: 'Datos generales de la acción' },
  { id: 'participants', title: 'Participantes', description: 'Número de participantes y detalles' },
  { id: 'objectives', title: 'Objetivos', description: 'Objetivos y ODS relacionados' },
  { id: 'departments', title: 'Departamentos', description: 'Departamentos involucrados' },
  { id: 'families', title: 'Familias y Grupos', description: 'Familias profesionales y grupos' },
  { id: 'attachments', title: 'Adjuntos', description: 'Imágenes y documentos' },
];

const requiredFields = {
  basic: ['name', 'location', 'startDate', 'endDate', 'network', 'center', 'quarter'],
  participants: ['description', 'studentParticipants', 'teacherParticipants'],
  objectives: ['objectives'],
  departments: ['departments'],
  families: ['professionalFamilies', 'selectedGroups'],
  attachments: [],
};

const ActionForm: React.FC<ActionFormProps> = ({ onSubmit, onClose, initialData }) => {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Action>>(() => {
    const defaultData = {
      name: '',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
      departments: [],
      professionalFamilies: [],
      selectedGroups: [],
      studentParticipants: 0,
      teacherParticipants: 0,
      rating: 5,
      comments: '',
      createdBy: user?.id || '',
      network: user?.network || '',
      center: user?.center || '',
      quarter: '',
      objectives: [],
      ods: [],
    };

    if (!initialData) {
      return defaultData;
    }

    // Si es una acción importada con errores, mantener los datos válidos
    if (initialData.importErrors?.length) {
      const invalidFields = new Set(initialData.importErrors.map(err => err.field));
      const validData = Object.entries(initialData).reduce((acc, [key, value]) => {
        if (!invalidFields.has(key) && value !== undefined && value !== '') {
          acc[key as keyof Action] = value;
        }
        return acc;
      }, {} as Partial<Action>);

      return { ...defaultData, ...validData };
    }

    return { ...defaultData, ...initialData };
  });

  const handleFormDataChange = (newData: Partial<Action>) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  const getMissingFields = (stepId: string) => {
    const fields = requiredFields[stepId as keyof typeof requiredFields];
    return fields.filter(field => {
      const value = formData[field as keyof typeof formData];
      return !value || (Array.isArray(value) && value.length === 0);
    });
  };

  const getFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      name: 'Nombre',
      location: 'Ubicación',
      startDate: 'Fecha de inicio',
      endDate: 'Fecha de fin',
      network: 'Red',
      center: 'Centro',
      quarter: 'Trimestre',
      description: 'Descripción',
      studentParticipants: 'Estudiantes participantes',
      teacherParticipants: 'Profesores participantes',
      objectives: 'Objetivos',
      departments: 'Departamentos',
      professionalFamilies: 'Familias profesionales',
      selectedGroups: 'Grupos',
    };
    return labels[field] || field;
  };

  const validateStep = () => {
    const stepId = steps[currentStep].id;
    const missingFields = getMissingFields(stepId);
    
    if (missingFields.length > 0) {
      setError(`Campos requeridos sin completar: ${missingFields.map(f => getFieldLabel(f)).join(', ')}`);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos requeridos
    const allMissingFields = steps.flatMap(step => 
      getMissingFields(step.id).map(field => getFieldLabel(field))
    );

    if (allMissingFields.length > 0) {
      setError(`Los siguientes campos son requeridos: ${allMissingFields.join(', ')}`);
      return;
    }

    // Si es una acción importada con errores, verificar si se han corregido
    if (initialData?.importErrors?.length) {
      const stillHasErrors = initialData.importErrors.some(error => {
        const value = formData[error.field as keyof typeof formData];
        return !value || (Array.isArray(value) && value.length === 0);
      });

      onSubmit({
        ...formData,
        isImported: true,
        importErrors: stillHasErrors ? initialData.importErrors : undefined,
        // No establecemos isIncomplete ya que todos los campos requeridos están completos
      } as Required<Omit<Action, 'id' | 'createdAt' | 'updatedAt'>>);
    } else {
      onSubmit(formData as Required<Omit<Action, 'id' | 'createdAt' | 'updatedAt'>>);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'basic':
        return <BasicInfo data={formData} onChange={handleFormDataChange} />;
      case 'participants':
        return <Participants data={formData} onChange={handleFormDataChange} />;
      case 'objectives':
        return <Objectives data={formData} onChange={handleFormDataChange} />;
      case 'departments':
        return <Departments data={formData} onChange={handleFormDataChange} />;
      case 'families':
        return <Families data={formData} onChange={handleFormDataChange} />;
      case 'attachments':
        return <Attachments data={formData} onChange={handleFormDataChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-semibold">
              {initialData ? 'Editar' : 'Nueva'} Acción
            </h2>
            {initialData?.importErrors && (
              <p className="text-sm text-red-600 mt-1">
                Esta acción fue importada con errores que necesitan ser corregidos
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-16rem)]">
          {/* Progress Bar */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex-1">
                  <div className="relative">
                    {index < steps.length - 1 && (
                      <div 
                        className={`absolute top-3 left-1/2 w-full h-1 ${
                          index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    )}
                    <div className="relative flex flex-col items-center group">
                      <div 
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                          ${index === currentStep ? 'border-blue-600 bg-white text-blue-600' :
                            index < currentStep ? 'border-blue-600 bg-blue-600 text-white' :
                            'border-gray-300 bg-white text-gray-300'
                          }`}
                      >
                        {getMissingFields(step.id).length > 0 ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          index < currentStep ? '✓' : index + 1
                        )}
                      </div>
                      <div className="absolute bottom-full mb-2 hidden group-hover:block">
                        <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          {step.description}
                        </div>
                      </div>
                      <div className="mt-2 text-xs font-medium text-gray-600">
                        {step.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {renderStepContent()}
            
            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {initialData?.importErrors && (
              <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Campos con errores de importación:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {initialData.importErrors.map((error, index) => (
                    <li key={index} className="text-sm text-yellow-700">
                      {getFieldLabel(error.field)}: {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                <span>Guardar</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActionForm;