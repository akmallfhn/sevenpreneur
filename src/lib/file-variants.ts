import { FileVariant } from "./app-types";

export function getFileVariantFromURL(url: string): FileVariant {
  if (url.includes("docs.google.com/document")) return "DOCX";
  if (url.includes("docs.google.com/spreadsheet")) return "XLSX";
  if (url.includes("docs.google.com/presentation")) return "PPTX";
  if (url.includes("drive.google.com/file")) return "FILE";
  if (url.includes("figma.com/design")) return "FIGMADESIGN";
  if (url.includes("figma.com/board")) return "FIGJAM";
  if (url.toLowerCase().endsWith(".pdf")) return "PDF";
  return "UNKNOWN";
}

const fileVariant: Record<
  FileVariant,
  {
    fileIcon: string;
    fileType: string;
  }
> = {
  DOCX: {
    fileIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/docx-icon.webp",
    fileType: "DOCX",
  },
  XLSX: {
    fileIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/xlsx-icon.webp",
    fileType: "XLSX",
  },
  PPTX: {
    fileIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/pptx-icon.webp",
    fileType: "PPTX",
  },
  FILE: {
    fileIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/drive-icon.webp",
    fileType: "DRIVE FILE",
  },
  FIGMADESIGN: {
    fileIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/figma-icon.webp",
    fileType: "FIGMA DESIGN",
  },
  FIGJAM: {
    fileIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/figma-icon.webp",
    fileType: "FIGMA JAM",
  },
  PDF: {
    fileIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//pdf-icon.webp",
    fileType: "PDF",
  },
  UNKNOWN: {
    fileIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/unknown-file-icon.webp",
    fileType: "UNKNOWN FORMAT",
  },
};

export function getFileIconAndType(variant: FileVariant) {
  return fileVariant[variant] || fileVariant.UNKNOWN;
}
