import React from 'react';
import { AppTab } from '../App';
import { UserProfile, DailyLogbookEntry } from '../types';
import { User as FirebaseUser } from 'firebase/auth';
import {
  ClipboardList,
  FileDown,
  FileText,
  ListChecks,
  UserCheck,
  Cloud,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  Building,
  Lock,
} from 'lucide-react';

interface MenuViewProps {
  onNavigate: (tab: AppTab) => void;
  entriesCount: number;
  profile: UserProfile;
  currentUser: FirebaseUser | null;
  periodLabel: string;
  onOpenLoginModal?: () => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  onNavigate,
  entriesCount,
  profile,
  currentUser,
  periodLabel,
  onOpenLoginModal,
}) => {
  const menuItems = [
    {
      id: 'logbook' as AppTab,
      title: 'Halaman Utama (Isi Logbook)',
      badge: 'Halaman Utama',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: ClipboardList,
      iconColor: 'bg-emerald-600 text-white',
      desc: 'Form input kehadiran harian (WFO, Sakit, Cuti), jam kerja, lokasi blok lahan, dan riwayat catatan logbook tanpa gangguan menu lain.',
      stat: `${entriesCount} Catatan Tersimpan`,
      primary: true,
      buttonText: 'Buka Halaman Utama',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    {
      id: 'download' as AppTab,
      title: 'Unduh Laporan (Word .docx & PDF)',
      badge: 'Halaman Unduh',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: FileDown,
      iconColor: 'bg-blue-600 text-white',
      desc: 'Halaman terpisah untuk generate & download laporan kinerja Bulanan dan Triwulanan dalam format Microsoft Word (.docx) atau PDF resmi.',
      stat: 'Format Resmi Kementan',
      buttonText: 'Buka Halaman Unduh',
      buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      id: 'report' as AppTab,
      title: 'Pratinjau Lembar Dokumen A4',
      badge: 'Pratinjau Cetak',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
      icon: FileText,
      iconColor: 'bg-teal-600 text-white',
      desc: 'Pratinjau visual format cetak kertas fisik A4 lengkap dengan Kop Surat Kementan RI, Bab I, Bab II Tabel Rincian, dan Lembar Pengesahan.',
      stat: 'Siap Cetak Kertas A4',
      buttonText: 'Buka Pratinjau A4',
      buttonClass: 'bg-teal-600 hover:bg-teal-700 text-white',
    },
    {
      id: 'tables' as AppTab,
      title: 'Tabel 1 Kegiatan & Tabel 2 Dokumentasi Foto',
      badge: 'Manajemen Data',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      icon: ListChecks,
      iconColor: 'bg-cyan-600 text-white',
      desc: 'Kustomisasi tabel rincian kegiatan operasional (Tabel 1) dan kelola galeri dokumentasi foto sebelum/sesudah per periode (Tabel 2).',
      stat: 'Bab II Laporan',
      buttonText: 'Kelola Tabel & Foto',
      buttonClass: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    },
    {
      id: 'profile' as AppTab,
      title: 'Profil Pegawai & Pejabat Penilai',
      badge: 'Pengaturan Akun',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: UserCheck,
      iconColor: 'bg-purple-600 text-white',
      desc: 'Kelola data identitas pegawai, NIP, jabatan PPPK, unit kerja, nama atasan langsung/pejabat penilai, dan tanda tangan digital.',
      stat: profile.nama || 'Profil Pegawai',
      buttonText: 'Buka Profil & Pejabat',
      buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
    {
      id: 'drive' as AppTab,
      title: 'Menu Login & Google Drive',
      badge: currentUser ? 'Terhubung' : 'Menu Login',
      badgeColor: currentUser
        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
        : 'bg-amber-100 text-amber-900 border-amber-300',
      icon: Cloud,
      iconColor: 'bg-sky-600 text-white',
      desc: 'Masuk dengan akun Gmail Anda (Google OAuth 2.0) untuk mengaktifkan pencadangan otomatis (backup) dan sinkronisasi arsip cloud.',
      stat: currentUser ? currentUser.email || 'Akun Aktif' : 'Belum Login Google',
      buttonText: currentUser ? 'Buka Google Drive' : '🔐 Menu Login',
      buttonClass: 'bg-sky-600 hover:bg-sky-700 text-white',
      isLoginCard: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-700 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pusat Navigasi & Menu Terpisah</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pusat Menu & Fitur Laporan
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Seluruh menu fitur telah dipisahkan ke halaman ini agar <strong>Halaman Utama</strong> tetap luas, bersih, dan khusus untuk <strong>mengisi logbook harian</strong> saja tanpa terhimpit toolbar yang sempit.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {onOpenLoginModal && (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-2xl text-xs sm:text-sm border border-slate-600 shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
                title="Buka Menu Login dengan background Kebun PVT I Manoko"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>{currentUser ? 'Status Akun' : '🔐 Menu Login'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('logbook')}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-sm shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-98 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Halaman Utama</span>
            </button>
          </div>
        </div>

        {/* Quick status bar */}
        <div className="mt-6 pt-5 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Autosave Aktif di Semua Halaman</span>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">
              Pegawai: <strong>{profile.nama || '-'}</strong> ({profile.jabatan})
            </span>
          </div>

          <div className="flex items-center space-x-2 text-slate-400">
            <span>Periode Aktif:</span>
            <span className="bg-slate-800 text-emerald-300 font-bold px-2.5 py-1 rounded-lg border border-slate-700">
              {periodLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Dedicated Pages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <span>Daftar Halaman & Fitur Mandiri</span>
            <span className="text-xs font-normal text-slate-500">
              (Klik untuk membuka halaman pilihan)
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (item.isLoginCard && !currentUser && onOpenLoginModal) {
                    onOpenLoginModal();
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                  item.primary
                    ? 'border-emerald-300 ring-2 ring-emerald-500/20 hover:border-emerald-500'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl shadow-xs ${item.iconColor}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[140px]">
                    {item.stat}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.isLoginCard && !currentUser && onOpenLoginModal) {
                        onOpenLoginModal();
                      } else {
                        onNavigate(item.id);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs group-hover:translate-x-0.5 cursor-pointer ${item.buttonClass}`}
                  >
                    <span>{item.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Helpful Hint */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-start space-x-3">
        <Building className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          <strong>Tip Kenyamanan Kerja:</strong> Ketika Anda berada di <strong>Halaman Utama (Isi Logbook)</strong>, seluruh ruang layar difokuskan untuk memudahkan Anda mengisi kegiatan harian dan unggah foto dokumentasi. Anda dapat membuka menu ini kapan saja melalui tombol <strong>"📂 Pusat Menu & Laporan"</strong> di pojok kanan atas.
        </p>
      </div>
    </div>
  );
};
