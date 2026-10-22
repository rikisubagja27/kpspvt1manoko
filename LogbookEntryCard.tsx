import React from 'react';

interface LogbookEntryCardProps {
  id?: string;
  date?: string;
  status?: string;
  activity?: string;
  notes?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const LogbookEntryCard: React.FC<LogbookEntryCardProps> = ({
  date = 'Hari Ini',
  status = 'WFO',
  activity = 'Pencatatan aktivitas harian',
  notes,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-100 shadow-sm hover:border-slate-700 transition-all">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-emerald-400">{date}</span>
        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
          {status}
        </span>
      </div>
      <p className="text-sm text-slate-200 mb-2">{activity}</p>
      {notes && <p className="text-xs text-slate-400 mb-3 italic">{notes}</p>}
      
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-800/60 text-xs">
        {onEdit && (
          <button onClick={onEdit} className="text-slate-400 hover:text-amber-400 font-medium transition-colors">
            Edit
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="text-slate-400 hover:text-rose-400 font-medium transition-colors">
            Hapus
          </button>
        )}
      </div>
    </div>
  );
};
