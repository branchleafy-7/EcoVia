import React from 'react';
import { Home, Layers, PlusCircle, BarChart3, CheckSquare } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'home' | 'events' | 'create' | 'analysis' | 'optimize' | 'plan';
  setCurrentTab: (tab: 'home' | 'events' | 'create' | 'analysis' | 'optimize' | 'plan') => void;
  hasEvent: boolean;
  savedEventsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  hasEvent,
  savedEventsCount
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F6]/95 dark:bg-[#0F1311]/95 backdrop-blur-lg border-t border-[#EAE8E3] dark:border-[#26322C] px-2 py-1.5 shadow-lg safe-area-pb transition-colors">
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        
        {/* Home */}
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentTab === 'home'
              ? 'text-[#132E20] dark:text-[#86EFAC] font-semibold bg-[#E2E8E4]/60 dark:bg-[#1C2C22]'
              : 'text-[#64748B] dark:text-[#8E9E95] hover:text-[#132E20] dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* My Events */}
        <button
          onClick={() => setCurrentTab('events')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors relative ${
            currentTab === 'events'
              ? 'text-[#132E20] dark:text-[#86EFAC] font-semibold bg-[#E2E8E4]/60 dark:bg-[#1C2C22]'
              : 'text-[#64748B] dark:text-[#8E9E95] hover:text-[#132E20] dark:hover:text-white'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">My Events</span>
          {savedEventsCount > 0 && (
            <span className="absolute top-1 right-2.5 w-1.5 h-1.5 rounded-full bg-[#15803D] dark:bg-[#4ADE80]" />
          )}
        </button>

        {/* Create */}
        <button
          onClick={() => setCurrentTab('create')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentTab === 'create'
              ? 'text-[#132E20] dark:text-[#86EFAC] font-semibold bg-[#E2E8E4]/60 dark:bg-[#1C2C22]'
              : 'text-[#64748B] dark:text-[#8E9E95] hover:text-[#132E20] dark:hover:text-white'
          }`}
        >
          <PlusCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Create</span>
        </button>

        {/* Analysis */}
        <button
          onClick={() => hasEvent && setCurrentTab('analysis')}
          disabled={!hasEvent}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            !hasEvent
              ? 'text-gray-300 dark:text-gray-700 opacity-40 cursor-not-allowed'
              : currentTab === 'analysis'
              ? 'text-[#132E20] dark:text-[#86EFAC] font-semibold bg-[#E2E8E4]/60 dark:bg-[#1C2C22]'
              : 'text-[#64748B] dark:text-[#8E9E95] hover:text-[#132E20] dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Analysis</span>
        </button>

        {/* Action Plan */}
        <button
          onClick={() => hasEvent && setCurrentTab('plan')}
          disabled={!hasEvent}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            !hasEvent
              ? 'text-gray-300 dark:text-gray-700 opacity-40 cursor-not-allowed'
              : currentTab === 'plan'
              ? 'text-[#132E20] dark:text-[#86EFAC] font-semibold bg-[#E2E8E4]/60 dark:bg-[#1C2C22]'
              : 'text-[#64748B] dark:text-[#8E9E95] hover:text-[#132E20] dark:hover:text-white'
          }`}
        >
          <CheckSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Plan</span>
        </button>

      </div>
    </div>
  );
};
