import React, { useState, useEffect } from 'react';
import { Plus, Upload, Filter } from 'lucide-react';
import { useObservatoryStore } from '../stores/observatoryStore';
import ObservatoryList from '../components/observatory/ObservatoryList';
import ObservatoryForm from '../components/observatory/ObservatoryForm';
import ObservatoryFilters from '../components/observatory/ObservatoryFilters';
import CsvImport from '../components/observatory/CsvImport';
import { mockObservatory } from '../data/mockObservatory';
import type { ObservatoryFormData, CsvImportData, ObservatoryItem } from '../types/observatory';

const Observatory = () => {
  const { 
    items, 
    filters,
    setItems, 
    addItem,
    updateItem, 
    deleteItem, 
    setFilters,
    importErrors, 
    setImportErrors, 
    clearImportErrors 
  } = useObservatoryStore();
  
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingItem, setEditingItem] = useState<ObservatoryItem | null>(null);

  useEffect(() => {
    setItems(mockObservatory);
  }, [setItems]);

  const handleSubmit = (data: ObservatoryFormData) => {
    if (editingItem) {
      updateItem(editingItem.id, data);
    } else {
      addItem(data);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item: ObservatoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
      deleteItem(id);
    }
  };

  const handleImport = (data: CsvImportData[]) => {
    const errors = [];
    data.forEach((item, index) => {
      if (!item.type || !['practice', 'research', 'resource'].includes(item.type)) {
        errors.push({
          row: index + 1,
          field: 'type',
          message: 'Tipo inválido',
        });
      }
      if (!item.description || item.description.length < 100) {
        errors.push({
          row: index + 1,
          field: 'description',
          message: 'Descripción debe tener al menos 100 caracteres',
        });
      }
    });

    if (errors.length > 0) {
      setImportErrors(errors);
      return;
    }

    data.forEach(item => {
      addItem({
        ...item,
        tags: item.tags.split(',').map(tag => tag.trim()),
      });
    });

    clearImportErrors();
    setShowImport(false);
  };

  const filteredItems = items.filter(item => {
    if (filters.type && item.type !== filters.type) return false;
    if (filters.network && item.network !== filters.network) return false;
    if (filters.topic && item.topic !== filters.topic) return false;
    if (filters.startDate && item.publishDate < filters.startDate) return false;
    if (filters.endDate && item.publishDate > filters.endDate) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Observatorio de Innovación
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          >
            <Upload className="w-5 h-5" />
            <span>Importar</span>
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Registro</span>
          </button>
        </div>
      </div>

      <ObservatoryFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <ObservatoryList
            items={filteredItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {showForm && (
        <ObservatoryForm
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          initialData={editingItem}
        />
      )}

      {showImport && (
        <CsvImport
          onImport={handleImport}
          onClose={() => {
            setShowImport(false);
            clearImportErrors();
          }}
          errors={importErrors}
        />
      )}
    </div>
  );
};

export default Observatory;