//hooks/useSchedule.ts


import { useMemo } from 'react';
import type { LinguaEvent } from '../types/LinguaEvent';
import { computeDayStatus, type DayStatus } from '../utils/scheduleUtils';

export function useSchedule(events: LinguaEvent[]) {
  const dayMap = useMemo(() => computeDayStatus(events), [events]);

  const isSlotAvailable = (datetime: string) => {
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

  return {
    dayMap,
    isSlotAvailable,
    getDayStatus,
    getEventsCountForDay,
    maxSlotsPerDay: 8
  };
}

export default useSchedule;