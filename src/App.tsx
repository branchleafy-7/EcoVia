import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomePage } from './components/HomePage';
import { SavedEventsDashboard } from './components/SavedEventsDashboard';
import { EventCreationWizard } from './components/EventCreationWizard';
import { AnalysisView } from './components/AnalysisView';
import { OptimizeView } from './components/OptimizeView';
import { ActionPlanView } from './components/ActionPlanView';
import { AnalysisTransition } from './components/AnalysisTransition';
import { EmptyState } from './components/EmptyState';
import { AboutModal } from './components/AboutModal';
import { EventDetailModal } from './components/EventDetailModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { EventSwitcherModal } from './components/EventSwitcherModal';
import { EventData, ActionTask, AnalysisResult, ThemeMode } from './types';
import { SAMPLE_EVENTS } from './data/sampleEvents';
import { analyzeEventSustainability } from './services/sustainabilityEngine';
import {
  getSavedEvents,
  saveEvent,
  deleteEvent,
  getActiveEventId,
  setActiveEventId,
  getThemePreference,
  setThemePreference,
  duplicateEvent,
  reanalyzeEvent,
  reoptimizeEvent,
  keepCurrentPlan,
  updateEventActionPlan,
  clearDraft
} from './services/eventStorage';

export default function App() {
  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<
    'home' | 'events' | 'create' | 'analysis' | 'optimize' | 'plan'
  >('home');

  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => getThemePreference());

  // Apply theme class to document element on mount & change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setThemePreference(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Saved events collection
  const [savedEvents, setSavedEvents] = useState<EventData[]>(() => getSavedEvents());

  // Current active event
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(() => {
    const activeId = getActiveEventId();
    const all = getSavedEvents();
    if (activeId) {
      const found = all.find((e) => e.id === activeId);
      if (found) return found;
    }
    return all.length > 0 ? all[0] : null;
  });

  // Track event being edited in wizard (null = create new event)
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);

  // Modal states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState<boolean>(false);
  const [detailTargetEvent, setDetailTargetEvent] = useState<EventData | null>(null);
  const [deleteTargetEvent, setDeleteTargetEvent] = useState<EventData | null>(null);

  // Recommendations and tasks
  const [plannedRecIds, setPlannedRecIds] = useState<Set<string>>(new Set());
  const [customTasks, setCustomTasks] = useState<ActionTask[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(
    new Set(['task-1', 'task-2', 'task-3'])
  );

  // Load completed tasks per active event
  useEffect(() => {
    if (currentEvent?.completedTasks && currentEvent.completedTasks.length > 0) {
      setCompletedTaskIds(new Set(currentEvent.completedTasks));
    } else {
      setCompletedTaskIds(new Set(['task-1', 'task-2', 'task-3']));
    }
  }, [currentEvent?.id]);

  // Synchronize active event whenever currentEvent changes
  const handleSelectEvent = (event: EventData) => {
    setCurrentEvent(event);
    setActiveEventId(event.id);
  };

  // Compute live analysis when current event changes
  const analysis: AnalysisResult | null = useMemo(() => {
    if (!currentEvent) return null;
    return analyzeEventSustainability(currentEvent);
  }, [currentEvent]);

  // Combined tasks
  const allTasks: ActionTask[] = useMemo(() => {
    if (!analysis) return [];
    const baseTasks = analysis.actionTasks.map((t) => ({
      ...t,
      completed: completedTaskIds.has(t.id)
    }));
    return [...baseTasks, ...customTasks];
  }, [analysis, completedTaskIds, customTasks]);

  // Handlers for event creation and modifications
  const handleCreateEventClick = () => {
    setEditingEvent(null);
    setCurrentTab('create');
  };

  const handleEditEvent = (evt: EventData) => {
    setEditingEvent(evt);
    handleSelectEvent(evt);
    setCurrentTab('create');
  };

  const handleTrySampleEvent = () => {
    const sample = SAMPLE_EVENTS.college_fest;
    const persisted = saveEvent(sample, 'analyzed');
    setSavedEvents(getSavedEvents());
    setCurrentEvent(persisted);
    setIsAnalyzing(true);
  };

  const handleFormComplete = (data: EventData) => {
    let toSave: EventData = { ...data };
    if (editingEvent) {
      toSave.id = editingEvent.id;
      toSave.analysisOutdated = true;
      if (editingEvent.status === 'optimized') {
        toSave.optimizationOutdated = true;
      }
    }
    const persisted = saveEvent(toSave, editingEvent ? toSave.status : 'analyzed');
    clearDraft();
    setEditingEvent(null);
    setSavedEvents(getSavedEvents());
    setCurrentEvent(persisted);
    setIsAnalyzing(true);
  };

  const handleAnalysisFinished = () => {
    setIsAnalyzing(false);
    setCurrentTab('analysis');
  };

  const handleToggleTask = (taskId: string) => {
    setCompletedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      if (currentEvent) {
        updateEventActionPlan(currentEvent.id, Array.from(next) as string[]);
      }
      return next;
    });

    setCustomTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddCustomTask = (
    title: string,
    phase: 'before' | 'during' | 'after',
    timelineGroup: any = '1_week_before',
    role: string = 'Organizing Committee'
  ) => {
    const newTask: ActionTask = {
      id: 'custom-' + Date.now(),
      title,
      phase,
      timelineGroup,
      role,
      completed: false,
      categoryId: 'waste',
      impactBadge: 'Custom Action'
    };
    setCustomTasks((prev) => [...prev, newTask]);
  };

  const handleTogglePlanRecommendation = (
    recId: string,
    title: string,
    categoryId: any
  ) => {
    setPlannedRecIds((prev) => {
      const next = new Set(prev);
      if (next.has(recId)) {
        next.delete(recId);
        setCustomTasks((tasks) =>
          tasks.filter((t) => t.sourceRecommendationId !== recId)
        );
      } else {
        next.add(recId);
        const newTask: ActionTask = {
          id: 'task-rec-' + recId,
          title: `Implement: ${title}`,
          phase: 'before',
          timelineGroup: '2_weeks_before',
          role: 'Operations Lead',
          completed: false,
          categoryId,
          impactBadge: 'High Impact',
          sourceRecommendationId: recId
        };
        setCustomTasks((tasks) => [...tasks, newTask]);
      }
      return next;
    });
  };

  // Duplicate Event handler
  const handleDuplicateEvent = (evt: EventData) => {
    const duplicated = duplicateEvent(evt.id);
    const updated = getSavedEvents();
    setSavedEvents(updated);
    if (duplicated) {
      setCurrentEvent(duplicated);
      setActiveEventId(duplicated.id);
    }
  };

  // Re-analyze Event handler
  const handleReanalyzeEvent = (evt: EventData) => {
    const updated = reanalyzeEvent(evt.id);
    setSavedEvents(getSavedEvents());
    if (updated) {
      setCurrentEvent(updated);
    }
  };

  // Re-optimize Event handler
  const handleReoptimizeEvent = (evt: EventData) => {
    const updated = reoptimizeEvent(evt.id);
    setSavedEvents(getSavedEvents());
    if (updated) {
      setCurrentEvent(updated);
    }
  };

  // Keep Current Plan handler
  const handleKeepCurrentPlan = (evt: EventData) => {
    const updated = keepCurrentPlan(evt.id);
    setSavedEvents(getSavedEvents());
    if (updated) {
      setCurrentEvent(updated);
    }
  };

  // Save As New Version (Optimization Isolation)
  const handleSaveAsNewVersion = (optimizedEvent: EventData) => {
    const newEvent: EventData = {
      ...optimizedEvent,
      id: 'event_' + Date.now(),
      name: `${currentEvent?.name || 'Event'} (Optimized Plan)`,
      status: 'optimized',
      analysisOutdated: false,
      optimizationOutdated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const persisted = saveEvent(newEvent, 'optimized');
    setSavedEvents(getSavedEvents());
    setCurrentEvent(persisted);
    setActiveEventId(persisted.id);
    setCurrentTab('analysis');
  };

  // Apply What-If changes to active plan safely
  const handleApplyWhatIfChanges = (delta: Partial<EventData>) => {
    if (!currentEvent) return;
    const updated: EventData = {
      ...currentEvent,
      ...delta,
      analysisOutdated: true,
      updatedAt: new Date().toISOString()
    };
    const persisted = saveEvent(updated);
    setSavedEvents(getSavedEvents());
    setCurrentEvent(persisted);
  };

  // Delete event flow
  const handleDeleteConfirm = () => {
    if (!deleteTargetEvent) return;
    deleteEvent(deleteTargetEvent.id);
    const updated = getSavedEvents();
    setSavedEvents(updated);
    if (currentEvent?.id === deleteTargetEvent.id) {
      setCurrentEvent(updated.length > 0 ? updated[0] : null);
    }
    setDeleteTargetEvent(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0F1311] text-[#1E2522] dark:text-[#E2E8E4] flex flex-col selection:bg-[#8DA393]/25 selection:text-[#132E20] transition-colors">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentEvent={currentEvent}
        savedEventsCount={savedEvents.length}
        onOpenAbout={() => setIsAboutOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSwitcher={() => setIsSwitcherOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-20 md:pb-12">
        
        {/* 1. HOME TAB */}
        {currentTab === 'home' && (
          <HomePage
            onCreateEvent={handleCreateEventClick}
            onTrySampleEvent={handleTrySampleEvent}
            currentEvent={currentEvent}
            savedEvents={savedEvents}
            onSelectEvent={(evt) => {
              handleSelectEvent(evt);
              setCurrentTab('analysis');
            }}
            onViewAllEvents={() => setCurrentTab('events')}
            onViewAnalysis={() => setCurrentTab('analysis')}
            onOpenAbout={() => setIsAboutOpen(true)}
          />
        )}

        {/* 2. SAVED EVENTS DASHBOARD TAB */}
        {currentTab === 'events' && (
          <SavedEventsDashboard
            events={savedEvents}
            activeEventId={currentEvent?.id || null}
            onSelectEvent={handleSelectEvent}
            onCreateNew={handleCreateEventClick}
            onViewAnalysis={(evt) => {
              handleSelectEvent(evt);
              setCurrentTab('analysis');
            }}
            onOptimizeEvent={(evt) => {
              handleSelectEvent(evt);
              setCurrentTab('optimize');
            }}
            onEditEvent={handleEditEvent}
            onDuplicateEvent={handleDuplicateEvent}
            onReanalyzeEvent={handleReanalyzeEvent}
            onReoptimizeEvent={handleReoptimizeEvent}
            onKeepCurrentPlan={handleKeepCurrentPlan}
            onDeleteEventClick={(evt) => setDeleteTargetEvent(evt)}
            onViewDetails={(evt) => setDetailTargetEvent(evt)}
          />
        )}

        {/* 3. CREATE / EDIT EVENT TAB */}
        {currentTab === 'create' && (
          <EventCreationWizard
            initialData={editingEvent}
            onComplete={handleFormComplete}
            onCancel={() => {
              setEditingEvent(null);
              if (savedEvents.length > 0) {
                setCurrentTab('events');
              } else {
                setCurrentTab('home');
              }
            }}
          />
        )}

        {/* 4. ANALYSIS TAB */}
        {currentTab === 'analysis' && (
          currentEvent && analysis ? (
            <AnalysisView
              event={currentEvent}
              analysis={analysis}
              onGoToOptimize={() => setCurrentTab('optimize')}
              onTogglePlanTask={handleTogglePlanRecommendation}
              plannedRecIds={plannedRecIds}
            />
          ) : (
            <EmptyState
              onCreateEvent={handleCreateEventClick}
              onTrySampleEvent={handleTrySampleEvent}
            />
          )
        )}

        {/* 5. OPTIMIZE TAB */}
        {currentTab === 'optimize' && (
          currentEvent && analysis ? (
            <OptimizeView
              event={currentEvent}
              analysis={analysis}
              onGoToActionPlan={() => setCurrentTab('plan')}
              onSaveAsNewVersion={handleSaveAsNewVersion}
              onApplyWhatIfChanges={handleApplyWhatIfChanges}
            />
          ) : (
            <EmptyState
              onCreateEvent={handleCreateEventClick}
              onTrySampleEvent={handleTrySampleEvent}
            />
          )
        )}

        {/* 6. ACTION PLAN TAB */}
        {currentTab === 'plan' && (
          currentEvent && analysis ? (
            <ActionPlanView
              tasks={allTasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddCustomTask}
              eventName={currentEvent.name}
            />
          ) : (
            <EmptyState
              onCreateEvent={handleCreateEventClick}
              onTrySampleEvent={handleTrySampleEvent}
            />
          )
        )}

      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        hasEvent={!!currentEvent}
        savedEventsCount={savedEvents.length}
      />

      {/* Event Detail Modal */}
      <EventDetailModal
        event={detailTargetEvent}
        isOpen={!!detailTargetEvent}
        onClose={() => setDetailTargetEvent(null)}
        onSelectAnalysis={(evt) => {
          handleSelectEvent(evt);
          setDetailTargetEvent(null);
          setCurrentTab('analysis');
        }}
        onSelectOptimize={(evt) => {
          handleSelectEvent(evt);
          setDetailTargetEvent(null);
          setCurrentTab('optimize');
        }}
        onSelectEdit={(evt) => {
          handleEditEvent(evt);
          setDetailTargetEvent(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteTargetEvent}
        eventName={deleteTargetEvent?.name || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetEvent(null)}
      />

      {/* Global Event Switcher Modal */}
      <EventSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
        events={savedEvents}
        activeEventId={currentEvent?.id || null}
        onSelectEvent={handleSelectEvent}
        onCreateNew={handleCreateEventClick}
      />

      {/* Analysis Transition Animation Modal */}
      {isAnalyzing && (
        <AnalysisTransition onComplete={handleAnalysisFinished} />
      )}

      {/* About & Sustainability Purpose Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

    </div>
  );
}
