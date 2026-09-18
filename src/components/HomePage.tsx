import React from 'react';
import {
  ArrowRight,
  Compass,
  BarChart3,
  Sliders,
  CalendarCheck,
  ChevronRight,
  Sparkles,
  Clock,
  Users,
  Layers,
  TrendingUp
} from 'lucide-react';
import { EventData } from '../types';
import { EventStatusBadge } from './EventStatusBadge';
import { EcoviaLogo } from './EcoviaLogo';

interface HomePageProps {
  onCreateEvent: () => void;
  onTrySampleEvent: () => void;
  currentEvent: EventData | null;
  savedEvents: EventData[];
  onSelectEvent: (event: EventData) => void;
  onViewAllEvents: () => void;
  onViewAnalysis: () => void;
  onOpenAbout: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onCreateEvent,
  onTrySampleEvent,
  currentEvent,
  savedEvents,
  onSelectEvent,
  onViewAllEvents,
  onViewAnalysis,
  onOpenAbout
}) => {
  const recentEvents = savedEvents.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16 space-y-12 sm:space-y-16">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-2 sm:pt-4">
        
        {/* Brand visual anchor */}
        <div className="flex justify-center">
          <EcoviaLogo variant="icon" size="lg" />
        </div>

        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-widest text-[#15803D] dark:text-[#4ADE80]">
            Event Sustainability Decision Support
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#132E20] dark:text-[#E2E8E4] tracking-tight">
            ECOVIA
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2C4A38] dark:text-[#A7D1B8] tracking-tight">
            Smarter events. <br className="hidden sm:inline" />Sustainable choices.
          </h2>
          <p className="text-base sm:text-lg text-[#526359] dark:text-[#9AA8A0] max-w-xl mx-auto font-normal leading-relaxed pt-1">
            Plan better events by identifying resource hotspots, prioritizing practical improvements, and simulating how your decisions change the outcome.
          </p>
        </div>

        {/* Primary & Secondary Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onCreateEvent}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#132E20] dark:bg-[#203D2D] hover:bg-[#1A3E2B] text-white font-semibold text-sm active:scale-[0.98] transition-all shadow-xs"
          >
            <span>Create an Event</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTrySampleEvent}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-[#181E1B] border border-[#D9D6CE] dark:border-[#2F3D35] text-[#1E2522] dark:text-[#E2E8E4] font-semibold text-sm hover:bg-[#F3F2EE] dark:hover:bg-[#202824] active:scale-[0.98] transition-all shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-[#15803D] dark:text-[#4ADE80]" />
            <span>Try Sample Event</span>
          </button>
        </div>

        {/* Current Active Event Resume Card */}
        {currentEvent && (
          <div className="mt-6 p-4 rounded-2xl bg-white dark:bg-[#181E1B] border border-[#EAE8E3] dark:border-[#26322C] shadow-xs max-w-lg mx-auto flex items-center justify-between gap-4 text-left">
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80]">
                Active Event Loaded
              </div>
              <div className="font-bold text-sm text-[#132E20] dark:text-[#E2E8E4] truncate">
                {currentEvent.name}
              </div>
              <div className="text-xs text-[#526359] dark:text-[#8E9E95] flex items-center gap-2 mt-0.5">
                <span>{currentEvent.attendees.toLocaleString()} attendees</span>
                <span>·</span>
                <span>{currentEvent.durationHours} hours</span>
                {currentEvent.baselineScore !== undefined && (
                  <>
                    <span>·</span>
                    <span className="font-semibold text-[#15803D] dark:text-[#4ADE80]">
                      Score: {currentEvent.baselineScore}
                      {currentEvent.projectedScore ? ` → ${currentEvent.projectedScore}` : ''}
                    </span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={onViewAnalysis}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E2E8E4] dark:bg-[#203227] text-[#132E20] dark:text-[#86EFAC] text-xs font-semibold hover:bg-[#D5DFD8] dark:hover:bg-[#294233] transition-colors shrink-0"
            >
              <span>View Analysis</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* RECENT EVENTS SECTION (if data exists) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#15803D] dark:text-[#4ADE80]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#132E20] dark:text-[#E2E8E4]">
              Recent Events
            </h3>
          </div>
          {savedEvents.length > 0 && (
            <button
              onClick={onViewAllEvents}
              className="text-xs font-semibold text-[#15803D] dark:text-[#4ADE80] hover:underline flex items-center gap-1"
            >
              <span>View all ({savedEvents.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {recentEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {recentEvents.map((evt) => {
              const isSelected = currentEvent?.id === evt.id;
              const hasScore = evt.baselineScore !== undefined;

              return (
                <button
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-white dark:bg-[#1B2520] border-[#15803D] dark:border-[#4ADE80] ring-1 ring-[#15803D]/20 shadow-xs'
                      : 'bg-white dark:bg-[#181E1B] border-[#EAE8E3] dark:border-[#26322C] hover:border-[#8DA393] dark:hover:border-[#384D41]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <EventStatusBadge status={evt.status} size="sm" />
                      <span className="text-[10px] text-[#8DA393]">
                        {evt.attendees.toLocaleString()} pax
                      </span>
                    </div>

                    <div className="font-bold text-sm text-[#132E20] dark:text-[#E2E8E4] group-hover:text-[#15803D] dark:group-hover:text-[#4ADE80] transition-colors truncate">
                      {evt.name}
                    </div>

                    <p className="text-[11px] text-[#526359] dark:text-[#8E9E95] truncate">
                      {evt.type}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-[#EAE8E3] dark:border-[#26322C] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#526359] dark:text-[#8E9E95]">Score</span>
                    {hasScore ? (
                      <span className="font-bold text-[#132E20] dark:text-[#E2E8E4]">
                        {evt.baselineScore}
                        {evt.projectedScore && evt.projectedScore > (evt.baselineScore || 0) && (
                          <span className="text-[#15803D] dark:text-[#4ADE80] ml-1">
                            → {evt.projectedScore}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-[#8DA393] text-[11px] italic">Draft</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white dark:bg-[#181E1B] border border-dashed border-[#D9D6CE] dark:border-[#2A3730] text-center space-y-2">
            <p className="text-xs font-semibold text-[#132E20] dark:text-[#E2E8E4]">
              Your events will appear here
            </p>
            <p className="text-xs text-[#526359] dark:text-[#8E9E95]">
              Create an event or try a sample scenario to begin evaluating sustainability.
            </p>
            <button
              onClick={onCreateEvent}
              className="text-xs font-semibold text-[#15803D] dark:text-[#4ADE80] hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>Create your first event</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </section>

      {/* Four-Stage Explanation: PLAN → ANALYZE → IMPROVE → ACT */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#526359] dark:text-[#8E9E95]">
            The Journey
          </h3>
          <p className="text-sm font-semibold text-[#132E20] dark:text-[#E2E8E4]">
            Four stages from initial plan to verified action
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Stage 1: PLAN */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181E1B] border border-[#EAE8E3] dark:border-[#26322C] shadow-2xs space-y-3 relative hover:border-[#8DA393] dark:hover:border-[#384D41] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#15803D] dark:text-[#4ADE80] bg-[#E2E8E4] dark:bg-[#203227] px-2.5 py-1 rounded-full">
                01
              </span>
              <Compass className="w-5 h-5 text-[#8DA393]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#132E20] dark:text-[#E2E8E4]">PLAN</h4>
              <p className="text-xs text-[#526359] dark:text-[#8E9E95] mt-1 leading-relaxed">
                Provide lightweight event details on catering, waste, energy, water, transit, and materials.
              </p>
            </div>
          </div>

          {/* Stage 2: ANALYZE */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181E1B] border border-[#EAE8E3] dark:border-[#26322C] shadow-2xs space-y-3 relative hover:border-[#8DA393] dark:hover:border-[#384D41] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#15803D] dark:text-[#4ADE80] bg-[#E2E8E4] dark:bg-[#203227] px-2.5 py-1 rounded-full">
                02
              </span>
              <BarChart3 className="w-5 h-5 text-[#8DA393]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#132E20] dark:text-[#E2E8E4]">ANALYZE</h4>
              <p className="text-xs text-[#526359] dark:text-[#8E9E95] mt-1 leading-relaxed">
                Inspect your deterministic Green Score and identify the top 3 highest-priority resource hotspots.
              </p>
            </div>
          </div>

          {/* Stage 3: IMPROVE */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181E1B] border border-[#EAE8E3] dark:border-[#26322C] shadow-2xs space-y-3 relative hover:border-[#8DA393] dark:hover:border-[#384D41] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#15803D] dark:text-[#4ADE80] bg-[#E2E8E4] dark:bg-[#203227] px-2.5 py-1 rounded-full">
                03
              </span>
              <Sliders className="w-5 h-5 text-[#8DA393]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#132E20] dark:text-[#E2E8E4]">IMPROVE</h4>
              <p className="text-xs text-[#526359] dark:text-[#8E9E95] mt-1 leading-relaxed">
                Simulate targeted decisions with What-If chips and see immediate projected score improvements.
              </p>
            </div>
          </div>

          {/* Stage 4: ACT */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181E1B] border border-[#EAE8E3] dark:border-[#26322C] shadow-2xs space-y-3 relative hover:border-[#8DA393] dark:hover:border-[#384D41] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#15803D] dark:text-[#4ADE80] bg-[#E2E8E4] dark:bg-[#203227] px-2.5 py-1 rounded-full">
                04
              </span>
              <CalendarCheck className="w-5 h-5 text-[#8DA393]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#132E20] dark:text-[#E2E8E4]">ACT</h4>
              <p className="text-xs text-[#526359] dark:text-[#8E9E95] mt-1 leading-relaxed">
                Execute a structured operational checklist organized across Before, During, and After phases.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Subtle SDG & Governance Footer Reference */}
      <section className="pt-6 border-t border-[#EAE8E3] dark:border-[#26322C] text-center">
        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-[#526359] dark:text-[#8E9E95]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#15803D] dark:bg-[#4ADE80]" />
            <span>Aligned with UN Sustainable Development Goals 12 & 13</span>
          </div>
          <span className="hidden sm:inline text-[#CBD5E1] dark:text-[#334155]">•</span>
          <button
            onClick={onOpenAbout}
            className="font-medium text-[#132E20] dark:text-[#E2E8E4] hover:underline flex items-center gap-1"
          >
            <span>About ECOVIA & Responsible AI</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </section>

    </div>
  );
};
