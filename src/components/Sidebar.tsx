//src/components/Sidebar.tsx

import { useState, useEffect } from 'react';
import type { LinguaEvent, EventFormData } from '../types/LinguaEvent';
import { AVAILABLE_CHANNELS, type ChannelType } from '../types/Channel';
import { useSchedule } from '../hooks/useSchedule';

type Props = {
  editId: number | null;
  events: LinguaEvent[];
  onSave: (data: EventFormData) => void;
  onReset: () => void;
};

export default function Sidebar({ editId, events, onSave, onReset }: Props) {
  const { isSlotAvailable, getEventsCountForDay, maxSlotsPerDay } = useSchedule(events);
  
  const [form, setForm] = useState<EventFormData>({
    account: '',
    address: '',
    title: '',
    teacher: '',
    student: '',
    channel: 'zoom',
    datetime: ''
  });

  const [dayWarning, setDayWarning] = useState<string | null>(null);
  const [isDayFull, setIsDayFull] = useState(false);

  useEffect(() => {
    if (editId === null) {
      setForm({
        account: '',
        address: '',
        title: '',
        teacher: '',
        student: '',
        channel: 'zoom',
        datetime: ''
      });
      setDayWarning(null);
      setIsDayFull(false);
      return;
    }

    const ev = events.find(e => e.id === editId);
    if (ev) {
      setForm({
        account: ev.account,
        address: ev.address,
        title: ev.title,
        teacher: ev.teacher,
        student: ev.student,
        channel: ev.channel,
        datetime: ev.datetime
      });
      // Reset warning when editing
      setDayWarning(null);
      setIsDayFull(false);
    }
  }, [editId, events]);

  const updateField = <K extends keyof EventFormData>(key: K, value: string) => {
    if (key === 'datetime') {
      const day = value.split('T')[0];
      if (day && !editId) {
        const currentCount = getEventsCountForDay(day);
        if (currentCount >= maxSlotsPerDay) {
          setDayWarning(`Dieser Tag hat bereits ${currentCount}/${maxSlotsPerDay} Einheiten. Keine weiteren Termine möglich.`);
          setIsDayFull(true);
        } else {
          setDayWarning(null);
          setIsDayFull(false);
        }
      } else if (day && editId) {
        // For edit mode, check if the new date is different and has capacity
        const originalEvent = events.find(e => e.id === editId);
        if (originalEvent && originalEvent.datetime.split('T')[0] !== day) {
          const currentCount = getEventsCountForDay(day);
          if (currentCount >= maxSlotsPerDay) {
            setDayWarning(`Dieser Tag hat bereits ${currentCount}/${maxSlotsPerDay} Einheiten. Keine weiteren Termine möglich.`);
            setIsDayFull(true);
          } else {
            setDayWarning(null);
            setIsDayFull(false);
          }
        } else {
          setDayWarning(null);
          setIsDayFull(false);
        }
      } else {
        setDayWarning(null);
        setIsDayFull(false);
      }
    }
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
  if (!form.title.trim()) {
    alert('Bitte Titel eingeben');
    return;
  }
  if (!form.datetime) {
    alert('Datum & Uhrzeit erforderlich');
    return;
  }

  if (!isSlotAvailable(form.datetime)) {
    const day = form.datetime.split('T')[0];
    const count = getEventsCountForDay(day);
    alert(`❌ Keine Kapazität mehr am ${day}\nBereits ${count}/${maxSlotsPerDay} Unterrichtseinheiten gebucht.\nBitte wählen Sie einen anderen Tag.`);
    return;
  }

  const res = await fetch("http://localhost:3001/api/create-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form)
  });

  if (!res.ok) {
    alert("Server error");
    return;
  }

  // optional: keep local UI sync
  onSave(form);

  // reset
  setForm({
    account: '',
    address: '',
    title: '',
    teacher: '',
    student: '',
    channel: 'zoom',
    datetime: ''
  });
};

  const systemStatus = {
    orchestrator: true,
    storage: events.length > 0,
    activeConstraints: `Max ${maxSlotsPerDay} Einheiten/Tag`
  };

  return (
    <div className="sidebar">
      <div className="card">
        <h3>🏫 Account & Standort</h3>
        <div className="input-group">
          <label>Manager / Account</label>
          <input
            value={form.account}
            onChange={e => updateField('account', e.target.value)}
            placeholder="z.B. Sprachzentrum Berlin"
            autoComplete="off"
          />
        </div>
        <div className="input-group">
          <label>Adresse / Schule</label>
          <input
            value={form.address}
            onChange={e => updateField('address', e.target.value)}
            placeholder="Straße, Ort, Raum"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="card">
        <h3>✏️ {editId ? 'Bearbeitungsmodus' : 'Neue Unterrichtseinheit'}</h3>
        <div className="input-group">
          <label>📖 Titel *</label>
          <input
            value={form.title}
            onChange={e => updateField('title', e.target.value)}
            placeholder="z.B. Englisch B2 Konversation"
          />
        </div>
        <div className="input-group">
          <label>👩‍🏫 Lehrer:in</label>
          <input
            value={form.teacher}
            onChange={e => updateField('teacher', e.target.value)}
            placeholder="Name"
          />
        </div>
        <div className="input-group">
          <label>🧑‍🎓 Schüler:in</label>
          <input
            value={form.student}
            onChange={e => updateField('student', e.target.value)}
            placeholder="Name / Gruppe"
          />
        </div>
        <div className="input-group">
          <label>🎥 Plattform</label>
          <select value={form.channel} onChange={e => updateField('channel', e.target.value as ChannelType)}>
            {AVAILABLE_CHANNELS.map(ch => (
              <option key={ch.type} value={ch.type}>
                {ch.icon} {ch.label}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>📅 Datum & Uhrzeit *</label>
          <input
            type="datetime-local"
            value={form.datetime}
            onChange={e => updateField('datetime', e.target.value)}
            className={isDayFull ? 'datetime-full' : ''}
          />
          {dayWarning && (
            <div className="capacity-warning">
              <div className="capacity-warning-icon">⚠️</div>
              <div className="capacity-warning-content">
                <div className="capacity-warning-title">Kapazitätslimit erreicht</div>
                <div className="capacity-warning-message">{dayWarning}</div>
                <div className="capacity-warning-stats">
                  <span>📊 Max: {maxSlotsPerDay} Einheiten/Tag</span>
                  <span>🔒 Keine weiteren Buchungen möglich</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="button-group">
          <button className="primary" onClick={handleSubmit}>💾 Speichern</button>
          <button className="secondary" onClick={onReset}>🗑️ Zurücksetzen</button>
        </div>
      </div>

      <div className="card system-status">
        <h3>⚙️ System Status</h3>
        <div className="status-item">
          <span>Orchestrator Mode</span>
          <span className={systemStatus.orchestrator ? "status-active" : "status-inactive"}>
            {systemStatus.orchestrator ? '● Active' : '○ Inactive'}
          </span>
        </div>
        <div className="status-item">
          <span>Local Storage</span>
          <span className={systemStatus.storage ? "status-active" : "status-inactive"}>
            {systemStatus.storage ? '● Synced' : '○ Empty'}
          </span>
        </div>
        <div className="status-item">
          <span>Constraint</span>
          <span className="status-info">{systemStatus.activeConstraints}</span>
        </div>
        <div className="status-item">
          <span>Timezone</span>
          <span>{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
        </div>
        <div className="status-note">
          ⚡ Aktive Scheduling-Regeln: Max {maxSlotsPerDay} Einheiten pro Tag
        </div>
      </div>

      <div className="card small">
        <div style={{ fontSize: '12px', opacity: 0.7 }}>
          ✨ Features: Automatische Kapazitätsprüfung, Konflikterkennung, Echtzeit-Validierung, lokale Speicherung
        </div>
      </div>
    </div>
  );
}