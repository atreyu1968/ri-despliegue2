import React from 'react';
import { Pencil, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import type { Center } from '../../types/masterRecords';

interface CenterListProps {
  centers: Center[];
  onEdit: (center: Center) => void;
  onDelete: (id: string) => void;
}

const CenterList: React.FC<CenterListProps> = ({ centers, onEdit, onDelete }) => {
  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="space-y-4">
      {centers.map((center) => (
        <div key={center.id} className="bg-white border rounded-lg shadow-sm hover:shadow transition-shadow">
          <div className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-3">
              <div className="font-medium text-gray-900">{center.name}</div>
              <div className="text-sm text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded mt-1">
                {center.code}
              </div>
            </div>
            
            <div className="col-span-3">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{center.municipality}, {center.island}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">{center.address}</div>
            </div>
            
            <div className="col-span-4">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <button
                  onClick={() => handleSendEmail(center.email)}
                  className="flex items-center hover:text-blue-600"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  <span>{center.email}</span>
                </button>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <button
                  onClick={() => handleCall(center.phone)}
                  className="flex items-center hover:text-blue-600"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  <span>{center.phone}</span>
                </button>
              </div>
            </div>

            <div className="col-span-2 flex items-center justify-end space-x-2">
              <button
                onClick={() => onEdit(center)}
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(center.id)}
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

export default CenterList;