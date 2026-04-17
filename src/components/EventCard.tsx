//components/EventCard.tsx

import type { LinguaEvent } from '../types/LinguaEvent';

type Props = {
  event: LinguaEvent;
  index: number;
  totalEvents: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
};

function escapeHtml(str: string) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function formatDateTime(datetimeStr: string) {
  if (!datetimeStr) return 'Keine Zeit';
  try {
    const dateObj = new Date(datetimeStr);
    return dateObj.toLocaleString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch(e) { 
    return datetimeStr; 
  }
}

export default function EventCard({ 
  event, 
  index, 
  totalEvents, 
  onEdit, 
  onDelete, 
  onMoveUp, 
  onMoveDown 
}: Props) {
  return (
    <div className="event-card">
      <div className="event-title">
        <strong>📘 {escapeHtml(event.title)}</strong>
        <span style={{ fontSize: '0.7rem', background: '#2d3748', padding: '2px 10px', borderRadius: '30px' }}>
          {event.channel || '—'}
        </span>
      </div>
      <div className="event-meta">
        <span className="meta-chip">
          🏫 {escapeHtml(event.account) || 'Kein Account'} {event.address ? '· ' + escapeHtml(event.address) : ''}
        </span>
        <span className="meta-chip">👩‍🏫 {escapeHtml(event.teacher) || 'nicht zugewiesen'}</span>
        <span className="meta-chip">🧑‍🎓 {escapeHtml(event.student) || '—'}</span>
        <span className="meta-chip">⏰ {formatDateTime(event.datetime)}</span>
      </div>
      <div className="event-actions">
        <button className="secondary" onClick={() => onEdit(event.id)}>✏️ Bearbeiten</button>
        <button className="danger" onClick={() => onDelete(event.id)}>🗑️ Löschen</button>
        {index > 0 && (
          <button className="secondary" onClick={() => onMoveUp(index)}>⬆️ Nach oben</button>
        )}
        {index < totalEvents - 1 && (
          <button className="secondary" onClick={() => onMoveDown(index)}>⬇️ Nach unten</button>
        )}
      </div>
    </div>
  );
}