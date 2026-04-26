// src/hooks/useEvents.ts

import { useState, useEffect } from 'react';
import type { LinguaEvent, EventFormData } from '../types/LinguaEvent';
import type { ChannelType } from '../types/Channel';

const STORAGE_KEY = 'lingua-events';

// Helper to generate unique ID
const generateId = () => Date.now();

// Initial demo data with correct channel types
const getInitialEvents = (): LinguaEvent[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  
  return [
    {
      id: generateId(),
      account: 'Sprachzentrum Berlin',
      address: 'Friedrichstraße 123, Berlin',
      title: 'Englisch B2 Konversation',
      teacher: 'Sarah Johnson',
      student: 'Michael Brown',
      channel: 'zoom' as ChannelType,
      datetime: '2024-03-20T10:00',
      createdAt: new Date().toISOString()
    },
    {
      id: generateId() + 1,
      account: 'Lingua Academy',
      address: 'Marienplatz 45, München',
      title: 'Deutsch A1 Anfänger',
      teacher: 'Thomas Weber',
      student: 'Anna Schmidt',
      channel: 'meet' as ChannelType,
      datetime: '2024-03-21T14:00',
      createdAt: new Date().toISOString()
    }
  ];
};

export function useEvents() {
  const [events, setEvents] = useState<LinguaEvent[]>(getInitialEvents);

  // Save to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const addEvent = (eventData: EventFormData): LinguaEvent => {
    const newEvent: LinguaEvent = {
      id: Date.now(),
      ...eventData,
      createdAt: new Date().toISOString()  // ← Add createdAt property
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: number, formData: EventFormData) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { ...formData, id, createdAt: event.createdAt }  // ← Keep original createdAt
        : event
    ));
  };

  const deleteEvent = (id: number) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const moveEventUp = (index: number) => {
    if (index === 0) return;
    setEvents(prev => {
      const newEvents = [...prev];
      [newEvents[index - 1], newEvents[index]] = [newEvents[index], newEvents[index - 1]];
      return newEvents;
    });
  };

  const moveEventDown = (index: number) => {
    if (index === events.length - 1) return;
    setEvents(prev => {
      const newEvents = [...prev];
      [newEvents[index], newEvents[index + 1]] = [newEvents[index + 1], newEvents[index]];
      return newEvents;
    });
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    moveEventUp,
    moveEventDown
  };
}