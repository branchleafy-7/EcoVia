import { EventData, EventStatus, ThemeMode } from '../types';
import { SAMPLE_EVENTS } from '../data/sampleEvents';
import { analyzeEventSustainability } from './sustainabilityEngine';

const STORAGE_KEYS = {
  EVENTS: 'ecovia_saved_events',
  ACTIVE_ID: 'ecovia_active_event_id',
  THEME: 'ecovia_theme',
  DRAFT: 'ecovia_event_draft'
};

// Initial sample events to seed if storage is empty
const INITIAL_SEEDED_EVENTS: EventData[] = [
  {
    ...SAMPLE_EVENTS.college_fest,
    id: 'sample-techfest-2026',
    name: 'TechFest 2026',
    type: 'Cultural & Music Festival',
    attendees: 1500,
    durationHours: 8,
    status: 'optimized',
    baselineScore: 56,
    projectedScore: 84,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    ...SAMPLE_EVENTS.metro_summit,
    id: 'sample-green-conf-2026',
    name: 'Green Tech Conference',
    type: 'Conference & Exhibition',
    attendees: 750,
    durationHours: 9,
    status: 'analyzed',
    baselineScore: 71,
    projectedScore: 83,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const getSavedEvents = (): EventData[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      // Seed initial sample events
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_SEEDED_EVENTS));
      return INITIAL_SEEDED_EVENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SEEDED_EVENTS;
  } catch (e) {
    console.error('Failed to read saved events from localStorage', e);
    return INITIAL_SEEDED_EVENTS;
  }
};

export const getEventById = (id: string): EventData | null => {
  const events = getSavedEvents();
  return events.find((e) => e.id === id) || null;
};

export const saveEvent = (
  eventData: EventData,
  statusOverride?: EventStatus
): EventData => {
  const events = getSavedEvents();
  const nowIso = new Date().toISOString();

  // Determine score if analyzed or optimized
  let baseline = eventData.baselineScore;
  let projected = eventData.projectedScore;

  if (!baseline || !projected) {
    try {
      const calc = analyzeEventSustainability(eventData);
      baseline = calc.overallScore;
      projected = calc.optimizedScore;
    } catch (e) {
      baseline = baseline || 50;
      projected = projected || 75;
    }
  }

  const status: EventStatus =
    statusOverride || eventData.status || (baseline ? 'analyzed' : 'draft');

  const updatedRecord: EventData = {
    ...eventData,
    status,
    baselineScore: baseline,
    projectedScore: projected,
    createdAt: eventData.createdAt || nowIso,
    updatedAt: nowIso
  };

  const existingIndex = events.findIndex((e) => e.id === eventData.id);
  let nextEvents: EventData[];

  if (existingIndex >= 0) {
    nextEvents = [...events];
    nextEvents[existingIndex] = updatedRecord;
  } else {
    nextEvents = [updatedRecord, ...events];
  }

  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(nextEvents));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, updatedRecord.id);
  } catch (e) {
    console.error('Failed to save event to localStorage', e);
  }

  return updatedRecord;
};

export const deleteEvent = (id: string): void => {
  const events = getSavedEvents();
  const nextEvents = events.filter((e) => e.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(nextEvents));
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
    if (activeId === id) {
      if (nextEvents.length > 0) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, nextEvents[0].id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_ID);
      }
    }
  } catch (e) {
    console.error('Failed to delete event from localStorage', e);
  }
};

export const duplicateEvent = (id: string): EventData | null => {
  const original = getEventById(id);
  if (!original) return null;

  const nowIso = new Date().toISOString();
  const newId = 'evt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  
  // Calculate fresh scores for the duplicate
  let baseline = original.baselineScore;
  let projected = original.projectedScore;
  try {
    const calc = analyzeEventSustainability(original);
    baseline = calc.overallScore;
    projected = calc.optimizedScore;
  } catch {
    // Keep existing if error
  }

  const duplicatedEvent: EventData = {
    ...original,
    id: newId,
    name: `${original.name} — Alternative Plan`,
    status: original.status || 'analyzed',
    baselineScore: baseline,
    projectedScore: projected,
    analysisOutdated: false,
    optimizationOutdated: false,
    completedTasks: [], // Fresh isolated action plan
    whatIfSelectedScenarioIds: [], // Fresh isolated What-If state
    createdAt: nowIso,
    updatedAt: nowIso
  };

  const events = getSavedEvents();
  const nextEvents = [duplicatedEvent, ...events];

  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(nextEvents));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, duplicatedEvent.id);
  } catch (e) {
    console.error('Failed to save duplicate event', e);
  }

  return duplicatedEvent;
};

export const saveDraft = (draftData: Partial<EventData>, step: number): void => {
  try {
    const payload = { data: draftData, step, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(payload));
  } catch (e) {
    console.error('Failed to save draft to localStorage', e);
  }
};

export const getDraft = (): { data: Partial<EventData>; step: number } | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAFT);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.step === 'number' && parsed.data) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export const clearDraft = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.DRAFT);
  } catch {
    // ignore
  }
};

export const updateEventActionPlan = (eventId: string, completedTaskIds: string[]): void => {
  const events = getSavedEvents();
  const index = events.findIndex((e) => e.id === eventId);
  if (index >= 0) {
    events[index].completedTasks = completedTaskIds;
    events[index].updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to persist action plan', e);
    }
  }
};

export const reanalyzeEvent = (eventId: string): EventData | null => {
  const event = getEventById(eventId);
  if (!event) return null;

  const calc = analyzeEventSustainability(event);
  const updated: EventData = {
    ...event,
    baselineScore: calc.overallScore,
    projectedScore: calc.optimizedScore,
    analysisOutdated: false,
    status: 'analyzed',
    updatedAt: new Date().toISOString()
  };

  return saveEvent(updated, 'analyzed');
};

export const reoptimizeEvent = (eventId: string): EventData | null => {
  const event = getEventById(eventId);
  if (!event) return null;

  const calc = analyzeEventSustainability(event);
  const updated: EventData = {
    ...event,
    baselineScore: calc.overallScore,
    projectedScore: calc.optimizedScore,
    analysisOutdated: false,
    optimizationOutdated: false,
    status: 'optimized',
    updatedAt: new Date().toISOString()
  };

  return saveEvent(updated, 'optimized');
};

export const keepCurrentPlan = (eventId: string): EventData | null => {
  const event = getEventById(eventId);
  if (!event) return null;

  const updated: EventData = {
    ...event,
    optimizationOutdated: false,
    updatedAt: new Date().toISOString()
  };

  return saveEvent(updated);
};

export const getActiveEventId = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
  } catch {
    return null;
  }
};

export const setActiveEventId = (id: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, id);
  } catch {
    // ignore
  }
};

export const getThemePreference = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // ignore
  }
  return 'light';
};

export const setThemePreference = (theme: ThemeMode): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch {
    // ignore
  }
};

export const formatRelativeTime = (isoString?: string): string => {
  if (!isoString) return 'Recently';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
};
