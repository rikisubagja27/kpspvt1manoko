import React, { useState } from 'react';
import { LogbookFormModal } from './LogbookFormModal';

export interface LogbookEntry {
  id: string;
  date: string;
  status: 'WFO' | 'Sakit' | 'Cuti';
  activity: string;
  notes?: string;
}

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
  }
];

export const LogbookManagerView: React.FC = () => {
  const [showForm, setShowForm] = useState(true);
  const [entries] = useState<LogbookEntry[]>(initialLogbooks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const wfoCount = entries.filter(e => e.status === 'WFO').length;
  const sakitCount = entries.filter(e => e.status === 'Sakit').length;
  const cutiCount = entries.filter(e => e.status === 'Cuti').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 md:p-6 space-y-4">
      {/* Card Ringkasan Logbook (Background Putih) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              📝 Isi & Catatan Logbook Kinerja
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Form pencatatan kehadiran & operasional harian Kebun PVT I Manoko
            </p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs px-3 py-1 rounded-full font-semibold">
            {entries.length} Catatan
          </span>
        </div>

        {/* Badge Status Kehadiran */}
        <div className="flex flex-wrap items-center gap-3 my-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1.5 rounded-lg font-medium">
            WFO: {wfoCount}
          </span>
          <span className="text-slate-300">|</span>
          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-3 py-1.5 rounded-lg font-medium">
            Sakit: {sakitCount}
          </span>
          <span className="text-slate-300">|</span>
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-3 py-1.5 rounded-lg font-medium">
            Cuti: {cutiCount}
          </span>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-sm font-medium rounded-xl transition-colors"
        >
          {showForm ? '× Sembunyikan Form' : '+ Tampilkan Form Input'}
        </button>
      </div>

      {/* Card Form Input Logbook (Muncul Kembali dengan Tampilan Putih/Hijau) */}
      {showForm && (
        <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
                ✏️
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Form Input Logbook Kinerja Harian
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih kehadiran (WFO, Sakit, Cuti), tanggal kegiatan, dan rincian pekerjaan
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowForm(false)} 
              className="text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Kehadiran <span className="text-rose-500">*</span>
            </label>
            <button className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors">
              <span>📟</span> WFO (Hadir di Kantor / Kebun)
            </button>
          </div>
        </div>
      )}

      {/* Riwayat Catatan Logbook */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Riwayat Catatan ({entries.length})
        </h3>
        {entries.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700">{item.date}</span>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                item.status === 'Sakit' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                item.status === 'Cuti' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {item.status}
              </span>
            </div>
            <p className="text-sm text-slate-600">{item.activity}</p>
          </div>
        ))}
      </div>

      <LogbookFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LogbookManagerView;
