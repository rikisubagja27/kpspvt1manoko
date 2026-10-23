import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  PageBreak,
  Footer,
  PageNumber,
} from 'docx';
import { saveAs } from 'file-saver';
import { DocumentationPhoto, PeriodActivityRow, PeriodType, UserProfile } from '../types';

interface ExportReportParams {
  periodType: PeriodType;
  periodTitleCaps: string;
  periodLabelNormal: string;
  year: number;
  profile: UserProfile;
  activities: PeriodActivityRow[];
  photos: DocumentationPhoto[];
  endDateStr: string;
}

export async function exportReportToWord({
  periodTitleCaps,
  periodLabelNormal,
  year,
  profile,
  activities,
  endDateStr,
}: ExportReportParams) {
  const borderStyle = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
  const tableBorderOption = {
    top: borderStyle,
    bottom: borderStyle,
    left: borderStyle,
    right: borderStyle,
    insideHorizontal: borderStyle,
    insideVertical: borderStyle,
  };

  const namaUser = profile.nama || "RIKI SUBAGJA";
  const nipUser = profile.nip || "199808272025211042";
  const jabatanUser = profile.jabatan || "Operator Layanan Operasional";

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ children: [PageNumber.CURRENT], size: 20, font: "Arial" }),
                ],
              }),
            ],
          }),
        },
        children: [
          // ================= COVER PAGE =================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
            children: [new TextRun({ text: "LAPORAN KINERJA", bold: true, size: 32, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [new TextRun({ text: "PELAKSANAAN TUGAS OPERASIONAL KANTO/KEBUN", bold: true, size: 26, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
            children: [new TextRun({ text: `${periodTitleCaps} TAHUN ${year}`, bold: true, size: 26, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 600, after: 150 },
            children: [new TextRun({ text: "Disusun oleh :", size: 24, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [new TextRun({ text: namaUser.toUpperCase(), bold: true, size: 26, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [new TextRun({ text: nipUser, size: 24, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 1200 },
            children: [new TextRun({ text: jabatanUser, size: 24, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [new TextRun({ text: "PUSAT PELINDUNGAN VARIETAS TANAMAN", bold: true, size: 24, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [new TextRun({ text: "DAN PERIZINAN PERTANIAN", bold: true, size: 24, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [new TextRun({ text: `${year}`, bold: true, size: 24, font: "Arial" })],
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= BAB I PENDAHULUAN =================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 80 },
            children: [new TextRun({ text: "BAB I", bold: true, size: 24, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [new TextRun({ text: "PENDAHULUAN", bold: true, size: 24, font: "Arial" })],
          }),

          // 1.1 LATAR BELAKANG
          new Paragraph({
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: "1.1 LATAR BELAKANG", bold: true, size: 22, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFY,
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: "Dalam rangka mendukung kelancaran pelaksanaan tugas dan fungsi organisasi, diperlukan dukungan sumber daya manusia yang mampu melaksanakan kegiatan operasional dan pelayanan perkantoran secara efektif, tertib, dan berkesinambungan. Salah satu bentuk dukungan tersebut dilaksanakan melalui penempatan PPPK Paruh Waktu pada jabatan Operator Layanan Operasional.",
                size: 22,
                font: "Arial",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFY,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "PPPK Paruh Waktu pada jabatan tersebut memiliki peran dalam membantu pelaksanaan kegiatan administrasi, layanan internal, pengelolaan kebutuhan umum, penataan dokumen, pengelolaan sarana dan prasarana, serta dukungan terhadap berbagai kegiatan kedinasan. Pelaksanaan tugas tersebut diperlukan untuk memastikan kegiatan operasional kantor dapat berjalan dengan baik dan memberikan pelayanan yang optimal kepada pegawai maupun unit kerja. Sejalan dengan kebutuhan organisasi, pelaksanaan tugas PPPK Paruh Waktu perlu diarahkan secara jelas berdasarkan peran, tanggung jawab, dan hasil yang diharapkan. Oleh karena itu, diperlukan uraian mengenai ruang lingkup pekerjaan dan hasil pelaksanaan sebagai dasar dalam pengelolaan, pemantauan, dan evaluasi kinerja PPPK Paruh Waktu.",
                size: 22,
                font: "Arial",
              }),
            ],
          }),

          // 1.2 TUJUAN
          new Paragraph({
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: "1.2 TUJUAN", bold: true, size: 22, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFY,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Tujuan penyusunan laporan pelaksanaan tugas dan fungsi jabatan ${jabatanUser}, adalah sebagai bentuk pertanggungjawaban kinerja pegawai di lingkungan Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian, sesuai dengan uraian tugas yang tercantum dalam Matriks Peran Hasil (MPH) yang ditetapkan.`,
                size: 22,
                font: "Arial",
              }),
            ],
          }),

          // 1.3 WAKTU PELAKSANAAN
          new Paragraph({
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: "1.3 WAKTU PELAKSANAAN", bold: true, size: 22, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFY,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `Kegiatan ${jabatanUser}. dilaksanakan di Kebun Pemeriksaan Substatif PVT I Manoko pada satuan Kerja Kantor Pusat Pusat Pelindungan Varietas Tanaman dan Perizinan Pertanian (PVTPP) pada periode ${periodLabelNormal}.`,
                size: 22,
                font: "Arial",
              }),
            ],
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= BAB II AKUNTABILITAS KINERJA =================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 80 },
            children: [new TextRun({ text: "BAB II", bold: true, size: 24, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [new TextRun({ text: "AKUNTABILITAS KINERJA", bold: true, size: 24, font: "Arial" })],
          }),
          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [new TextRun({ text: "2.1 HASIL PELAKSANAAN", bold: true, size: 22, font: "Arial" })],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [new TextRun({ text: `Kegiatan ${jabatanUser}`, size: 22, font: "Arial" })],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [new TextRun({ text: `Tabel 1. Rincian kegiatan operator layanan operasional ${periodLabelNormal}.`, italic: true, size: 20, font: "Arial" })],
          }),

          // TABEL 1
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorderOption,
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "No.", bold: true, size: 20, font: "Arial" })] })] }),
                  new TableCell({ width: { size: 18, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Bulan", bold: true, size: 20, font: "Arial" })] })] }),
                  new TableCell({ width: { size: 48, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Rincian Pekerjaan", bold: true, size: 20, font: "Arial" })] })] }),
                  new TableCell({ width: { size: 26, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Keterangan", bold: true, size: 20, font: "Arial" })] })] }),
                ],
              }),
              ...activities.map((row, idx) => {
                const bullets = row.rincianList || (row.rincianPekerjaan ? row.rincianPekerjaan.split('\n') : []);
                return new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${idx + 1}`, size: 20, font: "Arial" })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.periodeLabel || `-`, bold: true, size: 20, font: "Arial" })] })] }),
                    new TableCell({
                      children: bullets.map(
                        (item) => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: item.startsWith('•') ? item : `• ${item}`, size: 19, font: "Arial" })] })
                      ),
                    }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.keterangan || "Kebun PVT I Manoko", size: 19, font: "Arial" })] })] }),
                  ],
                });
              }),
            ],
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ================= BAB III PENUTUP =================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 80 },
            children: [new TextRun({ text: "BAB III", bold: true, size: 24, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [new TextRun({ text: "PENUTUP", bold: true, size: 24, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFY,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Pada ${periodLabelNormal}, pelaksanaan tugas PPPK Paruh Waktu jabatan ${jabatanUser} telah mendukung kelancaran operasional KPS PVT I Manoko. Kegiatan utama meliputi pengolahan lahan, pemeliharaan, penyiraman, penyiangan dan pengendalian gulma, panen dan penanganan hasil panen, serta pelaksanaan uji BUSS, pembersihan area kerja, pemeliharaan sarana pendukung, dan dukungan kegiatan lainnya yang berhubungan dengan kegiatan operasional kebun. Secara umum kegiatan terlaksana secara tertib, efektif, dan sesuai dengan tugas serta mendukung pencapaian tujuan dan kelancaran tugas organisasi.`,
                size: 22,
                font: "Arial",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFY,
            spacing: { after: 400 },
            children: [
              new TextRun({ text: "Demikian laporan ini disampaikan. Atas perhatian dan kerjasamanya, diucapkan terima kasih.", size: 22, font: "Arial" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 50 },
            children: [new TextRun({ text: `Bandung Barat, ${endDateStr}`, size: 22, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 600 },
            children: [new TextRun({ text: jabatanUser, size: 22, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 50 },
            children: [new TextRun({ text: namaUser, bold: true, size: 22, font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: nipUser, size: 22, font: "Arial" })],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanFileName = `Laporan_Kinerja_${periodLabelNormal.replace(/\s+/g, "_")}_${namaUser.replace(/\s+/g, "_")}.docx`;
  saveAs(blob, cleanFileName);
}
