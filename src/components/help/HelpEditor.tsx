import React, { useState } from 'react';
import { X, Save, Eye, Edit2 } from 'lucide-react';
import { useHelpStore } from '../../stores/helpStore';
import type { HelpSection } from '../../types/help';
import RichTextEditor from './RichTextEditor';

interface HelpEditorProps {
  section?: HelpSection;
  onClose: () => void;
}

const HelpEditor: React.FC<HelpEditorProps> = ({ section, onClose }) => {
  const { addSection, updateSection } = useHelpStore();
  const [title, setTitle] = useState(section?.title || '');
  const [content, setContent] = useState(section?.content || '');
  const [isPreview, setIsPreview] = useState(false);
  const [order, setOrder] = useState(section?.order || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sectionData = {
      title,
      content,
      parentId: section?.parentId,
      order,
    };

    if (section) {
      updateSection(section.id, sectionData);
    } else {
      addSection(sectionData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">
            {section ? 'Editar' : 'Nueva'} Sección
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`p-2 rounded-lg transition-colors ${
                isPreview 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={isPreview ? 'Editar' : 'Vista previa'}
            >
              {isPreview ? <Edit2 className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orden
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              min="0"
            />
          </div>

          {isPreview ? (
            <div className="prose max-w-none">
              <h2>{title}</h2>
              <div dangerouslySetInnerHTML={{ __html: content }} />
              <style>
                {`
                  .module {
                    margin: 1rem 0;
                    padding: 1rem;
                    background: #f9fafb;
                    border-radius: 0.375rem;
                  }
                  
                  .note {
                    background: #eff6ff;
                    padding: 1rem;
                    border-left: 4px solid #2563eb;
                    margin: 1rem 0;
                  }
                  
                  table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1rem 0;
                  }
                  
                  th, td {
                    padding: 0.75rem;
                    border: 1px solid #e5e7eb;
                    text-align: left;
                  }
                  
                  th {
                    background: #f3f4f6;
                  }
                `}
              </style>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido
              </label>
              <RichTextEditor
                content={content}
                onChange={setContent}
              />
            </div>
          )}

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
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              <Save className="w-5 h-5" />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HelpEditor;