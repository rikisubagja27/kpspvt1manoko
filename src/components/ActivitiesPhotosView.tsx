import React, { useState, useRef } from 'react';
import { PeriodActivityRow, DocumentationPhoto, PeriodType } from '../types';
import {
  ListChecks,
  Camera,
  Plus,
  Trash2,
  RotateCcw,
  Upload,
  Calendar,
  FileText,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

interface ActivitiesPhotosViewProps {
  activities: PeriodActivityRow[];
  onSaveActivities: (activities: PeriodActivityRow[]) => void;
  onResetActivities: () => void;
  photos: DocumentationPhoto[];
  onSavePhotos: (photos: DocumentationPhoto[]) => void;
  periodTitle: string;
  onNavigateToPreview?: () => void;
  onNavigateToDownload?: () => void;
}

export const ActivitiesPhotosView: React.FC<ActivitiesPhotosViewProps> = ({
  activities,
  onSaveActivities,
  onResetActivities,
  photos,
  onSavePhotos,
  periodTitle,
  onNavigateToPreview,
  onNavigateToDownload,
}) => {
  const [activeSection, setActiveSection] = useState<'table1' | 'table2'>('table1');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Table 1 state
  const [localRows, setLocalRows] = useState<PeriodActivityRow[]>(() =>
    JSON.parse(JSON.stringify(activities))
  );

  // Table 2 (Photos) state
  const [localPhotos, setLocalPhotos] = useState<DocumentationPhoto[]>(() =>
    JSON.parse(JSON.stringify(photos))
  );

  // Photo form modal / inline state
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-09-15');
  const [newBeforeImg, setNewBeforeImg] = useState<string | null>(null);
  const [newAfterImg, setNewAfterImg] = useState<string | null>(null);

  const beforeFileRef = useRef<HTMLInputElement | null>(null);
  const afterFileRef = useRef<HTMLInputElement | null>(null);

  const triggerSaved = () => {
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  // Table 1 handlers
  const handleUpdateItem = (
    rowIndex: number,
    itemIndex: number,
    field: 'category' | 'details',
    val: string
  ) => {
    const updated = [...localRows];
    updated[rowIndex].items[itemIndex][field] = val;
    setLocalRows(updated);
    onSaveActivities(updated);
    triggerSaved();
  };

  const handleAddItem = (rowIndex: number) => {
    const updated = [...localRows];
    updated[rowIndex].items.push({
      category: 'Pekerjaan Tambahan',
      details: 'Tuliskan deskripsi rincian operasional...',
    });
    setLocalRows(updated);
    onSaveActivities(updated);
    triggerSaved();
  };

  const handleDeleteItem = (rowIndex: number, itemIndex: number) => {
    const updated = [...localRows];
    updated[rowIndex].items.splice(itemIndex, 1);
    setLocalRows(updated);
    onSaveActivities(updated);
    triggerSaved();
  };

  const handleAddCategoryRow = () => {
    const newIdx = localRows.length + 1;
    const updated: PeriodActivityRow[] = [
      ...localRows,
      {
        id: `act-${Date.now()}`,
        periodLabel: `Kegiatan Operasional Tambahan ${newIdx}`,
        items: [
          {
            category: 'Uraian Utama',
            details: 'Deskripsi pelaksanaan tugas teknis kebun PVT...',
          },
        ],
      },
    ];
    setLocalRows(updated);
    onSaveActivities(updated);
    triggerSaved();
  };

  const handleDeleteCategoryRow = (rowIndex: number) => {
    const updated = localRows.filter((_, idx) => idx !== rowIndex);
    setLocalRows(updated);
    onSaveActivities(updated);
    triggerSaved();
  };

  // Table 2 handlers
  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPhoto: DocumentationPhoto = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      imageUrl: newAfterImg || newBeforeImg || '',
      dateStr: newDate,
      fotoSebelumUrl: newBeforeImg || undefined,
      fotoSesudahUrl: newAfterImg || undefined,
    };

    const updated = [...localPhotos, newPhoto];
    setLocalPhotos(updated);
    onSavePhotos(updated);
    triggerSaved();

    // Reset form
    setNewTitle('');
    setNewBeforeImg(null);
    setNewAfterImg(null);
    setIsAddingPhoto(false);
  };

  const handleDeletePhoto = (id: string) => {
    const updated = localPhotos.filter((p) => p.id !== id);
    setLocalPhotos(updated);
    onSavePhotos(updated);
    triggerSaved();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isBefore: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (isBefore) {
          setNewBeforeImg(result);
        } else {
          setNewAfterImg(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold tracking-wider uppercase mb-1">
              <Layers className="w-4 h-4" />
              <span>Halaman Pengaturan Isi Bab II Laporan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Tabel 1 (Rincian Kegiatan) & Tabel 2 (Foto Dokumentasi)</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Sesuaikan data tabel resmi Bab II untuk periode <strong className="text-cyan-300">{periodTitle}</strong>. Semua perubahan langsung diperbarui ke Dokumen A4, Word, dan PDF.
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
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Pratinjau A4
              </button>
            )}
            {onNavigateToDownload && (
              <button
                type="button"
                onClick={onNavigateToDownload}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md"
              >
                Unduh Word & PDF →
              </button>
            )}
          </div>
        </div>

        {/* Section Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-700/70 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSection('table1')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeSection === 'table1'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ListChecks className="w-4 h-4" />
            <span>📋 Tabel 1: Rincian Kegiatan ({localRows.reduce((acc, r) => acc + r.items.length, 0)} Baris)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('table2')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeSection === 'table2'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>📸 Tabel 2: Dokumentasi Foto 0% & 100% ({localPhotos.length} Foto)</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: TABEL 1 */}
      {activeSection === 'table1' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-cyan-600" />
                <span>Kelola Tabel 1: Rincian Kegiatan Operasional</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kategori dan rincian pekerjaan yang tercantum pada Bab II Tabel 1 Laporan Kinerja.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddCategoryRow}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kategori Baru</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetActivities();
                  setLocalRows(JSON.parse(JSON.stringify(activities)));
                  triggerSaved();
                }}
                className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                title="Kembalikan format standar Kementan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Standar</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {localRows.map((row, rIdx) => (
              <div
                key={row.id || rIdx}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center">
                      {rIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={row.periodLabel}
                      onChange={(e) => {
                        const updated = [...localRows];
                        updated[rIdx].periodLabel = e.target.value;
                        setLocalRows(updated);
                        onSaveActivities(updated);
                        triggerSaved();
                      }}
                      className="font-bold text-sm text-slate-800 bg-white border border-slate-300 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleAddItem(rIdx)}
                      className="flex items-center space-x-1 text-xs text-cyan-600 hover:text-cyan-700 font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Baris</span>
                    </button>
                    {localRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCategoryRow(rIdx)}
                        className="text-xs text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="Hapus kategori ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Items in this row */}
                <div className="space-y-2.5">
                  {row.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-xs"
                    >
                      <div className="w-full sm:w-1/3">
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) =>
                            handleUpdateItem(rIdx, itemIdx, 'category', e.target.value)
                          }
                          placeholder="Kategori / Jenis Pekerjaan"
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>
                      <div className="w-full sm:w-2/3 flex items-center gap-2">
                        <textarea
                          rows={1}
                          value={item.details}
                          onChange={(e) =>
                            handleUpdateItem(rIdx, itemIdx, 'details', e.target.value)
                          }
                          placeholder="Rincian pelaksanaan tugas lapangan..."
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:bg-white focus:ring-1 focus:ring-cyan-500 resize-y"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(rIdx, itemIdx)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                          title="Hapus baris ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: TABEL 2 (FOTO DOKUMENTASI) */}
      {activeSection === 'table2' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-600" />
                <span>Kelola Tabel 2: Dokumentasi Kegiatan Sebelum (0%) & Sesudah (100%)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Foto bukti kegiatan operasional di kebun PVT I Manoko dengan perbandingan progres fisik.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingPhoto(!isAddingPhoto)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingPhoto ? 'Tutup Formulir' : 'Tambah Foto Dokumentasi'}</span>
            </button>
          </div>

          {/* Form Add Photo */}
          {isAddingPhoto && (
            <form
              onSubmit={handleAddPhotoSubmit}
              className="bg-amber-50/60 rounded-2xl border border-amber-200 p-5 space-y-4 animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <h4 className="text-sm font-bold text-amber-900">
                  Formulir Tambah Foto Dokumentasi Baru
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingPhoto(false)}
                  className="text-amber-800 hover:text-amber-950 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul / Uraian Kegiatan Lapangan
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Pembersihan Gulma & Penyiangan Lahan Uji PVT"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Pelaksanaan
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                {/* Photo 0% */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Foto Sebelum (0%)</span>
                    {newBeforeImg && (
                      <button
                        type="button"
                        onClick={() => setNewBeforeImg(null)}
                        className="text-[11px] text-rose-500 hover:text-rose-700 cursor-pointer"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                  {newBeforeImg ? (
                    <div className="h-32 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-100">
                      <img
                        src={newBeforeImg}
                        alt="Sebelum 0%"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => beforeFileRef.current?.click()}
                      className="h-32 border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition-colors"
                    >
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs text-slate-500">Klik untuk unggah foto 0%</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={beforeFileRef}
                    onChange={(e) => handlePhotoUpload(e, true)}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Photo 100% */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Foto Sesudah (100%)</span>
                    {newAfterImg && (
                      <button
                        type="button"
                        onClick={() => setNewAfterImg(null)}
                        className="text-[11px] text-rose-500 hover:text-rose-700 cursor-pointer"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                  {newAfterImg ? (
                    <div className="h-32 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-100">
                      <img
                        src={newAfterImg}
                        alt="Sesudah 100%"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => afterFileRef.current?.click()}
                      className="h-32 border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition-colors"
                    >
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs text-slate-500">Klik untuk unggah foto 100%</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={afterFileRef}
                    onChange={(e) => handlePhotoUpload(e, false)}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Simpan Foto Dokumentasi
                </button>
              </div>
            </form>
          )}

          {/* List Photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localPhotos.map((photo, pIdx) => (
              <div
                key={photo.id}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      Dokumentasi #{pIdx + 1}
                    </span>
                    <h4 className="font-bold text-xs text-slate-800 mt-1">{photo.title}</h4>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Tanggal: {photo.dateStr || '2026-09-15'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg cursor-pointer transition-colors"
                    title="Hapus dokumentasi ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white text-center">
                    <span className="block text-[9px] font-bold uppercase py-0.5 bg-slate-100 text-slate-600">
                      Sebelum (0%)
                    </span>
                    <div className="h-28 flex items-center justify-center bg-slate-100">
                      {photo.fotoSebelumUrl ? (
                        <img
                          src={photo.fotoSebelumUrl}
                          alt="0%"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Tidak ada foto</span>
                      )}
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white text-center">
                    <span className="block text-[9px] font-bold uppercase py-0.5 bg-emerald-100 text-emerald-700">
                      Sesudah (100%)
                    </span>
                    <div className="h-28 flex items-center justify-center bg-slate-100">
                      {photo.fotoSesudahUrl || photo.imageUrl ? (
                        <img
                          src={photo.fotoSesudahUrl || photo.imageUrl}
                          alt="100%"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Tidak ada foto</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
