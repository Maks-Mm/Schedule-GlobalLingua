//hooks/useSchedule.ts

import { useMemo } from 'react';
import type { LinguaEvent } from '../types/LinguaEvent';
import { computeDayStatus, type DayStatus } from '../utils/scheduleUtils';

// Define the return type for the hook
interface UseScheduleReturn {
  dayMap: Record<string, DayStatus>;
  isSlotAvailable: (datetime: string) => boolean;
  getDayStatus: (date: string) => DayStatus;
  getEventsCountForDay: (date: string) => number;
  findNextAvailableDays: (fromDate: Date, daysToCheck?: number) => string[];
  getSmartSuggestion: (selectedDay: string) => { message: string; suggestedDays: string[] };
  getNextAvailableSlot: (date: Date) => string | null;
  maxSlotsPerDay: number;
}

export function useSchedule(events: LinguaEvent[]): UseScheduleReturn {
  const dayMap = useMemo(() => computeDayStatus(events), [events]);
  const maxSlotsPerDay = 8; // Your existing limit

  const isSlotAvailable = (datetime: string): boolean => {
    if (!datetime) return false;
    const day = datetime.split('T')[0];
    const dayStatus = dayMap[day];
    
    if (dayStatus === 'FULL') return false;
    
    const exactSlotTaken = events.some(ev => ev.datetime === datetime);
    if (exactSlotTaken) return false;
    
    return true;
  };

  const getDayStatus = (date: string): DayStatus => {
    return dayMap[date] || 'AVAILABLE';
  };

  const getEventsCountForDay = (date: string): number => {
    return events.filter(ev => ev.datetime.split('T')[0] === date).length;
  };

  // Find next available days with actual available slots
  const findNextAvailableDays = (fromDate: Date, daysToCheck: number = 14): string[] => {
    const availableDays: string[] = [];
    const currentDate = new Date(fromDate);
    
    for (let i = 0; i < daysToCheck; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(currentDate.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      // Check if this day has capacity
      if (getEventsCountForDay(dateStr) < maxSlotsPerDay) {
        availableDays.push(dateStr);
        if (availableDays.length >= 3) break; // Suggest up to 3 available days
      }
    }
    
    return availableDays;
  };

  // Get smart suggestion message with available days
  const getSmartSuggestion = (selectedDay: string): { message: string; suggestedDays: string[] } => {
    const currentCount = getEventsCountForDay(selectedDay);
    const remaining = maxSlotsPerDay - currentCount;
    
    if (currentCount >= maxSlotsPerDay) {
      // Day is full - find next available days
      const nextDays = findNextAvailableDays(new Date(selectedDay), 14);
      
      if (nextDays.length > 0) {
        const formattedDays = nextDays.map(day => {
          const date = new Date(day);
          return date.toLocaleDateString('de-DE', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'numeric' 
          });
        }).join(', ');
        
        return {
          message: `⚠️ Tag voll (${maxSlotsPerDay}/${maxSlotsPerDay}). Nächste freie Tage: ${formattedDays}`,
          suggestedDays: nextDays
        };
      }
      return {
        message: `❌ Keine Termine in den nächsten 14 Tagen verfügbar.`,
        suggestedDays: []
      };
    }
    
    // Day has availability
    return {
      message: `✅ ${remaining} ${remaining === 1 ? 'Slot' : 'Slots'} verfügbar an diesem Tag`,
      suggestedDays: []
    };
  };

  // Get next available time slot for a specific day
  const getNextAvailableSlot = (date: Date): string | null => {
    const dateStr = date.toISOString().split('T')[0];
    const existingSlots = events
      .filter(ev => ev.datetime.split('T')[0] === dateStr)
      .map(ev => ev.datetime);
    
    // Try common time slots (9:00, 10:00, 11:00, 13:00, 14:00, 15:00, 16:00)
    const commonSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
    
    for (const slot of commonSlots) {
      const datetime = `${dateStr}T${slot}`;
      if (!existingSlots.includes(datetime) && isSlotAvailable(datetime)) {
        return datetime;
      }
    }
    
    return null;
  };

  return {
    dayMap,
    isSlotAvailable,
    getDayStatus,
    getEventsCountForDay,
    findNextAvailableDays,
    getSmartSuggestion,
    getNextAvailableSlot,
    maxSlotsPerDay
  };
}

export default useSchedule;