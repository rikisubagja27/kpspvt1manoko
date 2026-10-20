import React, { useState, useEffect } from 'react';

const DRAFT_KEY = 'kpspvt_logbook_draft_full_v3';

type KehadiranType = 'WFO' | 'Sakit' | 'Cuti';
type PeriodeType = 'Bulanan' | 'Triwulan' | 'Tahunan';
type TriwulanType = 'I' | 'II' | 'III' | 'IV';

interface LogbookEntry {
  id: string;
  kehadiran: KehadiranType;
  tanggal: string;
  waktuMulai?: string;
  waktuSelesai?: string;
  lokasi?: string;
  rincian: string;
  luas?: string;
  keterangan?: string;
  fotoSebelum?: string;
  fotoSesudah?: string;
  fotoSakit?: string;
}

const initialForm = {
  kehadiran: 'WFO' as KehadiranType,
  tanggal: new Date().toISOString().split('T')[0],
  waktuMulai: '07:30',
  waktuSelesai: '11:30',
  lokasi: 'Blok C7 Manoko',
  rincian: '',
  luas: '',
  keterangan: '',
  fotoSebelum: '',
  fotoSesudah: '',
  fotoSakit: ''
};

export default function App() {
  // Navigation Tabs: 'input' | 'laporan' | 'unduhan'
  const [activeTab, setActiveTab] = useState<'input' | 'laporan' | 'unduhan'>('input');
  
  // Filter Laporan A4
  const [periodeType, setPeriodeType] = useState<PeriodeType>('Triwulan');
  const [selectedTriwulan, setSelectedTriwulan] = useState<TriwulanType>('III');
  const [selectedTahun, setSelectedTahun] = useState<string>('2026');

  // Form State dengan Autosave
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : initialForm;
    } catch {
      return initialForm;
    }
  });

  const [showForm, setShowForm] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedAlert, setSavedAlert] = useState<boolean>(false);

  // Sample Logbook Data
  const [logbooks, setLogbooks] = useState<LogbookEntry[]>([
    {
      id: '1',
      kehadiran: 'WFO',
      tanggal: '2026-10-20',
      waktuMulai: '07:30',
      waktuSelesai: '11:30',
      lokasi: 'Blok C7 Manoko',
      rincian: 'Pemeliharaan dan penyiangan gulma pada tanaman induk',
      luas: '500 m²',
      keterangan: 'Kondisi tanah gembur, cuaca cerah',
      fotoSebelum: '',
      fotoSesudah: ''
    },
    {
      id: '2',
      kehadiran: 'Sakit',
      tanggal: '2026-10-18',
      rincian: 'Sakit (Istirahat dokter)',
      keterangan: 'Istirahat dokter 1 hari',
      fotoSakit: ''
    }
  ]);

  // Autosave ke LocalStorage secara Real-time
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      // Ignore
    }
  }, [form]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: typeof initialForm) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: LogbookEntry = {
      ...form,
      id: Date.now().toString()
    };

    setLogbooks([newEntry, ...logbooks]);
    
    // Reset Form & Clear Draft
    localStorage.removeItem(DRAFT_KEY);
    setForm(initialForm);
    
    // Scroll ke Atas
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Notifikasi
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 4000);
  };

  const filteredLogbooks = logbooks.filter(
    (item) =>
      item.rincian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.lokasi && item.lokasi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.kehadiran.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased flex flex-col">
      {/* HEADER UTAMA APLIKASI */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/logo_kementan.svg"
              alt="Logo Kementan"
              className="h-10 w-10 object-contain flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                Logbook Kinerja PVT I Manoko
              </h1>
              <p className="text-xs text-slate-400">
                Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian
              </p>
            </div>
          </div>
        </div>

        {/* MENU NAVIGASI HALAMAN TERPISAH */}
        <nav className="bg-slate-900 px-2 flex justify-around border-t border-slate-800 text-xs sm:text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('input')}
            className={`py-3 px-3 border-b-2 flex items-center space-x-1.5 transition-colors ${
              activeTab === 'input'
                ? 'border-emerald-500 text-emerald-400 font-bold bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>📋 Isi Logbook</span>
            <span className="bg-emerald-900/80 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-full border border-emerald-700">
              {logbooks.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('laporan')}
            className={`py-3 px-3 border-b-2 flex items-center space-x-1.5 transition-colors ${
              activeTab === 'laporan'
                ? 'border-emerald-500 text-emerald-400 font-bold bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>📄 Laporan A4</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('unduhan')}
            className={`py-3 px-3 border-b-2 flex items-center space-x-1.5 transition-colors ${
              activeTab === 'unduhan'
                ? 'border-emerald-500 text-emerald-400 font-bold bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>📥 Unduhan & Ekspor</span>
          </button>
        </nav>
      </header>

      {/* KONTEN UTAMA */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 space-y-5">
        
        {/* NOTIFIKASI BERHASIL SIMPAN */}
        {savedAlert && (
          <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-between shadow-lg">
            <span>✅ Kegiatan berhasil disimpan ke Buku Logbook & draf diperbarui!</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: HALAMAN AWAL (KHUSUS PENGISIAN & DAFTAR LOGBOOK)   */}
        {/* ========================================================= */}
        {activeTab === 'input' && (
          <div className="space-y-5">
            {/* CARDBANNER UTAMA */}
            <div className="bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-800/60 rounded-2xl p-5 shadow-xl">
              <div className="inline-flex items-center space-x-2 bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs px-3 py-1 rounded-full mb-3">
                <span>📅 Sistem Pencatatan Logbook Kinerja</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Input & Catatan Logbook Harian</h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Catat kehadiran (WFO, Sakit, Cuti) dan pelaksanaan tugas harian di Kebun PVT I Manoko. Seluruh data akan otomatis terangkum ke dalam Laporan Kinerja A4.
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(!showForm)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow flex items-center space-x-2 transition"
                >
                  <span>{showForm ? '➖ Sembunyikan Form' : '➕ Isi Logbook Baru'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('laporan')}
                  className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-700/50 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center space-x-1.5 transition"
                >
                  <span>Buka Laporan A4 Terkompilasi ➔</span>
                </button>
              </div>
            </div>

            {/* FORM INPUT LOGBOOK HARIAN DINAMIS (WFO / SAKIT / CUTI) */}
            {showForm && (
              <section className="bg-white text-slate-800 rounded-2xl border-2 border-emerald-400 p-4 sm:p-6 shadow-2xl space-y-4">
                <div className="border-b border-emerald-100 pb-3 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="bg-emerald-600 text-white p-2 rounded-xl">✏️</div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Form Input Logbook Kinerja Harian</h3>
                      <p className="text-xs text-slate-500">Pilih kehadiran (WFO, Sakit, Cuti), tanggal, dan rincian pekerjaan</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                    💾 Autosave Aktif
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* PILIHAN KEHADIRAN (WFO / SAKIT / CUTI) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Kehadiran <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, kehadiran: 'WFO' })}
                        className={`py-3 px-2 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1 transition ${
                          form.kehadiran === 'WFO'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>🏢 WFO (Hadir Kebun)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, kehadiran: 'Sakit' })}
                        className={`py-3 px-2 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1 transition ${
                          form.kehadiran === 'Sakit'
                            ? 'bg-amber-600 text-white border-amber-600 shadow'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>❤️ Sakit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, kehadiran: 'Cuti' })}
                        className={`py-3 px-2 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1 transition ${
                          form.kehadiran === 'Cuti'
                            ? 'bg-blue-600 text-white border-blue-600 shadow'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>🌴 Cuti</span>
                      </button>
                    </div>
                  </div>

                  {/* TANGGAL KEGIATAN */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tanggal Kegiatan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="tanggal"
                      value={form.tanggal}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      required
                    />
                  </div>

                  {/* KONDISI DINAMIS: WFO */}
                  {form.kehadiran === 'WFO' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Jam Mulai</label>
                          <input
                            type="time"
                            name="waktuMulai"
                            value={form.waktuMulai}
                            onChange={handleInputChange}
                            className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Jam Selesai</label>
                          <input
                            type="time"
                            name="waktuSelesai"
                            value={form.waktuSelesai}
                            onChange={handleInputChange}
                            className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi / Blok Kebun</label>
                        <input
                          type="text"
                          name="lokasi"
                          value={form.lokasi}
                          onChange={handleInputChange}
                          placeholder="Contoh: Blok C7 Manoko"
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Rincian Uraian Pekerjaan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="rincian"
                          rows={3}
                          value={form.rincian}
                          onChange={handleInputChange}
                          placeholder="Jelaskan secara detail pekerjaan operasional yang dilaksanakan..."
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none resize-y"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Luas Lokasi Pekerjaan (m²)</label>
                        <input
                          type="text"
                          name="luas"
                          value={form.luas}
                          onChange={handleInputChange}
                          placeholder="Misal: 500 m² atau kosongi / isi (-)"
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Tambahan / Catatan Kondisi</label>
                        <input
                          type="text"
                          name="keterangan"
                          value={form.keterangan}
                          onChange={handleInputChange}
                          placeholder="Misal: Kondisi tanah gembur, cuaca cerah"
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      {/* UPLOAD FOTO 0% & 100% */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-700">📷 Foto Sebelum & Sesudah Kegiatan (0% & 100%)</span>
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Otomatis Masuk Tabel 2 Laporan A4
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-200 space-y-1">
                            <label className="block text-[11px] font-bold text-amber-800">Foto SEBELUM Kegiatan (0%)</label>
                            <input
                              type="text"
                              name="fotoSebelum"
                              value={form.fotoSebelum}
                              onChange={handleInputChange}
                              placeholder="Tempel URL foto sebelum..."
                              className="w-full p-2 border border-amber-300 rounded-lg text-xs bg-white outline-none"
                            />
                          </div>

                          <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200 space-y-1">
                            <label className="block text-[11px] font-bold text-emerald-800">Foto SESUDAH Kegiatan (100%)</label>
                            <input
                              type="text"
                              name="fotoSesudah"
                              value={form.fotoSesudah}
                              onChange={handleInputChange}
                              placeholder="Tempel URL foto sesudah..."
                              className="w-full p-2 border border-emerald-300 rounded-lg text-xs bg-white outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* KONDISI DINAMIS: SAKIT */}
                  {form.kehadiran === 'Sakit' && (
                    <>
                      <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs italic">
                        Status Sakit: Jam operasional lapangan tidak berlaku.
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Keterangan Sakit <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="rincian"
                          value={form.rincian}
                          onChange={handleInputChange}
                          placeholder="Sakit (Istirahat dokter)"
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Tambahan Sakit (Opsional)</label>
                        <input
                          type="text"
                          name="keterangan"
                          value={form.keterangan}
                          onChange={handleInputChange}
                          placeholder="Misal: Istirahat dokter 1 hari, kontrol ke fasilitas kesehatan"
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                      </div>

                      <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1">
                        <label className="block text-xs font-bold text-amber-900">
                          ❤️ Foto Surat Keterangan Sakit (Dokter / Klinik)
                        </label>
                        <input
                          type="text"
                          name="fotoSakit"
                          value={form.fotoSakit}
                          onChange={handleInputChange}
                          placeholder="Tempel URL foto surat dokter..."
                          className="w-full p-2.5 border border-amber-300 rounded-xl text-xs bg-white outline-none"
                        />
                      </div>
                    </>
                  )}

                  {/* KONDISI DINAMIS: CUTI */}
                  {form.kehadiran === 'Cuti' && (
                    <>
                      <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs italic">
                        Status Cuti: Jam operasional lapangan tidak berlaku.
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Keterangan Cuti <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="rincian"
                          value={form.rincian}
                          onChange={handleInputChange}
                          placeholder="Cuti Tahunan / Alasan Penting"
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Izin Cuti (Opsional)</label>
                        <input
                          type="text"
                          name="keterangan"
                          value={form.keterangan}
                          onChange={handleInputChange}
                          placeholder="Misal: Keperluan keluarga mendesak / cuti tahunan"
                          className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </>
                  )}

                  {/* TOMBOL SIMPAN */}
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setForm(initialForm)}
                      className="px-4 py-2.5 border border-slate-300 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
                    >
                      <span>✔️ Simpan ke Buku Logbook</span>
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* STATISTIK LOGBOOK */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow">
                <span className="text-xs text-slate-400 font-medium">Total Logbook Tercatat</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{logbooks.length}</p>
                <span className="text-[10px] text-slate-500">Catatan harian terdaftar</span>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow">
                <span className="text-xs text-slate-400 font-medium">Hadir Kerja (WFO)</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {logbooks.filter((b) => b.kehadiran === 'WFO').length}
                </p>
                <span className="text-[10px] text-slate-500">Hari efektif di kebun</span>
              </div>
            </div>

            {/* DAFTAR LOGBOOK TERSIMPAN */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 space-y-3 shadow">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Daftar Logbook Tersimpan</h3>
                <span className="text-xs text-slate-400">{filteredLogbooks.length} entri</span>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Cari rincian kegiatan, status kehadiran, atau lokasi..."
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none"
              />

              <div className="space-y-2">
                {filteredLogbooks.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">Belum ada logbook yang cocok dengan pencarian.</p>
                ) : (
                  filteredLogbooks.map((item) => (
                    <div key={item.id} className="bg-slate-900 p-3 rounded-xl border border-slate-700/60 space-y-1">
                      <div className="flex justify-between items-start text-xs">
                        <span className="font-bold text-emerald-400">
                          {item.tanggal} {item.waktuMulai ? `(${item.waktuMulai} - ${item.waktuSelesai})` : ''}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                          item.kehadiran === 'WFO'
                            ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700'
                            : item.kehadiran === 'Sakit'
                            ? 'bg-amber-900/60 text-amber-300 border-amber-700'
                            : 'bg-blue-900/60 text-blue-300 border-blue-700'
                        }`}>
                          {item.kehadiran}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium">{item.rincian}</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                        <span>📍 {item.lokasi || '-'}</span>
                        <span>📐 {item.luas || '-'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: HALAMAN LAPORAN A4 (BULANAN, TRIWULAN, TAHUNAN)     */}
        {/* ========================================================= */}
        {activeTab === 'laporan' && (
          <div className="space-y-5">
            <div className="bg-white text-slate-800 rounded-2xl p-4 border border-slate-200 shadow-md space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Filter Periode Laporan Kinerja A4</h3>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setPeriodeType('Bulanan')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    periodeType === 'Bulanan'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  📅 Bulanan
                </button>
                <button
                  type="button"
                  onClick={() => setPeriodeType('Triwulan')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    periodeType === 'Triwulan'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  📚 Triwulan
                </button>
                <button
                  type="button"
                  onClick={() => setPeriodeType('Tahunan')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    periodeType === 'Tahunan'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  🕒 Tahunan
                </button>
              </div>

              {periodeType === 'Triwulan' && (
                <div className="flex items-center space-x-2 pt-1">
                  <span className="text-xs font-semibold text-slate-600">Pilih Triwulan:</span>
                  <div className="grid grid-cols-4 gap-1.5 flex-1">
                    {(['I', 'II', 'III', 'IV'] as const).map((tw) => (
                      <button
                        key={tw}
                        type="button"
                        onClick={() => setSelectedTriwulan(tw)}
                        className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                          selectedTriwulan === tw
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        Triwulan {tw}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-600">Tahun:</span>
                <select
                  value={selectedTahun}
                  onChange={(e) => setSelectedTahun(e.target.value)}
                  className="p-1.5 border rounded-lg text-xs bg-slate-50 outline-none font-bold"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>

            {/* PRATINJAU DOKUMEN LAPORAN A4 (LEMBAR COVER, BAB 1, BAB 2, BAB 3) */}
            <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 space-y-6">
              {/* COVER LAPORAN */}
              <div className="text-center border-b pb-6 space-y-2">
                <h2 className="text-base font-bold tracking-wide">LAPORAN KINERJA</h2>
                <p className="text-xs font-semibold text-slate-700">PELAKSANAAN TUGAS OPERASIONAL KANTOR</p>
                <p className="text-xs font-bold text-emerald-800">PERIODE {selectedTahun}</p>
                
                <div className="pt-4 text-xs space-y-1">
                  <p className="text-slate-500">Disusun oleh:</p>
                  <p className="font-bold text-slate-900">RIKI SUBAGJA</p>
                  <p className="text-slate-600">NIP: 199808272025211042</p>
                  <p className="text-slate-600">Operator Layanan Operasional</p>
                </div>

                <div className="pt-2 text-[11px] font-semibold text-slate-700">
                  <p>PUSAT PELINDUNGAN VARIETAS TANAMAN DAN PERIZINAN PERTANIAN</p>
                </div>
              </div>

              {/* BAB I */}
              <div className="space-y-2 text-xs text-slate-800 border-b pb-4">
                <h3 className="font-bold text-slate-900 text-sm">BAB I PENDAHULUAN</h3>
                <p className="leading-relaxed">
                  <strong>1.1 Latar Belakang:</strong> Dalam rangka mendukung kelancaran pelaksanaan tugas dan fungsi organisasi, diperlukan dukungan sumber daya manusia pada jabatan Operator Layanan Operasional di Kebun PVT I Manoko.
                </p>
                <p className="leading-relaxed">
                  <strong>1.2 Tujuan:</strong> Sebagai bentuk pertanggungjawaban kinerja pegawai di lingkungan Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian.
                </p>
              </div>

              {/* BAB II TABEL 1 */}
              <div className="space-y-3 border-b pb-4">
                <h3 className="font-bold text-slate-900 text-sm">BAB II AKUNTABILITAS KINERJA</h3>
                <p className="text-xs text-slate-600">Tabel 1. Rincian kegiatan operator layanan operasional periode {selectedTahun}.</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800">
                        <th className="border border-slate-300 p-2 text-center">No</th>
                        <th className="border border-slate-300 p-2">Tanggal</th>
                        <th className="border border-slate-300 p-2">Waktu</th>
                        <th className="border border-slate-300 p-2">Uraian Pekerjaan</th>
                        <th className="border border-slate-300 p-2">Lokasi/Blok</th>
                        <th className="border border-slate-300 p-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logbooks.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                          <td className="border border-slate-300 p-2 whitespace-nowrap">{item.tanggal}</td>
                          <td className="border border-slate-300 p-2 whitespace-nowrap">{item.waktuMulai ? `${item.waktuMulai} - ${item.waktuSelesai}` : '-'}</td>
                          <td className="border border-slate-300 p-2">{item.rincian}</td>
                          <td className="border border-slate-300 p-2">{item.lokasi || '-'}</td>
                          <td className="border border-slate-300 p-2 text-center font-semibold text-emerald-700">{item.kehadiran}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BAB III */}
              <div className="space-y-2 text-xs text-slate-800 pt-2">
                <h3 className="font-bold text-slate-900 text-sm">BAB III PENUTUP</h3>
                <p className="leading-relaxed">
                  Pelaksanaan tugas PPPK Paruh Waktu jabatan Operator Layanan Operasional telah mendukung kelancaran operasional KPS PVT I Manoko secara tertib dan efektif.
                </p>
                <div className="pt-4 text-right">
                  <p>Bandung Barat, 30 September {selectedTahun}</p>
                  <p className="font-bold mt-8">Riki Subagja</p>
                  <p className="text-slate-500">NIP. 199808272025211042</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: HALAMAN UNDUHAN & EKSPOR (WORD, PDF, PRINT, DRIVE)   */}
        {/* ========================================================= */}
        {activeTab === 'unduhan' && (
          <div className="space-y-5">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4">
              <div>
                <h2 className="text-base font-bold text-white mb-1">📥 Unduhan & Ekspor Laporan</h2>
                <p className="text-xs text-slate-400">
                  Pilih format dokumen untuk menyimpan atau membagikan Laporan Kinerja PVT I Manoko.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => alert('Memproses unduhan Word (.docx)...')}
                  className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs flex items-center justify-between shadow transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">📘</span>
                    <div className="text-left">
                      <p className="font-bold">Unduh Format Word</p>
                      <p className="text-[10px] text-blue-100">Ekspor berkas .docx Laporan A4</p>
                    </div>
                  </div>
                  <span>➔</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Memproses cetak PDF...')}
                  className="p-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold text-xs flex items-center justify-between shadow transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">📕</span>
                    <div className="text-left">
                      <p className="font-bold">Cetak Dokumen PDF</p>
                      <p className="text-[10px] text-rose-100">Ekspor dokumen siap cetak PDF</p>
                    </div>
                  </div>
                  <span>➔</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-bold text-xs flex items-center justify-between shadow transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🖨️</span>
                    <div className="text-left">
                      <p className="font-bold">Cetak Langsung (Print)</p>
                      <p className="text-[10px] text-slate-300">Kirim ke printer lokal</p>
                    </div>
                  </div>
                  <span>➔</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Sinkronisasi Google Drive & Gmail aktif')}
                  className="p-4 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex items-center justify-between shadow transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">☁️</span>
                    <div className="text-left">
                      <p className="font-bold">Gmail & Google Drive</p>
                      <p className="text-[10px] text-emerald-200">Sinkronisasi Cloud Backup</p>
                    </div>
                  </div>
                  <span>➔</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
