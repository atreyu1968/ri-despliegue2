import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import HelpNavigation from '../components/help/HelpNavigation';
import HelpViewer from '../components/help/HelpViewer';
import HelpEditor from '../components/help/HelpEditor';
import { useHelpStore } from '../stores/helpStore';

const Help = () => {
  const { user } = useAuthStore();
  const { getSection, deleteSection } = useHelpStore();
  const [selectedSectionId, setSelectedSectionId] = useState<string>();
  const [showEditor, setShowEditor] = useState(false);
  const [editingSection, setEditingSection] = useState<ReturnType<typeof getSection>>();

  const handleNewSection = () => {
    setEditingSection(undefined);
    setShowEditor(true);
  };

  const handleEditSection = () => {
    if (selectedSectionId) {
      setEditingSection(getSection(selectedSectionId));
      setShowEditor(true);
    }
  };

  const handleDeleteSection = () => {
    if (selectedSectionId && confirm('¿Está seguro de que desea eliminar esta sección?')) {
      deleteSection(selectedSectionId);
      setSelectedSectionId(undefined);
    }
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingSection(undefined);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Ayuda
          </h2>
        </div>
        <div className="p-4">
          <HelpNavigation
            onSelectSection={setSelectedSectionId}
            selectedSectionId={selectedSectionId}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {user?.role === 'admin' && (
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-3">
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleNewSection}
                className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                <span>Nueva Sección</span>
              </button>
              {selectedSectionId && (
                <>
                  <button
                    onClick={handleEditSection}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                  >
                    <Edit2 className="w-5 h-5" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={handleDeleteSection}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Eliminar</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {selectedSectionId ? (
          <HelpViewer sectionId={selectedSectionId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Selecciona una sección para ver su contenido
          </div>
        )}
      </div>

      {showEditor && (
        <HelpEditor
          section={editingSection}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
};

export default Help;