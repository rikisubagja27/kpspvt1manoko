import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  PageBreak,
  ImageRun,
  convertInchesToTwip,
  convertMillimetersToTwip,
} from 'docx';
import { DocumentationPhoto, PeriodActivityRow, PeriodType, UserProfile } from '../types';
import { KEMENTAN_LOGO_PNG_BASE64 } from './kementanLogoBase64';

export function base64ToUint8Array(base64: string): Uint8Array {
  const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, '');
  const binaryString = atob(cleanBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export interface ExportWordParams {
  periodType: PeriodType;
  periodTitleCaps: string;
  periodLabelNormal: string;
  year: number;
  profile: UserProfile;
  activities: PeriodActivityRow[];
  photos: DocumentationPhoto[];
  endDateStr: string;
}

export function buildReportDocument({
  periodType,
  periodTitleCaps,
  periodLabelNormal,
  year,
  profile,
  activities,
  photos,
  endDateStr,
}: ExportWordParams): Document {
  const col2Header =
    periodType === 'bulanan' ? 'Tanggal' : periodType === 'triwulan' ? 'Bulan' : 'Triwulan';

  const thinBorder = {
    style: BorderStyle.SINGLE,
    size: 4,
    color: '000000',
  };

  const cellBorders = {
    top: thinBorder,
    bottom: thinBorder,
    left: thinBorder,
    right: thinBorder,
  };

  // Tabel 1
  const table1HeaderRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: 8, type: WidthType.PERCENTAGE },
        borders: cellBorders,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'No.', bold: true, size: 22, font: 'Arial' })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 22, type: WidthType.PERCENTAGE },
        borders: cellBorders,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: col2Header, bold: true, size: 22, font: 'Arial' })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 52, type: WidthType.PERCENTAGE },
        borders: cellBorders,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Rincian Pekerjaan', bold: true, size: 22, font: 'Arial' })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 18, type: WidthType.PERCENTAGE },
        borders: cellBorders,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Keterangan', bold: true, size: 22, font: 'Arial' })],
          }),
        ],
      }),
    ],
  });

  const table1DataRows = activities.map((row, idx) => {
    const itemParagraphs = row.items.map((item) => {
      return new Paragraph({
        spacing: { after: 100, line: 276 },
        children: [
          new TextRun({ text: '• ', bold: true, size: 21, font: 'Arial' }),
          new TextRun({ text: `${item.category}: `, bold: true, size: 21, font: 'Arial' }),
          new TextRun({ text: item.details, size: 21, font: 'Arial' }),
        ],
      });
    });

    return new TableRow({
      children: [
        new TableCell({
          width: { size: 8, type: WidthType.PERCENTAGE },
          borders: cellBorders,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: String(idx + 1), size: 21, font: 'Arial' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 22, type: WidthType.PERCENTAGE },
          borders: cellBorders,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: row.periodLabel, bold: true, size: 21, font: 'Arial' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 52, type: WidthType.PERCENTAGE },
          borders: cellBorders,
          children: itemParagraphs,
        }),
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          borders: cellBorders,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: row.keterangan || '-', size: 21, font: 'Arial' })],
            }),
          ],
        }),
      ],
    });
  });

  const table1 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [table1HeaderRow, ...table1DataRows],
  });

  // Struktur Dokumen Utama dengan Font Arial (Isi) & Arial MT (Judul)
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Arial',
            size: 22,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertMillimetersToTwip(25),
              bottom: convertMillimetersToTwip(25),
              left: convertMillimetersToTwip(30),
              right: convertMillimetersToTwip(25),
            },
          },
        },
        children: [
          // Cover (Judul menggunakan Arial MT)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 100 },
            children: [
              new TextRun({ text: 'LAPORAN KINERJA', bold: true, size: 32, font: 'Arial MT' }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'PELAKSANAAN TUGAS OPERASIONAL KANTOR', bold: true, size: 28, font: 'Arial MT' }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 1200 },
            children: [
              new TextRun({ text: periodTitleCaps, bold: true, size: 28, font: 'Arial MT' }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 800, after: 1000 },
            children: [
              new ImageRun({
                data: base64ToUint8Array(KEMENTAN_LOGO_PNG_BASE64),
                transformation: { width: 145, height: 145 },
                type: 'png',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 1000, after: 120 },
            children: [new TextRun({ text: 'Disusun oleh :', size: 24, font: 'Arial' })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [new TextRun({ text: profile.nama.toUpperCase(), bold: true, size: 26, font: 'Arial' })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({ text: profile.nip, bold: true, size: 24, font: 'Arial' })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
            children: [new TextRun({ text: profile.jabatan, size: 24, font: 'Arial' })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 600, after: 60 },
            children: [new TextRun({ text: profile.instansi.toUpperCase(), bold: true, size: 24, font: 'Arial' })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: String(year), bold: true, size: 26, font: 'Arial' })],
          }),
          new Paragraph({ children: [new PageBreak()] }),

          // Bab I (Judul Bab menggunakan Arial MT)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 60 },
            children: [new TextRun({ text: 'BAB I', bold: true, size: 26, font: 'Arial MT' })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [new TextRun({ text: 'PENDAHULUAN', bold: true, size: 26, font: 'Arial MT' })],
          }),
          new Paragraph({
            spacing: { before: 200, after: 120 },
            children: [new TextRun({ text: '1.1  LATAR BELAKANG', bold: true, size: 24, font: 'Arial MT' })],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360, after: 200 },
            indent: { firstLine: convertInchesToTwip(0.5) },
            children: [
              new TextRun({
                text: `Dalam rangka mendukung kelancaran pelaksanaan tugas dan fungsi organisasi, diperlukan dukungan sumber daya manusia yang mampu melaksanakan kegiatan operasional dan pelayanan perkantoran secara efektif, tertib, dan berkesinambungan. Salah satu bentuk dukungan tersebut dilaksanakan melalui penempatan ${profile.statusPegawai} pada jabatan ${profile.jabatan}.`,
                size: 23,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({ children: [new PageBreak()] }),

          // Bab II
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 60 },
            children: [new TextRun({ text: 'BAB II', bold: true, size: 26, font: 'Arial MT' })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [new TextRun({ text: 'AKUNTABILITAS KINERJA', bold: true, size: 26, font: 'Arial MT' })],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: '2.1  HASIL PELAKSANAAN', bold: true, size: 24, font: 'Arial MT' })],
          }),
          table1,
          new Paragraph({ children: [new PageBreak()] }),

          // Bab III
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 60 },
            children: [new TextRun({ text: 'BAB III', bold: true, size: 26, font: 'Arial MT' })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [new TextRun({ text: 'PENUTUP', bold: true, size: 26, font: 'Arial MT' })],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360, after: 800 },
            indent: { firstLine: convertInchesToTwip(0.5) },
            children: [
              new TextRun({
                text: 'Demikian laporan ini disampaikan. Atas perhatian dan kerjasamanya, diucapkan terima kasih.',
                size: 23,
                font: 'Arial',
              }),
            ],
          }),
        ],
      },
    ],
  });

  return doc;
}

export async function exportReportToWord(params: ExportWordParams): Promise<void> {
  const doc = buildReportDocument(params);
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Laporan_Kinerja_${params.periodLabelNormal.replace(/\s+/g, '_')}_${params.profile.nama.replace(/\s+/g, '_')}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
export async function generateWordBlob(params: any): Promise<Blob> {
  const doc = buildReportDocument(params);
  const blob = await Packer.toBlob(doc);
  return blob;
}

