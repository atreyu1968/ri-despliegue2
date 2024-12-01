import React from 'react';
import { FileText, Trash2, ExternalLink, Tag, Calendar, Network, Pencil } from 'lucide-react';
import type { ObservatoryItem } from '../../types/observatory';

interface ObservatoryListProps {
  items: ObservatoryItem[];
  onEdit: (item: ObservatoryItem) => void;
  onDelete: (id: string) => void;
}

const ObservatoryList: React.FC<ObservatoryListProps> = ({ items, onEdit, onDelete }) => {
  const getTypeLabel = (type: ObservatoryItem['type']) => {
    switch (type) {
      case 'practice': return 'Buena Práctica';
      case 'research': return 'Investigación';
      case 'resource': return 'Recurso';
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('es-ES');

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="bg-white border rounded-lg shadow-sm hover:shadow transition-shadow">
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    {getTypeLabel(item.type)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(item.publishDate)}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-2">{item.title}</h3>
              </div>
              
              <div className="flex items-center space-x-2">
                <a
                  href={item.resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
                <button
                  onClick={() => onEdit(item)}
                  className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <Network className="w-4 h-4 mr-1" />
                <span>{item.network}</span>
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                <span>{item.topic}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{item.description}</p>

            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay elementos registrados
        </div>
      )}
    </div>
  );
};

export default ObservatoryList;