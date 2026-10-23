import React from 'react';
import { UserProfile } from '../types';

interface ReportBab1Props {
  periodLabelNormal: string;
  profile: UserProfile;
  startPageNumber: number;
}

export const ReportBab1: React.FC<ReportBab1Props> = ({
  periodLabelNormal,
  profile,
  startPageNumber,
}) => {
  const jabatanStr = profile.jabatan || 'Operator Layanan Operasional';

  return (
    <div className="a4-page bg-white p-[2.5cm] shadow-md mb-8 relative flex flex-col justify-between text-slate-900 font-serif leading-relaxed text-sm">
      <div className="space-y-4">
        {/* JUDUL BAB I */}
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-base font-bold tracking-wide">BAB I</h2>
          <h2 className="text-base font-bold tracking-wide uppercase">PENDAHULUAN</h2>
        </div>

        {/* 1.1 LATAR BELAKANG */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm">1.1 LATAR BELAKANG</h3>
          <p className="text-justify leading-relaxed indent-8">
            Dalam rangka mendukung kelancaran pelaksanaan tugas dan fungsi organisasi, diperlukan dukungan sumber daya manusia yang mampu melaksanakan kegiatan operasional dan pelayanan perkantoran secara efektif, tertib, dan berkesinambungan. Salah satu bentuk dukungan tersebut dilaksanakan melalui penempatan PPPK Paruh Waktu pada jabatan {jabatanStr}.
          </p>
          <p className="text-justify leading-relaxed indent-8">
            PPPK Paruh Waktu pada jabatan tersebut memiliki peran dalam membantu pelaksanaan kegiatan administrasi, layanan internal, pengelolaan kebutuhan umum, penataan dokumen, pengelolaan sarana dan prasarana, serta dukungan terhadap berbagai kegiatan kedinasan. Pelaksanaan tugas tersebut diperlukan untuk memastikan kegiatan operasional kantor dapat berjalan dengan baik dan memberikan pelayanan yang optimal kepada pegawai maupun unit kerja. Sejalan dengan kebutuhan organisasi, pelaksanaan tugas PPPK Paruh Waktu perlu diarahkan secara jelas berdasarkan peran, tanggung jawab, dan hasil yang diharapkan. Oleh karena itu, diperlukan uraian mengenai ruang lingkup pekerjaan dan hasil pelaksanaan sebagai dasar dalam pengelolaan, pemantauan, dan evaluasi kinerja PPPK Paruh Waktu.
          </p>
        </div>

        {/* 1.2 TUJUAN */}
        <div className="space-y-2 pt-2">
          <h3 className="font-bold text-sm">1.2 TUJUAN</h3>
          <p className="text-justify leading-relaxed">
            Tujuan penyusunan laporan pelaksanaan tugas dan fungsi jabatan {jabatanStr}, adalah sebagai bentuk pertanggungjawaban kinerja pegawai di lingkungan Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian, sesuai dengan uraian tugas yang tercantum dalam Matriks Peran Hasil (MPH) yang ditetapkan.
          </p>
        </div>

        {/* 1.3 WAKTU PELAKSANAAN */}
        <div className="space-y-2 pt-2">
          <h3 className="font-bold text-sm">1.3 WAKTU PELAKSANAAN</h3>
          <p className="text-justify leading-relaxed">
            Kegiatan {jabatanStr}. dilaksanakan di Kebun Pemeriksaan Substatif PVT I Manoko pada satuan Kerja Kantor Pusat Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian (PVTPP) pada periode {periodLabelNormal}.
          </p>
        </div>
      </div>

      <div className="text-right text-xs font-sans text-slate-500 pt-8">
        <span>{startPageNumber}</span>
      </div>
    </div>
  );
};
