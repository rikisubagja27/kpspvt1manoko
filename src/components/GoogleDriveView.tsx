import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  googleSignIn,
  logout,
} from '../services/firebaseAuth';
import {
  uploadFileToDrive,
  listAppFiles,
  downloadFileContent,
  deleteFileFromDrive,
  DriveFileItem,
} from '../services/googleDriveService';
import { DailyLogbookEntry, PeriodActivityRow, PeriodType, UserProfile } from '../types';
import { generateWordBlob } from '../utils/wordExport';
import { generateReportPdfBlob } from '../utils/pdfExport';
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileText,
  FileDown,
  RotateCcw,
  Trash2,
  ExternalLink,
  LogOut,
  RefreshCw,
  FolderOpen,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';

interface GoogleDriveViewProps {
  currentUser: User | null;
  onAuthChange: (user: User | null) => void;
  logbookEntries: DailyLogbookEntry[];
  profile: UserProfile;
  activePeriodType: PeriodType;
  periodTitleCaps: string;
  periodLabelNormal: string;
  selectedYear: number;
  activities: PeriodActivityRow[];
  defaultEndDate: string;
  onRestoreEntries: (entries: DailyLogbookEntry[]) => void;
  onNavigateToLogbook?: () => void;
}

export const GoogleDriveView: React.FC<GoogleDriveViewProps> = ({
  currentUser,
  onAuthChange,
  logbookEntries,
  profile,
  activePeriodType,
  periodTitleCaps,
  periodLabelNormal,
  selectedYear,
  activities,
  defaultEndDate,
  onRestoreEntries,
  onNavigateToLogbook,
}) => {
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Load drive files on mount or when user changes
  useEffect(() => {
    if (currentUser) {
      fetchDriveFiles();
    } else {
      setDriveFiles([]);
    }
  }, [currentUser]);

  const showStatus = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 5000);
  };

  const handleGoogleLogin = async () => {
    try {
      setIsUploading(true);
      const res = await googleSignIn();
      if (res?.user) {
        onAuthChange(res.user);
        showStatus('success', `Berhasil masuk dengan akun ${res.user.email}! Google Drive terhubung.`);
        await fetchDriveFiles();
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      showStatus('error', `Gagal masuk dengan Google: ${error.message || 'Izin ditolak'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onAuthChange(null);
      setDriveFiles([]);
      showStatus('info', 'Anda telah keluar dari akun Google.');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  const fetchDriveFiles = async () => {
    try {
      setIsLoadingFiles(true);
      const files = await listAppFiles();
      setDriveFiles(files);
    } catch (error: any) {
      console.error('Fetch drive files error:', error);
      showStatus('error', 'Gagal memuat daftar berkas dari Google Drive.');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleBackupLogbookJson = async () => {
    try {
      setIsUploading(true);

      const backupData = {
        app: 'Logbook Kinerja PVT I Manoko',
        version: '2.0',
        exportedAt: new Date().toISOString(),
        profile,
        logbookEntries,
        activities,
      };

      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `backup_logbook_PVT_Manoko_${dateStr}.json`;

      await uploadFileToDrive({
        fileName,
        mimeType: 'application/json',
        content: JSON.stringify(backupData, null, 2),
        description: `Cadangan data logbook (${logbookEntries.length} entri)`,
      });

      showStatus('success', `Data logbook berhasil dicadangkan ke Google Drive (${fileName})!`);
      await fetchDriveFiles();
    } catch (error: any) {
      console.error('Backup JSON error:', error);
      showStatus('error', `Gagal mencadangkan: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadWordReport = async () => {
    try {
      setIsUploading(true);

      const blob = await generateWordBlob({
        periodType: activePeriodType,
        periodTitleCaps,
        periodLabelNormal,
        year: selectedYear,
        profile,
        activities,
        photos: [],
        endDateStr: defaultEndDate,
      });

      const fileName = `Laporan_Kinerja_PVT_Manoko_${periodTitleCaps.replace(/\s+/g, '_')}.docx`;
      await uploadFileToDrive({
        fileName,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        content: blob,
        description: `Dokumen Word Laporan Kinerja ${periodLabelNormal} ${selectedYear}`,
      });

      showStatus('success', `Laporan Word (.docx) berhasil disimpan ke Google Drive Anda!`);
      await fetchDriveFiles();
    } catch (error: any) {
      console.error('Upload Word to Drive error:', error);
      showStatus('error', `Gagal mengunggah Word: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadPdfReport = async () => {
    try {
      setIsUploading(true);

      const blob = await generateReportPdfBlob({
        elementId: 'report-print-container',
      });

      const fileName = `Laporan_Kinerja_PVT_Manoko_${periodTitleCaps.replace(/\s+/g, '_')}.pdf`;
      await uploadFileToDrive({
        fileName,
        mimeType: 'application/pdf',
        content: blob,
        description: `Dokumen PDF Laporan Kinerja ${periodLabelNormal} ${selectedYear}`,
      });

      showStatus('success', `Laporan PDF (.pdf) berhasil disimpan ke Google Drive Anda!`);
      await fetchDriveFiles();
    } catch (error: any) {
      console.error('Upload PDF to Drive error:', error);
      showStatus('error', `Gagal mengunggah PDF: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRestoreFile = async (file: DriveFileItem) => {
    if (!window.confirm(`Yakin ingin memulihkan data logbook dari berkas "${file.name}"? Data di aplikasi akan diperbarui sesuai cadangan ini.`)) {
      return;
    }

    try {
      setIsUploading(true);

      const content = await downloadFileContent(file.id);
      const parsed = JSON.parse(content);

      if (parsed.logbookEntries && Array.isArray(parsed.logbookEntries)) {
        onRestoreEntries(parsed.logbookEntries);
        showStatus('success', `Berhasil memulihkan ${parsed.logbookEntries.length} catatan logbook dari cadangan!`);
      } else {
        showStatus('error', 'Format berkas cadangan tidak sesuai.');
      }
    } catch (error: any) {
      console.error('Restore error:', error);
      showStatus('error', `Gagal memulihkan: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (file: DriveFileItem) => {
    if (!window.confirm(`Hapus berkas "${file.name}" dari Google Drive Anda?`)) return;

    try {
      await deleteFileFromDrive(file.id);
      showStatus('info', `Berkas ${file.name} telah dihapus dari Google Drive.`);
      setDriveFiles((prev) => prev.filter((f) => f.id !== file.id));
    } catch (error: any) {
      console.error('Delete error:', error);
      showStatus('error', `Gagal menghapus berkas: ${error.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold tracking-wider uppercase mb-1">
              <Cloud className="w-4 h-4" />
              <span>Halaman Cloud & Pencadangan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Akun Gmail & Google Drive</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Sinkronisasikan data logbook harian Anda langsung ke Google Drive pribadi. Simpan salinan dokumen Word (.docx), PDF (.pdf), serta cadangan database agar tidak pernah hilang.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentUser && onNavigateToLogbook && (
              <button
                type="button"
                onClick={onNavigateToLogbook}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md"
              >
                Kembali ke Logbook →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center space-x-3 text-xs sm:text-sm animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-800'
              : 'bg-blue-50 border-blue-300 text-blue-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : statusMessage.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <Cloud className="w-5 h-5 text-blue-600 shrink-0" />
          )}
          <span className="font-semibold">{statusMessage.text}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: User Account Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              <span>Status Akun Google</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Otorisasi resmi Google OAuth 2.0 untuk sinkronisasi Google Drive.
            </p>
          </div>

          {currentUser ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="User"
                    className="w-12 h-12 rounded-full border-2 border-emerald-500 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                    {currentUser.displayName ? currentUser.displayName[0] : 'G'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {currentUser.displayName || 'Pengguna Google'}
                  </h4>
                  <p className="text-xs text-slate-500 truncate font-mono">
                    {currentUser.email}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Google Drive Terhubung
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun Google</span>
              </button>
            </div>
          ) : (
            <div
              className="relative overflow-hidden rounded-2xl p-5 text-center shadow-md bg-cover bg-center border border-slate-700/60"
              style={{
                backgroundImage: `url('/assets/aistudio/IMG_1465_6255dbff.jpeg')`,
              }}
            >
              {/* Dark Overlay for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/80 to-slate-950/90" />

              <div className="relative z-10 space-y-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white/90 p-2 text-blue-600 flex items-center justify-center mx-auto shadow-lg border border-white/40">
                  <img
                    src="/logo_kementan.svg"
                    alt="Logo Kementan"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    Kebun PVT I Manoko
                  </span>
                  <h4 className="text-sm font-extrabold text-white mt-1.5">
                    Menu Login Google Drive
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
                    Masuk dengan akun Gmail Anda untuk mengaktifkan pencadangan otomatis data logbook ke Google Drive pribadi.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isUploading}
                  className="w-full flex items-center justify-center space-x-2.5 px-4 py-3 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold rounded-xl border border-white/80 shadow-lg transition-all cursor-pointer hover:shadow-xl active:scale-98 disabled:opacity-60"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Masuk dengan Akun Google</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Ringkasan Data Saat Ini
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Total Logbook</span>
                <span className="font-bold text-slate-900 text-sm">{logbookEntries.length} entri</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Tabel 1 Kegiatan</span>
                <span className="font-bold text-slate-900 text-sm">{activities.length} baris</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Backup Actions & Drive File List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-blue-600" />
                  <span>Tindakan Pencadangan ke Google Drive</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Simpan cadangan data aplikasi dan dokumen laporan langsung ke folder Google Drive Anda.
                </p>
              </div>
              {isUploading && (
                <span className="text-xs text-blue-600 font-bold flex items-center gap-1.5 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Memproses...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Backup JSON */}
              <button
                type="button"
                onClick={handleBackupLogbookJson}
                disabled={!currentUser || isUploading}
                className="p-4 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl flex flex-col items-start justify-between text-left transition-all cursor-pointer disabled:opacity-40"
              >
                <div className="p-2 bg-emerald-600 text-white rounded-lg mb-3">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">Cadangkan Database</h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Simpan seluruh data logbook & profil dalam format JSON (bisa di-restore).
                  </p>
                </div>
                <span className="mt-3 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  Cadangkan Sekarang →
                </span>
              </button>

              {/* Upload Word */}
              <button
                type="button"
                onClick={handleUploadWordReport}
                disabled={!currentUser || isUploading}
                className="p-4 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-xl flex flex-col items-start justify-between text-left transition-all cursor-pointer disabled:opacity-40"
              >
                <div className="p-2 bg-blue-600 text-white rounded-lg mb-3">
                  <FileDown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-950">Simpan Word (.docx)</h4>
                  <p className="text-[11px] text-blue-800 mt-0.5">
                    Unggah dokumen resmi Microsoft Word ke folder Google Drive Anda.
                  </p>
                </div>
                <span className="mt-3 text-[11px] font-bold text-blue-700 flex items-center gap-1">
                  Kirim ke Drive →
                </span>
              </button>

              {/* Upload PDF */}
              <button
                type="button"
                onClick={handleUploadPdfReport}
                disabled={!currentUser || isUploading}
                className="p-4 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-xl flex flex-col items-start justify-between text-left transition-all cursor-pointer disabled:opacity-40"
              >
                <div className="p-2 bg-rose-600 text-white rounded-lg mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-950">Simpan PDF (.pdf)</h4>
                  <p className="text-[11px] text-rose-800 mt-0.5">
                    Unggah berkas Adobe PDF lembar laporan utuh ke Google Drive.
                  </p>
                </div>
                <span className="mt-3 text-[11px] font-bold text-rose-700 flex items-center gap-1">
                  Kirim ke Drive →
                </span>
              </button>
            </div>
          </div>

          {/* Drive Files Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <FolderOpen className="w-5 h-5 text-slate-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Daftar Berkas Cadangan di Google Drive ({driveFiles.length})
                </h3>
              </div>
              {currentUser && (
                <button
                  type="button"
                  onClick={fetchDriveFiles}
                  disabled={isLoadingFiles}
                  className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                  <span>Segarkan</span>
                </button>
              )}
            </div>

            {!currentUser ? (
              <div className="text-center py-8 text-slate-400 text-xs italic">
                Silakan masuk dengan akun Google untuk melihat berkas yang tersimpan di Google Drive.
              </div>
            ) : isLoadingFiles ? (
              <div className="text-center py-8 text-slate-400 text-xs flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                <span>Memuat berkas dari Google Drive...</span>
              </div>
            ) : driveFiles.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs italic">
                Belum ada berkas cadangan dari aplikasi ini di Google Drive Anda. Klik salah satu tombol cadangkan di atas untuk membuat cadangan pertama.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                      <th className="py-2.5 px-3">Nama Berkas</th>
                      <th className="py-2.5 px-3">Format</th>
                      <th className="py-2.5 px-3">Waktu Diubah</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {driveFiles.map((file) => {
                      const isJson = file.name.endsWith('.json');
                      const isDocx = file.name.endsWith('.docx');
                      const isPdf = file.name.endsWith('.pdf');

                      return (
                        <tr key={file.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-slate-800 flex items-center space-x-2">
                            {isJson ? (
                              <Database className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : isDocx ? (
                              <FileDown className="w-4 h-4 text-blue-600 shrink-0" />
                            ) : isPdf ? (
                              <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                            ) : (
                              <FolderOpen className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className="truncate max-w-xs">{file.name}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              {isJson ? 'JSON' : isDocx ? 'DOCX' : isPdf ? 'PDF' : 'File'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                            {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }) : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                            {isJson && (
                              <button
                                type="button"
                                onClick={() => handleRestoreFile(file)}
                                className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-semibold text-[11px] cursor-pointer inline-flex items-center gap-1"
                                title="Pulihkan data logbook dari cadangan ini"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Restore</span>
                              </button>
                            )}
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px] inline-flex items-center gap-1"
                                title="Buka di Google Drive"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteFile(file)}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded font-semibold text-[11px] cursor-pointer inline-flex items-center"
                              title="Hapus berkas dari Google Drive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
