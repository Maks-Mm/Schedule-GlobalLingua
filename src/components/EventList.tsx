// src/components/EventList.tsx

import EventCard from './EventCard';
import type { LinguaEvent } from '../types/LinguaEvent';

type Props = {
  events: LinguaEvent[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
};

export default function EventList({ events, onEdit, onDelete, onMoveUp, onMoveDown }: Props) {
  if (events.length === 0) {
    return (
      <div className="empty-state">
        📭 Keine Termine gefunden.<br />
        Erstellen Sie eine neue Unterrichtseinheit.
      </div>
    );
  }

  return (
    <div className="events-list-container">
      {events.map((ev, idx) => (
        <EventCard
          key={ev.id}
          event={ev}
          index={idx}
          totalEvents={events.length}
          onEdit={onEdit}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      ))}
    </div>
  );
}