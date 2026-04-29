import EventCard from './EventCard';
import type { LinguaEvent } from '../types/LinguaEvent';
import { useLanguage } from '../contexts/LanguageContext';

type Props = {
  events: LinguaEvent[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onOpenDetail: (id: number) => void;
};

export default function EventList({
  events,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onOpenDetail
}: Props) {
  const { t } = useLanguage();

  if (events.length === 0) {
    const lines = t.noEventsFound.split('\n');

    return (
      <div className="empty-state">
         {lines[0]}
        <br />
        {lines[1] || t.createNewLesson}
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
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
}