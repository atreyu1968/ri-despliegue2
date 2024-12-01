import React from 'react';
import { Pencil, Trash2, GraduationCap, Users } from 'lucide-react';
import type { ProfessionalFamily } from '../../types/masterRecords';

interface FamilyListProps {
  families: ProfessionalFamily[];
  onEdit: (family: ProfessionalFamily) => void;
  onDelete: (id: string) => void;
}

const FamilyList: React.FC<FamilyListProps> = ({ families, onEdit, onDelete }) => {
  const getTotalGroups = (family: ProfessionalFamily) => {
    return family.studies.reduce((total, study) => total + study.groups.length, 0);
  };

  return (
    <div className="space-y-4">
      {families.map((family) => (
        <div key={family.id} className="bg-white border rounded-lg shadow-sm hover:shadow transition-shadow">
          <div className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-3">
              <div className="font-medium text-gray-900">{family.name}</div>
              <div className="text-sm text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded mt-1">
                {family.code}
              </div>
            </div>
            
            <div className="col-span-3">
              <div className="text-sm text-gray-600">{family.description}</div>
            </div>
            
            <div className="col-span-4">
              <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <GraduationCap className="w-4 h-4 mr-1" />
                <span>Estudios ({family.studies.length})</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                <span>Grupos ({getTotalGroups(family)})</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {family.studies.map(study => study.name).join(', ')}
              </div>
            </div>

            <div className="col-span-2 flex items-center justify-end space-x-2">
              <button
                onClick={() => onEdit(family)}
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(family.id)}
                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FamilyList;