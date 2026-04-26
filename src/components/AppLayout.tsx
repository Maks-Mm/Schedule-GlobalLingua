import { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import EventList from './EventList';
import Toast from './Toast';
import { useEvents } from '../hooks/useEvents';
import type { EventFormData } from '../types/LinguaEvent';
import ConfirmDialog from './ConfirmDialog';

export default function AppLayout() {
  const { events, addEvent, updateEvent, deleteEvent, moveEventUp, moveEventDown } = useEvents();
  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => () => {});
  const [successToast, setSuccessToast] = useState(false);
  const [lastAddedEventId, setLastAddedEventId] = useState<number | null>(null);

  // Parallax scroll effect for cards
  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll('.event-card-3d');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const offset = (rect.top - window.scrollY) * 0.05;
        (card as HTMLElement).style.transform = `translateY(${offset}px)`;
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to newly added event and highlight it
  useEffect(() => {
    if (lastAddedEventId !== null) {
      setTimeout(() => {
        const newEventCard = document.querySelector(`[data-event-id="${lastAddedEventId}"]`);
        if (newEventCard) {
          newEventCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          newEventCard.classList.add('highlight-new');
          setTimeout(() => {
            newEventCard.classList.remove('highlight-new');
          }, 2000);
        }
        setLastAddedEventId(null);
      }, 100);
    }
  }, [lastAddedEventId, events.length]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredEvents = events.filter(ev =>
    searchTerm === '' ||
    ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ev.teacher && ev.teacher.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (ev.student && ev.student.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (ev.account && ev.account.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (ev.address && ev.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSave = (formData: EventFormData) => {
    if (editId !== null) {
      updateEvent(editId, formData);
      showToast('✏️ Veranstaltung aktualisiert', 'success');
      setEditId(null);
    } else {
      const newEvent = addEvent(formData);
      showToast('✅ Termin erfolgreich gespeichert', 'success');
      
      // Show success message on mobile
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
      
      // Store the ID of the new event for scrolling
      if (newEvent && newEvent.id) {
        setLastAddedEventId(newEvent.id);
      }
    }
  };

  const handleReset = () => {
    setEditId(null);
    showToast('Formular zurückgesetzt', 'info');
  };

  const handleEdit = (id: number) => {
    setEditId(id);
    showToast('Bearbeitungsmodus aktiviert', 'info');
    // On mobile, scroll to sidebar when editing
    if (window.innerWidth <= 768 && sidebarRef.current) {
      sidebarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDelete = (id: number) => {
    setOnConfirmAction(() => () => {
      deleteEvent(id);
      showToast('🗑️ Termin gelöscht', 'error');
      if (editId === id) setEditId(null);
    });
    setConfirmOpen(true);
  };

  const handleMoveUp = (index: number) => {
    moveEventUp(index);
    showToast('⬆️ Reihenfolge geändert', 'info');
  };

  const handleMoveDown = (index: number) => {
    moveEventDown(index);
    showToast('⬇️ Reihenfolge geändert', 'info');
  };

  return (
    <>
      {/* Success toast for mobile */}
      {successToast && (
        <div className="toast-modern">
          ✅ Termin gespeichert — wird automatisch angezeigt
        </div>
      )}

      <div className="bg-animate" />
      <Header />

      <div className="app-layout">
        <div ref={sidebarRef} className="sidebar-container">
          <Sidebar
            editId={editId}
            events={events}
            onSave={handleSave}
            onReset={handleReset}
          />
        </div>

        <div className="main-area" ref={mainAreaRef}>
          <div className="events-header">
             <h3>📋 Stundenplan ({filteredEvents.length} Termine)</h3>
            <div className="filter-bar">
              <input
                type="text"
                placeholder="🔍 Titel, Lehrer:in, Schüler:in ..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ConfirmDialog
            isOpen={confirmOpen}
            title="Löschen bestätigen"
            message="Dieser Termin wird dauerhaft gelöscht."
            onConfirm={() => {
              onConfirmAction();
              setConfirmOpen(false);
            }}
            onCancel={() => setConfirmOpen(false)}
          />

          <EventList
            events={filteredEvents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
          />
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}