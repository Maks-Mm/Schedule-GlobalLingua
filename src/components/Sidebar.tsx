// Sidebar.tsx (pattern)


import { useState, useEffect } from 'react';
import type { LinguaEvent, EventFormData } from '../types/LinguaEvent';

type Props = {
  editId: number | null;
  events: LinguaEvent[];
  onSave: (data: EventFormData) => void;
  onReset: () => void;
};

const CHANNELS = ['Zoom', 'Google Meet', 'Skype', 'WhatsApp', 'Viber', 'Microsoft Teams', 'FaceTime'];

export default function Sidebar({ editId, events, onSave, onReset }: Props) {
  const [form, setForm] = useState<EventFormData>({
    account: '',
    address: '',
    title: '',
    teacher: '',
    student: '',
    channel: 'Zoom',
    datetime: ''
  });

  useEffect(() => {
    if (editId === null) {
      setForm({
        account: '',
        address: '',
        title: '',
        teacher: '',
        student: '',
        channel: 'Zoom',
        datetime: ''
      });
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
    }
  }, [editId, events]);

  const updateField = <K extends keyof EventFormData>(key: K, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert('Bitte Titel eingeben');
      return;
    }
    if (!form.datetime) {
      alert('Datum & Uhrzeit erforderlich');
      return;
    }
    onSave(form);
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
          <select value={form.channel} onChange={e => updateField('channel', e.target.value)}>
            {CHANNELS.map(ch => <option key={ch}>{ch}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label>📅 Datum & Uhrzeit *</label>
          <input 
            type="datetime-local" 
            value={form.datetime} 
            onChange={e => updateField('datetime', e.target.value)}
          />
        </div>
        <div className="button-group">
          <button className="primary" onClick={handleSubmit}>💾 Speichern</button>
          <button className="secondary" onClick={onReset}>🗑️ Zurücksetzen</button>
        </div>
      </div>

      {/* Add after the existing card */}
<div className="card system-status">
  <h3>⚙️ System Status</h3>
  <div className="status-item">
    <span>Orchestrator Mode</span>
    <span className="status-active">● Active</span>
  </div>
  <div className="status-item">
    <span>Local Storage</span>
    <span className="status-active">● Synced</span>
  </div>
  <div className="status-item">
    <span>Timezone</span>
    <span>{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
  </div>
  <div className="status-note">
    ⚡ Preventing scheduling chaos since 2024
  </div>
</div>

      <div className="card small">
        <div style={{ fontSize: '12px', opacity: 0.7 }}>
          ✨ Features: Sortieren via Drag & Drop (Up/Down), Suche, Echtzeit-Statistik, Benachrichtigungen, lokale Speicherung
        </div>
      </div>
    </div>
  );
}