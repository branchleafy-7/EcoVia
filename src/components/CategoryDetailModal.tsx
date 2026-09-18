import React from 'react';
import { X, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { CategoryScore } from '../types';

interface CategoryDetailModalProps {
  category: CategoryScore | null;
  onClose: () => void;
}

export const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({ category, onClose }) => {
  if (!category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white dark:bg-[#181E1B] rounded-t-3xl sm:rounded-3xl border border-[#EAE8E3] dark:border-[#26322C] max-w-lg w-full p-6 space-y-6 shadow-xl animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE8E3] dark:border-[#26322C] pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{category.emoji}</span>
            <div>
              <h3 className="text-lg font-bold text-[#132E20] dark:text-[#E2E8E4]">{category.name} Category</h3>
              <p className="text-xs text-[#526359] dark:text-[#8E9E95]">Impact Weight: {category.weight}% of Total Score</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#64748B] hover:text-[#132E20] dark:hover:text-white hover:bg-[#F3F2EE] dark:hover:bg-[#232D28] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Radial & Label */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F9F9F8] dark:bg-[#141A17] border border-[#EAE8E3] dark:border-[#26322C]">
          <div>
            <div className="text-xs text-[#526359] dark:text-[#8E9E95] uppercase tracking-wider font-semibold">Category Score</div>
            <div className="text-3xl font-extrabold text-[#132E20] dark:text-[#E2E8E4]">{category.score} <span className="text-sm font-normal text-[#64748B]">/ 100</span></div>
            <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E2E8E4] dark:bg-[#203227] text-[#15803D] dark:text-[#4ADE80]">
              {category.label}
            </span>
          </div>
          <div className="w-16 h-16 relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                fill="transparent"
                className="text-[#EAE8E3] dark:text-[#26322C]"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#15803D"
                strokeWidth="5"
                strokeDasharray={163.36}
                strokeDashoffset={163.36 * (1 - category.score / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-bold text-[#132E20]">{category.score}%</span>
          </div>
        </div>

        {/* Breakdown drivers */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#526359]">Analysis Summary</div>
          
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Primary Challenge:</strong>
              {category.keyDriver}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-2.5 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Positive Aspect / Foundation:</strong>
              {category.positiveAspect}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#EAE8E3]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#132E20] text-white text-xs font-semibold hover:bg-[#1D4430] transition-colors"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
