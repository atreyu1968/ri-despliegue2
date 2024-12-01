import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Department } from '../../types/masterRecords';

interface DepartmentListProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (id: string) => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({ departments, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {departments.map((department) => (
        <div key={department.id} className="bg-white border rounded-lg shadow-sm hover:shadow transition-shadow">
          <div className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-10">
              <div className="font-medium text-gray-900">{department.name}</div>
              <div className="text-sm text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded mt-1">
                {department.code}
              </div>
            </div>

            <div className="col-span-2 flex items-center justify-end space-x-2">
              <button
                onClick={() => onEdit(department)}
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(department.id)}
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

export default DepartmentList;