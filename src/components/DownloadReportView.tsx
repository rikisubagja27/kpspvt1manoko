import React from 'react';
import { User } from 'firebase/auth';
import {
  FileDown,
  Download,
  Printer,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Cloud,
  Layers,
  Building,
  UserCheck,
  Camera,
  HeartPulse,
  Palmtree,
  ExternalLink,
} from 'lucide-react';
import {
  DailyLogbookEntry,
  DocumentationPhoto,
  PeriodActivityRow,
  PeriodType,
  UserProfile,
} from '../types';
import { MONTH_NAMES, QUARTER_INFO } from '../data/defaultData';

interface DownloadReportViewProps {
  periodType: PeriodType;
  setPeriodType: (type: PeriodType) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedQuarter: number;
  setSelectedQuarter: (quarter: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  periodTitleCaps: string;
  periodLabelNormal: string;
  defaultEndDate: string;
  activeSummary: { badge: string; sub: string };
  profile: UserProfile;
  logbookEntries: DailyLogbookEntry[];
  activities: PeriodActivityRow[];
  photos: DocumentationPhoto[];
  onExportWord: () => Promise<void>;
  onExportPdf: () => Promise<void>;
  onPrint: () => void;
  onNavigateToReport: () => void;
  onNavigateToLogbook: () => void;
  onOpenGoogleDriveModal: () => void;
  currentUser: User | null;
  isExportingWord: boolean;
  isExportingPdf: boolean;
}

export const DownloadReportView: React.FC<DownloadReportViewProps> = ({
  periodType,
  setPeriodType,
  selectedMonth,
  setSelectedMonth,
  selectedQuarter,
  setSelectedQuarter,
  selectedYear,
  setSelectedYear,
  periodTitleCaps,
  periodLabelNormal,
  defaultEndDate,
  activeSummary,
  profile,
  logbookEntries,
  activities,
  photos,
  onExportWord,
  onExportPdf,
  onPrint,
  onNavigateToReport,
  onNavigateToLogbook,
  onOpenGoogleDriveModal,
  currentUser,
  isExportingWord,
  isExportingPdf,
}) => {
  // Statistics of logbook entries matching the selected period
  const periodFilteredEntries = logbookEntries.filter((item) => {
    const itemDate = new Date(item.tanggal);
    if (periodType === 'bulanan') {
      return (
        itemDate.getMonth() + 1 === selectedMonth &&
        itemDate.getFullYear() === selectedYear
      );
    }
    if (periodType === 'triwulan') {
      const q = Math.floor(itemDate.getMonth() / 3) + 1;
      return q === selectedQuarter && itemDate.getFullYear() === selectedYear;
    }
    // Tahunan
    return itemDate.getFullYear() === selectedYear;
  });

  const wfoCount = periodFilteredEntries.filter(
    (e) => (e.kehadiran || 'WFO') === 'WFO'
  ).length;
  const sakitCount = periodFilteredEntries.filter(
    (e) => e.kehadiran === 'Sakit'
  ).length;
  const cutiCount = periodFilteredEntries.filter(
    (e) => e.kehadiran === 'Cuti'
  ).length;
  const photosWithEvidence = periodFilteredEntries.filter(
    (e) =>
      Boolean(e.fotoSebelumUrl) ||
      Boolean(e.fotoSesudahUrl) ||
      Boolean(e.fotoSuratSakitUrl) ||
      Boolean(e.fotoUrl)
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-blue-400/30">
              <FileDown className="w-4 h-4 text-blue-400" />
              <span>Pusat Unduh Dokumen Laporan Kinerja</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Unduh Laporan Kinerja (Word & PDF)
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Halaman khusus untuk mengunduh laporan kinerja dalam format{' '}
              <strong className="text-blue-300">Microsoft Word (.docx)</strong> dan{' '}
              <strong className="text-rose-300">Adobe PDF (.pdf)</strong>. Laporan
              disusun secara otomatis untuk periode{' '}
              <span className="font-semibold text-white">Bulanan</span>,{' '}
              <span className="font-semibold text-white">Triwulan</span>, maupun{' '}
              <span className="font-semibold text-white">Tahunan</span> sesuai standar
              Kementerian Pertanian RI.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onNavigateToReport}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs sm:text-sm font-semibold border border-slate-700 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Pratinjau Lembar A4</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={onNavigateToLogbook}
              className="px-4 py-2.5 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              <span>Kembali ke Buku Logbook</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 1: Period Selection Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pilih Periode Laporan yang Ingin Diunduh
              </h2>
              <p className="text-xs text-slate-500">
                Pilih apakah laporan yang ingin diunduh adalah Laporan Triwulan, Laporan Bulanan, atau Laporan Tahunan.
              </p>
            </div>
          </div>

          {/* Current Period Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Aktif: {activeSummary.badge}</span>
          </div>
        </div>

        {/* Period Type Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Triwulan Button */}
          <button
            type="button"
            onClick={() => setPeriodType('triwulan')}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer relative ${
              periodType === 'triwulan'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-300'
                : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
            }`}
          >
            {periodType === 'triwulan' && (
              <span className="absolute top-3 right-3 text-indigo-600">
                <CheckCircle2 className="w-5 h-5 fill-indigo-600 text-white" />
              </span>
            )}
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm mb-1">
              <Layers className="w-4 h-4" />
              <span>Laporan Triwulan</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Laporan kinerja per 3 bulan (Triwulan I, II, III, IV) lengkap dengan rangkuman kegiatan dan dokumentasi foto.
            </p>
          </button>

          {/* Bulanan Button */}
          <button
            type="button"
            onClick={() => setPeriodType('bulanan')}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer relative ${
              periodType === 'bulanan'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-300'
                : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
            }`}
          >
            {periodType === 'bulanan' && (
              <span className="absolute top-3 right-3 text-indigo-600">
                <CheckCircle2 className="w-5 h-5 fill-indigo-600 text-white" />
              </span>
            )}
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm mb-1">
              <Calendar className="w-4 h-4" />
              <span>Laporan Bulanan</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Laporan pelaksanaan tugas bulanan (Januari s.d. Desember) berisi rincian mingguan dan kehadiran harian.
            </p>
          </button>

          {/* Tahunan Button */}
          <button
            type="button"
            onClick={() => setPeriodType('tahunan')}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer relative ${
              periodType === 'tahunan'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-300'
                : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
            }`}
          >
            {periodType === 'tahunan' && (
              <span className="absolute top-3 right-3 text-indigo-600">
                <CheckCircle2 className="w-5 h-5 fill-indigo-600 text-white" />
              </span>
            )}
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm mb-1">
              <Clock className="w-4 h-4" />
              <span>Laporan Tahunan</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rekapitulasi capaian kinerja operasional sepanjang 1 tahun penuh di Kebun PVT I Manoko.
            </p>
          </button>
        </div>

        {/* Sub-selector for Quarters / Months & Year */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 mr-1">Pilih Detail:</span>

            {/* Triwulan selector */}
            {periodType === 'triwulan' && (
              <div className="flex flex-wrap gap-1.5">
                {QUARTER_INFO.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setSelectedQuarter(q.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedQuarter === q.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{q.name}</span>
                    <span className="text-[10px] opacity-80 ml-1 hidden sm:inline">
                      ({q.range})
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Bulanan selector */}
            {periodType === 'bulanan' && (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-indigo-600 cursor-pointer shadow-xs"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx + 1}>
                    Bulan {m}
                  </option>
                ))}
              </select>
            )}

            {/* Tahunan label */}
            {periodType === 'tahunan' && (
              <span className="text-xs font-medium text-slate-600">
                Rekapitulasi tahunan sepanjang 12 bulan
              </span>
            )}
          </div>

          {/* Year selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700">Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-indigo-600 cursor-pointer shadow-xs"
            >
              {[2024, 2025, 2026, 2027, 2028].map((y) => (
                <option key={y} value={y}>
                  Tahun {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Step 2: Download Action Cards (Format Word & Format PDF) */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Pilih Format File yang Ingin Diunduh
            </h2>
            <p className="text-xs text-slate-500">
              Unduh dalam format Word (.docx) untuk diedit atau format PDF (.pdf) untuk langsung dicetak dan diarsipkan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Microsoft Word (.docx) - High Priority */}
          <div className="bg-white rounded-2xl border-2 border-blue-500 shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-xs">
              Pilihan Utama
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <FileDown className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <span>Format Microsoft Word</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      .docx
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dokumen Word lengkap, terformat rapi dan siap diedit
                  </p>
                </div>
              </div>

              <div className="bg-blue-50/70 rounded-xl p-3.5 border border-blue-100 space-y-2 text-xs text-slate-700">
                <p className="font-semibold text-blue-900 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Isi Dokumen Word yang Diunduh:</span>
                </p>
                <ul className="space-y-1.5 text-[11.5px] text-slate-600 list-disc list-inside">
                  <li>
                    <strong>Cover Resmi Kementan</strong> (Logo, judul huruf kapital, biodata pelaksana tugas)
                  </li>
                  <li>
                    <strong>BAB I Pendahuluan</strong> (Latar belakang, dasar hukum, profil pejabat & atasan)
                  </li>
                  <li>
                    <strong>BAB II Tabel 1</strong> ({activities.length} baris rincian kegiatan terkompilasi)
                  </li>
                  <li>
                    <strong>BAB II Tabel 2</strong> ({photos.length} foto dokumentasi sebelum-sesudah 0%-100% dan surat sakit)
                  </li>
                  <li>
                    <strong>BAB III Penutup</strong> (Kesimpulan dan lembar pengesahan tanda tangan)
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 space-y-2.5">
              <button
                type="button"
                onClick={onExportWord}
                disabled={isExportingWord}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <FileDown className="w-5 h-5 text-blue-100" />
                <span>
                  {isExportingWord
                    ? 'Sedang Menyiapkan Dokumen Word...'
                    : `Unduh Laporan ${periodType === 'triwulan' ? 'Triwulan' : periodType === 'bulanan' ? 'Bulanan' : 'Tahunan'} (Word .docx)`}
                </span>
              </button>

              <p className="text-[11px] text-slate-500 text-center">
                File otomatis tersimpan di folder Unduhan komputer Anda.
              </p>
            </div>
          </div>

          {/* Card 2: Adobe PDF (.pdf) & Print */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md">
                  <Download className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <span>Format Dokumen PDF</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                      .pdf
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dokumen siap cetak dan pengarsipan digital standar A4
                  </p>
                </div>
              </div>

              <div className="bg-rose-50/60 rounded-xl p-3.5 border border-rose-100 space-y-2 text-xs text-slate-700">
                <p className="font-semibold text-rose-900 flex items-center space-x-1.5">
                  <Printer className="w-4 h-4 text-rose-600" />
                  <span>Keunggulan Format PDF & Cetak A4:</span>
                </p>
                <ul className="space-y-1.5 text-[11.5px] text-slate-600 list-disc list-inside">
                  <li>Tata letak halaman A4 terkunci presisi sesuai standar pelaporan.</li>
                  <li>Siap dikirim langsung via WhatsApp, Email, atau Google Drive.</li>
                  <li>Dilengkapi tanda tangan digital pelaksana tugas dan pengesahan.</li>
                  <li>Dapat dicetak langsung ke kertas fisik A4 menggunakan browser print.</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={onExportPdf}
                  disabled={isExportingPdf}
                  className="py-3 px-3 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExportingPdf ? 'Menyiapkan...' : 'Unduh PDF (.pdf)'}</span>
                </button>

                <button
                  type="button"
                  onClick={onPrint}
                  className="py-3 px-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Print A4</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center">
                Mendukung pratinjau halaman dan dialog cetak browser otomatis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Data Summary & Verification Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Ringkasan Data yang Akan Masuk ke Dalam Laporan
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            Periode: {periodLabelNormal}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <p className="text-slate-500 text-[11px]">Pegawai Pelaksana</p>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{profile.nama}</p>
            <p className="text-[10.5px] text-slate-600 truncate">NIP: {profile.nip}</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <p className="text-slate-500 text-[11px]">Satuan Kerja</p>
            <p className="font-bold text-slate-900 text-sm mt-0.5 truncate">
              {profile.satuanKerja}
            </p>
            <p className="text-[10.5px] text-slate-600 truncate">{profile.jabatan}</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <p className="text-slate-500 text-[11px]">Entri Logbook Terkait</p>
            <p className="font-bold text-emerald-700 text-lg mt-0.5">
              {periodFilteredEntries.length} Catatan
            </p>
            <p className="text-[10.5px] text-slate-600">
              WFO: {wfoCount} | Sakit: {sakitCount} | Cuti: {cutiCount}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <p className="text-slate-500 text-[11px]">Foto Dokumentasi</p>
            <p className="font-bold text-indigo-700 text-lg mt-0.5">
              {photos.length} Foto
            </p>
            <p className="text-[10.5px] text-slate-600">
              Tabel 2 Sebelum & Sesudah Kegiatan
            </p>
          </div>
        </div>

        {/* Cloud & Google Drive Quick Action */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-lg shadow-2xs">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950">
                Cadangkan ke Google Drive Langsung
              </p>
              <p className="text-[11px] text-emerald-800">
                {currentUser
                  ? `Akun terhubung: ${currentUser.email || currentUser.displayName}. Sinkronkan laporan Anda ke Google Drive.`
                  : 'Masuk dengan akun Gmail Anda untuk otomatis mencadangkan dan menyinkronkan laporan ke Google Drive.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenGoogleDriveModal}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 shadow-xs flex items-center space-x-1.5"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>{currentUser ? 'Buka Google Drive' : 'Masuk Gmail & Drive'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
