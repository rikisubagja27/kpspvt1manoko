import React, { useState } from 'react';

export interface LogbookEntry {
  id: string;
  date: string;
  status: 'WFO' | 'Sakit' | 'Cuti';
  activity: string;
  location?: string;
  startTime?: string;
  endTime?: string;
}

export const LogbookManagerView: React.FC = () => {
  const [showForm, setShowForm] = useState(true);
  const [kehadiran, setKehadiran] = useState<'WFO' | 'Sakit' | 'Cuti'>('WFO');
  const [tanggal, setTanggal] = useState('22 Okt 2026');
  const [jamMulai, setJamMulai] = useState('07.30');
  const [jamSelesai, setJamSelesai] = useState('11.30');
  const [lokasi, setLokasi] = useState('Blok C7 Manoko');
  const [rincian, setRincian] = useState('');

  const [entries, setEntries] = useState<LogbookEntry[]>([
    {
      id: '1',
      date: '22 Okt 2026',
      status: 'WFO',
      activity: 'Pemeliharaan rutin dan pencatatan operasional harian Kebun PVT I Manoko.',
      location: 'Blok C7 Manoko',
      startTime: '07.30',
      endTime: '11.30'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rincian.trim()) return;

    const newEntry: LogbookEntry = {
      id: Date.now().toString(),
      date: tanggal,
      status: kehadiran,
      activity: rincian,
      location: lokasi,
      startTime: jamMulai,
      endTime: jamSelesai
    };

    setEntries([newEntry, ...entries]);
    setRincian('');
  };

  const wfoCount = entries.filter(e => e.status === 'WFO').length;
  const sakitCount = entries.filter(e => e.status === 'Sakit').length;
  const cutiCount = entries.filter(e => e.status === 'Cuti').length;

  return (
    <div className="min-h-screen bg-[#072419] text-slate-100 px-4 py-5 max-w-xl mx-auto space-y-4">

      {/* 1. Bar Status Ringkasan Kehadiran */}
      <div className="bg-[#0b3828] border border-emerald-800/80 rounded-2xl p-3.5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <span className="bg-emerald-300 text-emerald-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm">
              WFO: {wfoCount}
            </span>
            <span className="text-emerald-700 font-bold">|</span>
            <span className="bg-amber-300 text-amber-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm">
              Sakit: {sakitCount}
            </span>
            <span className="text-emerald-700 font-bold">|</span>
            <span className="bg-blue-300 text-blue-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm">
              Cuti: {cutiCount}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1 sm:mt-0">
            <span className="bg-emerald-900/90 text-emerald-200 border border-emerald-700 text-xs px-3 py-1.5 rounded-lg font-semibold">
              {entries.length} Catatan
            </span>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              {showForm ? 'Tutup Form' : 'Buka Form'}
            </button>
          </div>

        </div>
      </div>

      {/* CATATAN: 4 Kotak Statistik (Total Logbook, Hadir Kerja, Sakit & Cuti, Foto) Sudah Dihapus */}

      {/* 2. Form Input Logbook Kinerja Harian */}
      {showForm && (
        <div className="bg-white text-slate-800 border border-emerald-200 rounded-2xl shadow-xl overflow-hidden">
          
          <div className="bg-[#f0faf5] p-4 border-b border-emerald-100 flex items-start justify-between">
            <div className="flex gap-3 items-center">
              <div className="p-2.5 bg-[#2f855a] text-white rounded-xl shadow-sm font-bold">
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
              className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            
            {/* Opsi Kehadiran */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Kehadiran <span className="text-rose-500">*</span>
              </label>

              <button
                type="button"
                onClick={() => setKehadiran('WFO')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  kehadiran === 'WFO'
                    ? 'bg-[#2f855a] text-white border-[#2f855a] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🏢</span> WFO (Hadir di Kantor / Kebun)
              </button>

              <button
                type="button"
                onClick={() => setKehadiran('Sakit')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  kehadiran === 'Sakit'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🩺</span> Sakit
              </button>

              <button
                type="button"
                onClick={() => setKehadiran('Cuti')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  kehadiran === 'Cuti'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🌴</span> Cuti
              </button>
            </div>

            {/* Tanggal Kegiatan */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Tanggal Kegiatan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Jam Mulai & Selesai */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Jam Mulai
                </label>
                <input
                  type="text"
                  value={jamMulai}
                  onChange={(e) => setJamMulai(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Jam Selesai
                </label>
                <input
                  type="text"
                  value={jamSelesai}
                  onChange={(e) => setJamSelesai(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Lokasi / Blok Kebun */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Lokasi / Blok Kebun
              </label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Rincian Pekerjaan */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Rincian Kinerja / Pekerjaan <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={rincian}
                onChange={(e) => setRincian(e.target.value)}
                placeholder="Tuliskan rincian kegiatan harian Anda..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#2f855a] hover:bg-[#276749] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              Simpan Logbook Kinerja
            </button>

          </form>
        </div>
      )}

      {/* 3. Riwayat Catatan Logbook */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
          Riwayat Catatan ({entries.length})
        </h3>
        {entries.map((item) => (
          <div key={item.id} className="bg-white text-slate-800 border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-900">{item.date}</span>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                item.status === 'Sakit' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                item.status === 'Cuti' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                {item.status}
              </span>
            </div>
            {item.location && (
              <p className="text-[11px] font-semibold text-emerald-700">📍 {item.location} ({item.startTime} - {item.endTime})</p>
            )}
            <p className="text-xs text-slate-600 leading-relaxed">{item.activity}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default LogbookManagerView;
