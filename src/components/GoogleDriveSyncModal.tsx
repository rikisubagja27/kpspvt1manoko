import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { googleSignIn, logout } from '../services/firebaseAuth';
import { DailyLogbookEntry, UserProfile } from '../types';
import {
  Mail,
  Lock,
  LogIn,
  UserPlus,
  HelpCircle,
  X,
  Cloud,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAuthChange: (user: User | null) => void;
  logbookEntries: DailyLogbookEntry[];
  profile: UserProfile;
  activePeriodType: string;
  periodTitleCaps: string;
  periodLabelNormal: string;
  selectedYear: number;
  activities: any[];
  defaultEndDate: string;
  onRestoreEntries: (entries: DailyLogbookEntry[]) => void;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthChange,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await googleSignIn();
      onAuthChange(user);
    } catch (err: any) {
      setError(err.message || 'Gagal masuk dengan Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onAuthChange(null);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
      {/* Container Login Menggunakan Foto Kebun PVT I Manoko sebagai Latar Belakang (Gambar 3 & 4) */}
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/30 text-white flex flex-col justify-between p-6 sm:p-8 min-h-[620px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.75)), url('https://raw.githubusercontent.com/rikisubagja27/kpspvt1manoko/main/public/assets/kebun_pvt_manoko.jpg')`,
        }}
      >
        {/* Tombol Tutup Modal */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition-all cursor-pointer backdrop-blur-md z-10 border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Judul Atas Login */}
        <div className="text-center pt-4 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
            LOGIN APLIKASI<br />LOGBOOK KINERJA
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-emerald-200 drop-shadow-sm">
            KPS PVT I Manoko
          </p>
          <p className="text-[11px] text-slate-200/90 font-medium drop-shadow-xs">
            Sistem Pencatatan Kinerja Harian & Pelaporan Resmi
          </p>
        </div>

        {/* Form Login Bergaya Transparan Glassmorphism (Gambar 4) */}
        <div className="space-y-3.5 my-auto py-4">
          {error && (
            <div className="p-3 bg-rose-500/80 backdrop-blur-md border border-rose-300 text-white text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {currentUser ? (
            /* Tampilan jika sudah Login */
            <div className="bg-emerald-950/80 backdrop-blur-md p-5 rounded-2xl border border-emerald-400/40 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <div>
                <p className="text-xs text-emerald-200">Terhubung sebagai:</p>
                <p className="font-extrabold text-sm text-white">{currentUser.displayName || currentUser.email}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 bg-rose-600/90 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Keluar / Logout
              </button>
            </div>
          ) : (
            /* Formulir Login */
            <>
              <div>
                <label className="block text-xs font-bold text-white mb-1 drop-shadow-sm">
                  Alamat Email <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan alamat email Anda"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/30 backdrop-blur-md border border-white/40 rounded-xl text-xs text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1 drop-shadow-sm">
                  Kata Sandi <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi Anda"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/30 backdrop-blur-md border border-white/40 rounded-xl text-xs text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              {/* Kotak Info Sinkronisasi Drive */}
              <div className="bg-emerald-950/70 backdrop-blur-md p-3 rounded-2xl border border-emerald-500/40 flex items-start gap-2.5 text-[11px] text-emerald-100">
                <Cloud className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                <p>
                  <strong>Sinkronisasi Google Drive Aktif:</strong> Setiap logbook akan otomatis tersimpan dan disinkronkan ke Google Drive akun Anda.
                </p>
              </div>

              {/* Tombol Utama */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Memproses...' : 'Masuk ke Aplikasi (Google)'}</span>
              </button>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs border border-white/30 backdrop-blur-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Daftar Pengguna Baru</span>
              </button>

              <button
                type="button"
                onClick={() => alert('Silakan hubungi administrator Kebun PVT I Manoko untuk bantuan kata sandi.')}
                className="w-full py-2 bg-black/20 hover:bg-black/30 text-slate-200 font-semibold rounded-xl text-[11px] border border-white/20 backdrop-blur-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Bantuan / Lupa Sandi</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
