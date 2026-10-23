import React from 'react';

interface LogbookEntryCardProps {
  date?: string;
  status?: string;
  activity?: string;
}

export const LogbookEntryCard: React.FC<LogbookEntryCardProps> = ({
  date = '22 Okt 2026',
  status = 'WFO',
  activity = 'Pencatatan kegiatan harian'
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-900">{date}</span>
        <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          {status}
        </span>
      </div>
      <p className="text-xs text-slate-600">{activity}</p>
    </div>
  );
};
