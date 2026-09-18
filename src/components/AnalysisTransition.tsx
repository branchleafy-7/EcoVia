import React, { useEffect, useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

interface AnalysisTransitionProps {
  onComplete: () => void;
}

const REVIEW_STEPS = [
  { icon: '🔍', text: 'Reviewing waste & single-use load' },
  { icon: '🍽️', text: 'Checking food planning & surplus margins' },
  { icon: '💧', text: 'Reviewing water provision & refill logistics' },
  { icon: '⚡', text: 'Evaluating stage energy & generator fuel' },
  { icon: '🚌', text: 'Looking at attendee transport mode split' },
  { icon: '🎨', text: 'Reviewing signage materials & credentials' }
];

export const AnalysisTransition: React.FC<AnalysisTransitionProps> = ({ onComplete }) => {
  const [completedIndex, setCompletedIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCompletedIndex((prev) => {
        if (prev < REVIEW_STEPS.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF9F6]/90 backdrop-blur-md px-4">
      <div className="bg-white rounded-3xl border border-[#EAE8E3] p-6 sm:p-8 max-w-md w-full shadow-lg space-y-6 text-center">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#E2E8E4] text-[#15803D] flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-[#132E20]">
            Analyzing your event...
          </h2>
          <p className="text-xs text-[#526359]">
            Evaluating resource intensity, emissions hotspots, and reduction potential.
          </p>
        </div>

        {/* Steps List with subtle staggered checkmarks */}
        <div className="space-y-2.5 text-left py-2">
          {REVIEW_STEPS.map((step, idx) => {
            const isDone = idx < completedIndex;
            const isCurrent = idx === completedIndex;
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all duration-300 ${
                  isDone
                    ? 'bg-[#F4F9F5] border-[#B7D8C0] text-[#132E20]'
                    : isCurrent
                    ? 'bg-white border-[#15803D] shadow-xs text-[#132E20]'
                    : 'bg-[#F9F9F8] border-transparent text-[#94A3B8]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{step.icon}</span>
                  <span className="font-medium">{step.text}</span>
                </div>
                {isDone && (
                  <div className="w-5 h-5 rounded-full bg-[#15803D] text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                {isCurrent && (
                  <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping" />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
