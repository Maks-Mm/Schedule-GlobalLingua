//src/components/AppLayout.tsx

import { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import EventList from './EventList';
import Toast from './Toast';
import { useEvents } from '../hooks/useEvents';
import type { EventFormData } from '../types/LinguaEvent';

export default function AppLayout() {
  const { events, addEvent, updateEvent, deleteEvent, moveEventUp, moveEventDown } = useEvents();
  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effect for cards
  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll('.event-card-3d');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const scrollPosition = window.scrollY;
        const offset = (rect.top - scrollPosition) * 0.05;
        (card as HTMLElement).style.transform = `translateY(${offset}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
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
      showToast('✏️ Veranstaltung aktualisiert');
      setEditId(null);
    } else {
      addEvent(formData);
      showToast('✅ Termin erfolgreich gespeichert');
    }
  };

  const handleReset = () => {
    setEditId(null);
    showToast('Formular zurückgesetzt');
  };

  const handleEdit = (id: number) => {
    setEditId(id);
    // Smooth scroll to sidebar with better positioning
    setTimeout(() => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  const handleDelete = (id: number) => {
    if (confirm('Diesen Termin unwiderruflich löschen?')) {
      deleteEvent(id);
      showToast('🗑️ Gelöscht');
      if (editId === id) {
        setEditId(null);
      }
    }
  };

  const handleMoveUp = (index: number) => {
    moveEventUp(index);
    showToast('⬆️ Reihenfolge geändert');
  };

  const handleMoveDown = (index: number) => {
    moveEventDown(index);
    showToast('⬇️ Reihenfolge geändert');
  };

  return (
    <>
      <div className="bg-animate" />
      <Header />
      
      <div className="app-layout">
        <div ref={sidebarRef}>
          <Sidebar 
            editId={editId}
            events={events}
            onSave={handleSave}
            onReset={handleReset}
          />
        </div>
        
        <div className="main-area" ref={mainAreaRef}>
          <div className="events-header">
            <h3>📋 Stundenplan</h3>
            <div className="filter-bar">
              <input 
                type="text" 
                placeholder="🔍 Titel, Lehrer:in, Schüler:in ..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
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