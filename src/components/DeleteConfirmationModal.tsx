import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  eventName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  eventName,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="bg-white dark:bg-[#181E1B] rounded-2xl border border-[#EAE8E3] dark:border-[#2A3630] shadow-xl max-w-md w-full p-6 space-y-5">
        
        {/* Header with warning icon */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="delete-dialog-title" className="text-lg font-bold text-[#132E20] dark:text-[#E2E8E4]">
                Delete this event?
              </h3>
              <p className="text-xs text-[#526359] dark:text-[#8E9E95] mt-0.5">
                Permanently removes <span className="font-semibold text-[#1E2522] dark:text-[#F1F5F2]">"{eventName}"</span>
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#132E20] dark:hover:text-white hover:bg-[#F3F2EE] dark:hover:bg-[#232D28] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#526359] dark:text-[#8E9E95] leading-relaxed">
          This will permanently remove its configuration, baseline Green Score, scenarios, and associated action plans from this device. This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-[#D9D6CE] dark:border-[#2F3D35] bg-white dark:bg-[#1C2420] text-xs font-semibold text-[#374151] dark:text-[#D1D9D4] hover:bg-[#F3F2EE] dark:hover:bg-[#25302B] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-xs font-semibold text-white shadow-xs transition-all"
          >
            Delete Event
          </button>
        </div>

      </div>
    </div>
  );
};
