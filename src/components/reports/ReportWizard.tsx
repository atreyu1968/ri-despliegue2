import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import StepIndicator from './wizard/StepIndicator';
import ReportTypeSelector from './wizard/ReportTypeSelector';
import ReportFilters from './wizard/ReportFilters';
import ReportPreview from './wizard/ReportPreview';
import ReportCharts from './wizard/ReportCharts';
import ReportExport from './wizard/ReportExport';

type WizardStep = 'type' | 'filters' | 'preview' | 'charts' | 'export';

const ReportWizard = () => {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<WizardStep>('type');
  const [reportConfig, setReportConfig] = useState({
    type: '',
    filters: {},
    format: 'excel'
  });

  const steps = [
    { id: 'type', title: 'Tipo', description: 'Selecciona el tipo de informe' },
    { id: 'filters', title: 'Filtros', description: 'Configura los filtros' },
    { id: 'preview', title: 'Vista Previa', description: 'Previsualiza los datos' },
    { id: 'charts', title: 'Gráficos', description: 'Visualiza los datos' },
    { id: 'export', title: 'Exportar', description: 'Exporta el informe' }
  ];

  const completedSteps = steps
    .slice(0, steps.findIndex(s => s.id === currentStep))
    .map(s => s.id);

  const handleNext = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].id as WizardStep);
    }
  };

  const handleBack = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id as WizardStep);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'type':
        return (
          <ReportTypeSelector
            userRole={user?.role}
            selectedType={reportConfig.type}
            onSelect={(type) => setReportConfig({ ...reportConfig, type })}
          />
        );
      case 'filters':
        return (
          <ReportFilters
            filters={reportConfig.filters}
            onFiltersChange={(filters) => setReportConfig({ ...reportConfig, filters })}
          />
        );
      case 'preview':
        return (
          <ReportPreview
            filters={reportConfig.filters}
          />
        );
      case 'charts':
        return (
          <ReportCharts
            filters={reportConfig.filters}
          />
        );
      case 'export':
        return (
          <ReportExport
            config={reportConfig}
            onFormatChange={(format) => setReportConfig({ ...reportConfig, format })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Content */}
      <div className="bg-white shadow rounded-lg">
        {/* Progress Steps */}
        <div className="p-6 border-b">
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>

        {/* Step Content */}
        <div className="p-6">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 'type'}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentStep === 'export'}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportWizard;