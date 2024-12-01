import React from 'react';
import { Users } from 'lucide-react';
import type { Action } from '../../../types/action';

interface ParticipantsProps {
  data: Partial<Action>;
  onChange: (data: Partial<Action>) => void;
}

const Participants: React.FC<ParticipantsProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof Action, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Participantes (Estudiantes)
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="number"
              min="0"
              value={data.studentParticipants || 0}
              onChange={(e) => handleChange('studentParticipants', parseInt(e.target.value))}
              className="pl-10 w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Participantes (Profesores)
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="number"
              min="0"
              value={data.teacherParticipants || 0}
              onChange={(e) => handleChange('teacherParticipants', parseInt(e.target.value))}
              className="pl-10 w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comentarios
          </label>
          <textarea
            value={data.comments || ''}
            onChange={(e) => handleChange('comments', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valoración
          </label>
          <select
            value={data.rating || 5}
            onChange={(e) => handleChange('rating', parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {[1, 2, 3, 4, 5].map(rating => (
              <option key={rating} value={rating}>
                {rating} {rating === 1 ? 'estrella' : 'estrellas'}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Participants;