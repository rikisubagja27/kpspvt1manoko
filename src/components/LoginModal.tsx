import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { googleSignIn, logout } from '../services/firebaseAuth';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
  X,
  ClipboardList,
  Cloud,
  MapPin,
  Building,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAuthSuccess?: (user: User) => void;
  onAuthLogout?: () => void;
  onNavigateToLogbook?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onAuthLogout,
  onNavigateToLogbook,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await googleSignIn();
      if (res?.user) {
        if (onAuthSuccess) onAuthSuccess(res.user);
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setErrorMessage(
        err.message || 'Gagal masuk dengan Google. Pastikan koneksi internet stabil dan izinkan popup login.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await logout();
      if (onAuthLogout) onAuthLogout();
    } catch (err: any) {
      console.error('Sign-out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Dialog with Kebun PVT I Manoko signboard as background */}
      <div
        className="relative w-full max-w-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col my-auto transition-all bg-cover bg-center"
        style={{
          backgroundImage: `url('/assets/aistudio/IMG_1465_6255dbff.jpeg')`,
        }}
      >
        {/* Dark Vignette & Gradient Overlays for High Legibility & Premium Look */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/80 to-slate-950/92" />
        <div className="absolute inset-0 bg-emerald-950/30 mix-blend-multiply" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-900/90 p-2 rounded-full border border-white/10 transition-colors cursor-pointer shadow-md"
          title="Tutup Menu Login"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Header Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1 rounded-full text-xs font-semibold mb-4 backdrop-blur-xs">
            <Building className="w-3.5 h-3.5 text-emerald-400" />
            <span>KEMENTERIAN PERTANIAN RI</span>
          </div>

          {/* Logo Kementan */}
          <div className="w-20 h-20 rounded-2xl bg-white/95 p-2 shadow-2xl border border-white/40 flex items-center justify-center mb-4 backdrop-blur-md">
            <img
              src="/logo_kementan.svg"
              alt="Logo Kementerian Pertanian RI"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback icon if svg fails
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Titles matching the Signboard in the image */}
          <h2 className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-widest">
            Pusat Perlindungan Varietas Tanaman & Perizinan Pertanian
          </h2>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 mb-1">
            Menu Login Sistem Logbook
          </h1>
          <p className="text-emerald-400 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 mb-2">
            <span>Kebun Pemeriksaan Substantif PVT I Manoko</span>
          </p>
          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-300 bg-black/40 px-3 py-1 rounded-full border border-white/10 mb-6 backdrop-blur-xs">
            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Jl. Cisaroni Desa Cikahuripan, Kec. Lembang, Kab. Bandung Barat</span>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="w-full mb-4 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start space-x-2.5 text-left backdrop-blur-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Dynamic Card: Logged In vs Logged Out */}
          {currentUser ? (
            /* Logged In State */
            <div className="w-full bg-slate-900/85 backdrop-blur-md rounded-2xl border border-emerald-500/40 p-5 text-left shadow-xl space-y-4">
              <div className="flex items-center space-x-3.5">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-13 h-13 rounded-full border-2 border-emerald-400 shrink-0 shadow-md"
                  />
                ) : (
                  <div className="w-13 h-13 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                    {currentUser.displayName ? currentUser.displayName[0] : 'G'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white truncate">
                      {currentUser.displayName || 'Pegawai Terdaftar'}
                    </h3>
                    <span className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Aktif</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono truncate">
                    {currentUser.email}
                  </p>
                  <p className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
                    <Cloud className="w-3 h-3" />
                    <span>Google Drive Terhubung untuk Autosave & Backup</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigateToLogbook) onNavigateToLogbook();
                  }}
                  className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer active:scale-98"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Buka Halaman Logbook</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="w-full sm:w-auto py-3 px-4 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 font-semibold rounded-xl text-xs border border-slate-700 hover:border-rose-500/40 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          ) : (
            /* Logged Out / Ready to Login State */
            <div className="w-full bg-slate-900/85 backdrop-blur-md rounded-2xl border border-white/15 p-5 sm:p-6 text-center shadow-xl space-y-4">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md mx-auto">
                Masuk dengan <strong>Akun Google / Gmail</strong> untuk menghubungkan Google Drive pribadi Anda. Semua catatan logbook, berkas Word (.docx), dan PDF (.pdf) akan otomatis dicadangkan ke cloud.
              </p>

              {/* Official Google Sign-In Button */}
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full py-3.5 px-5 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl text-sm shadow-xl flex items-center justify-center space-x-3 transition-all cursor-pointer border border-white/80 active:scale-98 disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2 text-slate-600">
                    <span className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                    <span>Menghubungkan ke Google...</span>
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                    </svg>
                    <span>Masuk dengan Akun Google</span>
                  </>
                )}
              </button>

              {/* Continue Offline Option */}
              <div className="pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Autosave browser tetap aktif tanpa login</span>
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 cursor-pointer transition-colors"
                >
                  Lanjut Isi Logbook →
                </button>
              </div>
            </div>
          )}

          {/* Footer note */}
          <p className="mt-4 text-[10px] text-slate-300/80 tracking-wide">
            Sistem Informasi Pelaporan & Logbook Kinerja Lapangan • Kebun PVT I Manoko
          </p>
        </div>
      </div>
    </div>
  );
};
