import React, { useState } from 'react';
import { useRegistrationCodesStore } from '../../../stores/registrationCodesStore';
import type { RegistrationCodeTemplate } from '../../../types/registrationCode';

const AutomaticCodeGenerator = () => {
  const { generateCode } = useRegistrationCodesStore();
  const [templates] = useState<RegistrationCodeTemplate[]>([
    {
      role: 'manager',
      maxUses: 1,
      validityDays: 7,
    },
    {
      role: 'subnet_coordinator',
      maxUses: 1,
      validityDays: 7,
    },
    {
      role: 'general_coordinator',
      maxUses: 1,
      validityDays: 7,
    }
  ]);

  const handleGenerateCode = (template: RegistrationCodeTemplate) => {
    generateCode(template);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Generación Automática de Códigos
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium mb-2">
              {template.role === 'manager' && 'Gestor'}
              {template.role === 'subnet_coordinator' && 'Coordinador de Subred'}
              {template.role === 'general_coordinator' && 'Coordinador General'}
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              Validez: {template.validityDays} días<br />
              Usos máximos: {template.maxUses}
            </p>
            <button
              onClick={() => handleGenerateCode(template)}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Generar Código
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutomaticCodeGenerator;