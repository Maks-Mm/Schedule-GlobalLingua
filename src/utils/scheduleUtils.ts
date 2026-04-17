//utils/scheduleUtils.ts

import type { LinguaEvent } from '../types/LinguaEvent';

export type DayStatus = 'AVAILABLE' | 'PARTIAL' | 'FULL';

export function computeDayStatus(events: LinguaEvent[]) {
  const map: Record<string, DayStatus> = {};

  const grouped = events.reduce((acc, ev) => {
    const day = ev.datetime.split('T')[0];
    if (!acc[day]) acc[day] = [];
    acc[day].push(ev);
    return acc;
  }, {} as Record<string, LinguaEvent[]>);

  for (const day in grouped) {
    const count = grouped[day].length;

    if (count >= 8) map[day] = 'FULL';         // hard limit
    else if (count > 0) map[day] = 'PARTIAL';
    else map[day] = 'AVAILABLE';
  }

  return map;
}

export function getEventsForDay(events: LinguaEvent[], day: string) {
  return events.filter(ev => ev.datetime.split('T')[0] === day);
}

export function getEventsForTimeSlot(events: LinguaEvent[], datetime: string) {
  return events.filter(ev => ev.datetime === datetime);
}