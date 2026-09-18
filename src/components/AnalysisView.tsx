import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
  Plus,
  Compass,
  AlertCircle,
  Clock,
  Layers,
  CheckCircle2,
  Calculator,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import {
  EventData,
  AnalysisResult,
  CategoryScore,
  Recommendation,
  Hotspot,
  MatrixZone
} from '../types';
import { CategoryDetailModal } from './CategoryDetailModal';

interface AnalysisViewProps {
  event: EventData;
  analysis: AnalysisResult;
  onGoToOptimize: () => void;
  onTogglePlanTask: (recommendationId: string, title: string, categoryId: any) => void;
  plannedRecIds: Set<string>;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  event,
  analysis,
  onGoToOptimize,
  onTogglePlanTask,
  plannedRecIds
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryScore | null>(null);
  const [expandedWhyHotspot, setExpandedWhyHotspot] = useState<string | null>(null);
  const [expandedWhyRec, setExpandedWhyRec] = useState<string | null>(null);
  const [showCalculationDetails, setShowCalculationDetails] = useState<boolean>(false);
  const [highlightedRecId, setHighlightedRecId] = useState<string | null>(null);

  // Radial Donut math
  const score = analysis.overallScore;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const scrollToRecommendation = (recId: string) => {
    const targetElement = document.getElementById(`rec-${recId}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedRecId(recId);
      setTimeout(() => setHighlightedRecId(null), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-10">
      
      {/* Event Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE8E3] dark:border-[#26322C]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80]">
            Hotspot Analysis & Diagnostics
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#132E20] dark:text-[#E2E8E4]">
            {event.name}
          </h1>
          <p className="text-xs text-[#526359] dark:text-[#8E9E95] mt-0.5">
            {event.attendees.toLocaleString()} attendees · {event.type} · {event.durationHours} hours
          </p>
        </div>

        <button
          onClick={onGoToOptimize}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#132E20] dark:bg-[#203D2D] hover:bg-[#1A3E2B] dark:hover:bg-[#2A4D3A] text-white text-xs font-semibold active:scale-[0.98] transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-300 dark:text-emerald-400" />
          <span>✨ Optimize My Event</span>
        </button>
      </div>

      {/* 1. GREEN SCORE — PRIMARY VISUAL CENTERPIECE */}
      <section className="bg-white dark:bg-[#18201C] rounded-3xl border border-[#EAE8E3] dark:border-[#26322C] p-6 sm:p-9 shadow-xs text-center space-y-6">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#526359] dark:text-[#8E9E95]">
            Green Score
          </div>

          {/* Clean Radial Donut */}
          <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r={radius}
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-[#EAE8E3] dark:text-[#26322C]"
              />
              <circle
                cx="88"
                cy="88"
                r={radius}
                stroke={score >= 75 ? '#15803D' : score >= 55 ? '#D97706' : '#DC2626'}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#132E20] dark:text-[#E2E8E4]">
                {score}
              </div>
              <div className="text-xs font-semibold text-[#64748B] dark:text-[#8E9E95]">/ 100</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#E2E8E4] dark:bg-[#203227] text-[#132E20] dark:text-[#86EFAC]">
              {analysis.scoreGrade}
            </div>
            
            {/* Dynamic, concise 1-sentence summary */}
            <p className="text-xs sm:text-sm text-[#3E4C44] dark:text-[#C5D0C9] leading-relaxed max-w-sm mx-auto font-medium">
              {analysis.summarySentence}
            </p>
          </div>

          {/* 2. DATA COMPLETENESS INDICATOR */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F8F7F4] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F] text-xs">
            <div className="w-2 h-2 rounded-full bg-[#15803D] dark:bg-[#4ADE80]" />
            <span className="font-bold text-[#132E20] dark:text-[#E2E8E4]">
              {analysis.dataCompleteness}% Data Completeness
            </span>
            <span className="text-[#526359] dark:text-[#8E9E95]">·</span>
            <span className="text-[#526359] dark:text-[#8E9E95]">
              {analysis.completenessNote}
            </span>
          </div>
        </div>

        {/* 6 Compact Category Cards */}
        <div className="pt-6 border-t border-[#EAE8E3] dark:border-[#26322C] space-y-3">
          <div className="flex items-center justify-between text-left">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#526359] dark:text-[#8E9E95]">
              Category Breakdown
            </h2>
            <span className="text-[11px] text-[#64748B] dark:text-[#8E9E95]">Tap card for details</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {analysis.categoryScores.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="p-3.5 rounded-2xl bg-[#FAF9F6] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F] hover:border-[#8DA393] dark:hover:border-[#4A6354] transition-all text-left space-y-1.5 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{cat.emoji}</span>
                  <span className="text-sm font-bold text-[#132E20] dark:text-[#E2E8E4] group-hover:text-[#15803D] dark:group-hover:text-[#4ADE80] transition-colors">
                    {cat.score}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#132E20] dark:text-[#E2E8E4] truncate">
                  {cat.name}
                </div>
                <div className="w-full bg-[#EAE8E3] dark:bg-[#2F3D35] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      cat.score >= 70
                        ? 'bg-[#15803D] dark:bg-[#4ADE80]'
                        : cat.score >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. YOUR NEXT BEST ACTION CARD */}
      <section className="p-5 sm:p-6 rounded-3xl bg-[#F0FDF4] dark:bg-[#13251B] border border-emerald-200 dark:border-emerald-800/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-base">💡</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Your Next Best Action
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200">
              {analysis.nextBestAction.impactBadge}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/70 dark:bg-[#1B3224] text-emerald-800 dark:text-emerald-300">
              {analysis.nextBestAction.effortBadge}
            </span>
          </div>
          <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-100">
            {analysis.nextBestAction.title}
          </h3>
          <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
            {analysis.nextBestAction.description}
          </p>
        </div>

        <button
          onClick={() => {
            onTogglePlanTask(
              analysis.nextBestAction.recommendationId,
              analysis.nextBestAction.title,
              'waste'
            );
          }}
          className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0 ${
            plannedRecIds.has(analysis.nextBestAction.recommendationId)
              ? 'bg-emerald-800 dark:bg-emerald-700 text-white'
              : 'bg-[#132E20] dark:bg-[#203D2D] hover:bg-[#1A3E2B] text-white'
          }`}
        >
          {plannedRecIds.has(analysis.nextBestAction.recommendationId) ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to Action Plan</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Action Plan</span>
            </>
          )}
        </button>
      </section>

      {/* 4. BIGGEST OPPORTUNITIES (Hotspots - Maximum 3 items) */}
      <section id="hotspots-section" className="space-y-4">
        <div className="space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
            Priority Bottlenecks
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#132E20] dark:text-[#E2E8E4] flex items-center gap-2">
            <span>🔎</span> Your Biggest Opportunities
          </h2>
          <p className="text-xs text-[#526359] dark:text-[#8E9E95]">
            The top 3 critical areas generating the largest avoidable environmental impact.
          </p>
        </div>

        <div className="space-y-3">
          {analysis.hotspots.slice(0, 3).map((h) => {
            const isExpanded = expandedWhyHotspot === h.id;
            return (
              <div
                key={h.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#18201C] border border-[#EAE8E3] dark:border-[#26322C] shadow-xs space-y-3 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-extrabold text-[#526359] dark:text-[#8E9E95] bg-[#F3F2EE] dark:bg-[#202924] px-2.5 py-1 rounded-lg shrink-0">
                      {h.rank}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-[#132E20] dark:text-[#E2E8E4]">
                          {h.problem}
                        </h3>
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                            h.severity === 'High impact'
                              ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300'
                              : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {h.severity}
                        </span>
                      </div>
                      
                      {/* Evidence from event inputs */}
                      <p className="text-xs text-[#1E2522] dark:text-[#D5DDD8] font-medium leading-relaxed">
                        {h.evidence}
                      </p>
                      
                      {/* Short explanation (max 2 sentences) */}
                      <p className="text-xs text-[#526359] dark:text-[#8E9E95] leading-relaxed">
                        {h.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Recommendation link + Why toggle */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-1 sm:pt-0">
                    <button
                      onClick={() => scrollToRecommendation(h.recommendationId)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E2E8E4] dark:bg-[#203227] text-[#132E20] dark:text-[#86EFAC] text-xs font-semibold hover:bg-[#D3DDD6] dark:hover:bg-[#294233] transition-colors"
                    >
                      <span>See recommendation</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => setExpandedWhyHotspot(isExpanded ? null : h.id)}
                      className="p-1.5 text-[#64748B] hover:text-[#132E20] dark:text-[#8E9E95] dark:hover:text-white rounded-lg transition-colors"
                      title="Toggle detailed assessment"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F] text-xs text-[#2C4A38] dark:text-[#A7D1B8] leading-relaxed">
                    <strong>Recommended Action:</strong> {h.recommendedAction}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. PRACTICAL RECOMMENDATIONS */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80]">
            Actionable Next Steps
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#132E20] dark:text-[#E2E8E4] flex items-center gap-2">
            <span>💡</span> Practical Recommendations
          </h2>
          <p className="text-xs text-[#526359] dark:text-[#8E9E95]">
            Prioritized interventions to eliminate identified hotspots and raise your Green Score.
          </p>
        </div>

        <div className="space-y-3">
          {analysis.recommendations.map((rec) => {
            const isWhyExpanded = expandedWhyRec === rec.id;
            const isPlanned = plannedRecIds.has(rec.id);
            const isHighlighted = highlightedRecId === rec.id;

            return (
              <div
                key={rec.id}
                id={`rec-${rec.id}`}
                className={`p-5 rounded-2xl bg-white dark:bg-[#18201C] border transition-all space-y-3.5 ${
                  isHighlighted
                    ? 'ring-2 ring-[#15803D] dark:ring-[#4ADE80] border-[#15803D] bg-emerald-50/20 dark:bg-emerald-950/20'
                    : 'border-[#EAE8E3] dark:border-[#26322C] hover:border-[#8DA393] dark:hover:border-[#3C5245] shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{rec.emoji}</span>
                    <h3 className="text-sm font-bold text-[#132E20] dark:text-[#E2E8E4]">{rec.title}</h3>
                  </div>

                  {/* Impact · Effort · Cost · Priority Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                      +{rec.scoreBoost} pts
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F3F2EE] dark:bg-[#202924] text-[#526359] dark:text-[#8E9E95]">
                      {rec.effort} effort
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F3F2EE] dark:bg-[#202924] text-[#526359] dark:text-[#8E9E95]">
                      {rec.cost} cost
                    </span>
                  </div>
                </div>

                {/* Recommendation Description (concise: max 2 sentences) */}
                <p className="text-xs text-[#526359] dark:text-[#9AA8A0] leading-relaxed">
                  {rec.description}
                </p>

                {/* Bottom Row Controls */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setExpandedWhyRec(isWhyExpanded ? null : rec.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D] dark:text-[#4ADE80] hover:underline"
                  >
                    <span>{isWhyExpanded ? 'Hide explanation' : 'Why does this matter?'}</span>
                    {isWhyExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onTogglePlanTask(rec.id, rec.title, rec.categoryId)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      isPlanned
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#F3F2EE] dark:bg-[#202924] text-[#132E20] dark:text-[#E2E8E4] hover:bg-[#EAE8E3] dark:hover:bg-[#2A372F]'
                    }`}
                  >
                    {isPlanned ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>In Action Plan</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Plan</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Expandable Why Explanation (max 4 sentences) */}
                {isWhyExpanded && (
                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F] text-xs text-[#2C4A38] dark:text-[#A7D1B8] leading-relaxed">
                    {rec.whyItMatters}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. PRIORITY MATRIX */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80]">
            Effort vs Impact
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#132E20] dark:text-[#E2E8E4] flex items-center gap-2">
            <span>🎯</span> Priority Matrix
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* DO FIRST */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                <span>🚀</span> DO FIRST
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                High Impact · Low Effort
              </span>
            </div>
            <div className="space-y-1.5">
              {analysis.recommendations
                .filter((r) => r.priority === 'DO_FIRST')
                .map((r) => (
                  <div
                    key={r.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#18201C] border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-medium text-emerald-950 dark:text-emerald-200 flex items-center gap-2 shadow-xs"
                  >
                    <span>{r.emoji}</span>
                    <span className="truncate">{r.title}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* PLAN */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                <span>📅</span> PLAN
              </span>
              <span className="text-[10px] uppercase font-bold text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
                High Impact · High Effort
              </span>
            </div>
            <div className="space-y-1.5">
              {analysis.recommendations
                .filter((r) => r.priority === 'PLAN')
                .map((r) => (
                  <div
                    key={r.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#18201C] border border-blue-200/60 dark:border-blue-800/40 text-xs font-medium text-blue-950 dark:text-blue-200 flex items-center gap-2 shadow-xs"
                  >
                    <span>{r.emoji}</span>
                    <span className="truncate">{r.title}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* QUICK WIN */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                <span>⚡</span> QUICK WIN
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                Low Impact · Low Effort
              </span>
            </div>
            <div className="space-y-1.5">
              {analysis.recommendations
                .filter((r) => r.priority === 'QUICK_WIN')
                .map((r) => (
                  <div
                    key={r.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#18201C] border border-amber-200/60 dark:border-amber-800/40 text-xs font-medium text-amber-950 dark:text-amber-200 flex items-center gap-2 shadow-xs"
                  >
                    <span>{r.emoji}</span>
                    <span className="truncate">{r.title}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* DEPRIORITIZE */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-[#1B2420] border border-gray-200/80 dark:border-[#2F3D35] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-gray-200 flex items-center gap-1.5">
                <span>⏳</span> DEPRIORITIZE
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-400 bg-gray-200/80 dark:bg-[#26332C] px-2 py-0.5 rounded-full">
                Low Impact · High Effort
              </span>
            </div>
            <div className="space-y-1.5">
              {analysis.recommendations
                .filter((r) => r.priority === 'DEPRIORITIZE')
                .map((r) => (
                  <div
                    key={r.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#18201C] border border-gray-200 dark:border-[#2F3D35] text-xs font-medium text-gray-800 dark:text-gray-300 flex items-center gap-2 shadow-xs"
                  >
                    <span>{r.emoji}</span>
                    <span className="truncate">{r.title}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. TERTIARY: "HOW IS MY SCORE CALCULATED?" (COLLAPSIBLE ACCORDION) */}
      <section className="rounded-3xl border border-[#EAE8E3] dark:border-[#26322C] bg-white dark:bg-[#18201C] overflow-hidden shadow-xs">
        <button
          onClick={() => setShowCalculationDetails(!showCalculationDetails)}
          className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-[#FAF9F6] dark:hover:bg-[#1E2722] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#E2E8E4] dark:bg-[#203227] flex items-center justify-center text-[#132E20] dark:text-[#86EFAC] shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#132E20] dark:text-[#E2E8E4]">
                How is my score calculated?
              </h3>
              <p className="text-xs text-[#526359] dark:text-[#8E9E95]">
                Strictly deterministic, code-based mathematical formula across 6 resource dimensions.
              </p>
            </div>
          </div>
          <div className="text-[#526359] dark:text-[#8E9E95]">
            {showCalculationDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showCalculationDetails && (
          <div className="px-5 pb-6 sm:px-6 space-y-4 border-t border-[#EAE8E3] dark:border-[#26322C] pt-5 text-xs text-[#526359] dark:text-[#8E9E95] leading-relaxed">
            <div className="p-3.5 rounded-xl bg-[#F8F7F4] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F] font-mono text-[11px] text-[#132E20] dark:text-[#E2E8E4]">
              Green Score = 0.25(Waste) + 0.20(Food) + 0.15(Water) + 0.15(Energy) + 0.15(Transport) + 0.10(Materials)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#F8F7F4] dark:bg-[#202924]">
                <strong className="block text-[#132E20] dark:text-[#E2E8E4]">Waste (25% weight)</strong>
                Cups count, cutlery reusability, segregation streams, composting.
              </div>
              <div className="p-3 rounded-xl bg-[#F8F7F4] dark:bg-[#202924]">
                <strong className="block text-[#132E20] dark:text-[#E2E8E4]">Food (20% weight)</strong>
                Buffer leftovers, plant-based share, surplus food redistribution.
              </div>
              <div className="p-3 rounded-xl bg-[#F8F7F4] dark:bg-[#202924]">
                <strong className="block text-[#132E20] dark:text-[#E2E8E4]">Water (15% weight)</strong>
                Bulk dispensers vs PET bottles, BYOB flasks, station density.
              </div>
              <div className="p-3 rounded-xl bg-[#F8F7F4] dark:bg-[#202924]">
                <strong className="block text-[#132E20] dark:text-[#E2E8E4]">Energy (15% weight)</strong>
                Renewable grid vs diesel gensets, LED stage rigs, HVAC controls.
              </div>
              <div className="p-3 rounded-xl bg-[#F8F7F4] dark:bg-[#202924]">
                <strong className="block text-[#132E20] dark:text-[#E2E8E4]">Transport (15% weight)</strong>
                Metro / public transit split, carpooling, event shuttle buses.
              </div>
              <div className="p-3 rounded-xl bg-[#F8F7F4] dark:bg-[#202924]">
                <strong className="block text-[#132E20] dark:text-[#E2E8E4]">Materials (10% weight)</strong>
                Modular fabric vs PVC flex, returned lanyards, digital signage.
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-[#526359] dark:text-[#8E9E95]">
              <ShieldCheck className="w-4 h-4 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
              <span>
                Deterministic scoring guarantees that the same event inputs produce the exact same Green Score every time, free from random AI variance or budget bias.
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Category Detail Modal */}
      {selectedCategory && (
        <CategoryDetailModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}

    </div>
  );
};
