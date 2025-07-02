import { FileVariant } from "@/app/components/items/FileItemCMS";

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
