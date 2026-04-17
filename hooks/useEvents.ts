// hooks/useEvents.ts
import { useEffect, useState } from "react"
import type { LinguaEvent } from "../src/types/LinguaEvent"

export default function useEvents() {
  const [events, setEvents] = useState<LinguaEvent[]>([])
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    const data = localStorage.getItem("lingua_events")
    if (data) setEvents(JSON.parse(data))
  }, [])

  useEffect(() => {
    localStorage.setItem("lingua_events", JSON.stringify(events))
  }, [events])

  function saveEvent(event: LinguaEvent) {
    if (editId !== null) {
      setEvents(prev =>
        prev.map(e => (e.id === editId ? event : e))
      )
      setEditId(null)
    } else {
      setEvents(prev => [...prev, event])
    }
  }

  function deleteEvent(id: number) {
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  function startEdit(id: number) {
    setEditId(id)
  }

  return {
    events,
    editId,
    saveEvent,
    deleteEvent,
    startEdit
  }
}