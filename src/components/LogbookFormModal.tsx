import React from 'react';

interface LogbookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogbookFormModal: React.FC<LogbookFormModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-emerald-400">
            Form Input Logbook Kinerja Harian
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors text-xl font-bold"
          >
            ✕
          </button>
        </div>
        
        <div className="py-4 space-y-4">
          <p className="text-sm text-slate-300">
            Pilih kehadiran (WFO, Sakit, Cuti), tanggal kegiatan, dan rincian pekerjaan.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
