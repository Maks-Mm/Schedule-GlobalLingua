//src/types/LinguaEvent.ts


import type { ChannelType } from '../types/Channel';

export interface LinguaEvent {
  id: number;
  account: string;
  address: string;
  title: string;
  teacher: string;
  student: string;
  channel: ChannelType; // Changed from string to ChannelType
  datetime: string;
  createdAt: string;
}

export type EventFormData = Omit<LinguaEvent, 'id' | 'createdAt'>;