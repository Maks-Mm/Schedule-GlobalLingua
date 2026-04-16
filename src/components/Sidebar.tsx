//components/Sidebar.tsx
import { useState } from "react"
import type { LinguaEvent } from "../types/LinguaEvent"

type Props = {
  onSave: (event: LinguaEvent) => void
  editId: number | null
}

export default function Sidebar({ onSave }: Props) {
  const [title, setTitle] = useState("")
  const [teacher, setTeacher] = useState("")
  const [student, setStudent] = useState("")
  const [channel, setChannel] = useState("Zoom")
  const [datetime, setDatetime] = useState("")

  function submit() {
    if (!title || !datetime) return

    const event: LinguaEvent = {
      id: Date.now(),
      account: "",
      address: "",
      title,
      teacher,
      student,
      channel,
      datetime,
      createdAt: new Date().toISOString()
    }

    onSave(event)

    setTitle("")
    setTeacher("")
    setStudent("")
    setDatetime("")
  }

  return (
    <aside className="sidebar">
      <div className="card">
        <h3>Event Form</h3>

        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Teacher" value={teacher} onChange={e => setTeacher(e.target.value)} />
        <input placeholder="Student" value={student} onChange={e => setStudent(e.target.value)} />

        <select value={channel} onChange={e => setChannel(e.target.value)}>
          <option>Zoom</option>
          <option>Google Meet</option>
          <option>Teams</option>
        </select>

        <input type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)} />

        <button onClick={submit}>Save</button>
      </div>
    </aside>
  )
}