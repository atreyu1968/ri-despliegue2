import React from 'react';
import { useHelpStore } from '../../stores/helpStore';
import { Book } from 'lucide-react';

interface HelpViewerProps {
  sectionId: string;
}

const HelpViewer: React.FC<HelpViewerProps> = ({ sectionId }) => {
  const { getSection } = useHelpStore();
  const section = getSection(sectionId);

  if (!section) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center max-w-2xl mx-auto px-4">
          <Book className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Bienvenido al Sistema de Ayuda
          </h2>
          <p className="text-gray-600 mb-8">
            Aquí encontrarás toda la documentación necesaria para utilizar la plataforma.
            Selecciona una sección del menú para comenzar.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-2">Para Empezar</h3>
              <p className="text-sm text-gray-600">
                Revisa la guía básica de uso según tu rol en el sistema.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-2">Funcionalidades</h3>
              <p className="text-sm text-gray-600">
                Explora las diferentes características y módulos disponibles.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {section.title}
      </h1>
      
      <div className="prose prose-blue max-w-none">
        <div dangerouslySetInnerHTML={{ __html: section.content }} />
      </div>
      
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

          .pdf-download {
            display: inline-flex;
            align-items: center;
            padding: 0.5rem 1rem;
            background-color: #f3f4f6;
            color: #374151;
            border-radius: 0.375rem;
            text-decoration: none;
            margin: 1rem 0;
          }

          .pdf-download:hover {
            background-color: #e5e7eb;
          }

          .pdf-download svg {
            margin-right: 0.5rem;
          }
        `}
      </style>
    </div>
  );
};

export default HelpViewer;