//src/components/AppLayout.tsx

import { useState, useEffect, useRef } from 'react';
import Header from './Header';
import EventCard from './EventCard';
import Sidebar from './Sidebar';
import EventList from './EventList';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';
import { useEvents } from '../hooks/useEvents';
import type { EventFormData } from '../types/LinguaEvent';
import { useLanguage } from '../contexts/LanguageContext';

export default function AppLayout() {
  const { t } = useLanguage();

  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    moveEventUp,
    moveEventDown
  } = useEvents();

  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const mainAreaRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => () => { });

  const [successToast, setSuccessToast] = useState(false);
  const [lastAddedEventId, setLastAddedEventId] = useState<number | null>(null);

  const [mobileView, setMobileView] = useState<'list' | 'form' | 'detail'>('form');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

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

  useEffect(() => {
    if (lastAddedEventId !== null) {
      setTimeout(() => {
        const el = document.querySelector(`[data-event-id="${lastAddedEventId}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('highlight-new');
          setTimeout(() => el.classList.remove('highlight-new'), 2000);
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
      showToast(t.eventUpdated, 'success');
      setEditId(null);
      if (isMobile) setMobileView('list');
    } else {
      const newEvent = addEvent(formData);
      showToast(t.eventSaved, 'success');
      if (newEvent?.id) setLastAddedEventId(newEvent.id);
      if (isMobile) setMobileView('list');
    }
  };

  const handleReset = () => {
    setEditId(null);
    showToast(t.formReset, 'info');
  };

  const handleEdit = (id: number) => {
    setEditId(id);
    if (isMobile) setMobileView('form');
  };

  const handleOpenDetail = (id: number) => {
    setSelectedEventId(id);
    if (isMobile) setMobileView('detail');
  };

  const handleMobileBack = () => {
    if (mobileView === 'detail') setMobileView('list');
    else if (mobileView === 'form') setMobileView('list');
    setEditId(null);
  };

  const handleDelete = (id: number) => {
    setOnConfirmAction(() => () => {
      deleteEvent(id);
      showToast(t.eventDeleted, 'error');
      if (editId === id) setEditId(null);
    });
    setConfirmOpen(true);
  };

  const handleMoveUp = (index: number) => {
    moveEventUp(index);
    showToast(t.orderChanged, 'info');
  };

  const handleMoveDown = (index: number) => {
    moveEventDown(index);
    showToast(t.orderChanged, 'info');
  };

  if (isMobile) {
    return (
      <>
        <div className="bg-animate" />
        <Header />

        <div className="mobile-nav">
          {mobileView !== 'list' && (
            <button onClick={handleMobileBack} className="back-btn">← Back</button>
          )}
          {mobileView === 'list' && (
            <button onClick={() => { setEditId(null); setMobileView('form'); }} className="add-btn">+ New</button>
          )}
        </div>

        {mobileView === 'form' && (
          <Sidebar editId={editId} events={events} onSave={handleSave} onReset={handleReset} />
        )}

        {mobileView === 'list' && (
          <div className="mobile-list-screen">
            <div className="events-header">
              <h3>{t.scheduleWithCount.replace('{{count}}', String(filteredEvents.length))}</h3>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <EventList
              events={filteredEvents}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onOpenDetail={handleOpenDetail}
            />
          </div>
        )}

        {mobileView === 'detail' && selectedEventId && (
          <EventCard
            event={events.find(e => e.id === selectedEventId)!}
            index={0}
            totalEvents={1}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMoveUp={() => {}}
            onMoveDown={() => {}}
            onOpenDetail={handleOpenDetail}
          />
        )}

        <ConfirmDialog
          isOpen={confirmOpen}
          title={t.confirmDeleteTitle}
          message={t.confirmDeleteMessage}
          onConfirm={() => { onConfirmAction(); setConfirmOpen(false); }}
          onCancel={() => setConfirmOpen(false)}
        />

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </>
    );
  }

  return (
    <>
      <div className="bg-animate" />
      <Header />

      <div className="app-layout">
        <div className="sidebar-container" ref={sidebarRef}>
          <Sidebar editId={editId} events={events} onSave={handleSave} onReset={handleReset} />
        </div>

        <div className="main-area" ref={mainAreaRef}>
          <div className="events-header">
            <h3>{t.scheduleWithCount.replace('{{count}}', String(filteredEvents.length))}</h3>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <ConfirmDialog
            isOpen={confirmOpen}
            title={t.confirmDeleteTitle}
            message={t.confirmDeleteMessage}
            onConfirm={() => { onConfirmAction(); setConfirmOpen(false); }}
            onCancel={() => setConfirmOpen(false)}
          />

          <EventList
            events={filteredEvents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onOpenDetail={handleOpenDetail}
          />
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}