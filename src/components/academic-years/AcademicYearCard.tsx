import React from 'react';
import { Calendar, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import type { AcademicYear } from '../../types/academicYear';
import QuarterManager from './QuarterManager';

interface AcademicYearCardProps {
  academicYear: AcademicYear;
  onEdit: (year: AcademicYear) => void;
  onToggleQuarter: (yearId: string, quarterId: string) => void;
}

const AcademicYearCard: React.FC<AcademicYearCardProps> = ({ 
  academicYear, 
  onEdit,
  onToggleQuarter 
}) => {
  const formatDate = (date: string) => new Date(date).toLocaleDateString('es-ES');

  return (
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{academicYear.name}</h3>
              <p className="text-sm text-gray-500">
                {formatDate(academicYear.startDate)} - {formatDate(academicYear.endDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {academicYear.isActive ? (
                <span className="flex items-center text-green-600 text-sm bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Activo
                </span>
              ) : (
                <span className="flex items-center text-gray-500 text-sm bg-gray-50 px-3 py-1 rounded-full">
                  <XCircle className="w-4 h-4 mr-1" />
                  Inactivo
                </span>
              )}
            </div>
            
            <button
              onClick={() => onEdit(academicYear)}
              className="text-gray-400 hover:text-blue-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Trimestres</h4>
          <div className="space-y-2">
            {academicYear.quarters.map((quarter) => (
              <QuarterManager
                key={quarter.id}
                quarter={quarter}
                onToggleActive={(quarterId) => onToggleQuarter(academicYear.id, quarterId)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicYearCard;