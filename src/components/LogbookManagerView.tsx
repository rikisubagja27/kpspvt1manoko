import React, { useState, useMemo } from 'react';
import { DailyLogbookEntry } from '../types';
import { LogbookEntryCard } from './LogbookEntryCard';
import { LogbookFormModal } from './LogbookFormModal';
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
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKehadiran, setFilterKehadiran] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DailyLogbookEntry | null>(null);

  // State untuk menyembunyikan/menampilkan Form Input
  const [isFormVisible, setIsFormVisible] = useState(true);

  // Rekapitulasi Kehadiran
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
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-4">
      {/* REKAPITULASI RINGKAS: Tanpa Judul Besar / Deskripsi Lama */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-emerald-500/30 text-white flex flex-wrap items-center justify-between gap-2.5">
        {/* Badge Jumlah Kehadiran (WFO, Sakit, Cuti, Total) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <div className="flex items-center space-x-1 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-xl">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>WFO: <strong className="text-white">{stats.wfo}</strong></span>
          </div>

          <div className="flex items-center space-x-1 bg-amber-950/90 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-xl">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
            <span>Sakit: <strong className="text-white">{stats.sakit}</strong></span>
          </div>

          <div className="flex items-center space-x-1 bg-blue-950/90 text-blue-300 border border-blue-500/40 px-2.5 py-1 rounded-xl">
            <Palmtree className="w-3.5 h-3.5 text-blue-400" />
            <span>Cuti: <strong className="text-white">{stats.cuti}</strong></span>
          </div>

          <div className="flex items-center space-x-1 bg-slate-800/90 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Total: <strong className="text-white">{stats.total} Catatan</strong></span>
          </div>
        </div>

        {/* Tombol Aksi: Ikon Hide Form di Pinggir Rekapitulasi */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all cursor-pointer shadow-xs"
            title={isFormVisible ? 'Sembunyikan Form Input' : 'Tampilkan Form Input'}
          >
            {isFormVisible ? (
              <EyeOff className="w-4 h-4 text-amber-400" />
            ) : (
              <Eye className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Catatan</span>
          </button>
        </div>
      </div>

      {/* Form Input Logbook Utama (Bisa Dihide/Show via Ikon Mata) */}
      {isFormVisible && (
        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-emerald-500/30 text-white">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-white text-xs sm:text-sm">
              ✍️ Form Input Logbook Kinerja Harian
            </h3>
            <span className="text-[10px] text-emerald-400 font-medium">Kebun PVT I Manoko</span>
          </div>

          <p className="text-[11px] text-slate-300 mb-3">
            Pilih jenis kehadiran (WFO, Sakit, atau Cuti), tanggal kegiatan, serta uraian pekerjaan harian Anda.
          </p>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buka Formulir Pengisian Logbook Baru</span>
          </button>
        </div>
      )}

      {/* Filter & Pencarian */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 shadow-md border border-slate-800 flex flex-col sm:flex-row gap-2.5 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari uraian pekerjaan..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400 shrink-0">Filter:</span>
          {['all', 'WFO', 'Sakit', 'Cuti'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterKehadiran(type)}
              className={`px-2 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filterKehadiran === type
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {type === 'all' ? 'Semua' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Kartu Logbook */}
      <div className="space-y-2.5">
        {filteredEntries.length === 0 ? (
          <div className="bg-slate-900/80 rounded-2xl p-6 text-center text-slate-400 text-xs shadow-sm border border-slate-800">
            Belum ada entri logbook yang tercatat.
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

      {/* Modal Popup Form Input */}
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
