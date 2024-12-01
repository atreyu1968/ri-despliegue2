export type MeetingType = 'personal' | 'network';

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: MeetingType;
  network?: string;
  center?: string;
  organizerId: string;
  participants: string[];
}