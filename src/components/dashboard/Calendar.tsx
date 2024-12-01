import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, MapPin, Pencil, Trash2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuthStore } from '../../stores/authStore';
import { useMeetingStore } from '../../stores/meetingStore';
import MeetingForm from './MeetingForm';
import MeetingDetails from './MeetingDetails';
import type { Meeting } from '../../types/meeting';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const { user } = useAuthStore();
  const { meetings, deleteMeeting } = useMeetingStore();

  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return isSameDay(meetingDate, date) && (
        meeting.organizerId === user?.id ||
        meeting.participants.includes(user?.id || '')
      );
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (isSameMonth(date, currentDate)) {
      setShowMeetingForm(true);
    }
  };

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowMeetingDetails(true);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowMeetingForm(true);
    setShowMeetingDetails(false);
  };

  const handleDeleteMeeting = (meeting: Meeting) => {
    if (confirm('¿Está seguro de que desea eliminar esta reunión?')) {
      deleteMeeting(meeting.id);
      setShowMeetingDetails(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const canEditMeeting = (meeting: Meeting) => {
    return meeting.organizerId === user?.id;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Calendario de Reuniones</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              ←
            </button>
            <span className="text-lg font-medium">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              →
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {/* Weekday headers */}
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div
              key={day}
              className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map(date => {
            const dayMeetings = getMeetingsForDate(date);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isCurrentMonth = isSameMonth(date, currentDate);

            return (
              <div
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                className={`
                  relative bg-white p-2 h-24 hover:bg-gray-50 cursor-pointer
                  ${!isCurrentMonth && 'text-gray-400'}
                  ${isToday(date) && 'bg-blue-50'}
                  ${isSelected && 'ring-2 ring-blue-500'}
                `}
              >
                <span className="absolute top-1 right-1 text-sm">
                  {format(date, 'd')}
                </span>
                <div className="mt-6">
                  {dayMeetings.slice(0, 2).map((meeting) => (
                    <div
                      key={meeting.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMeetingClick(meeting);
                      }}
                      className={`
                        w-full text-left text-xs p-1 mb-1 rounded truncate cursor-pointer
                        ${meeting.type === 'network' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                      `}
                    >
                      {meeting.title}
                    </div>
                  ))}
                  {dayMeetings.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayMeetings.length - 2} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming Meetings */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Próximas Reuniones
          </h3>
          <div className="space-y-3">
            {meetings
              .filter(meeting => new Date(meeting.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 3)
              .map(meeting => (
                <div
                  key={meeting.id}
                  onClick={() => {
                    setSelectedMeeting(meeting);
                    setShowMeetingDetails(true);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div className={`
                      p-2 rounded-lg 
                      ${meeting.type === 'network' ? 'bg-green-100' : 'bg-blue-100'}
                    `}>
                      <CalendarIcon className={`
                        w-5 h-5 
                        ${meeting.type === 'network' ? 'text-green-600' : 'text-blue-600'}
                      `} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {meeting.title}
                      </p>
                      <div className="mt-1 text-xs text-gray-500 space-y-1">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {format(new Date(meeting.date), 'PPp', { locale: es })}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {meeting.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {meeting.participants.length} participantes
                        </div>
                      </div>
                    </div>
                    {canEditMeeting(meeting) && (
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditMeeting(meeting);
                          }}
                          className="p-1 text-gray-500 hover:text-blue-600 rounded"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMeeting(meeting);
                          }}
                          className="p-1 text-gray-500 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {showMeetingForm && (
        <MeetingForm
          date={selectedDate!}
          meeting={selectedMeeting}
          onClose={() => {
            setShowMeetingForm(false);
            setSelectedDate(null);
            setSelectedMeeting(null);
          }}
        />
      )}

      {showMeetingDetails && selectedMeeting && (
        <MeetingDetails
          meeting={selectedMeeting}
          onClose={() => {
            setShowMeetingDetails(false);
            setSelectedMeeting(null);
          }}
          onEdit={() => handleEditMeeting(selectedMeeting)}
          onDelete={() => handleDeleteMeeting(selectedMeeting)}
          canEdit={canEditMeeting(selectedMeeting)}
        />
      )}
    </div>
  );
};

export default Calendar;