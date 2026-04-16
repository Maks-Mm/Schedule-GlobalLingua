//components/EventCard.tsx

import type { LinguaEvent } from "../types/LinguaEvent"

type Props = {
  event: LinguaEvent
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export default function EventCard({ event, onEdit, onDelete }: Props) {
  return (
    <div className="event-card">
      <div className="event-title">{event.title}</div>

      <div className="event-meta">
        <span>{event.teacher}</span>
        <span>{event.student}</span>
        <span>{event.channel}</span>
        <span>{event.datetime}</span>
      </div>

      <div className="event-actions">
        <button onClick={() => onEdit(event.id)}>Edit</button>
        <button onClick={() => onDelete(event.id)}>Delete</button>
      </div>
    </div>
  )
}