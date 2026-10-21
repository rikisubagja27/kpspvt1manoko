import React, { useState, useMemo } from 'react';
import { DailyLogbookEntry, KehadiranType } from '../types';
import { LogbookEntryCard } from './LogbookEntryCard';
import { LogbookFormModal } from './LogbookFormModal';
import { formatIndonesianDate } from '../utils/logbookAggregator';
import {
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Building2,
  HeartHandshake,
  Palmtree,
  Calendar,
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKehadiran, setFilterKehadiran] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DailyLogbookEntry | null>(null);

  // State untuk menyembunyikan/menampilkan Form Input
  const [isFormVisible, setIsFormVisible] = useState(true);

  // Hitung Rekapitulasi Kehadiran
  const stats = useMemo(() => {
    let wfo = 0;
    let sakit = 0;
    let cuti = 0;

    entries.forEach((e) => {
      if (e.kehadiran === 'WFO') wfo++;
      else if (e.kehadiran === 'Sakit') sakit++;
      else if (e.kehadiran === 'Cuti') cuti++;
    });

    return { wfo, sakit, cuti, total: entries.length };
  }, [entries]);

  // Filter Entri
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const matchSearch =
        e.uraianPekerjaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.lokasiBlok && e.lokasiBlok.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (e.rincianOutput && e.rincianOutput.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchKehadiran =
        filterKehadiran === 'all' || e.kehadiran === filterKehadiran;

      return matchSearch && matchKehadiran;
    });
  }, [entries, searchTerm, filterKehadiran]);

  const handleOpenAddModal = () => {
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (entry: DailyLogbookEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Header Rekapitulasi Ringkas Saja (Poin 3 & 4) */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg border border-emerald-100 text-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Rekapitulasi Jumlah Kehadiran */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold">
          <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1.5 rounded-xl shadow-xs">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>WFO: <strong>{stats.wfo}</strong></span>
          </div>

          <div className="flex items-center space-x-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 px-3 py-1.5 rounded-xl shadow-xs">
            <HeartHandshake className="w-4 h-4 text-amber-600" />
            <span>Sakit: <strong>{stats.sakit}</strong></span>
          </div>

          <div className="flex items-center space-x-1.5 bg-blue-50 text-blue-800 border border-blue-200/80 px-3 py-1.5 rounded-xl shadow-xs">
            <Palmtree className="w-4 h-4 text-blue-600" />
            <span>Cuti: <strong>{stats.cuti}</strong></span>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
            <Calendar className="w-4 h-4 text-slate-600" />
            <span>Total: <strong>{stats.total} Catatan</strong></span>
          </div>
        </div>

        {/* Tombol Aksi: Tambah Logbook & Ikon Hide Form */}
        <div className="flex items-center space-x-2">
          {/* Tombol Sembunyikan/Tampilkan Form Input */}
          <button
            type="button"
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 text-xs transition-all cursor-pointer shadow-xs"
            title={isFormVisible ? 'Sembunyikan Form Input' : 'Tampilkan Form Input'}
          >
            {isFormVisible ? (
              <>
                <EyeOff className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Sembunyikan Form</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Tampilkan Form</span>
              </>
            )}
          </button>

          {/* Tombol Tambah Entri */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catatan Baru</span>
          </button>
        </div>
      </div>

      {/* Form Input Logbook Utama (Bisa Dihide/Show) */}
      {isFormVisible && (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border border-emerald-100 text-slate-800 transition-all">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <span>✍️ Form Input Logbook Kinerja Harian</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Kebun PVT I Manoko</span>
          </div>

          <p className="text-xs text-slate-600 mb-4">
            Pilih jenis kehadiran (WFO, Sakit, atau Cuti), tanggal kegiatan, serta uraian pekerjaan harian Anda secara lengkap.
          </p>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Buka Formulir Pengisian Logbook Baru</span>
          </button>
        </div>
      )}

      {/* Filter & Pencarian Daftar Entri */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-md border border-emerald-100/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari uraian atau lokasi..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="text-slate-500 shrink-0">Filter:</span>
          {['all', 'WFO', 'Sakit', 'Cuti'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterKehadiran(type)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                filterKehadiran === type
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type === 'all' ? 'Semua' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Kartu Logbook */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-sm border border-slate-200">
            Belum ada entri logbook yang sesuai dengan kriteria pencarian.
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <LogbookEntryCard
              key={entry.id}
              entry={entry}
              onEdit={handleOpenEditModal}
              onDelete={onDeleteEntry}
            />
          ))
        )}
      </div>

      {/* Modal Popup Formulir Tambah / Edit */}
      <LogbookFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingEntry}
        onSave={(data) => {
          if (editingEntry) {
            onUpdateEntry(data);
          } else {
            onAddEntry(data);
          }
          setIsFormOpen(false);
        }}
      />
    </div>
  );
};
