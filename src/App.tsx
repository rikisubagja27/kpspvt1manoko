import React, { useState, useEffect } from 'react';

// Kunci penyimpanan draf otomatis
const DRAFT_STORAGE_KEY = 'kpspvt_logbook_draft_v1';

interface LogbookForm {
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  kegiatan: string;
  hasil: string;
  kategori: string;
  catatan: string;
}

const initialFormState: LogbookForm = {
  tanggal: new Date().toISOString().split('T')[0],
  waktuMulai: '08:00',
  waktuSelesai: '16:00',
  kegiatan: '',
  hasil: '',
  kategori: 'Pelayanan',
  catatan: ''
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'input' | 'riwayat' | 'laporan' | 'unduhan'>('input');
  const [formData, setFormData] = useState<LogbookForm>(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        return JSON.parse(savedDraft);
      }
    } catch (e) {
      console.error('Gagal membaca draf:', e);
    }
    return initialFormState;
  });

  const [isSavedAlert, setIsSavedAlert] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error('Gagal menyimpan draf:', e);
    }
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Hapus draf autosave
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      // Reset formulir
      setFormData(initialFormState);
      // Gulirkan layar ke paling atas
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Tampilkan notifikasi
      setIsSavedAlert(true);
      setTimeout(() => setIsSavedAlert(false), 4000);
    } catch (error) {
      console.error('Gagal menyimpan:', error);
      alert('Gagal menyimpan data kegiatan.');
    }
  };

  return(
    <>
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between text-gray-800 antialiased">
      {/* HEADER & LOGO PERMANEN */}
      <header className="bg-emerald-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/logo_kementan.svg"
              alt="Logo Kementan"
              className="h-10 w-auto object-contain flex-shrink-0"
            />
            <div>
              <h1 className="text-base sm:text-lg font-bold leading-tight">Logbook Kinerja</h1>
              <p className="text-xs text-emerald-100">KPSP VT1 Manoko</p>
            </div>
          </div>
        </div>

        {/* NAVIGASI MENU TERPISAH */}
        <nav className="bg-emerald-800 px-2 flex justify-around sm:justify-center sm:space-x-4 text-xs sm:text-sm font-medium border-t border-emerald-600 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('input')}
            className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'input'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-emerald-200 hover:text-white'
            }`}
          >
            📝 Pengisian Logbook
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('riwayat')}
            className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'riwayat'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-emerald-200 hover:text-white'
            }`}
          >
            📜 Riwayat
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('laporan')}
            className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'laporan'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-emerald-200 hover:text-white'
            }`}
          >
            📊 Laporan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('unduhan')}
            className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'unduhan'
                ? 'border-white text-white font-bold'
                : 'border-transparent text-emerald-200 hover:text-white'
            }`}
          >
            📥 Unduhan
          </button>
        </nav>
      </header>

      {/* KONTEN UTAMA */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 pb-20 sm:pb-8">
        {isSavedAlert && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded-lg text-sm flex items-center justify-between shadow-sm">
            <span>✅ Kegiatan berhasil disimpan dan formulir telah diperbarui!</span>
          </div>
        )}

        {/* HALAMAN AWAL: KHUSUS PENGISIAN LOGBOOK */}
        {activeTab === 'input' && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="border-b pb-3 mb-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Form Pengisian Harian</h2>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
                💾 Autosave Aktif
              </span>
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="tanggal" className="block text-xs font-semibold text-gray-600 mb-1">
                    Tanggal
                  </label>
                  <input
                    id="tanggal"
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                    className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="waktuMulai" className="block text-xs font-semibold text-gray-600 mb-1">
                    Jam Mulai
                  </label>
                  <input
                    id="waktuMulai"
                    type="time"
                    name="waktuMulai"
                    value={formData.waktuMulai}
                    onChange={handleChange}
                    className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="waktuSelesai" className="block text-xs font-semibold text-gray-600 mb-1">
                    Jam Selesai
                  </label>
                  <input
                    id="waktuSelesai"
                    type="time"
                    name="waktuSelesai"
                    value={formData.waktuSelesai}
                    onChange={handleChange}
                    className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="kategori" className="block text-xs font-semibold text-gray-600 mb-1">
                  Kategori Kegiatan
                </label>
                <select
                  id="kategori"
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  <option value="Pelayanan">Pelayanan</option>
                  <option value="Pemeliharaan">Pemeliharaan</option>
                  <option value="Administrasi">Administrasi</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label htmlFor="kegiatan" className="block text-xs font-semibold text-gray-600 mb-1">
                  Rincian Kegiatan
                </label>
                <textarea
                  id="kegiatan"
                  name="kegiatan"
                  rows={3}
                  value={formData.kegiatan}
                  onChange={handleChange}
                  placeholder="Masukkan detail kegiatan yang dilaksanakan..."
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-y"
                  required
                />
              </div>

              <div>
                <label htmlFor="hasil" className="block text-xs font-semibold text-gray-600 mb-1">
                  Hasil / Output
                </label>
                <input
                  id="hasil"
                  type="text"
                  name="hasil"
                  value={formData.hasil}
                  onChange={handleChange}
                  placeholder="Contoh: 1 Dokumen / 5 Sampel terproses"
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                *Klik tombol di atas untuk memfoto langsung dari HP atau memilih dari galeri.
              </p>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-3 px-4 rounded-lg shadow transition duration-150 ease-in-out text-base"
                >
                  💾 Simpan Kegiatan
                </button>
              </div>
            </form>
          </section>
        )}

        {/* MENU TERPISAH: RIWAYAT */}
        {activeTab === 'riwayat' && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Riwayat Kegiatan Logbook</h2>
            <p className="text-sm text-gray-500">Daftar riwayat logbook tersimpan akan muncul di sini.</p>
          </section>
        )}

        {/* MENU TERPISAH: LAPORAN */}
        {activeTab === 'laporan' && (
          <section className="bg-gray-200 rounded-lg p-4 overflow-auto flex justify-center">
            
            {/* BINGKAI KERTAS A4 (Sesuai Standar Laporan) */}
            <div 
              className="bg-white text-black shadow-xl"
              style={{ 
                width: '210mm', 
                minHeight: '297mm', 
                padding: '3cm 3cm 3cm 4cm', // Margin kiri 4cm, sisanya 3cm
                fontFamily: 'Arial, sans-serif'
              }}
            >
              
              {/* 1. HALAMAN COVER */}
              <div className="text-center flex flex-col justify-between" style={{ minHeight: '230mm' }}>
                
                {/* Bagian Atas: Logo & Judul */}
                <div>
                  {/* Tempat Logo (Bisa diganti tag <img> nanti) */}
                  <div className="mx-auto w-24 h-24 border border-gray-400 rounded-full flex items-center justify-center text-xs font-bold mb-6">
                    LOGO
                  </div>
                  
                  <h1 className="font-bold text-lg leading-relaxed">
                    LAPORAN KINERJA<br />
                    PELAKSANAAN TUGAS OPERASIONAL KANTOR<br />
                    TRIWULAN I TAHUN 2026
                  </h1>
                </div>

                {/* Bagian Tengah: Disusun Oleh */}
                <div className="mt-16">
                  <p className="mb-2">Disusun oleh :</p>
                  <h2 className="font-bold text-lg uppercase">
                    RIKI SUBAGJA<br />
                    199808272025211042<br />
                    Operator Layanan Operasional
                  </h2>
                </div>

                {/* Bagian Bawah: Instansi */}
                <div className="font-bold text-lg mt-16 leading-relaxed uppercase">
                  PUSAT PELINDUNGAN VARIETAS TANAMAN<br />
                  DAN PERIZINAN PERTANIAN<br />
                  2026
                </div>
              </div>

              {/* Garis Pemisah Halaman (Hanya terlihat di layar, hilang saat dicetak) */}
              <hr className="my-12 border-4 border-dashed border-gray-300 print:hidden" />

              {/* 2. HALAMAN BAB I */}
              <div className="text-center font-bold uppercase mb-6 leading-relaxed">
                BAB I<br />PENDAHULUAN
              </div>
              
              <div className="mb-4">
                <h3 className="font-bold text-md mb-2">1.1 LATAR BELAKANG</h3>
                <p className="text-justify" style={{ textIndent: '30px' }}>
                  Dalam rangka mendukung kelancaran pelaksanaan tugas dan fungsi organisasi, diperlukan dukungan sumber daya manusia yang mampu melaksanakan kegiatan operasional dan pelayanan perkantoran secara efektif, tertib, dan berkesinambungan. Salah satu bentuk dukungan tersebut dilaksanakan melalui penempatan PPPK Paruh Waktu pada jabatan Operator Layanan Operasional.
                </p>
              </div>

              {/* Tombol Cetak (Hanya muncul di pojok atas layar A4) */}
              <button 
                onClick={() => window.print()}
                className="fixed top-20 right-10 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 print:hidden"
                title="Cetak PDF A4"
              >
                🖨️ Cetak PDF
              </button>

            </div>
          </section>
        )}

        {/* MENU TERPISAH: UNDUHAN */}
        {activeTab === 'unduhan' && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Unduhan & Ekspor Data</h2>
            <p className="text-sm text-gray-500">Unduh data logbook dalam format PDF atau Word.</p>
          </section>
        )}
      </main>
    </div>
    </>
  );
}
