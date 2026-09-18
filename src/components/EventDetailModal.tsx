import React, { useMemo } from 'react';
import {
  X,
  Calendar,
  Users,
  Clock,
  MapPin,
  TrendingUp,
  BarChart3,
  Sparkles,
  Edit3,
  Flame,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { EventData } from '../types';
import { EventStatusBadge } from './EventStatusBadge';
import { analyzeEventSustainability } from '../services/sustainabilityEngine';

interface EventDetailModalProps {
  event: EventData | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAnalysis: (event: EventData) => void;
  onSelectOptimize: (event: EventData) => void;
  onSelectEdit: (event: EventData) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onSelectAnalysis,
  onSelectOptimize,
  onSelectEdit
}) => {
  if (!isOpen || !event) return null;

  const analysis = useMemo(() => {
    try {
      return analyzeEventSustainability(event);
    } catch (e) {
      return null;
    }
  }, [event]);

  const baselineScore = event.baselineScore ?? analysis?.overallScore ?? 50;
  const projectedScore = event.projectedScore ?? analysis?.optimizedScore ?? 75;
  const isOptimized = event.status === 'optimized';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-detail-title"
    >
      <div className="bg-white dark:bg-[#181E1B] rounded-3xl border border-[#EAE8E3] dark:border-[#2A3630] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#EAE8E3] dark:border-[#26322C] pb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <EventStatusBadge status={event.status} />
              <span className="text-xs text-[#526359] dark:text-[#8E9E95]">
                {event.type}
              </span>
            </div>
            <h2
              id="event-detail-title"
              className="text-2xl sm:text-3xl font-extrabold text-[#132E20] dark:text-[#E2E8E4] tracking-tight"
            >
              {event.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#526359] dark:text-[#8E9E95]">
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#15803D] dark:text-[#4ADE80]" />
                {event.attendees.toLocaleString()} Attendees
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#15803D] dark:text-[#4ADE80]" />
                {event.durationHours} Hours Duration
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5 capitalize">
                <MapPin className="w-3.5 h-3.5 text-[#15803D] dark:text-[#4ADE80]" />
                {event.venueType} ({event.locationSetting})
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#132E20] dark:hover:text-white hover:bg-[#F3F2EE] dark:hover:bg-[#232D28] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Summary Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#FAF9F6] dark:bg-[#141A17] border border-[#EAE8E3] dark:border-[#26322C]">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#526359] dark:text-[#8E9E95]">
              Current Green Score
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold text-[#132E20] dark:text-[#E2E8E4]">
                {baselineScore}
              </span>
              <span className="text-sm font-semibold text-[#526359] dark:text-[#8E9E95]">
                / 100
              </span>
            </div>
            <p className="text-xs text-[#526359] dark:text-[#8E9E95] mt-1">
              Deterministic multi-category weighted index.
            </p>
          </div>

          <div className="sm:border-l sm:border-[#EAE8E3] dark:sm:border-[#26322C] sm:pl-5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Projected Potential</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold text-[#15803D] dark:text-[#4ADE80]">
                {projectedScore}
              </span>
              <span className="text-sm font-semibold text-[#15803D]/70 dark:text-[#4ADE80]/70">
                / 100
              </span>
              <span className="ml-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                +{projectedScore - baselineScore} pts
              </span>
            </div>
            <p className="text-xs text-[#526359] dark:text-[#8E9E95] mt-1">
              {isOptimized
                ? 'Optimized scenario plan generated.'
                : 'Achievable through guided decision levers.'}
            </p>
          </div>
        </div>

        {/* Hotspots Section */}
        {analysis && analysis.hotspots.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#132E20] dark:text-[#E2E8E4]">
                Key Impact Hotspots
              </h3>
            </div>
            <div className="space-y-2">
              {analysis.hotspots.slice(0, 3).map((hotspot) => (
                <div
                  key={hotspot.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-[#1A221E] border border-[#EAE8E3] dark:border-[#28352F] flex items-start gap-3"
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 mt-0.5">
                    {hotspot.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#1E2522] dark:text-[#E2E8E4]">
                      {hotspot.problem}
                    </div>
                    <p className="text-[11px] text-[#526359] dark:text-[#8E9E95] mt-0.5 line-clamp-1">
                      {hotspot.evidence}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Recommendations */}
        {analysis && analysis.recommendations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] dark:text-[#4ADE80]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#132E20] dark:text-[#E2E8E4]">
                Top Recommended Actions
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {analysis.recommendations.slice(0, 4).map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#141A17] border border-[#EAE8E3] dark:border-[#26322C] space-y-1"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-[#132E20] dark:text-[#E2E8E4] truncate">
                      {rec.emoji} {rec.title}
                    </span>
                    <span className="text-[10px] font-semibold text-[#15803D] dark:text-[#4ADE80] shrink-0">
                      +{rec.scoreBoost} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-[#526359] dark:text-[#8E9E95] line-clamp-1">
                    {rec.whyItMatters}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#EAE8E3] dark:border-[#26322C]">
          <button
            type="button"
            onClick={() => onSelectEdit(event)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#D9D6CE] dark:border-[#2F3D35] bg-white dark:bg-[#181E1B] text-xs font-semibold text-[#1E2522] dark:text-[#D1D9D4] hover:bg-[#F3F2EE] dark:hover:bg-[#202824] transition-colors"
          >
            <Edit3 className="w-4 h-4 text-[#526359]" />
            <span>Edit Event Details</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onSelectOptimize(event)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Optimize</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectAnalysis(event)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#132E20] dark:bg-[#203D2D] hover:bg-[#1A3E2B] text-white text-xs font-semibold active:scale-[0.98] transition-all shadow-xs"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View Full Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
