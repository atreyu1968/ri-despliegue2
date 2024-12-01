import React from 'react';
import { X, Clock, Users, MapPin, Video, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuthStore } from '../../stores/authStore';
import type { Meeting } from '../../types/meeting';

interface MeetingDetailsProps {
  meeting: Meeting;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
}

const MeetingDetails: React.FC<MeetingDetailsProps> = ({
  meeting,
  onClose,
  onEdit,
  onDelete,
  canEdit,
}) => {
  const { users } = useAuthStore();

  const getParticipantName = (userId: string) => {
    const user = users?.find(u => u.id === userId);
    return user ? `${user.name} ${user.lastName}` : 'Usuario desconocido';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Detalles de la Reunión</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium text-gray-900">{meeting.title}</h3>
              <div className="mt-2 text-sm text-gray-500">{meeting.description}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{format(new Date(meeting.date), 'PPp', { locale: es })}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{meeting.location}</span>
              </div>
            </div>

            {meeting.isVideoConference && meeting.videoUrl && (
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <Video className="w-4 h-4" />
                <a
                  href={meeting.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Unirse a la videoconferencia
                </a>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Participantes ({meeting.participants.length})
              </h4>
              <div className="space-y-1">
                {meeting.participants.map(participantId => (
                  <div key={participantId} className="text-sm text-gray-600">
                    {getParticipantName(participantId)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="flex justify-end space-x-3 p-4 border-t bg-gray-50">
            <button
              onClick={onDelete}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              <Pencil className="w-4 h-4" />
              <span>Editar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingDetails;