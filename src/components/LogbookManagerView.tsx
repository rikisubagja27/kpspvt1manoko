import React, { useState } from 'react';
import { LogbookFormModal } from './LogbookFormModal';

// Komponen LogbookEntryCard dibuat langsung di sini agar tidak error import
interface LogbookEntryCardProps {
  date?: string;
  status?: string;
  activity?: string;
  notes?: string;
}

const LogbookEntryCard: React.FC<LogbookEntryCardProps> = ({
  date = 'Hari Ini',
  status = 'WFO',
  activity = 'Pencatatan aktivitas harian Kebun PVT I Manoko',
  notes
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-emerald-400">{date}</span>
        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
          {status}
        </span>
      </div>
      <p className="text-sm text-slate-200 mb-2">{activity}</p>
      {notes && <p className="text-xs text-slate-400 italic">{notes}</p>}
    </div>
  );
};

export const LogbookManagerView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d1726] text-slate-100 p-4 md:p-6 space-y-6">
      {/* Kartu Ringkasan Logbook */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              📝 Isi & Catatan Logbook Kinerja
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Form pencatatan kehadiran & operasional harian Kebun PVT I Manoko
            </p>
          </div>
          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 text-xs px-3 py-1 rounded-full font-medium">
            13 Catatan
          </span>
        </div>

        {/* Status Badge */}
        <div className="flex flex-wrap gap-3 my-4">
          <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 text-xs px-3 py-1.5 rounded-lg font-medium">
            WFO: 12
          </span>
          <span className="bg-amber-950/60 text-amber-400 border border-amber-800/60 text-xs px-3 py-1.5 rounded-lg font-medium">
            Sakit: 1
          </span>
          <span className="bg-blue-950/60 text-blue-400 border border-blue-800/60 text-xs px-3 py-1.5 rounded-lg font-medium">
            Cuti: 0
          </span>
        </div>

        <button 
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm rounded-lg transition-colors"
        >
          {isModalOpen ? '× Sembunyikan Form' : '+ Tampilkan Form Input'}
        </button>
      </div>

      {/* Contoh Card Daftar Logbook */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-400">Riwayat Catatan</h3>
        <LogbookEntryCard 
          date="22 Oktober 2026" 
          status="WFO" 
          activity="Pemeliharaan rutin dan pencatatan operasional harian Kebun PVT I Manoko." 
        />
      </div>

      {/* Modal Form */}
      <LogbookFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default LogbookManagerView;
