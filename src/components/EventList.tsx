//components/EventList.tsx
import type { LinguaEvent } from "../types/LinguaEvent"
import EventCard from "./EventCard"

type Props = {
  events: LinguaEvent[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export default function EventList({ events, onEdit, onDelete }: Props) {
  return (
    <main className="main-area">
      {events.map(ev => (
        <EventCard
          key={ev.id}
          event={ev}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </main>
  )
}