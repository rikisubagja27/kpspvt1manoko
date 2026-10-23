import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  User,
  Building,
  MapPin,
  Save,
  CheckCircle2,
  PenTool,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  Check,
  ShieldCheck,
  Sparkles,
  Award,
  Calendar,
} from 'lucide-react';
import { PRESET_LOGOS } from './CustomLogoSelectorModal';

interface ProfileSettingsViewProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  customLogoUrl: string | null;
  onSelectLogo: (logoUrl: string | null) => void;
  onNavigateToPreview?: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  profile,
  onSaveProfile,
  customLogoUrl,
  onSelectLogo,
  onNavigateToPreview,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'organization' | 'signature' | 'logo'>('profile');

  // Signature state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | undefined>(profile.signatureImage);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync formData with profile prop if updated from external sources
  useEffect(() => {
    setFormData({ ...profile });
    setSignatureDataUrl(profile.signatureImage);
  }, [profile]);

  const handleChange = (field: keyof UserProfile, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onSaveProfile(updated);
    triggerSaved();
  };

  const triggerSaved = () => {
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setSignatureDataUrl(dataUrl);
      const updated = { ...formData, signatureImage: dataUrl, useDigitalSignature: true };
      setFormData(updated);
      onSaveProfile(updated);
      triggerSaved();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setSignatureDataUrl(undefined);
    const updated = { ...formData, signatureImage: undefined };
    setFormData(updated);
    onSaveProfile(updated);
    triggerSaved();
  };

  const handleUploadSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setSignatureDataUrl(result);
        const updated = { ...formData, signatureImage: result, useDigitalSignature: true };
        setFormData(updated);
        onSaveProfile(updated);
        triggerSaved();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadCustomLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onSelectLogo(result);
        triggerSaved();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-purple-950 p-6 rounded-2xl border border-slate-800 text-white shadow-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold tracking-wider uppercase mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Halaman Pengaturan Resmi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Profil Pegawai, Satuan Kerja & Pengesahan</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Kelola data diri penyusun, jabatan, satuan kerja kebun, instansi Kementerian Pertanian, logo dinas, dan tanda tangan digital untuk Cover dan Lembar Pengesahan Bab III.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isSavedRecently && (
              <span className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Tersimpan Otomatis!</span>
              </span>
            )}
            {onNavigateToPreview && (
              <button
                type="button"
                onClick={onNavigateToPreview}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md"
              >
                Lihat Pratinjau A4 →
              </button>
            )}
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-700/70 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab('profile')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'profile'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>1. Data Pegawai Penyusun</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('organization')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'organization'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>2. Satuan Kerja & Lokasi Kebun</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('signature')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'signature'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>3. Tanda Tangan Digital</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('logo')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'logo'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>4. Logo Instansi</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* SUBTAB 1: DATA PEGAWAI */}
        {activeSubTab === 'profile' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                <span>Identitas Pegawai Penyusun Laporan</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Data ini dicantumkan pada Halaman Judul (Cover) dan Lembar Pengesahan Laporan Kinerja.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Lengkap Pegawai
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => handleChange('nama', e.target.value)}
                  placeholder="Contoh: RIKI SUBAGJA"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  NIP / NIPPPK
                </label>
                <input
                  type="text"
                  value={formData.nip}
                  onChange={(e) => handleChange('nip', e.target.value)}
                  placeholder="199808272025211042"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Jabatan / Posisi
                </label>
                <input
                  type="text"
                  value={formData.jabatan}
                  onChange={(e) => handleChange('jabatan', e.target.value)}
                  placeholder="Operator Layanan Operasional"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Status Kepegawaian
                </label>
                <input
                  type="text"
                  value={formData.statusPegawai}
                  onChange={(e) => handleChange('statusPegawai', e.target.value)}
                  placeholder="PPPK Paruh Waktu / PNS"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kota / Lokasi Tanda Tangan
                </label>
                <input
                  type="text"
                  value={formData.lokasiTtd}
                  onChange={(e) => handleChange('lokasiTtd', e.target.value)}
                  placeholder="Bandung Barat / Lembang"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tanggal Pengesahan Dokumen
                </label>
                <input
                  type="text"
                  value={formData.tanggalTtd}
                  onChange={(e) => handleChange('tanggalTtd', e.target.value)}
                  placeholder="30 September 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: SATUAN KERJA & LOKASI */}
        {activeSubTab === 'organization' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-600" />
                <span>Satuan Kerja, Kebun & Instansi Induk</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Digunakan pada Kop Dokumen, Bab I (Pendahuluan), dan Lembar Pengesahan.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Satuan Kerja / Kebun
                </label>
                <input
                  type="text"
                  value={formData.satuanKerja}
                  onChange={(e) => handleChange('satuanKerja', e.target.value)}
                  placeholder="Kebun Pemeriksaan Substantif PVT I Manoko"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Instansi Induk (Tertulis di Cover & Kop)
                </label>
                <input
                  type="text"
                  value={formData.instansi}
                  onChange={(e) => handleChange('instansi', e.target.value)}
                  placeholder="PUSAT PELINDUNGAN VARIETAS TANAMAN DAN PERIZINAN PERTANIAN"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Deskripsi Lokasi Spesifik (Bab I Bagian 1.3)
                </label>
                <textarea
                  rows={3}
                  value={formData.lokasiSpesifik}
                  onChange={(e) => handleChange('lokasiSpesifik', e.target.value)}
                  placeholder="Kebun Pemeriksaan Substantif PVT I Manoko pada satuan Kerja Kantor Pusat Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian (PVTPP)..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 resize-y"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: TANDA TANGAN DIGITAL */}
        {activeSubTab === 'signature' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-purple-600" />
                <span>Tanda Tangan Digital & Stempel Dinas</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tanda tangan ini akan otomatis terpasang di lembar pengesahan Bab III laporan dan saat diekspor ke Word maupun PDF.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Drawing Board */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Goreskan Tanda Tangan
                  </span>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Hapus / Bersihkan</span>
                  </button>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-xl bg-white overflow-hidden shadow-inner flex items-center justify-center p-2">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={180}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-44 cursor-crosshair touch-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">
                    Goreskan tanda tangan Anda di area putih kanvas.
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUploadSignature}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah File PNG / Foto TTD</span>
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pratinjau Lembar Pengesahan
                </span>

                <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm text-center">
                  <p className="text-xs text-slate-600 mb-1">
                    {formData.lokasiTtd || 'Bandung Barat'}, {formData.tanggalTtd || '30 September 2026'}
                  </p>
                  <p className="text-xs font-bold text-slate-800 mb-2">
                    Yang Melaporkan,
                  </p>

                  <div className="h-28 flex items-center justify-center my-1">
                    {signatureDataUrl ? (
                      <img
                        src={signatureDataUrl}
                        alt="Tanda Tangan"
                        className="max-h-24 max-w-[200px] object-contain"
                      />
                    ) : (
                      <div className="text-slate-400 italic text-xs border border-dashed border-slate-300 px-4 py-6 rounded-lg">
                        (Belum ada tanda tangan)
                      </div>
                    )}
                  </div>

                  <p className="text-xs font-bold text-slate-900 underline uppercase">
                    {formData.nama || 'Nama Pegawai'}
                  </p>
                  <p className="text-[11px] text-slate-600 font-mono">
                    NIP. {formData.nip || '19xxxxxxxxxxxxxx'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: LOGO INSTANSI */}
        {activeSubTab === 'logo' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                <span>Pilihan Logo Kop Dokumen & Aplikasi</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih logo resmi instansi Kementerian Pertanian atau unggah gambar logo satuan kerja pilihan Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {PRESET_LOGOS.map((preset) => {
                const isSelected = (!customLogoUrl && preset.id === 'kementan-logo') || customLogoUrl === preset.url;
                return (
                  <div
                    key={preset.id}
                    onClick={() => onSelectLogo(preset.id === 'kementan-logo' ? null : preset.url)}
                    className={`relative p-4 rounded-xl border-2 flex flex-col items-center justify-between text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/60 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="w-16 h-16 flex items-center justify-center p-2 mb-2">
                      <img
                        src={preset.url}
                        alt={preset.title}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{preset.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{preset.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Upload Card */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 text-purple-800 rounded-xl">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Unggah Logo Kustom Pilihan Anda Sendiri
                  </h4>
                  <p className="text-xs text-slate-500">
                    Mendukung format PNG transparan, JPG, atau WebP (disarankan resolusi tajam minimal 200x200 px).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="file"
                  ref={logoFileInputRef}
                  onChange={handleUploadCustomLogo}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoFileInputRef.current?.click()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Pilih Gambar Logo...
                </button>
                {customLogoUrl && (
                  <button
                    type="button"
                    onClick={() => onSelectLogo(null)}
                    className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Reset ke Default
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
