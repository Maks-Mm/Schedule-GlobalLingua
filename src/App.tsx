//src/App.tsx

import useEvents from "./hooks/useEvents"

import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import EventList from "./components/EventList"
import Toast from "./components/Toast"

function App() {
  const {
    events,
    editId,
    saveEvent,
    deleteEvent,
    startEdit
  } = useEvents()

  return (
    <div>
      <Header />

      <div className="app-layout">
        <Sidebar
          onSave={saveEvent}
          editId={editId}
        />

        <EventList
          events={events}
          onEdit={startEdit}
          onDelete={deleteEvent}
        />
      </div>

      <Toast />
    </div>
  )
}

export default App