import React from 'react';
import { UserProfile } from '../types';

interface ReportBab3Props {
  periodLabelNormal: string;
  profile: UserProfile;
  endDateStr: string;
  pageNumber: number;
}

export const ReportBab3: React.FC<ReportBab3Props> = ({
  periodLabelNormal,
  profile,
  endDateStr,
  pageNumber,
}) => {
  const jabatanStr = profile.jabatan || 'Operator Layanan Operasional';
  const namaStr = profile.nama || 'RIKI SUBAGJA';
  const nipStr = profile.nip || '199808272025211042';

  return (
    <div className="a4-page bg-white p-[2.5cm] shadow-md mb-8 relative flex flex-col justify-between text-slate-900 font-serif leading-relaxed text-sm">
      <div className="space-y-6">
        {/* JUDUL BAB III */}
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-base font-bold tracking-wide">BAB III</h2>
          <h2 className="text-base font-bold tracking-wide uppercase">PENUTUP</h2>
        </div>

        {/* PARAGRAF PENUTUP */}
        <p className="text-justify leading-relaxed indent-8">
          Pada {periodLabelNormal}, pelaksanaan tugas PPPK Paruh Waktu jabatan {jabatanStr} telah mendukung kelancaran operasional KPS PVT I Manoko. Kegiatan utama meliputi pengolahan lahan, pemeliharaan, penyiraman, penyiangan dan pengendalian gulma, panen dan penanganan hasil panen, serta pelaksanaan uji BUSS, pembersihan area kerja, pemeliharaan sarana pendukung, dan dukungan kegiatan lainnya yang berhubungan dengan kegiatan operasional kebun. Secara umum kegiatan terlaksana secara tertib, efektif, dan sesuai dengan tugas serta mendukung pencapaian tujuan dan kelancaran tugas organisasi.
        </p>

        <p className="text-justify leading-relaxed">
          Demikian laporan ini disampaikan. Atas perhatian dan kerjasamanya, diucapkan terima kasih.
        </p>

        {/* TANDA TANGAN */}
        <div className="pt-8 flex justify-end font-sans text-xs">
          <div className="text-right space-y-1">
            <p>Bandung Barat, {endDateStr}</p>
            <p className="font-semibold">{jabatanStr}</p>
            <div className="h-20 flex items-center justify-end">
              {profile.useDigitalSignature && profile.signatureImage && (
                <img src={profile.signatureImage} alt="Tanda tangan" className="h-16 object-contain" />
              )}
            </div>
            <p className="font-bold underline uppercase">{namaStr}</p>
            <p>{nipStr}</p>
          </div>
        </div>
      </div>

      <div className="text-right text-xs font-sans text-slate-500 pt-8">
        <span>{pageNumber}</span>
      </div>
    </div>
  );
};
