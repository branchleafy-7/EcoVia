import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Sliders,
  Check,
  CalendarCheck,
  Zap,
  Trash2,
  Droplets,
  Utensils,
  Leaf,
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { EventData, AnalysisResult, ScenarioOption } from '../types';

interface OptimizeViewProps {
  event: EventData;
  analysis: AnalysisResult;
  onGoToActionPlan: () => void;
  onSaveAsNewVersion?: (optimizedEvent: EventData) => void;
  onApplyWhatIfChanges?: (updatedDelta: Partial<EventData>) => void;
}

export const OptimizeView: React.FC<OptimizeViewProps> = ({
  event,
  analysis,
  onGoToActionPlan,
  onSaveAsNewVersion,
  onApplyWhatIfChanges
}) => {
  // Scenario Simulator state (operates on temporary copy)
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>([
    'scenario-cups',
    'scenario-water'
  ]);
  const [expandedChangeIndex, setExpandedChangeIndex] = useState<number | null>(null);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const toggleScenario = (id: string) => {
    setSelectedScenarioIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllScenarios = () => {
    setSelectedScenarioIds(analysis.scenarioOptions.map((s) => s.id));
  };

  const resetScenarios = () => {
    setSelectedScenarioIds([]);
  };

  // What-If live computation
  const selectedScenarios = analysis.scenarioOptions.filter((s) =>
    selectedScenarioIds.includes(s.id)
  );

  const scenarioBoost = selectedScenarios.reduce((acc, curr) => acc + curr.scoreBoost, 0);
  const whatIfProjectedScore = Math.min(98, analysis.overallScore + scenarioBoost);

  // Environmental impact reduction estimates
  const singleUseItemsEliminated =
    (event.disposableCupsCount || 0) + (event.packagedBottlesCount || 0);
  const foodWasteDivertedKg = Math.round(
    ((event.attendees || 1000) * 0.45 * (event.expectedLeftoverPercent - 10)) / 100
  );

  const handleApplyWhatIf = () => {
    if (onApplyWhatIfChanges && selectedScenarios.length > 0) {
      let combinedDelta: Partial<EventData> = {};
      selectedScenarios.forEach((s) => {
        combinedDelta = { ...combinedDelta, ...s.overrideDelta };
      });
      onApplyWhatIfChanges(combinedDelta);
      setAppliedNotification('Applied scenarios to current plan.');
      setTimeout(() => setAppliedNotification(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-12">
      
      {/* Header Transformation Summary */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-[#132E20] dark:text-[#86EFAC] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-[#4ADE80]" />
          <span>Decision Modeling & Projections</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#132E20] dark:text-[#E2E8E4] tracking-tight">
          Your Optimized Event
        </h1>
        <p className="text-xs sm:text-sm text-[#526359] dark:text-[#8E9E95] max-w-md mx-auto">
          High-value strategic changes derived from deterministic scoring weights to maximize your sustainability return.
        </p>
      </div>

      {/* BEFORE VS AFTER TRANSFORMATION CARD (Split Card Layout) */}
      <section className="bg-white dark:bg-[#18201C] rounded-3xl border border-[#EAE8E3] dark:border-[#26322C] p-6 sm:p-8 shadow-xs space-y-8">
        
        {/* Score comparison banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center p-6 rounded-2xl bg-[#FAF9F6] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F]">
          
          {/* Baseline Score */}
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8E9E95]">
              Current Baseline
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#1E2522] dark:text-[#E2E8E4]">
              {analysis.overallScore}
              <span className="text-sm font-normal text-[#64748B] dark:text-[#8E9E95]"> / 100</span>
            </div>
            <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              {analysis.scoreGrade}
            </div>
          </div>

          {/* Transformation Arrow & Badge */}
          <div className="flex flex-col items-center justify-center space-y-1 py-2">
            <div className="w-10 h-10 rounded-full bg-[#132E20] dark:bg-[#203D2D] text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-5 h-5 text-emerald-300 dark:text-emerald-400" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 font-extrabold text-xs">
              +{analysis.projectedBoost} projected points
            </div>
            <span className="text-[10px] text-[#64748B] dark:text-[#8E9E95]">Deterministic Model</span>
          </div>

          {/* Optimized Score */}
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80]">
              Projected Optimized
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#15803D] dark:text-[#4ADE80]">
              {analysis.optimizedScore}
              <span className="text-sm font-normal text-[#64748B] dark:text-[#8E9E95]"> / 100</span>
            </div>
            <div className="text-xs font-semibold text-[#15803D] dark:text-[#4ADE80]">
              Exemplary Rating
            </div>
          </div>

        </div>

        {/* Key Metrics Change Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F] space-y-1 text-center">
            <div className="text-xs font-semibold text-[#526359] dark:text-[#8E9E95]">Green Score Lift</div>
            <div className="text-2xl font-extrabold text-[#15803D] dark:text-[#4ADE80]">
              +{analysis.projectedBoost} pts
            </div>
            <div className="text-[11px] text-[#64748B] dark:text-[#8E9E95]">
              From {analysis.overallScore} to {analysis.optimizedScore}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F] space-y-1 text-center">
            <div className="text-xs font-semibold text-[#526359] dark:text-[#8E9E95]">Single-Use Items Diverted</div>
            <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
              ~{singleUseItemsEliminated.toLocaleString()} units
            </div>
            <div className="text-[11px] text-[#64748B] dark:text-[#8E9E95]">
              Zero cups & bottles to landfill
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F] space-y-1 text-center">
            <div className="text-xs font-semibold text-[#526359] dark:text-[#8E9E95]">Surplus Food Redirected</div>
            <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
              ~{Math.max(60, foodWasteDivertedKg)} kg
            </div>
            <div className="text-[11px] text-[#64748B] dark:text-[#8E9E95]">
              Donated to community partners
            </div>
          </div>
        </div>

        <p className="text-[11px] text-center text-[#64748B] dark:text-[#8E9E95] italic">
          Projected from your event inputs and ECOVIA's scoring model.
        </p>

        {/* Six Compact Category Comparisons with Animated Visual Bars */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#526359] dark:text-[#8E9E95]">
              Category Comparison (Current vs Projected)
            </h3>
            <span className="text-[11px] font-semibold text-[#15803D] dark:text-[#4ADE80] uppercase tracking-wider">
              Projected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysis.categoryScores.map((cat) => {
              const currentScore = cat.score;
              const optimizedCatScore = Math.min(96, Math.round(currentScore + (100 - currentScore) * 0.65));
              const gain = optimizedCatScore - currentScore;

              return (
                <div
                  key={cat.id}
                  className="p-3.5 rounded-2xl bg-[#FAF9F6] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-[#132E20] dark:text-[#E2E8E4]">
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </div>
                    <div className="font-semibold text-[#1E2522] dark:text-[#E2E8E4]">
                      <span className="text-[#64748B] dark:text-[#8E9E95]">{currentScore}</span>
                      <span className="mx-1 text-[#94A3B8]">→</span>
                      <span className="text-[#15803D] dark:text-[#4ADE80]">{optimizedCatScore}</span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold ml-1.5">
                        (+{gain})
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar */}
                  <div className="relative w-full h-2 bg-[#EAE8E3] dark:bg-[#2F3D35] rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-[#94A3B8] rounded-full opacity-60"
                      style={{ width: `${currentScore}%` }}
                    />
                    <div
                      className="absolute top-0 left-0 h-full bg-[#15803D] dark:bg-[#4ADE80] rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${optimizedCatScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* 4 CHANGES SUGGESTED IN PRACTICE */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-[#132E20] dark:text-[#E2E8E4] flex items-center gap-2">
            <span>🔄</span> 4 Strategic Changes Suggested
          </h2>
          <p className="text-xs text-[#526359] dark:text-[#8E9E95]">
            Direct comparison between current event logistics and recommended operational standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {analysis.variableChanges.slice(0, 4).map((change, idx) => {
            const isExpanded = expandedChangeIndex === idx;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#18201C] border border-[#EAE8E3] dark:border-[#26322C] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#132E20] dark:text-[#E2E8E4]">
                    {change.parameter}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full">
                    {change.confidenceNote}
                  </span>
                </div>

                <div className="text-xs space-y-2">
                  <div className="p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-[#64748B] dark:text-[#9AA8A0]">
                    <span className="font-bold text-rose-700 dark:text-rose-400 block text-[10px] uppercase">
                      Current:
                    </span>
                    <span className="line-through text-rose-900/80 dark:text-rose-300/80">
                      {change.currentValue}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-[#132E20] dark:text-[#E2E8E4]">
                    <span className="font-bold text-[#15803D] dark:text-[#4ADE80] block text-[10px] uppercase">
                      Projected:
                    </span>
                    <span className="text-emerald-950 dark:text-emerald-100 font-semibold">
                      {change.optimizedValue}
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => setExpandedChangeIndex(isExpanded ? null : idx)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#15803D] dark:text-[#4ADE80] hover:underline"
                  >
                    <span>{isExpanded ? 'Hide explanation' : 'Why this change?'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isExpanded && (
                    <p className="mt-2 text-xs text-[#526359] dark:text-[#8E9E95] leading-relaxed p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#202924]">
                      {change.rationale}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHAT IF I CHANGE THIS? (INTERACTIVE DECISION SIMULATOR) */}
      <section className="bg-white dark:bg-[#18201C] rounded-3xl border border-[#EAE8E3] dark:border-[#26322C] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE8E3] dark:border-[#26322C] pb-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[#132E20] dark:text-[#E2E8E4] flex items-center gap-2">
              <span>🤔</span> What if I change this?
            </h2>
            <p className="text-xs text-[#526359] dark:text-[#8E9E95]">
              Toggle individual operational choices to recalculate your Green Score in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={selectAllScenarios}
              className="text-xs font-semibold text-[#15803D] dark:text-[#4ADE80] hover:underline cursor-pointer"
            >
              Select all
            </button>
            <span className="text-[#D9D6CE] dark:text-[#38483F]">•</span>
            <button
              onClick={resetScenarios}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#526359] dark:text-[#8E9E95] hover:text-[#132E20] dark:hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Scenario Selection Chips with immediate score diff */}
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {analysis.scenarioOptions.map((opt) => {
              const isSelected = selectedScenarioIds.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleScenario(opt.id)}
                  className={`p-3 rounded-2xl text-left transition-all border flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#132E20] dark:bg-[#203D2D] text-white border-[#132E20] dark:border-[#203D2D] shadow-xs'
                      : 'bg-[#FAF9F6] dark:bg-[#202924] text-[#2C4A38] dark:text-[#E2E8E4] border-[#D9D6CE] dark:border-[#2A372F] hover:border-[#8DA393]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base">{opt.emoji}</span>
                    <span className="text-xs font-semibold truncate">{opt.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#E2E8E4] dark:bg-[#2A3B31] text-[#15803D] dark:text-[#4ADE80]'
                    }`}
                  >
                    +{opt.scoreBoost} pts
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Simulator Results Bar */}
        <div className="p-5 rounded-2xl bg-[#FAF9F6] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F] space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#8E9E95]">Baseline</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1E2522] dark:text-[#E2E8E4]">
                {analysis.overallScore}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-[#15803D] dark:text-[#4ADE80]">Projected</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#15803D] dark:text-[#4ADE80]">
                {whatIfProjectedScore}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">Net Lift</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
                +{scenarioBoost}
              </div>
            </div>
          </div>

          {/* Active Explanations */}
          {selectedScenarios.length > 0 ? (
            <div className="space-y-2 pt-3 border-t border-[#EAE8E3] dark:border-[#2A372F]">
              <div className="text-xs font-semibold text-[#132E20] dark:text-[#E2E8E4]">
                Effect of selected choices:
              </div>
              <ul className="space-y-1.5 text-xs text-[#526359] dark:text-[#8E9E95]">
                {selectedScenarios.map((s) => (
                  <li key={s.id} className="flex items-start gap-2">
                    <span className="text-base shrink-0">{s.emoji}</span>
                    <span>
                      <strong className="text-[#132E20] dark:text-[#E2E8E4]">{s.label}:</strong> {s.explanation}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Apply Changes button */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handleApplyWhatIf}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#132E20] dark:bg-[#203D2D] text-white text-xs font-semibold hover:bg-[#1A3E2B]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Changes to Plan</span>
                </button>
                {appliedNotification && (
                  <span className="text-xs font-semibold text-[#15803D] dark:text-[#4ADE80]">
                    {appliedNotification}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-center text-[#64748B] dark:text-[#8E9E95] pt-2">
              Select one or more scenario chips above to simulate their real-time impact on your Green Score.
            </p>
          )}
        </div>
      </section>

      {/* Bottom CTA Row: Save as New Version & View Action Plan */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {onSaveAsNewVersion && (
          <button
            onClick={() => onSaveAsNewVersion(analysis.optimizedEvent)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-[#18201C] border border-[#D9D6CE] dark:border-[#2F3D35] text-[#132E20] dark:text-[#E2E8E4] font-semibold text-xs hover:bg-[#F3F2EE] dark:hover:bg-[#233129] active:scale-[0.98] transition-all shadow-2xs"
          >
            <Copy className="w-4 h-4 text-[#15803D] dark:text-[#4ADE80]" />
            <span>Save as New Version</span>
          </button>
        )}

        <button
          onClick={onGoToActionPlan}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#132E20] dark:bg-[#203D2D] hover:bg-[#1A3E2B] text-white font-semibold text-xs active:scale-[0.98] transition-all shadow-sm"
        >
          <CalendarCheck className="w-4 h-4 text-emerald-300 dark:text-emerald-400" />
          <span>View Action Plan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
