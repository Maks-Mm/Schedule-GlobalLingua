// src/hooks/useEvents.ts


import { useState, useEffect } from 'react';
import type { LinguaEvent, EventFormData } from '../types/LinguaEvent';

const STORAGE_KEY = 'lingua_events';

export function useEvents() {
  const [events, setEvents] = useState<LinguaEvent[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      // Add demo event if empty
      const demoEvent: LinguaEvent = {
        id: 1001,
        account: 'GlobalLingua Academy',
        address: 'Online / Virtual Classroom',
        title: '🇬🇧 Business English Intensiv',
        teacher: 'Ms. Thompson',
        student: 'Advanced Group A',
        channel: 'Zoom',
        datetime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        createdAt: new Date().toISOString()
      };
      setEvents([demoEvent]);
    }
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  }, [events]);

  const addEvent = (eventData: EventFormData) => {
    const newEvent: LinguaEvent = {
      ...eventData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: number, eventData: EventFormData) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { ...eventData, id, createdAt: event.createdAt }
        : event
    ));
  };

  const deleteEvent = (id: number) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const moveEventUp = (index: number) => {
    if (index <= 0) return;
    setEvents(prev => {
      const newEvents = [...prev];
      [newEvents[index - 1], newEvents[index]] = [newEvents[index], newEvents[index - 1]];
      return newEvents;
    });
  };

  const moveEventDown = (index: number) => {
    if (index >= events.length - 1) return;
    setEvents(prev => {
      const newEvents = [...prev];
      [newEvents[index + 1], newEvents[index]] = [newEvents[index], newEvents[index + 1]];
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