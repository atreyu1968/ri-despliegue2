import React from 'react';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { useMasterRecordsStore } from '../../../stores/masterRecordsStore';
import type { Action } from '../../../types/action';

interface FamiliesProps {
  data: Partial<Action>;
  onChange: (data: Partial<Action>) => void;
}

const Families: React.FC<FamiliesProps> = ({ data, onChange }) => {
  const { families } = useMasterRecordsStore();
  const [selectedFamily, setSelectedFamily] = React.useState('');
  const [selectedGroups, setSelectedGroups] = React.useState<string[]>([]);

  const handleAddFamily = () => {
    if (selectedFamily && !data.professionalFamilies?.includes(selectedFamily)) {
      onChange({
        professionalFamilies: [...(data.professionalFamilies || []), selectedFamily],
        selectedGroups: [...(data.selectedGroups || []), ...selectedGroups],
      });
      setSelectedFamily('');
      setSelectedGroups([]);
    }
  };

  const handleRemoveFamily = (familyCode: string) => {
    const family = families.find(f => f.code === familyCode);
    const familyGroupIds = family?.studies.flatMap(s => s.groups.map(g => g.id)) || [];
    
    onChange({
      professionalFamilies: data.professionalFamilies?.filter(f => f !== familyCode) || [],
      selectedGroups: data.selectedGroups?.filter(g => !familyGroupIds.includes(g)) || [],
    });
  };

  const selectedFamilies = families.filter(
    family => data.professionalFamilies?.includes(family.code)
  );

  const currentFamily = families.find(f => f.code === selectedFamily);
  const availableGroups = currentFamily?.studies.flatMap(s => s.groups) || [];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Familias Profesionales y Grupos
        </label>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <GraduationCap className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <select
                value={selectedFamily}
                onChange={(e) => {
                  setSelectedFamily(e.target.value);
                  setSelectedGroups([]);
                }}
                className="pl-10 w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar familia...</option>
                {families
                  .filter(family => !data.professionalFamilies?.includes(family.code))
                  .map(family => (
                    <option key={family.id} value={family.code}>
                      {family.name}
                    </option>
                  ))
                }
              </select>
            </div>
            <button
              type="button"
              onClick={handleAddFamily}
              disabled={!selectedFamily || selectedGroups.length === 0}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {selectedFamily && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Grupos
              </label>
              <div className="space-y-2">
                {availableGroups.map((group) => (
                  <label key={group.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.id)}
                      onChange={(e) => {
                        setSelectedGroups(prev =>
                          e.target.checked
                            ? [...prev, group.id]
                            : prev.filter(id => id !== group.id)
                        );
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      {group.name} ({group.code})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {selectedFamilies.map((family) => {
          const familyGroups = family.studies
            .flatMap(s => s.groups)
            .filter(g => data.selectedGroups?.includes(g.id));

          return (
            <div
              key={family.id}
              className="bg-gray-50 p-4 rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{family.name}</div>
                  <div className="text-sm text-gray-500">{family.code}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFamily(family.code)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {familyGroups.length > 0 && (
                <div className="pl-4 border-l-2 border-gray-200 mt-2">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Grupos seleccionados:
                  </div>
                  <div className="space-y-1">
                    {familyGroups.map(group => (
                      <div key={group.id} className="text-sm text-gray-600">
                        {group.name} ({group.code})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {selectedFamilies.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No hay familias profesionales seleccionadas
          </p>
        )}
      </div>
    </div>
  );
};

export default Families;