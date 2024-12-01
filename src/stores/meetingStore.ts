import { create } from 'zustand';
import type { Meeting } from '../types/meeting';

interface MeetingState {
  meetings: Meeting[];
  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  updateMeeting: (id: string, meeting: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  meetings: [],
  
  addMeeting: (meetingData) => set((state) => ({
    meetings: [...state.meetings, {
      ...meetingData,
      id: Date.now().toString(),
    }],
  })),
  
  updateMeeting: (id, meetingData) => set((state) => ({
    meetings: state.meetings.map((meeting) =>
      meeting.id === id ? { ...meeting, ...meetingData } : meeting
    ),
  })),
  
  deleteMeeting: (id) => set((state) => ({
    meetings: state.meetings.filter((meeting) => meeting.id !== id),
  })),
}));