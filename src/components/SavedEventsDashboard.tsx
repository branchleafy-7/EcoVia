import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Clock,
  Users,
  TrendingUp,
  BarChart3,
  Sparkles,
  Edit3,
  Trash2,
  ChevronRight,
  Copy,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { EventData, EventStatus } from '../types';
import { EventStatusBadge } from './EventStatusBadge';
import { formatRelativeTime } from '../services/eventStorage';

interface SavedEventsDashboardProps {
  events: EventData[];
  activeEventId: string | null;
  onSelectEvent: (event: EventData) => void;
  onCreateNew: () => void;
  onViewAnalysis: (event: EventData) => void;
  onOptimizeEvent: (event: EventData) => void;
  onEditEvent: (event: EventData) => void;
  onDuplicateEvent: (event: EventData) => void;
  onDeleteEventClick: (event: EventData) => void;
  onViewDetails: (event: EventData) => void;
  onReanalyzeEvent?: (event: EventData) => void;
  onReoptimizeEvent?: (event: EventData) => void;
  onKeepCurrentPlan?: (event: EventData) => void;
}

export const SavedEventsDashboard: React.FC<SavedEventsDashboardProps> = ({
  events,
  activeEventId,
  onSelectEvent,
  onCreateNew,
  onViewAnalysis,
  onOptimizeEvent,
  onEditEvent,
  onDuplicateEvent,
  onDeleteEventClick,
  onViewDetails,
  onReanalyzeEvent,
  onReoptimizeEvent,
  onKeepCurrentPlan
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'analyzed' | 'optimized'>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'score' | 'attendees'>('updated');

  // Filter and sort across the entire saved collection (unlimited)
  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        const matchesQuery =
          evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          evt.type.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesQuery) return false;

        if (statusFilter === 'all') return true;
        return evt.status === statusFilter;
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          const scoreA = a.baselineScore ?? 0;
          const scoreB = b.baselineScore ?? 0;
          return scoreB - scoreA;
        }
        if (sortBy === 'attendees') {
          return b.attendees - a.attendees;
        }
        // Default: updated
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA;
      });
  }, [events, searchQuery, statusFilter, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE8E3] dark:border-[#26322C] pb-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#15803D] dark:text-[#4ADE80]">
            Event Portfolio
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#132E20] dark:text-[#E2E8E4] tracking-tight mt-1">
            My Events
          </h1>
          <p className="text-sm text-[#526359] dark:text-[#8E9E95] mt-1 font-normal">
            Plan, analyze and improve your events.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#132E20] dark:bg-[#203D2D] hover:bg-[#1A3E2B] dark:hover:bg-[#2A4D3A] text-white font-semibold text-xs active:scale-[0.98] transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Event</span>
        </button>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#526359] dark:text-[#8E9E95]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved events by name or type..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D9D6CE] dark:border-[#2F3D35] bg-white dark:bg-[#1B2420] text-sm text-[#132E20] dark:text-[#E2E8E4] placeholder-[#526359]/70 dark:placeholder-[#8E9E95]/70 focus:outline-none focus:ring-2 focus:ring-[#15803D] dark:focus:ring-[#4ADE80]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#526359] hover:text-[#132E20] dark:text-[#8E9E95] dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'draft', 'analyzed', 'optimized'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-[#132E20] text-white dark:bg-[#4ADE80] dark:text-[#0B1510]'
                  : 'bg-white dark:bg-[#1B2420] text-[#526359] dark:text-[#8E9E95] border border-[#EAE8E3] dark:border-[#2A372F] hover:bg-[#F3F2EE] dark:hover:bg-[#233129]'
              }`}
            >
              {status === 'all' ? 'All Events' : status}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#526359] dark:text-[#8E9E95]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-medium rounded-lg border border-[#D9D6CE] dark:border-[#2F3D35] bg-white dark:bg-[#1B2420] text-[#132E20] dark:text-[#E2E8E4] px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#15803D]"
          >
            <option value="updated">Recently Updated</option>
            <option value="score">Highest Green Score</option>
            <option value="attendees">Attendee Count</option>
          </select>
        </div>
      </div>

      {/* Events Grid (Scalable to unlimited events) */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-[#D9D6CE] dark:border-[#2F3D35] bg-white/50 dark:bg-[#18201C]/50 space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#EAE8E3] dark:bg-[#233129] flex items-center justify-center mx-auto text-[#526359] dark:text-[#8E9E95]">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#132E20] dark:text-[#E2E8E4]">
              No events found
            </h3>
            <p className="text-xs text-[#526359] dark:text-[#8E9E95] max-w-sm mx-auto">
              {searchQuery
                ? `No event matching "${searchQuery}". Try changing search terms or filters.`
                : 'You have not created any events yet. Create your first event to get started.'}
            </p>
          </div>
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-xs font-semibold text-[#15803D] dark:text-[#4ADE80] hover:underline"
            >
              Reset filters
            </button>
          ) : (
            <button
              onClick={onCreateNew}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#132E20] dark:bg-[#203D2D] text-white text-xs font-semibold hover:bg-[#1A3E2B]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Event</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((evt) => {
            const isActive = evt.id === activeEventId;
            const hasScore = evt.baselineScore !== undefined && evt.baselineScore > 0;
            const isAnalyzed = evt.status === 'analyzed' || evt.status === 'optimized';

            return (
              <div
                key={evt.id}
                className={`flex flex-col justify-between rounded-2xl border transition-all duration-200 bg-white dark:bg-[#18201C] p-5 shadow-xs hover:shadow-md ${
                  isActive
                    ? 'border-[#15803D] dark:border-[#4ADE80] ring-1 ring-[#15803D]/20 dark:ring-[#4ADE80]/20'
                    : 'border-[#EAE8E3] dark:border-[#26322C] hover:border-[#D1CECA] dark:hover:border-[#38483F]'
                }`}
              >
                {/* Card Top */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <EventStatusBadge
                          status={evt.status}
                          size="sm"
                          analysisOutdated={evt.analysisOutdated}
                          optimizationOutdated={evt.optimizationOutdated}
                        />
                        {isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#132E20] text-white dark:bg-[#4ADE80] dark:text-[#0B1510]">
                            Active
                          </span>
                        )}
                      </div>
                      <h3
                        onClick={() => onSelectEvent(evt)}
                        className="text-lg font-bold text-[#132E20] dark:text-[#E2E8E4] truncate cursor-pointer hover:text-[#15803D] dark:hover:text-[#4ADE80]"
                        title={evt.name}
                      >
                        {evt.name}
                      </h3>
                      <p className="text-xs text-[#526359] dark:text-[#8E9E95] truncate">
                        {evt.type}
                      </p>
                    </div>
                  </div>

                  {/* Outdated Warning Notice if applicable */}
                  {evt.analysisOutdated && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-amber-900 dark:text-amber-200">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span className="text-[11px] font-medium leading-tight">Inputs changed</span>
                      </div>
                      {onReanalyzeEvent && (
                        <button
                          onClick={() => onReanalyzeEvent(evt)}
                          className="px-2 py-1 rounded bg-amber-600 text-white text-[10px] font-bold hover:bg-amber-700 shrink-0"
                        >
                          Re-analyze
                        </button>
                      )}
                    </div>
                  )}

                  {evt.optimizationOutdated && !evt.analysisOutdated && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-amber-900 dark:text-amber-200">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span className="text-[11px] font-medium leading-tight">Inputs changed since optimization</span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        {onReoptimizeEvent && (
                          <button
                            onClick={() => onReoptimizeEvent(evt)}
                            className="px-2 py-1 rounded bg-[#132E20] text-white text-[10px] font-bold hover:bg-[#1A3E2B]"
                          >
                            Re-optimize
                          </button>
                        )}
                        {onKeepCurrentPlan && (
                          <button
                            onClick={() => onKeepCurrentPlan(evt)}
                            className="px-2 py-1 rounded border border-amber-300 dark:border-amber-700 text-[10px] text-amber-900 dark:text-amber-300 font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30"
                          >
                            Keep plan
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Attendance & Duration Specs */}
                  <div className="flex items-center gap-3 text-xs text-[#526359] dark:text-[#8E9E95] pt-1">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {evt.attendees.toLocaleString()} attendees
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {evt.durationHours} hours
                    </span>
                  </div>

                  {/* Score & Projections Block */}
                  <div className="p-3 rounded-xl bg-[#F8F7F4] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#526359] dark:text-[#8E9E95]">
                        Green Score
                      </div>
                      {hasScore ? (
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-2xl font-black text-[#132E20] dark:text-[#E2E8E4]">
                            {evt.baselineScore}
                          </span>
                          <span className="text-xs text-[#526359] dark:text-[#8E9E95]">/ 100</span>
                        </div>
                      ) : (
                        <div className="text-xs font-semibold text-[#526359] dark:text-[#8E9E95] mt-1">
                          Draft (Not analyzed)
                        </div>
                      )}
                    </div>

                    {evt.projectedScore && evt.projectedScore > (evt.baselineScore || 0) && (
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-[#15803D] dark:text-[#4ADE80]">
                          Projected
                        </div>
                        <div className="text-sm font-bold text-[#15803D] dark:text-[#4ADE80] mt-0.5">
                          {evt.projectedScore} / 100
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Metadata & Actions */}
                <div className="pt-4 mt-3 border-t border-[#EAE8E3] dark:border-[#26322C] space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#526359] dark:text-[#8E9E95]">
                    <span>Last updated: {formatRelativeTime(evt.updatedAt)}</span>
                    <button
                      onClick={() => onViewDetails(evt)}
                      className="font-medium hover:underline text-[#132E20] dark:text-[#E2E8E4]"
                    >
                      Quick details
                    </button>
                  </div>

                  {/* Action Buttons Toolbar */}
                  <div className="grid grid-cols-5 gap-1 pt-1">
                    {/* View / Analyze */}
                    <button
                      onClick={() => onViewAnalysis(evt)}
                      title="View Analysis"
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#F3F2EE] dark:bg-[#202924] hover:bg-[#EAE8E3] dark:hover:bg-[#2A372F] text-[#132E20] dark:text-[#E2E8E4] transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-[9px] font-semibold mt-1">View</span>
                    </button>

                    {/* Optimize */}
                    <button
                      onClick={() => onOptimizeEvent(evt)}
                      title="Optimize Event"
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#F3F2EE] dark:bg-[#202924] hover:bg-[#EAE8E3] dark:hover:bg-[#2A372F] text-[#15803D] dark:text-[#4ADE80] transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[9px] font-semibold mt-1">Optimize</span>
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onEditEvent(evt)}
                      title="Edit Event"
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#F3F2EE] dark:bg-[#202924] hover:bg-[#EAE8E3] dark:hover:bg-[#2A372F] text-[#132E20] dark:text-[#E2E8E4] transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="text-[9px] font-semibold mt-1">Edit</span>
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={() => onDuplicateEvent(evt)}
                      title="Duplicate Event (creates independent alternative plan)"
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#F3F2EE] dark:bg-[#202924] hover:bg-[#EAE8E3] dark:hover:bg-[#2A372F] text-[#526359] dark:text-[#8E9E95] hover:text-[#132E20] dark:hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-[9px] font-semibold mt-1">Duplicate</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDeleteEventClick(evt)}
                      title="Delete Event"
                      className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#F3F2EE] dark:bg-[#202924] hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-[9px] font-semibold mt-1">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
