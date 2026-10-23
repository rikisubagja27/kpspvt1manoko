import React, { useState } from 'react';
import { DailyLogbookEntry } from '../types';
import { formatIndonesianDate } from '../utils/logbookAggregator';
import { Plus, Trash2, Edit2, Calendar, Clock, MapPin, FileText, Sparkles } from 'lucide-react';

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
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [jamMulai, setJamMulai] = useState<string>('07:30');
  const [jamSelesai, setJamSelesai] = useState<string>('16:00');
  const [kehadiran, setKehadiran] = useState<'WFO' | 'Sakit' | 'Cuti'>('WFO');
  const [uraianPekerjaan, setUraianPekerjaan] = useState<string>('');
  const [lokasiBlok, setLokasiBlok] = useState<string>('Kebun PVT I Manoko');
  const [fotoSebelumUrl, setFotoSebelumUrl] = useState<string>('');
  const [fotoSesudahUrl, setFotoSesudahUrl] = useState<string>('');
  const [fotoSuratSakitUrl, setFotoSuratSakitUrl] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uraianPekerjaan.trim()) return;

    if (editingId) {
      onUpdateEntry({
        id: editingId,
        tanggal,
        jamMulai,
        jamSelesai,
        kehadiran,
        uraianPekerjaan,
        lokasiBlok,
        fotoSebelumUrl,
        fotoSesudahUrl,
        fotoSuratSakitUrl,
        showInReport: true,
      });
      setEditingId(null);
    } else {
      onAddEntry({
        id: `entry-${Date.now()}`,
        tanggal,
        jamMulai,
        jamSelesai,
        kehadiran,
        uraianPekerjaan,
        lokasiBlok,
        fotoSebelumUrl,
        fotoSesudahUrl,
        fotoSuratSakitUrl,
        showInReport: true,
      });
    }

    setUraianPekerjaan('');
    setFotoSebelumUrl('');
    setFotoSesudahUrl('');
    setFotoSuratSakitUrl('');
  };

  const handleEdit = (entry: DailyLogbookEntry) => {
    setEditingId(entry.id);
    setTanggal(entry.tanggal);
    setJamMulai(entry.jamMulai || '07:30');
    setJamSelesai(entry.jamSelesai || '16:00');
    setKehadiran(entry.kehadiran || 'WFO');
    setUraianPekerjaan(entry.uraianPekerjaan);
    setLokasiBlok(entry.lokasiBlok || 'Kebun PVT I Manoko');
    setFotoSebelumUrl(entry.fotoSebelumUrl || '');
    setFotoSesudahUrl(entry.fotoSesudahUrl || '');
    setFotoSuratSakitUrl(entry.fotoSuratSakitUrl || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setUraianPekerjaan('');
    setFotoSebelumUrl('');
    setFotoSesudahUrl('');
    setFotoSuratSakitUrl('');
  };

  return (
    <div className="space-y-6">
      {/* Form Input */}
      <div className="bg-slate-900/90 border border-emerald-800/80 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
        <h2 className="text-base sm:text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span>{editingId ? 'Edit Catatan Logbook' : 'Tambah Catatan Logbook Harian'}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tanggal</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full bg-slate-950 border border-emerald-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Jam Kerja</label>
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={jamMulai}
                  onChange={(e) => setJamMulai(e.target.value)}
                  placeholder="07:30"
                  className="w-1/2 bg-slate-950 border border-emerald-800/80 rounded-xl px-2 py-2 text-xs text-white text-center focus:outline-none focus:border-emerald-500"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="text"
                  value={jamSelesai}
                  onChange={(e) => setJamSelesai(e.target.value)}
                  placeholder="16:00"
                  className="w-1/2 bg-slate-950 border border-emerald-800/80 rounded-xl px-2 py-2 text-xs text-white text-center focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status Kehadiran</label>
              <select
                value={kehadiran}
                onChange={(e) => setKehadiran(e.target.value as 'WFO' | 'Sakit' | 'Cuti')}
                className="w-full bg-slate-950 border border-emerald-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="WFO">WFO (Hadir di Kebun)</option>
                <option value="Sakit">Sakit</option>
                <option value="Cuti">Cuti</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Uraian Pekerjaan / Kegiatan</label>
            <textarea
              value={uraianPekerjaan}
              onChange={(e) => setUraianPekerjaan(e.target.value)}
              rows={3}
              placeholder="Contoh: Pemeliharaan & Sanitasi Lahan di Blok B2..."
              className="w-full bg-slate-950 border border-emerald-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Lokasi / Blok</label>
              <input
                type="text"
                value={lokasiBlok}
                onChange={(e) => setLokasiBlok(e.target.value)}
                placeholder="Contoh: Blok B2, Kebun PVT I Manoko"
                className="w-full bg-slate-950 border border-emerald-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {kehadiran === 'Sakit' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL Foto Surat Sakit</label>
                <input
                  type="text"
                  value={fotoSuratSakitUrl}
                  onChange={(e) => setFotoSuratSakitUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-emerald-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Foto Sebelum (URL)</label>
                  <input
                    type="text"
                    value={fotoSebelumUrl}
                    onChange={(e) => setFotoSebelumUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-emerald-800/80 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Foto Sesudah (URL)</label>
                  <input
                    type="text"
                    value={fotoSesudahUrl}
                    onChange={(e) => setFotoSesudahUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-emerald-800/80 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{editingId ? 'Simpan Perubahan' : 'Tambah Ke Logbook'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Logbook */}
      <div className="bg-slate-900/90 border border-emerald-800/80 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Daftar Logbook Tersimpan ({entries.length})</span>
          </h3>
          <button
            type="button"
            onClick={onNavigateToReport}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline"
          >
            Lihat Tampilan Laporan A4 →
          </button>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {entries.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">Belum ada catatan logbook. Silakan tambah di atas.</p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-800/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-white flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      {formatIndonesianDate(entry.tanggal)}
                    </span>
                    {entry.jamMulai && (
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3" />
                        {entry.jamMulai} - {entry.jamSelesai}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        entry.kehadiran === 'WFO'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                          : entry.kehadiran === 'Sakit'
                          ? 'bg-amber-950 text-amber-300 border border-amber-700/50'
                          : 'bg-blue-950 text-blue-300 border border-blue-700/50'
                      }`}
                    >
                      {entry.kehadiran}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 font-medium leading-relaxed">{entry.uraianPekerjaan}</p>

                  {entry.lokasiBlok && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {entry.lokasiBlok}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleEdit(entry)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-semibold transition-colors border border-rose-800/40"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
