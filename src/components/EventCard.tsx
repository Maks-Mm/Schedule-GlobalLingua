//components/EventCard.tsx

import { useState } from 'react';
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
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position (-8 to 8 degrees)
    const rotateX = ((y - rect.height / 2) / rect.height) * 8;
    const rotateY = ((x - rect.width / 2) / rect.width) * -8;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div 
      className="event-card-3d"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovering 
          ? `perspective(400px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          : 'perspective(400px) rotateX(0deg) rotateY(0deg)',
        transition: 'transform 0.3s ease',
      }}
    >
      <div className="event-card-inner">
        <div className="event-title">
          <strong>📘 {escapeHtml(event.title)}</strong>
          <span className="channel-badge">
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
          <button className="btn-secondary" onClick={() => onEdit(event.id)}>
            ✏️ Bearbeiten
          </button>
          <button className="btn-danger" onClick={() => onDelete(event.id)}>
            🗑️ Löschen
          </button>
          {index > 0 && (
            <button className="btn-secondary" onClick={() => onMoveUp(index)}>
              ⬆️ Nach oben
            </button>
          )}
          {index < totalEvents - 1 && (
            <button className="btn-secondary" onClick={() => onMoveDown(index)}>
              ⬇️ Nach unten
            </button>
          )}
        </div>
      </div>
    </div>
  );
}