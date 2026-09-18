import React from 'react';
import { X, ShieldCheck, Leaf, Target, Globe, ExternalLink } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-[#181E1B] rounded-3xl border border-[#EAE8E3] dark:border-[#2A3630] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#EAE8E3] dark:border-[#26322C] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#132E20] dark:bg-[#1F2D24] border border-[#2B3E32] flex items-center justify-center text-white">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#132E20] dark:text-[#E2E8E4]">About ECOVIA</h3>
              <p className="text-xs text-[#526359] dark:text-[#8E9E95]">Smarter events. Sustainable choices.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#64748B] hover:text-[#132E20] dark:hover:text-white hover:bg-[#F3F2EE] dark:hover:bg-[#232D28] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Our Purpose */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80]">
            Our Purpose
          </h4>
          <p className="text-xs text-[#2C4A38] dark:text-[#CBD5E1] leading-relaxed">
            Events generate substantial short-term resource spikes — single-use plastics, excessive food preparation, transport emissions, and temporary staging waste. ECOVIA transforms event planning into a practical sustainability strategy through transparent quantification and actionable intervention design.
          </p>
        </div>

        {/* Core Methodology */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80]">
            The 4-Stage Methodology
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#131916] border border-[#EAE8E3] dark:border-[#26322C]">
              <span className="font-bold text-[#132E20] dark:text-[#E2E8E4] block mb-0.5">1. PLAN</span>
              <span className="text-[#526359] dark:text-[#8E9E95]">Capture attendee scale, catering format, and logistics.</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#131916] border border-[#EAE8E3] dark:border-[#26322C]">
              <span className="font-bold text-[#132E20] dark:text-[#E2E8E4] block mb-0.5">2. ANALYZE</span>
              <span className="text-[#526359] dark:text-[#8E9E95]">Pinpoint critical resource hotspots and intensity metrics.</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#131916] border border-[#EAE8E3] dark:border-[#26322C]">
              <span className="font-bold text-[#132E20] dark:text-[#E2E8E4] block mb-0.5">3. IMPROVE</span>
              <span className="text-[#526359] dark:text-[#8E9E95]">Simulate what-if decisions and projected score gains.</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#131916] border border-[#EAE8E3] dark:border-[#26322C]">
              <span className="font-bold text-[#132E20] dark:text-[#E2E8E4] block mb-0.5">4. ACT</span>
              <span className="text-[#526359] dark:text-[#8E9E95]">Deliver phased checklists for Before, During, and After.</span>
            </div>
          </div>
        </div>

        {/* SDG Alignment — Subtle and Tasteful */}
        <div className="p-4 rounded-2xl bg-[#F4F9F5] dark:bg-[#14231A] border border-[#B7D8C0] dark:border-[#274433] space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#15803D] dark:text-[#4ADE80]" />
            <span className="text-xs font-bold text-[#132E20] dark:text-[#E2E8E4]">
              Aligned with UN Sustainable Development Goals
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] text-[#2C4A38] dark:text-[#CBD5E1] leading-relaxed">
            <div>
              <strong className="text-[#132E20] dark:text-white">SDG 12: Responsible Consumption and Production</strong> — Targets reduction in single-use items, circular food management, and minimal packaging scrap.
            </div>
            <div>
              <strong className="text-[#132E20] dark:text-white">SDG 13: Climate Action</strong> — Focuses on reducing scope 3 transit emissions and localized diesel generation footprints.
            </div>
          </div>
        </div>

        {/* Responsible Intelligence */}
        <div className="space-y-1 text-xs text-[#526359] dark:text-[#8E9E95]">
          <div className="font-semibold text-[#132E20] dark:text-[#E2E8E4] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#15803D] dark:text-[#4ADE80]" />
            <span>Transparent Calculation Model</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            All Green Scores and projections are computed transparently from physical resource factors rather than black-box assumptions, giving event teams verifiable audit readiness.
          </p>
        </div>

        {/* Footer Close */}
        <div className="pt-2 border-t border-[#EAE8E3] dark:border-[#26322C]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#132E20] dark:bg-[#203D2D] hover:bg-[#1A3E2B] text-white text-xs font-semibold transition-colors"
          >
            Back to Application
          </button>
        </div>

      </div>
    </div>
  );
};
