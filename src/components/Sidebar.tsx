// src/components/Sidebar.tsx

import { useState, useEffect } from 'react';
import type { LinguaEvent, EventFormData } from '../types/LinguaEvent';
import { AVAILABLE_CHANNELS, type ChannelType } from '../types/Channel';
import { useSchedule } from '../hooks/useSchedule';
import { useLanguage } from '../contexts/LanguageContext';

type Props = {
  editId: number | null;
  events: LinguaEvent[];
  onSave: (data: EventFormData) => void;
  onReset: () => void;
};

export default function Sidebar({ editId, events, onSave, onReset }: Props) {
  const { t } = useLanguage();

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
        alert(`${t.nextFreeDay}: ${new Date(nextDate).toLocaleDateString('de-DE')}\n${t.pleaseChooseTime}`);
        updateField('datetime', `${nextDate}T10:00`);
      }
    } else {
      alert(t.noFreeDays30);
    }
  };

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
      alert(t.noTitle);
      return;
    }
    if (!form.datetime) {
      alert(t.noDatetime);
      return;
    }

    if (!isSlotAvailable(form.datetime)) {
      const day = form.datetime.split('T')[0];
      const count = getEventsCountForDay(day);
      const { suggestedDays: suggestions } = getSmartSuggestion(day);

      let message = `${t.noCapacityDay.replace('{{day}}', day)}\n${t.alreadyBooked.replace('{{count}}', String(count)).replace('{{max}}', String(maxSlotsPerDay))}`;

      if (suggestions.length > 0) {
        const nextDates = suggestions
          .map(d => new Date(d).toLocaleDateString('de-DE'))
          .join(', ');
        message += `\n\n${t.nextAvailable.replace('{{dates}}', nextDates)}`;
      }

      alert(message);
      return;
    }

    try {
      const res = await fetch('/api/create-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        console.warn('API endpoint not available, saving locally only');
      }
    } catch {
      console.warn('API not available, saving locally only');
    }

    onSave(form);

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
    activeConstraints: t.activeRules.replace('{{max}}', String(maxSlotsPerDay))
  };

  return (
    <div className="sidebar">
      <div className="card">
        <h3>{t.accountLocation}</h3>

        <div className="input-group">
          <label>{t.account}</label>
          <input
            value={form.account}
            onChange={e => updateField('account', e.target.value)}
            placeholder={t.accountPlaceholder}
            autoComplete="off"
          />
        </div>

        <div className="input-group">
          <label>{t.address}</label>
          <input
            value={form.address}
            onChange={e => updateField('address', e.target.value)}
            placeholder={t.addressPlaceholder}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="card">
        <h3>{editId ? t.editMode : t.newLesson}</h3>

        <button type="button" onClick={suggestNextAvailableDay} style={{ width: '100%', background: '#3479f3', color: 'white', padding: '10px', border: 'none', borderRadius: '8px' }}>
          {t.suggestNextDay}
        </button>

        <div className="input-group">
          <label>{t.titleRequired}</label>
          <input value={form.title} onChange={e => updateField('title', e.target.value)} placeholder={t.titlePlaceholder} />
        </div>

        <div className="input-group">
          <label>{t.teacher}</label>
          <input value={form.teacher} onChange={e => updateField('teacher', e.target.value)} placeholder={t.teacherPlaceholder} />
        </div>

        <div className="input-group">
          <label>{t.student}</label>
          <input value={form.student} onChange={e => updateField('student', e.target.value)} placeholder={t.studentPlaceholder} />
        </div>

        <div className="input-group">
          <label>{t.platform}</label>
          <select value={form.channel} onChange={e => updateField('channel', e.target.value as ChannelType)}>
            {AVAILABLE_CHANNELS.map(ch => (
              <option key={ch.type} value={ch.type}>
                {ch.icon}{' '}
                {ch.type === 'zoom'
                  ? t.channelZoom
                  : ch.type === 'teams'
                  ? t.channelTeams
                  : ch.type === 'meet'
                  ? t.channelMeet
                  : ch.type === 'webex'
                  ? t.channelWebex
                  : t.channelInPerson}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>{t.datetimeRequired}</label>
          <input type="datetime-local" value={form.datetime} onChange={e => updateField('datetime', e.target.value)} className={isDayFull ? 'datetime-full' : ''} />
        </div>

        <div className="button-group">
          <button className="primary" onClick={handleSubmit}>{t.save}</button>
          <button className="secondary" onClick={onReset}>{t.reset}</button>
        </div>
      </div>

      <div className="card system-status">
  <h3>{t.systemStatus}</h3>

  <div className="status-item">
    <span>{t.orchestratorMode}</span>
    <span className={systemStatus.orchestrator ? 'status-active' : 'status-inactive'}>
      {systemStatus.orchestrator ? t.active : t.inactive}
    </span>
  </div>

  <div className="status-item">
    <span>{t.localStorage}</span>
    <span className={systemStatus.storage ? 'status-active' : 'status-inactive'}>
      {systemStatus.storage ? t.synced : t.empty}
    </span>
  </div>

  <div className="status-item">
    <span>{t.constraint}</span>
    <span className="status-info">
      {systemStatus.activeConstraints}
    </span>
  </div>

  <div className="status-item">
    <span>{t.timezone}</span>
    <span>{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
  </div>
</div>
    </div>
  );
}