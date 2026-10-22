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
  const [showAddForm, setShowAddForm] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [status, setStatus] = useState<'WFO' | 'Sakit' | 'Cuti'>('WFO');
  const [date, setDate] = useState('22 Okt 2026');
  const [startTime, setStartTime] = useState('07.30');
  const [endTime, setEndTime] = useState('11.30');
  const [location, setLocation] = useState('Blok C7 Manoko');
  const [activity, setActivity] = useState('');

  // Data Logbook
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

  const resetForm = () => {
    setStatus('WFO');
    setDate('22 Okt 2026');
    setStartTime('07.30');
    setEndTime('11.30');
    setLocation('Blok C7 Manoko');
    setActivity('');
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity.trim()) return;

    if (editingId) {
      setEntries(entries.map(item => 
        item.id === editingId 
          ? { ...item, status, date, startTime, endTime, location, activity }
          : item
      ));
    } else {
      const newEntry: LogbookEntry = {
        id: Date.now().toString(),
        date,
        status,
        activity,
        location,
        startTime,
        endTime
      };
      setEntries([newEntry, ...entries]);
    }

    resetForm();
  };

  const handleEdit = (entry: LogbookEntry) => {
    setEditingId(entry.id);
    setStatus(entry.status);
    setDate(entry.date);
    setStartTime(entry.startTime || '07.30');
    setEndTime(entry.endTime || '11.30');
    setLocation(entry.location || '');
    setActivity(entry.activity);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const wfoCount = entries.filter(e => e.status === 'WFO').length;
  const sakitCount = entries.filter(e => e.status === 'Sakit').length;
  const cutiCount = entries.filter(e => e.status === 'Cuti').length;

  return (
    <div className="min-h-screen bg-[#072419] text-slate-100 px-4 py-5 max-w-xl mx-auto space-y-4">
      
      {/* 1. Bar Status Ringkasan (Teks Dipaksa Hitam #000000) */}
      <div className="bg-[#0b3828] border border-emerald-800 rounded-2xl p-3.5 shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Badge WFO */}
          <span 
            style={{ color: '#000000' }} 
            className="!text-black bg-emerald-300 font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm"
          >
            WFO: {wfoCount}
          </span>

          <span style={{ color: '#ffffff' }} className="font-bold">|</span>

          {/* Badge Sakit */}
          <span 
            style={{ color: '#000000' }} 
            className="!text-black bg-amber-300 font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm"
          >
            Sakit: {sakitCount}
          </span>

          <span style={{ color: '#ffffff' }} className="font-bold">|</span>

          {/* Badge Cuti */}
          <span 
            style={{ color: '#000000' }} 
            className="!text-black bg-blue-300 font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm"
          >
            Cuti: {cutiCount}
          </span>

          {/* Badge Total Catatan */}
          <span 
            style={{ color: '#000000' }} 
            className="!text-black bg-emerald-300 font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm"
          >
            {entries.length} Catatan
          </span>

          {/* Tombol Isi Logbook */}
          <button 
            type="button"
            style={{ color: '#000000' }}
            onClick={() => {
              if (showAddForm && !editingId) {
                setShowAddForm(false);
              } else {
                resetForm();
                setShowAddForm(true);
              }
            }}
            className="!text-black px-4 py-2 bg-white hover:bg-slate-100 font-bold text-xs rounded-xl border border-slate-200 shadow-sm transition-colors ml-auto"
          >
            {showAddForm ? '× Tutup Form' : '+ Isi Logbook'}
          </button>
        </div>
      </div>

      {/* 2. Form Input Logbook Kinerja Harian */}
      {showAddForm && (
        <div className="bg-white text-slate-800 border border-emerald-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-[#f0faf5] p-4 border-b border-emerald-100 flex items-start justify-between">
            <div className="flex gap-3 items-center">
              <div className="p-2.5 bg-[#2f855a] text-white rounded-xl shadow-sm font-bold">
                ✏️
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingId ? 'Edit Catatan Logbook' : 'Form Input Logbook Kinerja Harian'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih kehadiran (WFO, Sakit, Cuti), tanggal kegiatan, dan rincian pekerjaan
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddForm(false)} 
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
                onClick={() => setStatus('WFO')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  status === 'WFO'
                    ? 'bg-[#2f855a] text-white border-[#2f855a] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🏢</span> WFO (Hadir di Kantor / Kebun)
              </button>

              <button
                type="button"
                onClick={() => setStatus('Sakit')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  status === 'Sakit'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🩺</span> Sakit
              </button>

              <button
                type="button"
                onClick={() => setStatus('Cuti')}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  status === 'Cuti'
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Jam Mulai & Jam Selesai */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Jam Mulai
                </label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Jam Selesai
                </label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Rincian Kinerja */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Rincian Kinerja / Pekerjaan <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="Tuliskan rincian kegiatan harian Anda..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-3 bg-[#2f855a] hover:bg-[#276749] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                {editingId ? 'Update Logbook' : 'Simpan Logbook Kinerja'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Batal
                </button>
              )}
            </div>
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
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                  item.status === 'Sakit' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                  item.status === 'Cuti' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                  'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {item.status}
                </span>
                <button 
                  onClick={() => handleEdit(item)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-rose-400 hover:text-rose-600"
                  title="Hapus"
                >
                  🗑️
                </button>
              </div>
            </div>
            {item.location && (
              <p className="text-[11px] font-semibold text-emerald-700">
                📍 {item.location} {item.startTime && item.endTime ? `(${item.startTime} - ${item.endTime})` : ''}
              </p>
            )}
            <p className="text-xs text-slate-600 leading-relaxed">{item.activity}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default LogbookManagerView;
