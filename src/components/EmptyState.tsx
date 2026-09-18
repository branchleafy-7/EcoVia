import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onCreateEvent: () => void;
  onTrySampleEvent: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onCreateEvent,
  onTrySampleEvent
}) => {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-[#E2E8E4] dark:bg-[#1E2C23] flex items-center justify-center text-3xl mx-auto shadow-xs">
        🌱
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[#132E20] dark:text-[#E2E8E4]">No event loaded</h2>
        <p className="text-sm font-semibold text-[#2C4A38] dark:text-[#A7D1B8]">
          Your sustainability journey starts here.
        </p>
        <p className="text-xs text-[#526359] dark:text-[#8E9E95] leading-relaxed">
          Select or create an event to see your Green Score, uncover resource hotspots, and generate an actionable reduction strategy.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onCreateEvent}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#132E20] dark:bg-[#203D2D] hover:bg-[#1A3E2B] text-white text-xs font-semibold transition-all shadow-xs"
        >
          <span>Create Event</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onTrySampleEvent}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#D9D6CE] dark:border-[#2F3D35] bg-white dark:bg-[#181E1B] text-[#1E2522] dark:text-[#E2E8E4] text-xs font-semibold hover:bg-[#F3F2EE] dark:hover:bg-[#202824] transition-all"
        >
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Try Sample Event</span>
        </button>
      </div>
    </div>
  );
};
