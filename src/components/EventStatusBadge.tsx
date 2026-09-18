import React from 'react';
import { EventStatus } from '../types';
import { FileEdit, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface EventStatusBadgeProps {
  status?: EventStatus;
  size?: 'sm' | 'md';
  analysisOutdated?: boolean;
  optimizationOutdated?: boolean;
}

export const EventStatusBadge: React.FC<EventStatusBadgeProps> = ({
  status = 'draft',
  size = 'md',
  analysisOutdated = false,
  optimizationOutdated = false
}) => {
  const isSm = size === 'sm';
  const sizeClasses = isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]';
  const iconSize = isSm ? 'w-3 h-3' : 'w-3.5 h-3.5';

  if (analysisOutdated) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 ${sizeClasses}`}
      >
        <AlertCircle className={iconSize} />
        <span>Analysis Outdated</span>
      </span>
    );
  }

  if (optimizationOutdated) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 ${sizeClasses}`}
      >
        <AlertCircle className={iconSize} />
        <span>Optimization Outdated</span>
      </span>
    );
  }

  if (status === 'optimized') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 ${sizeClasses}`}
      >
        <Sparkles className={iconSize} />
        <span>Optimized</span>
      </span>
    );
  }

  if (status === 'analyzed') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700/60 ${sizeClasses}`}
      >
        <CheckCircle2 className={iconSize} />
        <span>Analyzed</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wider bg-[#F3F2EE] dark:bg-[#202724] text-[#526359] dark:text-[#9AA8A0] border border-[#D9D6CE] dark:border-[#2F3D35] ${sizeClasses}`}
    >
      <FileEdit className={iconSize} />
      <span>Draft</span>
    </span>
  );
};
