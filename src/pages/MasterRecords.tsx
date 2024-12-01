import React, { useState, useEffect } from 'react';
import { Network, Users, GraduationCap, Plus, Building2, Target, Globe } from 'lucide-react';
import { useMasterRecordsStore } from '../stores/masterRecordsStore';
import { mockNetworks, mockCenters, mockFamilies, mockDepartments, mockObjectives } from '../data/mockMasterRecords';
import { mockODS } from '../data/mockODS';
import NetworkList from '../components/master-records/NetworkList';
import CenterList from '../components/master-records/CenterList';
import FamilyList from '../components/master-records/FamilyList';
import DepartmentList from '../components/master-records/DepartmentList';
import ObjectiveList from '../components/master-records/ObjectiveList';
import NetworkForm from '../components/master-records/NetworkForm';
import CenterForm from '../components/master-records/CenterForm';
import FamilyForm from '../components/master-records/FamilyForm';
import DepartmentForm from '../components/master-records/DepartmentForm';
import ObjectiveForm from '../components/master-records/ObjectiveForm';
import type { Network as NetworkType, Center, ProfessionalFamily, Department, NetworkObjective } from '../types/masterRecords';

type TabType = 'networks' | 'centers' | 'families' | 'departments' | 'objectives' | 'ods';

const MasterRecords = () => {
  const {
    networks,
    centers,
    families,
    departments,
    objectives,
    ods,
    setNetworks,
    setCenters,
    setFamilies,
    setDepartments,
    setObjectives,
    setODS,
    addNetwork,
    updateNetwork,
    deleteNetwork,
    addCenter,
    updateCenter,
    deleteCenter,
    addFamily,
    updateFamily,
    deleteFamily,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addObjective,
    updateObjective,
    deleteObjective,
    toggleObjectiveActive,
    toggleODSActive,
  } = useMasterRecordsStore();

  const [activeTab, setActiveTab] = useState<TabType>('networks');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<NetworkType | Center | ProfessionalFamily | Department | NetworkObjective | null>(null);

  useEffect(() => {
    setNetworks(mockNetworks);
    setCenters(mockCenters);
    setFamilies(mockFamilies);
    setDepartments(mockDepartments);
    setObjectives(mockObjectives);
    setODS(mockODS);
  }, [setNetworks, setCenters, setFamilies, setDepartments, setObjectives, setODS]);

  const tabs = [
    { id: 'networks' as const, label: 'Redes', icon: Network },
    { id: 'centers' as const, label: 'Centros', icon: Users },
    { id: 'families' as const, label: 'Familias Profesionales', icon: GraduationCap },
    { id: 'departments' as const, label: 'Departamentos', icon: Building2 },
    { id: 'objectives' as const, label: 'Objetivos', icon: Target },
    { id: 'ods' as const, label: 'ODS', icon: Globe },
  ];

  const handleEdit = (item: NetworkType | Center | ProfessionalFamily | Department | NetworkObjective) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este elemento?')) {
      switch (activeTab) {
        case 'networks':
          deleteNetwork(id);
          break;
        case 'centers':
          deleteCenter(id);
          break;
        case 'families':
          deleteFamily(id);
          break;
        case 'departments':
          deleteDepartment(id);
          break;
        case 'objectives':
          deleteObjective(id);
          break;
      }
    }
  };

  const handleSubmit = (data: any) => {
    if (editingItem) {
      switch (activeTab) {
        case 'networks':
          updateNetwork(editingItem.id, data);
          break;
        case 'centers':
          updateCenter(editingItem.id, data);
          break;
        case 'families':
          updateFamily(editingItem.id, data);
          break;
        case 'departments':
          updateDepartment(editingItem.id, data);
          break;
        case 'objectives':
          updateObjective(editingItem.id, data);
          break;
      }
    } else {
      switch (activeTab) {
        case 'networks':
          addNetwork(data);
          break;
        case 'centers':
          addCenter(data);
          break;
        case 'families':
          addFamily(data);
          break;
        case 'departments':
          addDepartment(data);
          break;
        case 'objectives':
          addObjective(data);
          break;
      }
    }
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Registros Maestros</h1>
        {activeTab !== 'ods' && (
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
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'networks' && (
            <NetworkList
              networks={networks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {activeTab === 'centers' && (
            <CenterList
              centers={centers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {activeTab === 'families' && (
            <FamilyList
              families={families}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {activeTab === 'departments' && (
            <DepartmentList
              departments={departments}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {activeTab === 'objectives' && (
            <ObjectiveList
              objectives={objectives}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={toggleObjectiveActive}
            />
          )}

          {activeTab === 'ods' && (
            <ObjectiveList
              objectives={ods}
              onEdit={() => {}}
              onDelete={() => {}}
              onToggleActive={toggleODSActive}
            />
          )}
        </div>
      </div>

      {showForm && (
        <>
          {activeTab === 'networks' && (
            <NetworkForm
              onSubmit={handleSubmit}
              onClose={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              initialData={editingItem as NetworkType}
            />
          )}
          {activeTab === 'centers' && (
            <CenterForm
              onSubmit={handleSubmit}
              onClose={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              initialData={editingItem as Center}
            />
          )}
          {activeTab === 'families' && (
            <FamilyForm
              onSubmit={handleSubmit}
              onClose={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              initialData={editingItem as ProfessionalFamily}
            />
          )}
          {activeTab === 'departments' && (
            <DepartmentForm
              onSubmit={handleSubmit}
              onClose={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              initialData={editingItem as Department}
            />
          )}
          {activeTab === 'objectives' && (
            <ObjectiveForm
              onSubmit={handleSubmit}
              onClose={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              initialData={editingItem as NetworkObjective}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MasterRecords;