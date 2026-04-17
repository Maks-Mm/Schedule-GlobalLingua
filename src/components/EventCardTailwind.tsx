//src/components/EventCardTailwind.tsx

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

export default function EventCardTailwind({ 
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
    const rotateX = ((y - rect.height / 2) / rect.height) * 8;
    const rotateY = ((x - rect.width / 2) / rect.width) * -8;
    setRotation({ x: rotateX, y: rotateY });
  };

  const formatDateTime = (datetimeStr: string) => {
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
  };

  return (
    <div 
      className="relative mb-5 rounded-2xl bg-gradient-to-br from-[#161c26] to-[#11161f] border-l-4 border-l-[#3b82f6] shadow-lg transition-all duration-300 cursor-pointer group"
      style={{
        transform: isHovering 
          ? `perspective(400px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          : 'perspective(400px) rotateX(0deg) rotateY(0deg)',
        transition: 'transform 0.3s ease',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setRotation({ x: 0, y: 0 });
      }}
    >
      <div className="p-5 relative z-10">
        <div className="flex justify-between items-start mb-2 flex-wrap">
          <strong className="text-lg font-bold">📘 {event.title}</strong>
          <span className="text-xs bg-gray-700 px-3 py-1 rounded-full">
            {event.channel || '—'}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-4 my-3 text-sm text-gray-400">
          <span className="bg-[#1e2a3a] px-3 py-1 rounded-full">
            🏫 {event.account || 'Kein Account'} {event.address && `· ${event.address}`}
          </span>
          <span className="bg-[#1e2a3a] px-3 py-1 rounded-full">
            👩‍🏫 {event.teacher || 'nicht zugewiesen'}
          </span>
          <span className="bg-[#1e2a3a] px-3 py-1 rounded-full">
            🧑‍🎓 {event.student || '—'}
          </span>
          <span className="bg-[#1e2a3a] px-3 py-1 rounded-full">
            ⏰ {formatDateTime(event.datetime)}
          </span>
        </div>
        
        <div className="flex gap-3 mt-4 flex-wrap">
          <button 
            className="bg-[#2a2f3c] hover:bg-[#3f4758] text-white px-4 py-2 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5"
            onClick={() => onEdit(event.id)}
          >
            ✏️ Bearbeiten
          </button>
          <button 
            className="bg-red-500/85 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5"
            onClick={() => onDelete(event.id)}
          >
            🗑️ Löschen
          </button>
          {index > 0 && (
            <button 
              className="bg-[#2a2f3c] hover:bg-[#3f4758] text-white px-4 py-2 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5"
              onClick={() => onMoveUp(index)}
            >
              ⬆️ Nach oben
            </button>
          )}
          {index < totalEvents - 1 && (
            <button 
              className="bg-[#2a2f3c] hover:bg-[#3f4758] text-white px-4 py-2 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5"
              onClick={() => onMoveDown(index)}
            >
              ⬇️ Nach unten
            </button>
          )}
        </div>
      </div>
      
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
    </div>
  );
}