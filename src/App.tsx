Import React, { useState, useMemo, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  DEFAULT_DOCUMENTATION_PHOTOS,
  DEFAULT_MONTHLY_WEEKS,
  DEFAULT_TRIWULAN_ACTIVITIES,
  DEFAULT_USER_PROFILE,
  generateDefaultMonthWeeks,
  generateTahunanActivities,
} from './data/defaultData';
import { DEFAULT_LOGBOOK_ENTRIES } from './data/defaultLogbookEntries';
import {
  DailyLogbookEntry,
  DocumentationPhoto,
  PeriodActivityRow,
  PeriodType,
  UserProfile,
} from './types';
import {
  getDefaultEndDate,
  getPeriodBadgeDesc,
  getPeriodLabelNormal,
  getPeriodTitleCaps,
} from './utils/reportHelpers';
import { compileLogbookToTable1, formatIndonesianDate } from './utils/logbookAggregator';
import { PeriodSelector } from './components/PeriodSelector';
import { ReportCover } from './components/ReportCover';
import { ReportBab1 } from './components/ReportBab1';
import { ReportBab2Table1 } from './components/ReportBab2Table1';
import { ReportBab2Table2 } from './components/ReportBab2Table2';
import { ReportBab3 } from './components/ReportBab3';
import { LogbookManagerView } from './components/LogbookManagerView';
import { EditProfileModal } from './components/EditProfileModal';
import { EditActivityModal } from './components/EditActivityModal';
import { AddPhotoModal } from './components/AddPhotoModal';
import { SignatureModal } from './components/SignatureModal';
import { CustomLogoSelectorModal, PRESET_LOGOS } from './components/CustomLogoSelectorModal';
import { GoogleDriveSyncModal } from './components/GoogleDriveSyncModal';
import { exportReportToWord } from './utils/wordExport';
import { exportReportToPdf } from './utils/pdfExport';
import { auth, initAuth } from './services/firebaseAuth';
import {
  Printer,
  FileDown,
  UserCheck,
  ListPlus,
  Camera,
  PenTool,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Sparkles,
  ClipboardList,
  ArrowRight,
  Cloud,
  Download,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('logbook');

  const [periodType, setPeriodType] = useState<PeriodType>('triwulan');
  const [selectedMonth, setSelectedMonth] = useState<number>(7);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(3);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // State utama untuk menyembunyikan seluruh menu atas
  const [isMenuHidden, setIsMenuHidden] = useState<boolean>(false);

  // Autosave logbookEntries
  const [logbookEntries, setLogbookEntries] = useState<DailyLogbookEntry[]>(() => {
    const saved = localStorage.getItem('kpspvt_logbook_entries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Gagal memuat data tersimpan:', e);
      }
    }
    return DEFAULT_LOGBOOK_ENTRIES;
  });

  const [saveStatus, setSaveStatus] = useState<string>('Tersimpan otomatis');

  useEffect(() => {
    setSaveStatus('Menyimpan...');
    const timer = setTimeout(() => {
      localStorage.setItem('kpspvt_logbook_entries', JSON.stringify(logbookEntries));
      setSaveStatus('Tersimpan otomatis');
    }, 400);

    return () => clearTimeout(timer);
  }, [logbookEntries]);

  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [activitiesOverride, setActivitiesOverride] = useState<Record<string, PeriodActivityRow[]>>({});
  const [extraPhotos, setExtraPhotos] = useState<DocumentationPhoto[]>([]);

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  const [headerLogoUrl, setHeaderLogoUrl] = useState<string>(() => {
    return localStorage.getItem('app_header_logo') || PRESET_LOGOS[0].url;
  });
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isGoogleDriveModalOpen, setIsGoogleDriveModalOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => setCurrentUser(user),
      () => setCurrentUser(null)
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const activePeriodKey = useMemo(() => {
    if (periodType === 'bulanan') return `m-${selectedMonth}-${selectedYear}`;
    if (periodType === 'triwulan') return `q-${selectedQuarter}-${selectedYear}`;
    return `y-${selectedYear}`;
  }, [periodType, selectedMonth, selectedQuarter, selectedYear]);

  const activeActivities: PeriodActivityRow[] = useMemo(() => {
    if (activitiesOverride[activePeriodKey]) {
      return activitiesOverride[activePeriodKey];
    }
    const compiled = compileLogbookToTable1(
      logbookEntries,
      periodType,
      selectedMonth,
      selectedQuarter,
      selectedYear
    );
    if (compiled && compiled.length > 0) {
      return compiled;
    }
    if (periodType === 'triwulan') {
      return DEFAULT_TRIWULAN_ACTIVITIES[selectedQuarter] || DEFAULT_TRIWULAN_ACTIVITIES[3];
    }
    if (periodType === 'bulanan') {
      if (DEFAULT_MONTHLY_WEEKS[selectedMonth]) {
        return DEFAULT_MONTHLY_WEEKS[selectedMonth];
      }
      return generateDefaultMonthWeeks(selectedMonth, selectedYear);
    }
    return generateTahunanActivities(selectedYear);
  }, [activitiesOverride, activePeriodKey, logbookEntries, periodType, selectedMonth, selectedQuarter, selectedYear]);

  const activePhotos: DocumentationPhoto[] = useMemo(() => {
    const logbookPhotos: DocumentationPhoto[] = logbookEntries
      .filter(
        (e) =>
          (Boolean(e.fotoSebelumUrl) ||
            Boolean(e.fotoSesudahUrl) ||
            Boolean(e.fotoUrl) ||
            Boolean(e.fotoSuratSakitUrl)) &&
          e.showInReport !== false
      )
      .map((e) => {
        if (e.kehadiran === 'Sakit' && e.fotoSuratSakitUrl) {
          return {
            id: `doc-sakit-${e.id}`,
            title: `Surat Keterangan Sakit (${formatIndonesianDate(e.tanggal)}) - ${e.uraianPekerjaan}`,
            imageUrl: e.fotoSuratSakitUrl,
            dateStr: formatIndonesianDate(e.tanggal),
            locationName: 'Fasilitas Kesehatan / Klinik',
            showGpsBadge: false,
          };
        }
        const primary = e.fotoSesudahUrl || e.fotoUrl || e.fotoSebelumUrl || '';
        return {
          id: `doc-${e.id}`,
          title: e.fotoTitle || e.uraianPekerjaan.slice(0, 75),
          imageUrl: primary,
          fotoSebelumUrl: e.fotoSebelumUrl,
          fotoSesudahUrl: e.fotoSesudahUrl,
          dateStr: formatIndonesianDate(e.tanggal),
          timeStr: e.jamMulai ? `${e.jamMulai} WIB` : undefined,
          coordinates: 'S 6°48\'16.074", E 107°36\'50.629"',
          locationName: e.lokasiBlok || 'Kebun PVT I Manoko, Bandung Barat',
          elevation: '1290.0 m a.s.l.',
          speed: '0.0km/h',
          direction: '180° S',
          showGpsBadge: true,
        };
      });

    if (extraPhotos.length > 0) {
      return [...extraPhotos, ...logbookPhotos];
    }
    return logbookPhotos.length > 0 ? logbookPhotos : DEFAULT_DOCUMENTATION_PHOTOS;
  }, [logbookEntries, extraPhotos]);

  const periodTitleCaps = useMemo(
    () => getPeriodTitleCaps(periodType, selectedMonth, selectedQuarter, selectedYear),
    [periodType, selectedMonth, selectedQuarter, selectedYear]
  );

  const periodLabelNormal = useMemo(
    () => getPeriodLabelNormal(periodType, selectedMonth, selectedQuarter, selectedYear),
    [periodType, selectedMonth, selectedQuarter, selectedYear]
  );

  const defaultEndDate = useMemo(
    () => getDefaultEndDate(periodType, selectedMonth, selectedQuarter, selectedYear),
    [periodType, selectedMonth, selectedQuarter, selectedYear]
  );

  const activeSummary = useMemo(
    () => getPeriodBadgeDesc(periodType, selectedMonth, selectedQuarter, selectedYear),
    [periodType, selectedMonth, selectedQuarter, selectedYear]
  );

  const isTriwulanThreeRows = periodType === 'triwulan' && activeActivities.length === 3;
  const table1PageCount = isTriwulanThreeRows
    ? 2
    : Math.max(1, Math.ceil(activeActivities.length / (periodType === 'bulanan' ? 3 : 2)));

  const table1StartPage = 4;
  const table2StartPage = table1StartPage + table1PageCount;

  const table2PageCount =
    activePhotos.length <= 3
      ? 1
      : activePhotos.length <= 7
      ? 2
      : Math.ceil((activePhotos.length - 7) / 4) + 2;

  const penutupPageNumber = table2StartPage + table2PageCount;
  const totalPages = penutupPageNumber;

  const handleAddLogbookEntry = (newEntry: DailyLogbookEntry) => {
    setLogbookEntries((prev) => [newEntry, ...prev]);
  };

  const handleUpdateLogbookEntry = (updated: DailyLogbookEntry) => {
    setLogbookEntries((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDeleteLogbookEntry = (id: string) => {
    setLogbookEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = async () => {
    try {
      setIsExportingWord(true);
      await exportReportToWord({
        periodType,
        periodTitleCaps,
        periodLabelNormal,
        year: selectedYear,
        profile,
        activities: activeActivities,
        photos: activePhotos,
        endDateStr: defaultEndDate,
      });
    } catch (err) {
      console.error('Failed to export Word document:', err);
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      if (activeTab !== 'report') {
        setActiveTab('report');
        await new Promise((resolve) => setTimeout(resolve, 450));
      }
      const fileNameClean = `Laporan_Kinerja_${periodLabelNormal.replace(/\s+/g, '_')}_${profile.nama.replace(/\s+/g, '_')}.pdf`;
      await exportReportToPdf({
        fileName: fileNameClean,
        elementId: 'report-print-container',
      });
    } catch (err: any) {
      console.error('Failed to export PDF:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleSaveActivities = (updated: PeriodActivityRow[]) => {
    setActivitiesOverride((prev) => ({
      ...prev,
      [activePeriodKey]: updated,
    }));
  };

  const handleResetActivities = () => {
    setActivitiesOverride((prev) => {
      const copy = { ...prev };
      delete copy[activePeriodKey];
      return copy;
    });
  };

  const handleAddPhoto = (newPhoto: DocumentationPhoto) => {
    setExtraPhotos((prev) => [newPhoto, ...prev]);
  };

  const handleSaveSignature = (sigUrl?: string) => {
    setProfile((prev) => ({
      ...prev,
      signatureImage: sigUrl,
      useDigitalSignature: true,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-200/80 text-slate-800 flex flex-col font-sans select-text">
      {/* Tombol Melayang / Bar Kecil Paling Atas untuk Sembunyikan/Tampilkan Menu */}
      {activeTab === 'report' && (
        <div className="bg-slate-900 text-white px-4 py-2.5 border-b border-slate-700 flex items-center justify-between text-xs no-print sticky top-0 z-50 shadow-md">
          <button
            type="button"
            onClick={() => setIsMenuHidden(!isMenuHidden)}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shadow-sm"
          >
            {isMenuHidden ? (
              <>
                <Eye className="w-4 h-4 text-emerald-200" />
                <span>Tampilkan Menu Atas</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 text-emerald-200" />
                <span>Sembunyikan Menu Atas (Fullscreen)</span>
              </>
            )}
          </button>

          {/* Zoom Controls yang selalu aktif */}
          <div className="flex items-center space-x-1 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.max(50, prev - 10))}
              className="p-1 hover:text-emerald-400 cursor-pointer"
              title="Perkecil"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs px-1.5 text-slate-200">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))}
              className="p-1 hover:text-emerald-400 cursor-pointer"
              title="Perbesar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="p-1 hover:text-emerald-400 cursor-pointer"
              title="Reset"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header Utama & Panel Kontrol (Hanya tampil jika isMenuHidden bernilai false)  */}
      {!isMenuHidden && (
        <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-12 z-30 shadow-md no-print">
          <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <div
                onClick={() => setIsLogoModalOpen(true)}
                className="relative group w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer shadow-xs transition-all"
              >
                {headerLogoUrl === 'DEFAULT_ICON' ? (
                  <div className="w-full h-full bg-emerald-600 flex items-center justify-center font-bold text-white">
                    <ClipboardList className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <img src={headerLogoUrl} alt="Logo" className="w-full h-full object-contain p-0.5" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-sm sm:text-base font-bold tracking-tight text-white">
                    Logbook Kinerja PVT I Manoko
                  </h1>
                  <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded">
                    Kementan RI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-sm sm:max-w-md flex items-center gap-2">
                  <span>Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian</span>
                  <span className="text-emerald-400 font-semibold text-[10px] bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                    ● {saveStatus}
                  </span>
                </p>
              </div>
            </div>

            {/* Primary View Switcher & Action Menu */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveTab('logbook')}
                  className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'logbook'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>📝 Isi Logbook</span>
                  <span className="bg-emerald-950/60 text-emerald-200 px-1.5 py-0.2 rounded-full text-[10px]">
                    {logbookEntries.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('report')}
                  className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'report'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>📄 Laporan A4</span>
                </button>
              </div>

              {/* Export Word */}
              <button
                type="button"
                onClick={handleExportWord}
                disabled={isExportingWord}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <FileDown className="w-4 h-4" />
                <span>{isExportingWord ? 'Menyiapkan...' : 'Word'}</span>
              </button>

              {/* Export PDF */}
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExportingPdf ? 'Menyiapkan...' : 'PDF'}</span>
              </button>

              {/* Print */}
              <button
                type="button"
                onClick={() => {
                  if (activeTab !== 'report') setActiveTab('report');
                  setTimeout(() => handlePrint(), 100);
                }}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>

              {/* Google Drive */}
              <button
                type="button"
                onClick={() => setIsGoogleDriveModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
              >
                <Cloud className="w-4 h-4 text-blue-400" />
                <span>Drive</span>
              </button>
            </div>
          </div>

          {/* Period Selector Bar */}
          {activeTab === 'report' && (
            <PeriodSelector
              periodType={periodType}
              setPeriodType={setPeriodType}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedQuarter={selectedQuarter}
              setSelectedQuarter={setSelectedQuarter}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              activeSummary={activeSummary}
            />
          )}

          {/* Secondary Action Buttons (Edit Profil, Kustom Tabel, dll) */}
          {activeTab === 'report' && (
            <div className="bg-slate-800/90 px-4 py-2 border-t border-slate-700/60 text-xs">
              <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600 transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Edit Profil & Pejabat</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(true)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600 transition-colors cursor-pointer"
                >
                  <ListPlus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Kustom Tabel 1 ({activeActivities.length} Baris)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tambah Foto ({activePhotos.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSignatureModalOpen(true)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600 transition-colors cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5 text-purple-400" />
                  <span>Tanda Tangan</span>
                </button>
              </div>
            </div>
          )}
        </header>
      )}

      {/* Main Content Area */}
      {activeTab === 'logbook' ? (
        <main className="flex-1 pb-16">
          <LogbookManagerView
            entries={logbookEntries}
            onAddEntry={handleAddLogbookEntry}
            onUpdateEntry={handleUpdateLogbookEntry}
            onDeleteEntry={handleDeleteLogbookEntry}
            onNavigateToReport={() => setActiveTab('report')}
            selectedMonth={selectedMonth}
            selectedQuarter={selectedQuarter}
            selectedYear={selectedYear}
          />
        </main>
      ) : (
        <main className="flex-1 flex flex-col items-center">
          {/* Notice Banner */}
          {!isMenuHidden && (
            <div className="w-full bg-emerald-50 border-b border-emerald-200/80 py-1.5 px-4 text-center text-xs text-emerald-900 no-print flex items-center justify-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Format Laporan Kinerja A4. Dirangkum otomatis dari <strong>{logbookEntries.length} entri logbook</strong>.
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('logbook')}
                className="ml-2 font-bold text-emerald-800 underline hover:text-emerald-950 inline-flex items-center space-x-1 cursor-pointer"
              >
                <span>Isi Buku Logbook</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Main A4 Document Workspace */}
          <div className="w-full py-8 px-2 sm:px-6 overflow-x-auto flex justify-center items-start print:p-0 print:m-0 print:overflow-visible">
            <div
              id="report-print-container"
              className="print-area flex flex-col gap-10 items-center transition-transform origin-top print:gap-0 print:block"
              style={{
                transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
              }}
            >
              <ReportCover
                periodTitleCaps={periodTitleCaps}
                year={selectedYear}
                profile={profile}
              />
              <ReportBab1
                periodLabelNormal={periodLabelNormal}
                profile={profile}
                startPageNumber={2}
              />
              <ReportBab2Table1
                periodType={periodType}
                periodLabelNormal={periodLabelNormal}
                profile={profile}
                activities={activeActivities}
                startPageNumber={table1StartPage}
              />
              <ReportBab2Table2
                photos={activePhotos}
                startPageNumber={table2StartPage}
              />
              <ReportBab3
                periodLabelNormal={periodLabelNormal}
                profile={profile}
                endDateStr={defaultEndDate}
                pageNumber={penutupPageNumber}
              />
            </div>
          </div>
        </main>
      )}

      {/* Modals */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={(updated) => setProfile(updated)}
      />

      <EditActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        activities={activeActivities}
        onSave={handleSaveActivities}
        onReset={handleResetActivities}
        periodTitle={periodLabelNormal}
      />

      <AddPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onAddPhoto={handleAddPhoto}
      />

      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        currentSignatureUrl={profile.signatureImage}
        onSaveSignature={handleSaveSignature}
      />

      <CustomLogoSelectorModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        currentLogoUrl={headerLogoUrl}
        onSelectLogo={(logoUrl) => setHeaderLogoUrl(logoUrl)}
      />

      <GoogleDriveSyncModal
        isOpen={isGoogleDriveModalOpen}
        onClose={() => setIsGoogleDriveModalOpen(false)}
        currentUser={currentUser}
        onAuthChange={(user) => setCurrentUser(user)}
        logbookEntries={logbookEntries}
        profile={profile}
        activePeriodType={periodType}
        periodTitleCaps={periodTitleCaps}
        periodLabelNormal={periodLabelNormal}
        selectedYear={selectedYear}
        activities={activeActivities}
        defaultEndDate={defaultEndDate}
        onRestoreEntries={(restoredEntries) => setLogbookEntries(restoredEntries)}
      />
    </div>
  );
}
