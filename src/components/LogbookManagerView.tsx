import React, { useState } from 'react';
import { LogbookFormModal } from './LogbookFormModal';

export interface LogbookEntry {
  id: string;
  date: string;
  status: 'WFO' | 'Sakit' | 'Cuti';
  activity: string;
  notes?: string;
}

// Data daftar logbook (Sesuaikan/hubungkan dengan state atau storage Anda)
const initialLogbooks: LogbookEntry[] = [
  { 
    id: '1', 
    date: '22 Oktober 2026', 
    status: 'WFO', 
    activity: 'Pemeliharaan rutin dan pencatatan operasional harian Kebun PVT I Manoko.' 
  },
  { 
    id: '2', 
    date: '21 Oktober 2026', 
    status: 'WFO', 
    activity: 'Pembersihan gulma dan pemantauan kondisi fisik tanaman varietas unggul.' 
  },
  { 
    id: '3', 
    date: '20 Oktober 2026', 
    status: 'Sakit', 
    activity: 'Izin tidak hadir karena sakit (Surat Dokter terlampir).' 
  },
  { 
    id: '4', 
    date: '19 Oktober 2026', 
    status: 'WFO', 
    activity: 'Pemeriksaan rutin sarana & prasarana lapangan serta rekapitulasi data.' 
  }
];

interface LogbookEntryCardProps {
  entry: LogbookEntry;
}

const LogbookEntryCard: React.FC<LogbookEntryCardProps> = ({ entry }) => {
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'Sakit':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
      case 'Cuti':
        return 'bg-blue-950/80 text-blue-300 border-blue-800/60';
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-100 shadow-sm transition-all hover:border-slate-700">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-300">{entry.date}</span>
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getBadgeStyle(entry.status)}`}>
          {entry.status}
        </span>
      </div>
      <p className="text-sm text-slate-200 mb-1">{entry.activity}</p>
      {entry.notes && <p className="text-xs text-slate-400 italic mt-1">{entry.notes}</p>}
    </div>
  );
};

export const LogbookManagerView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entries] = useState<LogbookEntry[]>(initialLogbooks);

  const wfoCount = entries.filter(e => e.status === 'WFO').length;
  const sakitCount = entries.filter(e => e.status === 'Sakit').length;
  const cutiCount = entries.filter(e => e.status === 'Cuti').length;

  return (
    <div className="min-h-screen bg-[#0d1726] text-slate-100 p-4 md:p-6 space-y-6">
      {/* Ringkasan Header */}
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
            {entries.length} Catatan
          </span>
        </div>

        {/* Counts */}
        <div className="flex flex-wrap gap-3 my-4">
          <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 text-xs px-3 py-1.5 rounded-lg font-medium">
            WFO: {wfoCount}
          </span>
          <span className="bg-amber-950/60 text-amber-400 border border-amber-800/60 text-xs px-3 py-1.5 rounded-lg font-medium">
            Sakit: {sakitCount}
          </span>
          <span className="bg-blue-950/60 text-blue-400 border border-blue-800/60 text-xs px-3 py-1.5 rounded-lg font-medium">
            Cuti: {cutiCount}
          </span>
        </div>

        <button 
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm rounded-lg transition-colors"
        >
          {isModalOpen ? '× Sembunyikan Form' : '+ Tampilkan Form Input'}
        </button>
      </div>

      {/* Perulangan Daftar Catatan (Looping Array) */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-400">
          Riwayat Catatan ({entries.length})
        </h3>
        {entries.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-6 text-center text-slate-400 text-sm">
            Belum ada catatan logbook.
          </div>
        ) : (
          entries.map((item) => (
            <LogbookEntryCard key={item.id} entry={item} />
          ))
        )}
      </div>

      {/* Modal Input Form */}
      <LogbookFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default LogbookManagerView;
