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
  const { 
    isSlotAvailable, 
    getEventsCountForDay, 
    getSmartSuggestion,
    findNextAvailableDays,
    getNextAvailableSlot,
    maxSlotsPerDay 
  } = useSchedule(events);
  
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
  const [suggestedDays, setSuggestedDays] = useState<string[]>([]);
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
      setSuggestedDays([]);
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
      setDayWarning(null);
      setSuggestedDays([]);
      setIsDayFull(false);
    }
  }, [editId, events]);

  const updateField = <K extends keyof EventFormData>(key: K, value: string) => {
    if (key === 'datetime') {
      const day = value.split('T')[0];
      if (day && !editId) {
        const { message, suggestedDays: suggestions } = getSmartSuggestion(day);
        setDayWarning(message);
        setSuggestedDays(suggestions);
        setIsDayFull(getEventsCountForDay(day) >= maxSlotsPerDay);
      } else if (day && editId) {
        const originalEvent = events.find(e => e.id === editId);
        if (originalEvent && originalEvent.datetime.split('T')[0] !== day) {
          const { message, suggestedDays: suggestions } = getSmartSuggestion(day);
          setDayWarning(message);
          setSuggestedDays(suggestions);
          setIsDayFull(getEventsCountForDay(day) >= maxSlotsPerDay);
        } else {
          setDayWarning(null);
          setSuggestedDays([]);
          setIsDayFull(false);
        }
      } else {
        setDayWarning(null);
        setSuggestedDays([]);
        setIsDayFull(false);
      }
    }
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // NEW: Auto-suggest next available day
  const suggestNextAvailableDay = () => {
    const today = new Date();
    const nextDays = findNextAvailableDays(today, 30);
    
    if (nextDays.length > 0) {
      const nextDate = nextDays[0];
      const nextSlot = getNextAvailableSlot(new Date(nextDate));
      
      if (nextSlot) {
        updateField('datetime', nextSlot);
        const { message } = getSmartSuggestion(nextDate);
        setDayWarning(message);
      } else {
        alert(`Nächster freier Tag: ${new Date(nextDate).toLocaleDateString('de-DE')}\nBitte wählen Sie eine Uhrzeit.`);
        updateField('datetime', `${nextDate}T10:00`);
      }
    } else {
      alert('Keine freien Tage in den nächsten 30 Tagen gefunden.');
    }
  };

  // NEW: Apply a suggested day
  const applySuggestedDay = (suggestedDay: string) => {
    const nextSlot = getNextAvailableSlot(new Date(suggestedDay));
    if (nextSlot) {
      updateField('datetime', nextSlot);
    } else {
      updateField('datetime', `${suggestedDay}T10:00`);
    }
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
      const { suggestedDays: suggestions } = getSmartSuggestion(day);
      
      let message = `❌ Keine Kapazität mehr am ${day}\nBereits ${count}/${maxSlotsPerDay} Unterrichtseinheiten gebucht.\n`;
      
      if (suggestions.length > 0) {
        const nextDates = suggestions.map(d => new Date(d).toLocaleDateString('de-DE')).join(', ');
        message += `\n📅 Nächste freie Tage: ${nextDates}\nMöchten Sie einen dieser Tage ausprobieren?`;
      }
      
      alert(message);
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

    onSave(form);

    // Reset form
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
    setSuggestedDays([]);
    setIsDayFull(false);
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
        
        {/* NEW: Smart suggestion button */}
        <div className="button-group" style={{ marginBottom: '15px' }}>
          <button 
            type="button" 
            onClick={suggestNextAvailableDay}
            style={{ 
              background: '#4CAF50', 
              color: 'white',
              width: '100%',
              padding: '10px'
            }}
          >
            🔍 Nächsten freien Tag vorschlagen
          </button>
        </div>

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
          
          {/* Enhanced warning with suggestions */}
          {dayWarning && (
            <div className="capacity-warning">
              <div className="capacity-warning-icon">⚠️</div>
              <div className="capacity-warning-content">
                <div className="capacity-warning-title">Kapazitätsinformation</div>
                <div className="capacity-warning-message">{dayWarning}</div>
                
                {/* NEW: Show suggested days as clickable buttons */}
                {suggestedDays.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '12px', marginBottom: '5px' }}>📅 Verfügbare Tage:</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {suggestedDays.map(day => (
                        <button
                          key={day}
                          onClick={() => applySuggestedDay(day)}
                          style={{
                            padding: '4px 8px',
                            fontSize: '11px',
                            background: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          {new Date(day).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' })}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="capacity-warning-stats">
                  <span>📊 Max: {maxSlotsPerDay} Einheiten/Tag</span>
                  {isDayFull && <span>🔒 Keine weiteren Buchungen möglich</span>}
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
          ✨ Features: Automatische Kapazitätsprüfung, Konflikterkennung, Echtzeit-Validierung, 
          <strong> Smart Day Suggestions</strong>
        </div>
      </div>
    </div>
  );
}