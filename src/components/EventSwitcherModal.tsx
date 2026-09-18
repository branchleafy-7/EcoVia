import React from 'react';
import { Check, Plus, X, Calendar, ArrowRight } from 'lucide-react';
import { EventData } from '../types';
import { EventStatusBadge } from './EventStatusBadge';

interface EventSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventData[];
  activeEventId: string | null;
  onSelectEvent: (event: EventData) => void;
  onCreateNew: () => void;
}

export const EventSwitcherModal: React.FC<EventSwitcherModalProps> = ({
  isOpen,
  onClose,
  events,
  activeEventId,
  onSelectEvent,
  onCreateNew
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="switcher-title"
    >
      <div className="bg-white dark:bg-[#181E1B] rounded-3xl border border-[#EAE8E3] dark:border-[#2A3630] shadow-2xl max-w-md w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE8E3] dark:border-[#26322C]">
          <div>
            <h3 id="switcher-title" className="text-base font-bold text-[#132E20] dark:text-[#E2E8E4]">
              Switch Active Event
            </h3>
            <p className="text-xs text-[#526359] dark:text-[#8E9E95]">
              Select which event to analyze, optimize, or plan
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#132E20] dark:hover:text-white hover:bg-[#F3F2EE] dark:hover:bg-[#232D28] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto space-y-2 py-1 pr-1">
          {events.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#526359] dark:text-[#8E9E95]">
              No saved events found.
            </div>
          ) : (
            events.map((evt) => {
              const isActive = evt.id === activeEventId;
              return (
                <button
                  key={evt.id}
                  onClick={() => {
                    onSelectEvent(evt);
                    onClose();
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-[#EBF3EE] dark:bg-[#1C2C23] border-[#8DA393] dark:border-[#3D5B49] shadow-xs'
                      : 'bg-white dark:bg-[#181E1B] border-[#EAE8E3] dark:border-[#26322C] hover:border-[#8DA393] dark:hover:border-[#384C40] hover:bg-[#FAF9F6] dark:hover:bg-[#1E2722]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#132E20] dark:text-[#E2E8E4] truncate">
                        {evt.name}
                      </span>
                      <EventStatusBadge status={evt.status} size="sm" />
                    </div>
                    <div className="text-[11px] text-[#526359] dark:text-[#8E9E95] mt-1 flex items-center gap-2">
                      <span>{evt.attendees.toLocaleString()} attendees</span>
                      <span>·</span>
                      <span>{evt.durationHours}h</span>
                      {evt.baselineScore !== undefined && (
                        <>
                          <span>·</span>
                          <span className="font-semibold text-[#15803D] dark:text-[#4ADE80]">
                            Score: {evt.baselineScore}
                            {evt.projectedScore ? ` → ${evt.projectedScore}` : ''}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {isActive ? (
                    <div className="w-6 h-6 rounded-full bg-[#132E20] dark:bg-[#4ADE80] text-white dark:text-[#0F1311] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <ArrowRight className="w-4 h-4 text-[#8DA393] shrink-0 opacity-60" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Create New Event footer CTA */}
        <div className="pt-3 border-t border-[#EAE8E3] dark:border-[#26322C]">
          <button
            onClick={() => {
              onCreateNew();
              onClose();
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#132E20] dark:bg-[#203D2D] hover:bg-[#1A3E2B] text-white text-xs font-semibold active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>

      </div>
    </div>
  );
};
