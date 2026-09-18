import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Copy,
  Check,
  Calendar,
  Users,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { ActionTask, TimelineGroup } from '../types';

interface ActionPlanViewProps {
  tasks: ActionTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (
    title: string,
    phase: 'before' | 'during' | 'after',
    timelineGroup?: TimelineGroup,
    role?: string
  ) => void;
  eventName: string;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  eventName
}) => {
  const [activePhase, setActivePhase] = useState<'before' | 'during' | 'after'>('before');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskRole, setNewTaskRole] = useState('Operations Coordinator');
  const [isAdding, setIsAdding] = useState(false);
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [showVendorBriefs, setShowVendorBriefs] = useState(false);

  // Filter tasks by the 3 requested phases: Before, During, After
  const phaseTasks = tasks.filter((t) => t.phase === activePhase);
  const completedPhaseTasks = phaseTasks.filter((t) => t.completed).length;

  const totalCompleted = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const totalPercent = totalCount > 0 ? Math.round((totalCompleted / totalCount) * 100) : 0;

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const timelineGroup: TimelineGroup =
      activePhase === 'during'
        ? 'event_day'
        : activePhase === 'after'
        ? 'post_event'
        : '2_weeks_before';

    onAddTask(newTaskTitle.trim(), activePhase, timelineGroup, newTaskRole);
    setNewTaskTitle('');
    setIsAdding(false);
  };

  const copySummaryToClipboard = () => {
    const lines = [
      `# ECOVIA Action Plan: ${eventName}`,
      `Overall Completion: ${totalCompleted} / ${totalCount} (${totalPercent}%)\n`,
      `## Before Event:`,
      ...tasks.filter((t) => t.phase === 'before').map((t) => `- [${t.completed ? 'x' : ' '}] ${t.title} (${t.role})`),
      `\n## During Event:`,
      ...tasks.filter((t) => t.phase === 'during').map((t) => `- [${t.completed ? 'x' : ' '}] ${t.title} (${t.role})`),
      `\n## After Event:`,
      ...tasks.filter((t) => t.phase === 'after').map((t) => `- [${t.completed ? 'x' : ' '}] ${t.title} (${t.role})`)
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      
      {/* Header with Title & Overall Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE8E3] dark:border-[#26322C] pb-5">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80]">
            Implementation Roadmap
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#132E20] dark:text-[#E2E8E4] tracking-tight mt-0.5">
            Action Plan
          </h1>
          <p className="text-xs text-[#526359] dark:text-[#8E9E95] mt-0.5">
            Step-by-step checklist saved specifically for <strong className="text-[#132E20] dark:text-[#E2E8E4]">{eventName}</strong>.
          </p>
        </div>

        {/* Action Buttons: Copy Plan & Add Item */}
        <div className="flex items-center gap-2">
          <button
            onClick={copySummaryToClipboard}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#D9D6CE] dark:border-[#2F3D35] bg-white dark:bg-[#18201C] text-xs font-semibold text-[#132E20] dark:text-[#E2E8E4] hover:bg-[#F3F2EE] dark:hover:bg-[#202924] transition-colors"
          >
            {copiedPlan ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#15803D] dark:text-[#4ADE80]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Checklist</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#132E20] dark:bg-[#203D2D] hover:bg-[#1A3E2B] text-white text-xs font-semibold active:scale-[0.98] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Overall Completion Metric Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#18201C] border border-[#EAE8E3] dark:border-[#26322C] shadow-xs flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-[#526359] dark:text-[#8E9E95]">
            Checklist Progress
          </div>
          <div className="text-2xl font-black text-[#132E20] dark:text-[#E2E8E4] mt-0.5">
            {totalCompleted} / {totalCount} complete
          </div>
        </div>

        <div className="w-36 sm:w-48 space-y-1 text-right">
          <div className="text-xs font-bold text-[#15803D] dark:text-[#4ADE80]">
            {totalPercent}%
          </div>
          <div className="w-full bg-[#EAE8E3] dark:bg-[#2A372F] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#15803D] dark:bg-[#4ADE80] h-full rounded-full transition-all duration-500"
              style={{ width: `${totalPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Custom Task Form (inline) */}
      {isAdding && (
        <form
          onSubmit={handleAddNewTask}
          className="p-4 rounded-2xl bg-[#F8F7F4] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F] space-y-3 animate-fadeIn"
        >
          <div className="text-xs font-bold text-[#132E20] dark:text-[#E2E8E4]">
            Add New Checklist Item to "{activePhase.toUpperCase()}"
          </div>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="e.g. Inspect compost sorting bins at south pavilion..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D6CE] dark:border-[#2F3D35] bg-white dark:bg-[#18201C] text-sm text-[#132E20] dark:text-[#E2E8E4] focus:outline-none focus:ring-2 focus:ring-[#15803D]"
            autoFocus
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <input
              type="text"
              value={newTaskRole}
              onChange={(e) => setNewTaskRole(e.target.value)}
              placeholder="Responsible Role"
              className="px-3 py-1.5 text-xs rounded-lg border border-[#D9D6CE] dark:border-[#2F3D35] bg-white dark:bg-[#18201C] text-[#132E20] dark:text-[#E2E8E4]"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs font-semibold text-[#526359] dark:text-[#8E9E95] hover:text-[#132E20]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#132E20] dark:bg-[#203D2D] text-white text-xs font-semibold hover:bg-[#1A3E2B]"
              >
                Save Item
              </button>
            </div>
          </div>
        </form>
      )}

      {/* PHASE TABS: BEFORE / DURING / AFTER */}
      <div className="space-y-4">
        <div className="flex items-center border-b border-[#EAE8E3] dark:border-[#26322C] gap-2">
          {(['before', 'during', 'after'] as const).map((phase) => {
            const count = tasks.filter((t) => t.phase === phase).length;
            const completed = tasks.filter((t) => t.phase === phase && t.completed).length;
            const isActive = activePhase === phase;

            return (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={`pb-3 px-4 text-xs font-bold capitalize transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'border-[#15803D] dark:border-[#4ADE80] text-[#132E20] dark:text-[#E2E8E4]'
                    : 'border-transparent text-[#526359] dark:text-[#8E9E95] hover:text-[#132E20] dark:hover:text-[#E2E8E4]'
                }`}
              >
                <span>{phase === 'before' ? 'Before Event' : phase === 'during' ? 'During Event' : 'After Event'}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                      : 'bg-[#F3F2EE] dark:bg-[#202924] text-[#526359] dark:text-[#8E9E95]'
                  }`}
                >
                  {completed}/{count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Phase Header with Phase Counter */}
        <div className="flex items-center justify-between text-xs text-[#526359] dark:text-[#8E9E95] pt-1">
          <span>
            {activePhase === 'before'
              ? 'Procurement, vendor agreements, and communications'
              : activePhase === 'during'
              ? 'On-site operations, hydration stations, and waste marshals'
              : 'Post-event surplus reconciliation and recycling audits'}
          </span>
          <span className="font-semibold text-[#132E20] dark:text-[#E2E8E4]">
            {completedPhaseTasks} / {phaseTasks.length} complete
          </span>
        </div>

        {/* Checklist Items */}
        <div className="space-y-2.5">
          {phaseTasks.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-[#D9D6CE] dark:border-[#2F3D35] text-xs text-[#526359] dark:text-[#8E9E95]">
              No tasks listed for this phase. Click "+ Add Item" above to add one.
            </div>
          ) : (
            phaseTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  task.completed
                    ? 'bg-[#F8FDF9] dark:bg-[#13251B] border-emerald-200 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-200'
                    : 'bg-white dark:bg-[#18201C] border-[#EAE8E3] dark:border-[#26322C] hover:border-[#8DA393] text-[#132E20] dark:text-[#E2E8E4] shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="pt-0.5 text-emerald-700 dark:text-emerald-400 shrink-0">
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4 text-[#94A3B8] dark:text-[#526359]" />
                    )}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p
                      className={`text-xs font-semibold leading-relaxed ${
                        task.completed ? 'line-through text-emerald-800/70 dark:text-emerald-300/60' : ''
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-[#526359] dark:text-[#8E9E95]">
                      <span className="font-medium text-[#15803D] dark:text-[#4ADE80]">
                        {task.role || 'Coordinator'}
                      </span>
                      {task.notes && (
                        <>
                          <span>·</span>
                          <span className="truncate">{task.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                    task.completed
                      ? 'bg-emerald-200 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                      : 'bg-[#F3F2EE] dark:bg-[#202924] text-[#526359] dark:text-[#8E9E95]'
                  }`}
                >
                  {task.completed ? 'Done' : 'Pending'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Collapsible Vendor Guidelines Accordion */}
      <section className="rounded-3xl border border-[#EAE8E3] dark:border-[#26322C] bg-white dark:bg-[#18201C] overflow-hidden shadow-xs">
        <button
          onClick={() => setShowVendorBriefs(!showVendorBriefs)}
          className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#FAF9F6] dark:hover:bg-[#1E2722] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#E2E8E4] dark:bg-[#203227] flex items-center justify-center text-[#132E20] dark:text-[#86EFAC] shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#132E20] dark:text-[#E2E8E4]">
                Vendor Sustainability Protocols
              </h3>
              <p className="text-xs text-[#526359] dark:text-[#8E9E95]">
                Specifications ready to share with catering, logistics, and AV contractors.
              </p>
            </div>
          </div>
          <div className="text-[#526359] dark:text-[#8E9E95]">
            {showVendorBriefs ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showVendorBriefs && (
          <div className="px-5 pb-6 space-y-4 border-t border-[#EAE8E3] dark:border-[#26322C] pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#526359] dark:text-[#8E9E95]">
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F] space-y-1">
                <strong className="text-[#132E20] dark:text-[#E2E8E4] block">🍽️ Catering Vendor</strong>
                <p>Deposit-return cup sanitization, washable dishware, and calibrated headcount buffer with surplus donation pact.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F] space-y-1">
                <strong className="text-[#132E20] dark:text-[#E2E8E4] block">♻️ Waste & Logistics</strong>
                <p>3-stream colored sorting stations with student volunteer marshals at dining foyers and post-event diversion log.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F] space-y-1">
                <strong className="text-[#132E20] dark:text-[#E2E8E4] block">⚡ Stage & AV Rig</strong>
                <p>100% LED lighting fixtures, grid power utility feeds, and reusable modular tension fabric backdrops.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#202924] border border-[#EAE8E3] dark:border-[#2A372F] space-y-1">
                <strong className="text-[#132E20] dark:text-[#E2E8E4] block">💧 Venue Administration</strong>
                <p>1 bulk filtered dispenser per 250 attendees, clear wayfinding maps, and returned lanyard dropboxes at exits.</p>
              </div>
            </div>
          </div>
        )}
      </section>

    </div>
  );
};
