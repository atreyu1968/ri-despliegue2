import React, { useEffect } from 'react';
import { useRegistrationCodesStore } from '../../stores/registrationCodesStore';
import RegistrationCodeList from './registration/RegistrationCodeList';
import AutomaticCodeGenerator from './registration/AutomaticCodeGenerator';

const RegistrationCodes = () => {
  const { codes, cleanExpiredCodes } = useRegistrationCodesStore();

  // Limpiar códigos expirados cada minuto
  useEffect(() => {
    cleanExpiredCodes();
    const interval = setInterval(cleanExpiredCodes, 60000);
    return () => clearInterval(interval);
  }, [cleanExpiredCodes]);

  return (
    <div className="space-y-8">
      <AutomaticCodeGenerator />
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Códigos Activos
        </h3>
        <RegistrationCodeList codes={codes} />
      </div>
    </div>
  );
};

export default RegistrationCodes;