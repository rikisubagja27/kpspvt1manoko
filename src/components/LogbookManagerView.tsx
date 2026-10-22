import React, { useState } from 'react';

export interface LogbookEntry {
  id: string;
  date: string;
  status: 'WFO' | 'Sakit' | 'Cuti';
  activity: string;
  notes?: string;
}

// Modal Form Popup
interface LogbookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogbookFormModal: React.FC<LogbookFormModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-slate-800">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-lg font-bold text-slate-900">Notifikasi Logbook</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>
        <p className="text-sm text-slate-600">Catatan logbook berhasil ditambahkan!</p>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-[#2f855a] hover:bg-[#276749] text-white rounded-xl text-sm font-semibold transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export const LogbookManagerView: React.FC = () => {
  const [showForm, setShowForm] = useState(true);
  const [kehadiran, setKehadiran] = useState<'WFO' | 'Sakit' | 'Cuti'>('WFO');
  const [tanggal, setTanggal] = useState('2026-10-21');
  const [jamMulai, setJamMulai] = useState('07:30');
  const [rincian, setRincian] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [entries, setEntries] = useState<LogbookEntry[]>([
    {
      id: '1',
      date: '21 Okt 2026',
      status: 'WFO',
      activity: 'Pemeliharaan rutin dan pencatatan operasional harian Kebun PVT I Manoko.'
    },
    {
      id: '2',
      date: '20 Okt 2026',
      status: 'WFO',
      activity: 'Pembersihan gulma dan pemantauan kondisi fisik tanaman varietas unggul.'
    },
    {
      id: '3',
      date: '19 Okt 2026',
      status: 'Sakit',
      activity: 'Izin tidak hadir karena sakit (Surat Dokter terlampir).'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rincian.trim()) return;
    
    const newEntry: LogbookEntry = {
      id: Date.now().toString(),
      date: tanggal,
      status: kehadiran,
      activity: rincian
    };

    setEntries([newEntry, ...entries]);
    setRincian('');
    setIsModalOpen(true);
  };

  const wfoCount = entries.filter(e => e.status === 'WFO').length;
  const sakitCount = entries.filter(e => e.status === 'Sakit').length;
  const cutiCount = entries.filter(e => e.status === 'Cuti').length;

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 p-3 md:p-6 space-y-4">
      
      {/* 1. Header Ringkasan Logbook */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                Isi & Catatan Logbook
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                Form pencatatan kehadiran & operasional harian Kebun PVT I Manoko
              </p>
            </div>
          </div>
          <span className="bg-emerald-100/80 text-emerald-800 border border-emerald-200 text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap">
            {entries.length} Catatan
          </span>
        </div>

        {/* Badge Status Kehadiran */}
        <div className="flex flex-wrap items-center gap-2 my-3 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs px-3 py-1 rounded-lg font-medium">
            WFO: {wfoCount}
          </span>
          <span className="text-slate-300">|</span>
          <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-xs px-3 py-1 rounded-lg font-medium">
            Sakit: {sakitCount}
          </span>
          <span className="text-slate-300">|</span>
          <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-xs px-3 py-1 rounded-lg font-medium">
            Cuti: {cutiCount}
          </span>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300/80 text-xs md:text-sm font-medium rounded-xl transition-colors"
        >
          {showForm ? '× Sembunyikan Form' : '+ Tampilkan Form Input'}
        </button>
      </div>

      {/* 2. Form Input Logbook Kinerja Harian */}
      {showForm && (
        <div className="bg-white border border-emerald-200/90 rounded-2xl shadow-sm overflow-hidden">
          {/* Form Header */}
          <div className="bg-[#f0faf5] p-4 md:p-5 border-b border-emerald-100 flex items-start justify-between">
            <div className="flex gap-3">
              <div className="p-2.5 bg-[#2f855a] text-white rounded-xl shadow-sm flex items-center justify-center w-10 h-10 shrink-0">
                ✏️
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Form Input Logbook Kinerja Harian
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Pilih kehadiran (WFO, Sakit, Cuti), tanggal kegiatan, dan rincian pekerjaan
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowForm(false)} 
              className="text-slate-400 hover:text-slate-600 transition-colors text-sm font-bold p-1"
            >
              ✕
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 md:p-5 space-y-4">
              
              {/* Option Kehadiran */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Kehadiran <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setKehadiran('WFO')}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all ${
                      kehadiran === 'WFO'
                        ? 'bg-[#2f855a] text-white border-[#2f855a] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>🏢</span> WFO (Hadir di Kantor / Kebun)
                  </button>

                  <button
                    type="button"
                    onClick={() => setKehadiran('Sakit')}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all ${
                      kehadiran === 'Sakit'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>🩺</span> Sakit
                  </button>

                  <button
                    type="button"
                    onClick={() => setKehadiran('Cuti')}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all ${
                      kehadiran === 'Cuti'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>🌴</span> Cuti
                  </button>
                </div>
              </div>

              {/* Tanggal Kegiatan */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Tanggal Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full md:w-auto bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Jam Mulai */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Jam Mulai
                </label>
                <input
                  type="time"
                  value={jamMulai}
                  onChange={(e) => setJamMulai(e.target.value)}
                  className="w-full md:w-auto bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Rincian Pekerjaan */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Rincian Pekerjaan
                </label>
                <textarea
                  rows={3}
                  value={rincian}
                  onChange={(e) => setRincian(e.target.value)}
                  placeholder="Tuliskan pekerjaan harian Anda di sini..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2f855a] hover:bg-[#276749] text-white text-sm font-bold rounded-xl shadow-sm transition-colors"
              >
                Simpan Logbook Kinerja
              </button>

            </div>
          </form>
        </div>
      )}

      {/* 3. Riwayat Catatan Logbook */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Riwayat Catatan ({entries.length})
        </h3>
        {entries.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-800">{item.date}</span>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                item.status === 'Sakit' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                item.status === 'Cuti' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {item.status}
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{item.activity}</p>
          </div>
        ))}
      </div>

      {/* Modal Notification */}
      <LogbookFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default LogbookManagerView;
