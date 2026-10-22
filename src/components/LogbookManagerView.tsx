import React, { useState, useMemo, useRef } from 'react';
import { AttendanceStatus, DailyLogbookEntry, PeriodType } from '../types';
import { ATTENDANCE_OPTIONS } from '../data/defaultLogbookEntries';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Edit3,
  Camera,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Upload,
  ArrowRight,
  Check,
  X,
  UserCheck,
  HeartPulse,
  Palmtree,
  Building,
  Eye,
} from 'lucide-react';

interface LogbookManagerViewProps {
  entries: DailyLogbookEntry[];
  onAddEntry: (entry: DailyLogbookEntry) => void;
  onUpdateEntry: (entry: DailyLogbookEntry) => void;
  onDeleteEntry: (id: string) => void;
  onNavigateToReport: () => void;
  selectedMonth: number;
  selectedQuarter: number;
  selectedYear: number;
}

export const LogbookManagerView: React.FC<LogbookManagerViewProps> = ({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onNavigateToReport,
  selectedMonth,
  selectedQuarter,
  selectedYear,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [kehadiran, setKehadiran] = useState<AttendanceStatus>('WFO');
  const [tanggal, setTanggal] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [jamMulai, setJamMulai] = useState('07:30');
  const [jamSelesai, setJamSelesai] = useState('11:30');
  const [lokasiBlok, setLokasiBlok] = useState('Blok C7 Manoko');
  const [uraianPekerjaan, setUraianPekerjaan] = useState('');
  const [luasLokasi, setLuasLokasi] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [fotoSebelumUrl, setFotoSebelumUrl] = useState('');
  const [fotoSesudahUrl, setFotoSesudahUrl] = useState('');
  const [fotoSuratSakitUrl, setFotoSuratSakitUrl] = useState('');
  const [fotoTitle, setFotoTitle] = useState('');
  const [showInReport, setShowInReport] = useState(true);

  // Lightbox preview modal
  const [previewModalImg, setPreviewModalImg] = useState<{ url: string; title: string } | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKehadiranFilter, setSelectedKehadiranFilter] = useState<string>('ALL');
  const [periodFilter, setPeriodFilter] = useState<'ALL' | 'CURRENT_MONTH' | 'CURRENT_QUARTER'>('ALL');

  const fileInputSebelumRef = useRef<HTMLInputElement>(null);
  const fileInputSesudahRef = useRef<HTMLInputElement>(null);
  const fileInputSuratSakitRef = useRef<HTMLInputElement>(null);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      if (selectedKehadiranFilter !== 'ALL' && item.kehadiran !== selectedKehadiranFilter) {
        return false;
      }

      if (periodFilter === 'CURRENT_MONTH') {
        const itemDate = new Date(item.tanggal);
        if (itemDate.getMonth() + 1 !== selectedMonth || itemDate.getFullYear() !== selectedYear) {
          return false;
        }
      } else if (periodFilter === 'CURRENT_QUARTER') {
        const itemDate = new Date(item.tanggal);
        const itemQuarter = Math.floor(itemDate.getMonth() / 3) + 1;
        if (itemQuarter !== selectedQuarter || itemDate.getFullYear() !== selectedYear) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchUraian = item.uraianPekerjaan.toLowerCase().includes(q);
        const matchKehadiran = item.kehadiran.toLowerCase().includes(q);
        const matchLokasi = (item.lokasiBlok || '').toLowerCase().includes(q);
        const matchLuas = (item.luasLokasi || '').toLowerCase().includes(q);
        return matchUraian || matchKehadiran || matchLokasi || matchLuas;
      }

      return true;
    });
  }, [entries, selectedKehadiranFilter, periodFilter, searchQuery, selectedMonth, selectedQuarter, selectedYear]);

  // Sort by date descending
  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [filteredEntries]);

  // Upload Handlers
  const handleUploadSebelum = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoSebelumUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSesudah = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoSesudahUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSuratSakit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoSuratSakitUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (entry: DailyLogbookEntry) => {
    setEditingId(entry.id);
    setKehadiran(entry.kehadiran || 'WFO');
    setTanggal(entry.tanggal);
    setJamMulai(entry.jamMulai || '07:30');
    setJamSelesai(entry.jamSelesai || '11:30');
    setLokasiBlok(entry.lokasiBlok || '');
    setUraianPekerjaan(entry.uraianPekerjaan);
    setLuasLokasi(entry.luasLokasi || '');
    setKeterangan(entry.keterangan || '');
    setFotoSebelumUrl(entry.fotoSebelumUrl || '');
    setFotoSesudahUrl(entry.fotoSesudahUrl || entry.fotoUrl || '');
    setFotoSuratSakitUrl(entry.fotoSuratSakitUrl || '');
    setFotoTitle(entry.fotoTitle || '');
    setShowInReport(entry.showInReport ?? true);
    setShowAddForm(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setKehadiran('WFO');
    setTanggal(new Date().toISOString().split('T')[0]);
    setJamMulai('07:30');
    setJamSelesai('11:30');
    setLokasiBlok('Blok C7 Manoko');
    setUraianPekerjaan('');
    setLuasLokasi('');
    setKeterangan('');
    setFotoSebelumUrl('');
    setFotoSesudahUrl('');
    setFotoSuratSakitUrl('');
    setFotoTitle('');
    setShowInReport(true);
    setShowAddForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uraianPekerjaan.trim()) return;

    const primaryPhoto =
      kehadiran === 'Sakit'
        ? fotoSuratSakitUrl.trim() || undefined
        : fotoSesudahUrl.trim() || fotoSebelumUrl.trim() || undefined;

    if (editingId) {
      const updated: DailyLogbookEntry = {
        id: editingId,
        kehadiran,
        tanggal,
        jamMulai: kehadiran === 'WFO' ? jamMulai : undefined,
        jamSelesai: kehadiran === 'WFO' ? jamSelesai : undefined,
        lokasiBlok: kehadiran === 'WFO' ? lokasiBlok : '-',
        uraianPekerjaan: uraianPekerjaan.trim(),
        luasLokasi: kehadiran === 'WFO' ? luasLokasi.trim() : '-',
        keterangan: keterangan.trim(),
        fotoUrl: primaryPhoto,
        fotoSebelumUrl: kehadiran === 'WFO' ? (fotoSebelumUrl.trim() || undefined) : undefined,
        fotoSesudahUrl: kehadiran === 'WFO' ? (fotoSesudahUrl.trim() || undefined) : undefined,
        fotoSuratSakitUrl: kehadiran === 'Sakit' ? (fotoSuratSakitUrl.trim() || undefined) : undefined,
        fotoTitle: fotoTitle.trim() || undefined,
        showInReport,
      };
      onUpdateEntry(updated);
    } else {
      const newEntry: DailyLogbookEntry = {
        id: `entry-${Date.now()}`,
        kehadiran,
        tanggal,
        jamMulai: kehadiran === 'WFO' ? jamMulai : undefined,
        jamSelesai: kehadiran === 'WFO' ? jamSelesai : undefined,
        lokasiBlok: kehadiran === 'WFO' ? lokasiBlok : '-',
        uraianPekerjaan: uraianPekerjaan.trim(),
        luasLokasi: kehadiran === 'WFO' ? luasLokasi.trim() : '-',
        keterangan: keterangan.trim(),
        fotoUrl: primaryPhoto,
        fotoSebelumUrl: kehadiran === 'WFO' ? (fotoSebelumUrl.trim() || undefined) : undefined,
        fotoSesudahUrl: kehadiran === 'WFO' ? (fotoSesudahUrl.trim() || undefined) : undefined,
        fotoSuratSakitUrl: kehadiran === 'Sakit' ? (fotoSuratSakitUrl.trim() || undefined) : undefined,
        fotoTitle: fotoTitle.trim() || undefined,
        showInReport,
      };
      onAddEntry(newEntry);
    }

    resetForm();
  };

  const formatDisplayDate = (dStr: string) => {
    try {
      const parts = dStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
      return dStr;
    } catch {
      return dStr;
    }
  };

  return (
    // DIUBAH: w-full px-1 sm:px-4 agar di HP memenuhi layar kiri-kanan secara maksimal
    <div className="w-full max-w-7xl mx-auto px-1 sm:px-4 py-4 space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-400/30">
            <Calendar className="w-3.5 h-3.5" />
            <span>Sistem Pencatatan Logbook Kinerja</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Input & Catatan Logbook Harian
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
            Catat kehadiran (WFO, Sakit, Cuti) dan pelaksanaan tugas harian di Kebun PVT I Manoko.
            Seluruh data akan <strong>otomatis terangkum ke dalam Laporan Kinerja A4</strong> (Bulanan, Triwulan, Tahunan).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (showAddForm && !editingId) {
                setShowAddForm(false);
              } else {
                resetForm();
                setShowAddForm(true);
              }
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Tutup Form' : 'Isi Logbook Baru'}</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToReport}
            className="w-full sm:w-auto px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-300" />
            <span>Buka Laporan A4 Terkompilasi</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </button>
        </div>
      </div>

      {/* FORM LOGBOOK DIPERLEBAR & PADDING KIRI-KANAN DIOPTIMALKAN */}
      {showAddForm && (
        <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-emerald-500/80 shadow-xl overflow-hidden animate-in fade-in duration-200 w-full">
          <div className="bg-emerald-50/80 px-3 sm:px-6 py-3.5 border-b border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 sm:p-2 bg-emerald-600 text-white rounded-lg shadow-xs">
                <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {editingId ? 'Edit Catatan Logbook' : 'Form Input Logbook Kinerja Harian'}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600">
                  Pilih kehadiran (WFO, Sakit, Cuti), tanggal kegiatan, dan rincian pekerjaan
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Padding form dibuat ramping di HP (p-3) agar input lebar */}
          <form onSubmit={handleSubmit} className="p-3 sm:p-6 space-y-4 text-xs">
            {/* KOTAK WFO, SAKIT, CUTI (TEKS HITAM PEKAT & PROPORSIONAL) */}
            <div className="bg-slate-50/90 p-2.5 sm:p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="block font-black text-xs sm:text-sm" style={{ color: '#000000' }}>
                Kehadiran <span className="text-rose-600">*</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                {ATTENDANCE_OPTIONS.map((opt) => {
                  const isSelected = kehadiran === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setKehadiran(opt)}
                      style={{ color: '#000000' }}
                      className={`py-2.5 px-1 sm:px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer border-2 shadow-xs ${
                        isSelected
                          ? opt === 'WFO'
                            ? 'bg-emerald-300 border-emerald-700 ring-2 ring-emerald-500/50'
                            : opt === 'Sakit'
                            ? 'bg-amber-300 border-amber-700 ring-2 ring-amber-500/50'
                            : 'bg-sky-300 border-blue-700 ring-2 ring-blue-500/50'
                          : 'bg-white border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {opt === 'WFO' && (
                        <Building
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]"
                          style={{ color: '#000000', stroke: '#000000' }}
                        />
                      )}
                      {opt === 'Sakit' && (
                        <HeartPulse
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]"
                          style={{ color: '#000000', stroke: '#000000' }}
                        />
                      )}
                      {opt === 'Cuti' && (
                        <Palmtree
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]"
                          style={{ color: '#000000', stroke: '#000000' }}
                        />
                      )}
                      <span
                        style={{
                          color: '#000000',
                          fontWeight: 900,
                        }}
                        className="text-[11px] sm:text-sm font-black"
                      >
                        {opt === 'WFO' ? 'WFO (Hadir)' : opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tanggal Kegiatan & Waktu */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Tanggal Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600 font-medium bg-white"
                  required
                />
              </div>

              {kehadiran === 'WFO' ? (
                <>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Jam Mulai
                    </label>
                    <input
                      type="time"
                      value={jamMulai}
                      onChange={(e) => setJamMulai(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Jam Selesai
                    </label>
                    <input
                      type="time"
                      value={jamSelesai}
                      onChange={(e) => setJamSelesai(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600 bg-white"
                    />
                  </div>
                </>
              ) : (
                <div
                  className="col-span-2 flex items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-xs italic font-bold"
                  style={{ color: '#000000' }}
                >
                  Status {kehadiran}: Jam operasional lapangan tidak berlaku.
                </div>
              )}
            </div>

            {/* Lokasi Blok Kebun (Hanya WFO) */}
            {kehadiran === 'WFO' && (
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Lokasi / Blok Kebun
                </label>
                <input
                  type="text"
                  placeholder="Misal: Blok C7 (sekitar screen house), Blok C4, Blok C1, Aula"
                  value={lokasiBlok}
                  onChange={(e) => setLokasiBlok(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600 bg-white"
                />
              </div>
            )}

            {/* Uraian Pekerjaan / Keterangan Sakit / Cuti */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                {kehadiran === 'WFO'
                  ? 'Rincian Uraian Pekerjaan'
                  : kehadiran === 'Sakit'
                  ? 'Keterangan Sakit'
                  : 'Keterangan Cuti'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder={
                  kehadiran === 'WFO'
                    ? 'Jelaskan secara detail pekerjaan operasional yang dilaksanakan...'
                    : kehadiran === 'Sakit'
                    ? 'Tuliskan keterangan sakit atau istirahat dokter (misal: Sakit flu dan demam, istirahat dokter 1 hari)...'
                    : 'Tuliskan jenis atau keperluan cuti (misal: Cuti tahunan, keperluan keluarga)...'
                }
                value={uraianPekerjaan}
                onChange={(e) => setUraianPekerjaan(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600 text-xs leading-relaxed bg-white"
                required
              />
            </div>

            {/* Luas Lokasi (m²) & Catatan Kondisi (Hanya jika WFO) */}
            {kehadiran === 'WFO' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Luas Lokasi Pekerjaan (m²)
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: 500 m² atau kosongi / isi (-)"
                    value={luasLokasi}
                    onChange={(e) => setLuasLokasi(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600 bg-white"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Apabila tidak diketahui atau bukan lahan, bisa diisi simbol (-).
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Keterangan Tambahan / Catatan Kondisi
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Kondisi tanah gembur, cuaca cerah"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600 bg-white"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {kehadiran === 'Sakit' ? 'Catatan Tambahan Sakit (Opsional)' : 'Keterangan Izin Cuti (Opsional)'}
                </label>
                <input
                  type="text"
                  placeholder={
                    kehadiran === 'Sakit'
                      ? 'Misal: Istirahat dokter 1 hari, kontrol ke klinik'
                      : 'Misal: Keperluan keluarga mendesak / cuti tahunan'
                  }
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-emerald-600 bg-white"
                />
              </div>
            )}

            {/* Bukti Foto Surat Keterangan Sakit (Hanya jika Sakit) */}
            {kehadiran === 'Sakit' && (
              <div className="p-3 sm:p-4 bg-amber-50/80 rounded-xl border-2 border-amber-300 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-2">
                  <span className="font-bold text-amber-950 flex items-center space-x-2 text-xs sm:text-sm">
                    <HeartPulse className="w-4 h-4 text-amber-600" />
                    <span>Foto Surat Sakit (Dokter / Klinik)</span>
                  </span>
                  <label className="flex items-center space-x-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={showInReport}
                      onChange={(e) => setShowInReport(e.target.checked)}
                      className="w-3.5 h-3.5 text-amber-600 rounded focus:ring-amber-500"
                    />
                    <span className="text-[10.5px] font-semibold text-amber-900">
                      Lampirkan ke Laporan A4
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                  <div className="space-y-2">
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Lampirkan foto lembar surat dokter sebagai bukti sah izin sakit.
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputSuratSakitRef.current?.click()}
                        className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center space-x-1.5 cursor-pointer text-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Surat Sakit</span>
                      </button>
                      <input
                        ref={fileInputSuratSakitRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUploadSuratSakit}
                        className="hidden"
                      />

                      {fotoSuratSakitUrl && (
                        <button
                          type="button"
                          onClick={() => setFotoSuratSakitUrl('')}
                          className="px-2 py-1.5 bg-white hover:bg-rose-50 text-rose-700 rounded-lg font-semibold border border-rose-300 text-xs"
                        >
                          Hapus
                        </button>
                      )}
                    </div>

                    <div>
                      <input
                        type="url"
                        placeholder="Atau tempel URL foto surat sakit..."
                        value={fotoSuratSakitUrl}
                        onChange={(e) => setFotoSuratSakitUrl(e.target.value)}
                        className="w-full border border-amber-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-amber-600 bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    {fotoSuratSakitUrl ? (
                      <div className="relative aspect-[4/3] max-h-40 rounded-xl overflow-hidden border-2 border-amber-400 bg-white">
                        <img
                          src={fotoSuratSakitUrl}
                          alt="Surat Sakit"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputSuratSakitRef.current?.click()}
                        className="border-2 border-dashed border-amber-300 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-amber-100/60 h-28 bg-amber-50/40"
                      >
                        <Camera className="w-6 h-6 text-amber-600 mb-1" />
                        <span className="text-[11px] font-bold text-amber-900">
                          Klik untuk Upload Foto Surat Sakit
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Foto Sebelum & Sesudah Kegiatan (Hanya jika WFO) */}
            {kehadiran === 'WFO' && (
              <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800 flex items-center space-x-1.5 text-xs sm:text-sm">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Foto Sebelum & Sesudah (0% & 100%)</span>
                  </span>
                  <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={showInReport}
                      onChange={(e) => setShowInReport(e.target.checked)}
                      className="w-3.5 h-3.5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-[10.5px] font-semibold text-emerald-900">
                      Masuk Tabel 2 Laporan
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Foto Sebelum */}
                  <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 text-[11px] flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Foto SEBELUM (0%)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputSebelumRef.current?.click()}
                        className="px-2 py-1 bg-white hover:bg-amber-100 text-amber-900 rounded-md font-semibold border border-amber-300 flex items-center space-x-1 text-[10.5px]"
                      >
                        <Upload className="w-3 h-3 text-amber-700" />
                        <span>Upload</span>
                      </button>
                      <input
                        ref={fileInputSebelumRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUploadSebelum}
                        className="hidden"
                      />
                    </div>

                    <input
                      type="url"
                      placeholder="Atau tempel URL foto sebelum..."
                      value={fotoSebelumUrl}
                      onChange={(e) => setFotoSebelumUrl(e.target.value)}
                      className="w-full border border-amber-300 rounded-lg px-2 py-1.5 text-slate-900 bg-white text-xs"
                    />

                    {fotoSebelumUrl && (
                      <div className="relative aspect-[4/3] max-h-32 rounded-lg overflow-hidden border border-amber-300">
                        <img src={fotoSebelumUrl} alt="Sebelum" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Foto Sesudah */}
                  <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 text-[11px] flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Foto SESUDAH (100%)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputSesudahRef.current?.click()}
                        className="px-2 py-1 bg-white hover:bg-emerald-100 text-emerald-900 rounded-md font-semibold border border-emerald-300 flex items-center space-x-1 text-[10.5px]"
                      >
                        <Upload className="w-3 h-3 text-emerald-700" />
                        <span>Upload</span>
                      </button>
                      <input
                        ref={fileInputSesudahRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUploadSesudah}
                        className="hidden"
                      />
                    </div>

                    <input
                      type="url"
                      placeholder="Atau tempel URL foto sesudah..."
                      value={fotoSesudahUrl}
                      onChange={(e) => setFotoSesudahUrl(e.target.value)}
                      className="w-full border border-emerald-300 rounded-lg px-2 py-1.5 text-slate-900 bg-white text-xs"
                    />

                    {fotoSesudahUrl && (
                      <div className="relative aspect-[4/3] max-h-32 rounded-lg overflow-hidden border border-emerald-300">
                        <img src={fotoSesudahUrl} alt="Sesudah" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm flex items-center space-x-1.5 transition-all active:scale-98 cursor-pointer text-xs"
              >
                <Check className="w-4 h-4" />
                <span>{editingId ? 'Simpan Pembaruan' : 'Simpan ke Buku Logbook'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kegiatan, status, atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600 focus:bg-white bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedKehadiranFilter}
              onChange={(e) => setSelectedKehadiranFilter(e.target.value)}
              style={{ color: '#000000', fontWeight: 800 }}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white flex-1 sm:flex-initial"
            >
              <option value="ALL" style={{ color: '#000000' }}>Semua Kehadiran ({entries.length})</option>
              {ATTENDANCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} style={{ color: '#000000' }}>
                  {opt === 'WFO' ? '🏢 WFO (Hadir)' : opt === 'Sakit' ? '🏥 Sakit' : '🌴 Cuti'}
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setPeriodFilter('ALL')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                  periodFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setPeriodFilter('CURRENT_MONTH')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                  periodFilter === 'CURRENT_MONTH'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bulan Ini
              </button>
              <button
                type="button"
                onClick={() => setPeriodFilter('CURRENT_QUARTER')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                  periodFilter === 'CURRENT_QUARTER'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Triwulan Ini
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Menampilkan <strong>{sortedEntries.length}</strong> dari {entries.length} entri
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-emerald-700 hover:underline font-medium cursor-pointer"
            >
              Hapus Filter
            </button>
          )}
        </div>
      </div>

      {/* Logbook Entries List */}
      <div className="space-y-2.5">
        {sortedEntries.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-xl border border-dashed border-slate-300 text-slate-500 space-y-2.5">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="font-semibold text-slate-700 text-sm">Tidak ada catatan ditemukan</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Cobalah ubah filter pencarian atau tambahkan catatan baru.
            </p>
          </div>
        ) : (
          sortedEntries.map((entry) => {
            const hasBeforeAndAfter =
              Boolean(entry.fotoSebelumUrl) && Boolean(entry.fotoSesudahUrl);

            const isWFO = (entry.kehadiran || 'WFO') === 'WFO';
            const isSakit = entry.kehadiran === 'Sakit';
            const isCuti = entry.kehadiran === 'Cuti';

            return (
              <div
                key={entry.id}
                className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-2xs space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-100 pb-2">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="inline-flex items-center space-x-1 font-bold text-slate-900 text-xs sm:text-sm">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{formatDisplayDate(entry.tanggal)}</span>
                    </span>

                    {isWFO && (
                      <span
                        style={{ color: '#000000', fontWeight: 900 }}
                        className="inline-flex items-center space-x-1 text-[10.5px] bg-emerald-200 border-2 border-emerald-500 px-2 py-0.5 rounded-md"
                      >
                        <Building
                          className="w-3 h-3 stroke-[2.5]"
                          style={{ color: '#000000', stroke: '#000000' }}
                        />
                        <span style={{ color: '#000000' }}>WFO</span>
                      </span>
                    )}
                    {isSakit && (
                      <span
                        style={{ color: '#000000', fontWeight: 900 }}
                        className="inline-flex items-center space-x-1 text-[10.5px] bg-amber-200 border-2 border-amber-500 px-2 py-0.5 rounded-md"
                      >
                        <HeartPulse
                          className="w-3 h-3 stroke-[2.5]"
                          style={{ color: '#000000', stroke: '#000000' }}
                        />
                        <span style={{ color: '#000000' }}>Sakit</span>
                      </span>
                    )}
                    {isCuti && (
                      <span
                        style={{ color: '#000000', fontWeight: 900 }}
                        className="inline-flex items-center space-x-1 text-[10.5px] bg-blue-200 border-2 border-blue-500 px-2 py-0.5 rounded-md"
                      >
                        <Palmtree
                          className="w-3 h-3 stroke-[2.5]"
                          style={{ color: '#000000', stroke: '#000000' }}
                        />
                        <span style={{ color: '#000000' }}>Cuti</span>
                      </span>
                    )}

                    {isWFO && (entry.jamMulai || entry.jamSelesai) && (
                      <span className="inline-flex items-center space-x-1 text-[10.5px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>
                          {entry.jamMulai || '07:30'} - {entry.jamSelesai || '11:30'}
                        </span>
                      </span>
                    )}

                    {isWFO && entry.lokasiBlok && (
                      <span className="inline-flex items-center space-x-1 text-[10.5px] text-slate-800 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-200">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{entry.lokasiBlok}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleEditClick(entry)}
                      className="p-1 text-slate-500 hover:text-emerald-700 rounded-lg text-xs flex items-center space-x-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 items-start justify-between">
                  <div className="flex-1 space-y-1.5 text-xs leading-relaxed">
                    <p className="text-slate-800 font-normal text-justify">
                      {entry.uraianPekerjaan}
                    </p>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500 pt-0.5">
                      {isWFO && (
                        <div className="flex items-center space-x-1">
                          <strong className="text-slate-700">Luas:</strong>
                          <span className="text-emerald-800 font-medium bg-emerald-50/60 px-1 py-0.5 rounded">
                            {entry.luasLokasi && entry.luasLokasi.trim() !== '' ? entry.luasLokasi : '-'}
                          </span>
                        </div>
                      )}
                      {entry.keterangan && (
                        <div className="flex items-center space-x-1">
                          <strong className="text-slate-700">Keterangan:</strong>
                          <span>{entry.keterangan}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Foto Thumbnail */}
                  {isWFO && hasBeforeAndAfter ? (
                    <div className="shrink-0 flex items-center gap-1.5">
                      <div
                        onClick={() =>
                          setPreviewModalImg({
                            url: entry.fotoSebelumUrl!,
                            title: `Sebelum (${formatDisplayDate(entry.tanggal)})`,
                          })
                        }
                        className="w-20 aspect-[4/3] rounded-lg overflow-hidden border border-amber-300 relative cursor-pointer"
                      >
                        <img src={entry.fotoSebelumUrl} alt="Sebelum" className="w-full h-full object-cover" />
                        <span className="absolute top-0.5 left-0.5 bg-amber-800 text-white text-[7px] font-bold px-1 rounded uppercase">
                          0%
                        </span>
                      </div>
                      <div
                        onClick={() =>
                          setPreviewModalImg({
                            url: entry.fotoSesudahUrl!,
                            title: `Sesudah (${formatDisplayDate(entry.tanggal)})`,
                          })
                        }
                        className="w-20 aspect-[4/3] rounded-lg overflow-hidden border border-emerald-400 relative cursor-pointer"
                      >
                        <img src={entry.fotoSesudahUrl} alt="Sesudah" className="w-full h-full object-cover" />
                        <span className="absolute top-0.5 left-0.5 bg-emerald-800 text-white text-[7px] font-bold px-1 rounded uppercase">
                          100%
                        </span>
                      </div>
                    </div>
                  ) : isWFO && (entry.fotoUrl || entry.fotoSesudahUrl || entry.fotoSebelumUrl) ? (
                    <div
                      onClick={() =>
                        setPreviewModalImg({
                          url: (entry.fotoSesudahUrl || entry.fotoUrl || entry.fotoSebelumUrl)!,
                          title: `Foto (${formatDisplayDate(entry.tanggal)})`,
                        })
                      }
                      className="shrink-0 w-24 aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 relative cursor-pointer"
                    >
                      <img
                        src={entry.fotoSesudahUrl || entry.fotoUrl || entry.fotoSebelumUrl}
                        alt="Foto kegiatan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : isSakit && entry.fotoSuratSakitUrl ? (
                    <div
                      onClick={() =>
                        setPreviewModalImg({
                          url: entry.fotoSuratSakitUrl!,
                          title: `Surat Sakit (${formatDisplayDate(entry.tanggal)})`,
                        })
                      }
                      className="shrink-0 w-24 aspect-[4/3] rounded-lg overflow-hidden border-2 border-amber-400 cursor-pointer"
                    >
                      <img src={entry.fotoSuratSakitUrl} alt="Surat Sakit" className="w-full h-full object-cover" />
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Lightbox Modal */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col text-white">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800">
              <span className="font-semibold text-xs truncate pr-2">
                {previewModalImg.title}
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center bg-black/40 overflow-auto max-h-[70vh]">
              <img
                src={previewModalImg.url}
                alt={previewModalImg.title}
                className="max-w-full max-h-[65vh] object-contain rounded"
              />
            </div>
            <div className="px-4 py-2.5 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
