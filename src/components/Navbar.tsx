import React from 'react';
import {
  Info,
  Sparkles,
  CheckSquare,
  BarChart3,
  Home,
  PlusCircle,
  Sun,
  Moon,
  FolderHeart,
  ChevronDown,
  Layers
} from 'lucide-react';
import { EventData, ThemeMode } from '../types';
import { EcoviaLogo } from './EcoviaLogo';

interface NavbarProps {
  currentTab: 'home' | 'events' | 'create' | 'analysis' | 'optimize' | 'plan';
  setCurrentTab: (tab: 'home' | 'events' | 'create' | 'analysis' | 'optimize' | 'plan') => void;
  currentEvent: EventData | null;
  savedEventsCount: number;
  onOpenAbout: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenSwitcher: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentEvent,
  savedEventsCount,
  onOpenAbout,
  theme,
  onToggleTheme,
  onOpenSwitcher
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 dark:bg-[#0F1311]/90 backdrop-blur-md border-b border-[#EAE8E3] dark:border-[#26322C] transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand Logo & Context */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('home')}
              className="flex items-center text-left group focus:outline-none"
              aria-label="ECOVIA Home"
            >
              <EcoviaLogo variant="full" size="md" />
            </button>

            {/* Event Switcher Trigger Pill */}
            {currentEvent ? (
              <button
                onClick={onOpenSwitcher}
                className="hidden lg:inline-flex items-center gap-2 ml-3 pl-3 border-l border-[#EAE8E3] dark:border-[#26322C] text-xs text-[#526359] dark:text-[#8E9E95] hover:text-[#132E20] dark:hover:text-[#E2E8E4] group transition-colors"
                title="Click to switch between saved events"
              >
                <span className="w-2 h-2 rounded-full bg-[#15803D] dark:bg-[#4ADE80] animate-pulse" />
                <span className="font-semibold text-[#1E2522] dark:text-[#E2E8E4] max-w-[140px] truncate">
                  {currentEvent.name}
                </span>
                <span className="text-[11px] text-[#8DA393]">
                  ({currentEvent.attendees.toLocaleString()})
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8DA393] group-hover:translate-y-0.5 transition-transform" />
              </button>
            ) : savedEventsCount > 0 ? (
              <button
                onClick={onOpenSwitcher}
                className="hidden lg:inline-flex items-center gap-1.5 ml-3 pl-3 border-l border-[#EAE8E3] dark:border-[#26322C] text-xs font-medium text-[#15803D] dark:text-[#4ADE80] hover:underline"
              >
                <span>Select active event ({savedEventsCount})</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            ) : null}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            
            {/* Home */}
            <button
              onClick={() => setCurrentTab('home')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                currentTab === 'home'
                  ? 'bg-[#132E20] text-white dark:bg-[#203D2D] shadow-xs'
                  : 'text-[#4A5568] dark:text-[#A0AEC0] hover:text-[#132E20] dark:hover:text-white hover:bg-[#EAE8E3]/60 dark:hover:bg-[#1E2622]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            {/* My Events Dashboard */}
            <button
              onClick={() => setCurrentTab('events')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                currentTab === 'events'
                  ? 'bg-[#132E20] text-white dark:bg-[#203D2D] shadow-xs'
                  : 'text-[#4A5568] dark:text-[#A0AEC0] hover:text-[#132E20] dark:hover:text-white hover:bg-[#EAE8E3]/60 dark:hover:bg-[#1E2622]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>My Events</span>
              {savedEventsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#E2E8E4] dark:bg-[#2B3B32] text-[#132E20] dark:text-[#86EFAC] font-bold">
                  {savedEventsCount}
                </span>
              )}
            </button>

            {/* Create / Edit */}
            <button
              onClick={() => setCurrentTab('create')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                currentTab === 'create'
                  ? 'bg-[#132E20] text-white dark:bg-[#203D2D] shadow-xs'
                  : 'text-[#4A5568] dark:text-[#A0AEC0] hover:text-[#132E20] dark:hover:text-white hover:bg-[#EAE8E3]/60 dark:hover:bg-[#1E2622]'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{currentEvent ? 'Edit Event' : 'Create Event'}</span>
            </button>

            {/* Analysis */}
            <button
              onClick={() => setCurrentTab('analysis')}
              disabled={!currentEvent}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                !currentEvent
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : currentTab === 'analysis'
                  ? 'bg-[#132E20] text-white dark:bg-[#203D2D] shadow-xs'
                  : 'text-[#4A5568] dark:text-[#A0AEC0] hover:text-[#132E20] dark:hover:text-white hover:bg-[#EAE8E3]/60 dark:hover:bg-[#1E2622]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analysis</span>
            </button>

            {/* Optimize */}
            <button
              onClick={() => setCurrentTab('optimize')}
              disabled={!currentEvent}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                !currentEvent
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : currentTab === 'optimize'
                  ? 'bg-[#132E20] text-white dark:bg-[#203D2D] shadow-xs'
                  : 'text-[#4A5568] dark:text-[#A0AEC0] hover:text-[#132E20] dark:hover:text-white hover:bg-[#EAE8E3]/60 dark:hover:bg-[#1E2622]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Optimize</span>
            </button>

            {/* Action Plan */}
            <button
              onClick={() => setCurrentTab('plan')}
              disabled={!currentEvent}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                !currentEvent
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : currentTab === 'plan'
                  ? 'bg-[#132E20] text-white dark:bg-[#203D2D] shadow-xs'
                  : 'text-[#4A5568] dark:text-[#A0AEC0] hover:text-[#132E20] dark:hover:text-white hover:bg-[#EAE8E3]/60 dark:hover:bg-[#1E2622]'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Action Plan</span>
            </button>
          </nav>

          {/* Right Action: Event Switcher (Mobile/Tablet), Theme Toggle, Purpose Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Switcher Button for Tablets & Mobile */}
            {savedEventsCount > 0 && (
              <button
                onClick={onOpenSwitcher}
                className="inline-flex lg:hidden items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#D9D6CE] dark:border-[#2F3D35] bg-white dark:bg-[#181E1B] text-[11px] font-semibold text-[#1E2522] dark:text-[#E2E8E4]"
                title="Switch Active Event"
              >
                <span className="w-2 h-2 rounded-full bg-[#15803D] dark:bg-[#4ADE80]" />
                <span className="max-w-[70px] sm:max-w-[100px] truncate">
                  {currentEvent ? currentEvent.name : 'Events'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#8DA393]" />
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-[#D9D6CE] dark:border-[#2F3D35] bg-white dark:bg-[#181E1B] text-[#4B5563] dark:text-[#E2E8E4] hover:bg-[#F3F2EE] dark:hover:bg-[#232D28] transition-all"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#526359]" />
              )}
            </button>

            {/* Purpose & About Modal trigger */}
            <button
              onClick={onOpenAbout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D9D6CE] dark:border-[#2F3D35] bg-white dark:bg-[#181E1B] text-[12px] font-medium text-[#4B5563] dark:text-[#CBD5E1] hover:text-[#132E20] dark:hover:text-white hover:border-[#8DA393] dark:hover:border-[#3D5246] transition-all"
              title="About ECOVIA & Sustainability Alignment"
            >
              <Info className="w-3.5 h-3.5 text-[#15803D] dark:text-[#4ADE80]" />
              <span className="hidden sm:inline">Purpose</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
