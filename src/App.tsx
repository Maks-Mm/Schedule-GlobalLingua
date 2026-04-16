//src/App.tsx
import useEvents from "../hooks/useEvents"

function App() {
  const {
    events,
    deleteEvent,
    startEdit
  } = useEvents()

  return (
    <div>
      {events.map(ev => (
        <div key={ev.id}>
          <h3>{ev.title}</h3>
          <button onClick={() => startEdit(ev.id)}>Edit</button>
          <button onClick={() => deleteEvent(ev.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

export default App