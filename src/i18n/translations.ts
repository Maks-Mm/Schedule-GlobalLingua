// src/i18n/translations.ts

export type Language = 'en' | 'de';

export interface Translations {
  // Header
  appTitle: string;
  appBadge: string;
  orchestratorPro: string;

  // Landing Page
  welcomeTitle: string;
  welcomeSubtitle: string;
  enterButton: string;
  heroBadge: string;

  // Sidebar / Form
  accountLocation: string;
  account: string;
  accountPlaceholder: string;
  address: string;
  addressPlaceholder: string;
  editMode: string;
  newLesson: string;
  suggestNextDay: string;
  titleRequired: string;
  titlePlaceholder: string;
  teacher: string;
  student: string;
  teacherPlaceholder: string;
  studentPlaceholder: string;
  platform: string;
  datetimeRequired: string;
  pleaseChooseTime: string;
  save: string;
  reset: string;

  // Messages & Alerts
  eventSaved: string;
  eventSavedMobile: string;
  eventUpdated: string;
  eventDeleted: string;
  orderChanged: string;
  formReset: string;
  noTitle: string;
  noDatetime: string;
  noCapacityDay: string;
  alreadyBooked: string;
  nextAvailable: string;
  serverError: string;
  nextFreeDay: string;
  noFreeDays30: string;

  // Schedule / Events
  scheduleWithCount: string;
  searchPlaceholder: string;
  noEventsFound: string;
  createNewLesson: string;

  // Event Card
  noTime: string;
  noAccount: string;
  notAssigned: string;
  noStudent: string;
  edit: string;
  delete: string;
  moveUp: string;
  moveDown: string;

  // Confirm Dialog
  confirmDeleteTitle: string;
  confirmDeleteMessage: string;
  confirmWarningTitle: string;
  confirmInfoTitle: string;
  cancel: string;
  confirm: string;
  deleteConfirm: string;
  proceed: string;
  ok: string;

  // System Status
  systemStatus: string;
  orchestratorMode: string;
  localStorage: string;
  active: string;
  inactive: string;
  synced: string;
  empty: string;
  constraint: string;
  timezone: string;
  activeRules: string;
  features: string;

  // Capacity Warnings
  capacityInfo: string;
  capacityWarningTitle: string;
  maxPerDay: string;
  noMoreBookings: string;
  availableDays: string;

  // Mobile Views
  backToList: string;
  eventDetails: string;

  // Channels
  channelZoom: string;
  channelTeams: string;
  channelMeet: string;
  channelWebex: string;
  channelInPerson: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'GlobalLingua',
    appBadge: 'ACADEMY',
    orchestratorPro: '⚡ Orchestrator Pro',

    welcomeTitle: 'Schedule GlobalLingua',
    welcomeSubtitle: 'Smart scheduling for language schools',
    enterButton: 'Enter Dashboard →',
    heroBadge: '⚡ Orchestrator Pro',

    accountLocation: '🏫 Account & Location',
    account: 'Manager / Account',
    accountPlaceholder: 'e.g., Language Center Berlin',
    address: 'Address / School',
    addressPlaceholder: 'Street, City, Room',
    editMode: '✏️ Edit Mode',
    newLesson: '✏️ New Lesson',
    suggestNextDay: '🔍 Suggest next available day',
    titleRequired: '📖 Title *',
    titlePlaceholder: 'e.g., English B2 Conversation',
    teacher: '👩‍🏫 Teacher',
    student: '🧑‍🎓 Student',
    teacherPlaceholder: 'Name',
    studentPlaceholder: 'Name / Group',
    platform: '🎥 Platform',
    datetimeRequired: '📅 Date & Time *',
    pleaseChooseTime: 'Please choose a time.',
    save: '💾 Save',
    reset: '🗑️ Reset',

    eventSaved: '✅ Event saved successfully',
    eventSavedMobile: '✅ Event saved — will be displayed automatically',
    eventUpdated: '✏️ Event updated',
    eventDeleted: '🗑️ Event deleted',
    orderChanged: '⬆️ Order changed',
    formReset: 'Form reset',
    noTitle: 'Please enter a title',
    noDatetime: 'Date & time required',
    noCapacityDay: 'No capacity available on {{day}}',
    alreadyBooked: 'Already {{count}}/{{max}} lessons booked',
    nextAvailable: 'Next available days: {{dates}}',
    serverError: 'Server error. Please try again.',
    nextFreeDay: 'Next free day',
    noFreeDays30: 'No free days found in the next 30 days.',

    scheduleWithCount: '📋 Schedule ({{count}} events)',
    searchPlaceholder: '🔍 Title, teacher, student ...',
    noEventsFound: '📭 No events found.',
    createNewLesson: 'Create a new lesson',

    noTime: 'No time set',
    noAccount: 'No account',
    notAssigned: 'Not assigned',
    noStudent: '—',
    edit: '✏️ Edit',
    delete: '🗑️ Delete',
    moveUp: '⬆️ Move up',
    moveDown: '⬇️ Move down',

    confirmDeleteTitle: 'Confirm Delete',
    confirmDeleteMessage: 'This event will be permanently deleted.',
    confirmWarningTitle: 'Confirm Action',
    confirmInfoTitle: 'Information',
    cancel: 'Cancel',
    confirm: 'Confirm',
    deleteConfirm: 'Delete',
    proceed: 'Proceed',
    ok: 'OK',

    systemStatus: '⚙️ System Status',
    orchestratorMode: 'Orchestrator Mode',
    localStorage: 'Local Storage',
    active: '● Active',
    inactive: '○ Inactive',
    synced: '● Synced',
    empty: '○ Empty',
    constraint: 'Constraint',
    timezone: 'Timezone',
    activeRules: '⚡ Active rules: Max {{max}} units/day',
    features: '✨ Features: Automatic capacity check, conflict detection',

    capacityInfo: 'Capacity Information',
    capacityWarningTitle: 'Capacity Information',
    maxPerDay: '📊 Max: {{max}} units/day',
    noMoreBookings: '🔒 No more bookings possible',
    availableDays: '📅 Available days:',

    backToList: '← Back to list',
    eventDetails: 'Event Details',

    channelZoom: 'Zoom',
    channelTeams: 'Microsoft Teams',
    channelMeet: 'Google Meet',
    channelWebex: 'Cisco Webex',
    channelInPerson: 'In-person',
  },

  de: {
    appTitle: 'GlobalLingua',
    appBadge: 'AKADEMIE',
    orchestratorPro: '⚡ Orchestrator Pro',

    welcomeTitle: 'Schedule GlobalLingua',
    welcomeSubtitle: 'Intelligente Planung für Sprachschulen',
    enterButton: ' Dashboard →',
    heroBadge: '⚡ Orchestrator Pro',

    accountLocation: '🏫 Account & Standort',
    account: 'Manager / Account',
    accountPlaceholder: 'z.B. Sprachzentrum Berlin',
    address: 'Adresse / Schule',
    addressPlaceholder: 'Straße, Ort, Raum',
    editMode: '✏️ Bearbeitungsmodus',
    newLesson: '✏️ Neue Unterrichtseinheit',
    suggestNextDay: '🔍 Nächsten freien Tag vorschlagen',
    titleRequired: '📖 Titel *',
    titlePlaceholder: 'z.B. Englisch B2 Konversation',
    teacher: '👩‍🏫 Lehrer:in',
    student: '🧑‍🎓 Schüler:in',
    teacherPlaceholder: 'Name',
    studentPlaceholder: 'Name / Gruppe',
    platform: '🎥 Plattform',
    datetimeRequired: '📅 Datum & Uhrzeit *',
    pleaseChooseTime: 'Bitte wählen Sie eine Uhrzeit.',
    save: '💾 Speichern',
    reset: '🗑️ Zurücksetzen',

    eventSaved: '✅ Termin erfolgreich gespeichert',
    eventSavedMobile: '✅ Termin gespeichert — wird automatisch angezeigt',
    eventUpdated: '✏️ Veranstaltung aktualisiert',
    eventDeleted: '🗑️ Termin gelöscht',
    orderChanged: '⬆️ Reihenfolge geändert',
    formReset: 'Formular zurückgesetzt',
    noTitle: 'Bitte Titel eingeben',
    noDatetime: 'Datum & Uhrzeit erforderlich',
    noCapacityDay: 'Keine Kapazität mehr am {{day}}',
    alreadyBooked: 'Bereits {{count}}/{{max}} Unterrichtseinheiten gebucht',
    nextAvailable: 'Nächste verfügbare Tage: {{dates}}',
    serverError: 'Serverfehler. Bitte versuchen Sie es erneut.',
    nextFreeDay: 'Nächster freier Tag',
    noFreeDays30: 'Keine freien Tage in den nächsten 30 Tagen gefunden.',

    scheduleWithCount: '📋 Stundenplan ({{count}} Termine)',
    searchPlaceholder: '🔍 Titel, Lehrer:in, Schüler:in ...',
    noEventsFound: '📭 Keine Termine gefunden.',
    createNewLesson: 'Neue Unterrichtseinheit erstellen',

    noTime: 'Keine Zeit',
    noAccount: 'Kein Account',
    notAssigned: 'nicht zugewiesen',
    noStudent: '—',
    edit: '✏️ Bearbeiten',
    delete: '🗑️ Löschen',
    moveUp: '⬆️ Nach oben',
    moveDown: '⬇️ Nach unten',

    confirmDeleteTitle: 'Löschen bestätigen',
    confirmDeleteMessage: 'Dieser Termin wird dauerhaft gelöscht.',
    confirmWarningTitle: 'Aktion bestätigen',
    confirmInfoTitle: 'Information',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    deleteConfirm: 'Löschen',
    proceed: 'Fortfahren',
    ok: 'OK',

    systemStatus: '⚙️ System Status',
    orchestratorMode: 'Orchestrator Mode',
    localStorage: 'Lokaler Speicher',
    active: '● Aktiv',
    inactive: '○ Inaktiv',
    synced: '● Synchronisiert',
    empty: '○ Leer',
    constraint: 'Einschränkung',
    timezone: 'Zeitzone',
    activeRules: '⚡ Aktive Regeln: Max {{max}} Einheiten/Tag',
    features: '✨ Features: Automatische Kapazitätsprüfung, Konflikterkennung',

    capacityInfo: 'Kapazitätsinformation',
    capacityWarningTitle: 'Kapazitätsinformation',
    maxPerDay: '📊 Max: {{max}} Einheiten/Tag',
    noMoreBookings: '🔒 Keine weiteren Buchungen möglich',
    availableDays: '📅 Verfügbare Tage:',

    backToList: '← Zurück zur Liste',
    eventDetails: 'Termindetails',

    channelZoom: 'Zoom',
    channelTeams: 'Microsoft Teams',
    channelMeet: 'Google Meet',
    channelWebex: 'Cisco Webex',
    channelInPerson: 'Präsenz',
  }
};

export function t(
  translation: Translations,
  key: keyof Translations,
  params?: Record<string, string | number>
): string {
  let text = translation[key] as string;
  if (params && text) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
    });
  }
  return text;
}