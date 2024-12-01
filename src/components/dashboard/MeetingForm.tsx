import React, { useState, useEffect } from 'react';
import { X, Users, Video } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuthStore } from '../../stores/authStore';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';
import { useMeetingStore } from '../../stores/meetingStore';
import { useMeetingConfigStore } from '../../stores/meetingConfigStore';
import { useEmailConfigStore } from '../../stores/emailConfigStore';
import type { Meeting } from '../../types/meeting';
import type { User } from '../../types/user';

interface MeetingFormProps {
  date: Date;
  meeting?: Meeting | null;
  onClose: () => void;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ date, meeting, onClose }) => {
  const { user } = useAuthStore();
  const { networks, centers } = useMasterRecordsStore();
  const { addMeeting, updateMeeting } = useMeetingStore();
  const { config: meetingConfig, generateMeetingUrl } = useMeetingConfigStore();
  const { config: emailConfig } = useEmailConfigStore();
  const [formData, setFormData] = useState<Omit<Meeting, 'id'>>({
    title: meeting?.title || '',
    description: meeting?.description || '',
    date: meeting ? meeting.date : format(date, "yyyy-MM-dd'T'HH:mm"),
    location: meeting?.location || '',
    type: meeting?.type || 'personal',
    network: meeting?.network || user?.network || '',
    center: meeting?.center || user?.center || '',
    organizerId: meeting?.organizerId || user?.id || '',
    participants: meeting?.participants || [],
    isVideoConference: meeting?.isVideoConference || false,
    videoUrl: meeting?.videoUrl || '',
  });

  const [availableParticipants, setAvailableParticipants] = useState<User[]>([]);

  // Cargar participantes disponibles según el tipo de reunión
  const loadAvailableParticipants = async () => {
    // Aquí cargarías los usuarios según el tipo de reunión y permisos
    // Por ahora usamos datos de ejemplo
    const mockUsers = [
      { id: '1', name: 'Usuario 1', role: 'manager', network: 'RED1', center: 'Centro 1' },
      { id: '2', name: 'Usuario 2', role: 'manager', network: 'RED1', center: 'Centro 2' },
    ];
    setAvailableParticipants(mockUsers as User[]);
  };

  useEffect(() => {
    loadAvailableParticipants();
  }, [formData.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let videoUrl = formData.videoUrl;
    if (formData.isVideoConference && meetingConfig.enabled && !videoUrl) {
      try {
        videoUrl = await generateMeetingUrl();
      } catch (error) {
        console.error('Error generating meeting URL:', error);
      }
    }

    const meetingData = {
      ...formData,
      videoUrl,
    };

    if (meeting) {
      updateMeeting(meeting.id, meetingData);
    } else {
      addMeeting(meetingData);
    }

    // Enviar notificaciones por correo si está configurado
    if (emailConfig.enabled) {
      // Aquí implementarías el envío de correos a los participantes
      console.log('Sending email notifications...');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {meeting ? 'Editar' : 'Nueva'} Reunión
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={formData.type}
                onChange={(e) => {
                  const type = e.target.value as Meeting['type'];
                  setFormData(prev => ({ ...prev, type }));
                  loadAvailableParticipants();
                }}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="personal">Personal</option>
                <option value="network">Red</option>
              </select>
            </div>
          </div>

          {/* Videoconferencia */}
          {meetingConfig.enabled && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isVideoConference"
                checked={formData.isVideoConference}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  isVideoConference: e.target.checked,
                  videoUrl: e.target.checked ? prev.videoUrl : ''
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isVideoConference" className="text-sm text-gray-700 flex items-center">
                <Video className="w-4 h-4 mr-1" />
                Incluir videoconferencia
              </label>
            </div>
          )}

          {/* Participantes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participantes
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
              {availableParticipants.map(participant => (
                <label key={participant.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.participants.includes(participant.id)}
                    onChange={(e) => {
                      const newParticipants = e.target.checked
                        ? [...formData.participants, participant.id]
                        : formData.participants.filter(id => id !== participant.id);
                      setFormData(prev => ({ ...prev, participants: newParticipants }));
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm">{participant.name}</span>
                </label>
              ))}
            </div>
          </div>

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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {meeting ? 'Guardar Cambios' : 'Crear Reunión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingForm;