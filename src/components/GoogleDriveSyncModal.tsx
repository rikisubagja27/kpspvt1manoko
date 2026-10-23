import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { loginWithGoogle, logoutFirebase } from '../services/firebaseAuth';
import { uploadToGoogleDrive, downloadFromGoogleDrive } from '../services/googleDriveService';
import { DailyLogbookEntry, PeriodActivityRow, PeriodType, UserProfile } from '../types';
import { X, Cloud, Download, Upload, LogOut, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
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
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setMessage(null);
      const user = await loginWithGoogle();
      onAuthChange(user);
      setMessage({ type: 'success', text: 'Berhasil terhubung ke akun Google!' });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Gagal login ke Google.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutFirebase();
      onAuthChange(null);
      setMessage(null);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleBackup = async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      setMessage(null);
      const dataToSave = {
        logbookEntries,
        profile,
        updatedAt: new Date().toISOString(),
      };
      await uploadToGoogleDrive(currentUser, dataToSave);
      setMessage({ type: 'success', text: 'Data berhasil dicadangkan ke Google Drive!' });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Gagal mencadangkan data.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      setMessage(null);
      const restoredData = await downloadFromGoogleDrive(currentUser);
      if (restoredData && restoredData.logbookEntries) {
        onRestoreEntries(restoredData.logbookEntries);
        setMessage({ type: 'success', text: `Berhasil memulihkan ${restoredData.logbookEntries.length} entri logbook!` });
      } else {
        setMessage({ type: 'error', text: 'Tidak ada data cadangan yang ditemukan di Google Drive.' });
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Gagal memulihkan data.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 text-slate-100 relative shadow-2xl space-y-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
            <Cloud className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Sinkronisasi Google Drive</h3>
          <p className="text-xs text-slate-400">
            Cadangkan dan pulihkan data logbook kinerja antar perangkat.
          </p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center space-x-2 border ${
              message.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {!currentUser ? (
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
            <span>Masuk ke Aplikasi (Google)</span>
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/40 text-center space-y-1">
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                Status Koneksi
              </span>
              <p className="text-xs font-bold text-white truncate">{currentUser.displayName || currentUser.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleBackup}
                disabled={isLoading}
                className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>Cadangkan Data</span>
              </button>

              <button
                type="button"
                onClick={handleRestore}
                disabled={isLoading}
                className="p-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Pulihkan Data</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-semibold rounded-xl text-xs border border-rose-800/60 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar / Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
